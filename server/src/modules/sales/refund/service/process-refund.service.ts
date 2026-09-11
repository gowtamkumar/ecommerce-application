import { getDBConnection } from '@/config/db';
import { logger } from '@/middlewares/logger';
import { PaymentMethod, RefundStatus as OrderRefundStatus } from '@/modules/sales/order/enums';
import { OrderEntity } from '@/modules/sales/order/model/order.entity';
import { PaymentEntity } from '@/modules/sales/payment/model/payment.entity';
import { initiateSSLCommerzRefund } from '@/utils/sslcommerz.utils';
import { EntityManager } from 'typeorm';
import { RefundMethod } from '../enums/refund-method.enum';
import { RefundStatus } from '../enums/refund-status.enum';
import { RefundEntity } from '../model/refund.entity';

export interface CreateRefundInput {
  orderId: number;
  userId: number;
  amount: number;
  reason?: string;
  /** Order payment method — used to decide auto vs manual */
  paymentMethod: PaymentMethod;
  /** Optional existing manager (inside a transaction) for creating the Pending refund row */
  manager?: EntityManager;
}

/**
 * Creates a Pending refund row inside the caller's transaction (or a new connection).
 * Does NOT call SSLCommerz — use attemptAutoRefundAfterCommit after commit.
 */
export const createPendingRefundRecord = async (
  input: CreateRefundInput,
): Promise<RefundEntity> => {
  const manager =
    input.manager ?? (await getDBConnection()).manager;
  const refundRepository = manager.getRepository(RefundEntity);

  const paymentMethod =
    input.paymentMethod === PaymentMethod.SSLCOMMERZ
      ? RefundMethod.SSLCommerz
      : RefundMethod.Manual;

  const refund = refundRepository.create({
    orderId: input.orderId,
    userId: input.userId,
    amount: input.amount,
    status: RefundStatus.Pending,
    paymentMethod,
    reason: input.reason || 'Product Return',
  });

  return refundRepository.save(refund);
};

/**
 * After return+refund rows are committed: for SSLCommerz orders, call the gateway.
 * Cash/COD stays Pending for manual completion in the admin dashboard.
 * Failed auto attempts stay Failed/Pending so admin can complete manually.
 */
export const attemptAutoRefundAfterCommit = async (refundId: number): Promise<RefundEntity | null> => {
  const connection = await getDBConnection();
  const refundRepository = connection.getRepository(RefundEntity);
  const orderRepository = connection.getRepository(OrderEntity);
  const paymentRepository = connection.getRepository(PaymentEntity);

  const refund = await refundRepository.findOne({
    where: { id: refundId },
    relations: ['order'],
  });

  if (!refund) {
    logger.error(`attemptAutoRefundAfterCommit: refund #${refundId} not found`);
    return null;
  }

  if (refund.status === RefundStatus.Completed) {
    return refund;
  }

  const order =
    refund.order ||
    (await orderRepository.findOne({ where: { id: refund.orderId } }));

  if (!order) {
    logger.error(`attemptAutoRefundAfterCommit: order #${refund.orderId} not found`);
    return refund;
  }

  // COD / non-SSL: leave Pending for manual dashboard completion
  if (order.paymentMethod !== PaymentMethod.SSLCOMMERZ) {
    refund.paymentMethod = RefundMethod.Manual;
    return refundRepository.save(refund);
  }

  const payment = await paymentRepository.findOne({
    where: { orderId: order.id, paymentMethod: PaymentMethod.SSLCOMMERZ },
    order: { id: 'DESC' },
  });

  const bankTranId = payment?.bankTranId;

  if (!bankTranId) {
    refund.status = RefundStatus.Failed;
    refund.paymentMethod = RefundMethod.SSLCommerz;
    refund.note =
      'Auto-refund failed: missing bank_tran_id on payment. Complete manually after paying the customer.';
    await refundRepository.save(refund);
    logger.warn(
      `Auto-refund skipped for refund #${refund.id}: no bank_tran_id for order #${order.id}`,
    );
    return refund;
  }

  const refundTransId = `RFND_${refund.id}_${Date.now()}`;

  try {
    const result = await initiateSSLCommerzRefund({
      bankTranId,
      refundAmount: Number(refund.amount),
      refundRemarks: refund.reason || 'Order return refund',
      refundTransId,
      refeId: order.tranId || String(order.id),
    });

    if (result.success) {
      refund.status = RefundStatus.Completed;
      refund.paymentMethod = RefundMethod.SSLCommerz;
      refund.transactionId = result.refundRefId || refundTransId;
      refund.note = `SSLCommerz auto-refund (${result.status}). Ref: ${refund.transactionId}`;
      await refundRepository.save(refund);

      order.totalRefunded = (Number(order.totalRefunded) || 0) + Number(refund.amount);
      if (order.totalRefunded >= Number(order.totalReturned || 0)) {
        order.refundStatus = OrderRefundStatus.Full;
      } else {
        order.refundStatus = OrderRefundStatus.Partial;
      }
      await orderRepository.save(order);

      logger.info(`Auto-refund completed for refund #${refund.id}`);
      return refund;
    }

    refund.status = RefundStatus.Failed;
    refund.paymentMethod = RefundMethod.SSLCommerz;
    refund.note = `Auto-refund failed: ${result.errorReason || 'Unknown error'}. Complete manually.`;
    await refundRepository.save(refund);
    logger.warn(`Auto-refund failed for refund #${refund.id}: ${result.errorReason}`);
    return refund;
  } catch (error: any) {
    refund.status = RefundStatus.Failed;
    refund.paymentMethod = RefundMethod.SSLCommerz;
    refund.note = `Auto-refund error: ${error?.message || 'Unknown'}. Complete manually.`;
    await refundRepository.save(refund);
    logger.error(`Auto-refund exception for refund #${refund.id}:`, error);
    return refund;
  }
};
