import { getDBConnection } from '@/config/db';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { RefundStatus as OrderRefundStatus } from '@/modules/sales/order/enums';
import { OrderEntity } from '@/modules/sales/order/model/order.entity';
import { Request, Response } from 'express';
import { RefundStatus } from '../enums/refund-status.enum';
import { RefundEntity } from '../model/refund.entity';

// @desc Get all Refunds
// @route GET /api/v1/refunds
// @access Private (Admin)
export const getRefunds = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getRefunds ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(RefundEntity);

  const result = await repository.find({
    relations: ['order', 'user'],
    order: { createdAt: 'DESC' },
  });

  return res.status(200).json({
    success: true,
    message: 'Get all Refunds',
    count: result.length,
    data: result,
  });
});

// @desc Get a single Refund
// @route GET /api/v1/refunds/:id
// @access Private (Admin)
export const getRefund = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getRefund ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = connection.getRepository(RefundEntity);
  const result = await repository.findOne({
    where: { id: Number(id) },
    relations: ['order', 'user'],
  });

  if (!result) {
    return res.status(404).json({
      success: false,
      message: `Refund not found with id #${id}`,
    });
  }

  return res.status(200).json({
    success: true,
    message: `Get a single Refund of id ${id}`,
    data: result,
  });
});

// @desc Complete a Refund (Manual)
// @route PUT /api/v1/refunds/:id/complete
// @access Private (Admin)
export const completeRefund = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: completeRefund ${req.method} ${req.url}`);

  const { id } = req.params;
  const { transactionId, note } = req.body;

  const connection = await getDBConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const refundRepository = queryRunner.manager.getRepository(RefundEntity);
    const orderRepository = queryRunner.manager.getRepository(OrderEntity);

    const refund = await refundRepository.findOne({
      where: { id: Number(id) },
      relations: ['order'],
    });

    if (!refund) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({
        success: false,
        message: `Refund not found with id #${id}`,
      });
    }

    if (refund.status === RefundStatus.Completed) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({
        success: false,
        message: 'Refund has already been completed',
      });
    }

    // Update Refund Record
    refund.status = RefundStatus.Completed;
    refund.transactionId = transactionId;
    refund.note = note;
    await refundRepository.save(refund);

    // Update Order Refund Status
    const order = refund.order;
    if (order) {
        order.totalRefunded = (Number(order.totalRefunded) || 0) + Number(refund.amount);
        
        // Determine order refund status
        if (order.totalRefunded >= order.totalReturned) {
            order.refundStatus = OrderRefundStatus.Full;
        } else {
            order.refundStatus = OrderRefundStatus.Partial;
        }
        
        await orderRepository.save(order);
    }

    await queryRunner.commitTransaction();

    return res.status(200).json({
      success: true,
      message: 'Refund completed successfully',
      data: refund,
    });
  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    logger.error('Error completing refund:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while completing refund',
      error: error.message,
    });
  } finally {
    await queryRunner.release();
  }
});
