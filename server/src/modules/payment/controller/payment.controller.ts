import { NextFunction, Request, Response } from 'express';
import { getDBConnection } from '../../../config/db';
import { CustomRequest } from '../../../enums/custom-request-type';
import { NotificationType } from '../../../enums/notification-type.enum';
import { asyncHandler } from '../../../middlewares/async.middleware';
import { logger } from '../../../middlewares/logger';
import { initiateSSLCommerzPayment } from '../../../utils/sslcommerz.utils';
import { paymentValidationSchema } from '../../../validation';
import { dashboardPaymentValidationSchema } from '../../../validation/payment/dashboardPaymentValidation';
import { RoleEnum } from '../../auth/enums/role.enum';
import { UserEntity } from '../../auth/model/user.entity';
import { PaymentMethod, PaymentStatus } from '../../order/enums';
import { OrderEntity } from '../../order/model/order.entity';
import { NotificationEntity } from '../../other/notification/model/notification.entity';
import { PaymentType } from '../enums/payment-type.enum';
import { PaymentEntity } from '../model/payment.entity';

// @desc Get all Payment
// @route GET /api/v1/Payment
// @access Public
export const getPayments = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getPayments ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(PaymentEntity);

  const result = await repository.find({
    relations: {
      order: true,
      user: true,
    },
    select: {
      user: {
        name: true,
      },
    },
    order: { id: 'DESC' },
  });

  return res.status(200).json({
    success: true,
    message: 'Get all Payment',
    data: result,
  });
});

// @desc Get a single Payment
// @route GET /api/v1/Payment/:id
// @access Public
export const getPayment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: getPayment ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(PaymentEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  return res.status(200).json({
    success: true,
    message: `Get a single Payment of id ${req.params.id}`,
    data: result,
  });
});

// @desc Create a single Payment
// @route POST /api/v1/Payment
// @access Public
export const createPayment = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createPayment ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const validation = paymentValidationSchema.safeParse({
    ...req.body,
    userId: req.id,
  });

  if (!validation.success) {
    const formattedErrors = validation.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      issues: formattedErrors,
    });
  }

  const repository = connection.getRepository(PaymentEntity);
  const newPayment = repository.create(validation.data);
  const save = await repository.save(newPayment);

  return res.status(200).json({
    success: true,
    message: 'Create a new Payment',
    data: save,
  });
});

export const onlinePayment = async (req: CustomRequest, res: Response) => {
  logger.info(`Service: onlinePayment ${req.method} ${req.url}`);
  const { tranId, grandTotal } = req.body;
  const userId = req.id as number | string;

  const connection = await getDBConnection();
  const userRepository = connection.getRepository(UserEntity);
  const user = await userRepository.findOne({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  try {
    const paymentUrl = await initiateSSLCommerzPayment({
      tranId,
      amount: grandTotal,
      user,
    });

    return res.status(200).json({
      success: true,
      message: 'Payment initiated successfully',
      url: paymentUrl,
    });
  } catch (error: any) {
    logger.error('Payment initialization failed', error);
    // Note: We might want to send admin notification here too, like before
    // but the previous code relied on 'savedOrder' which wasn't available in this scope.
    // So sticking to basic error response for now.
    return res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.message,
    });
  }
};

export const createDashboardPayment = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createDashboardPayment ${req.method} ${req.url}`);

  try {
    const connection = await getDBConnection();

    const validation = dashboardPaymentValidationSchema.safeParse(req.body);

    if (!validation.success) {
      const formattedErrors = validation.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        issues: formattedErrors,
      });
    }

    const { due, amount, orderId, paymentMethod } = validation.data;

    // Check for overpayment
    if (amount <= 0 || amount > due) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment amount: ${amount}. It must be between 0 and ${(+due || 0).toFixed(
          2,
        )}.`,
      });
    }

    const orderRepository = connection.getRepository(OrderEntity);
    const order = await orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${orderId} not found.`,
      });
    }

    // Update payment status based on amount
    const updateOrder = {
      id: order.id,
      paymentStatus: amount < due ? PaymentStatus.PartialPaid : PaymentStatus.Paid,
      paymentMethod,
    };

    await orderRepository.save(updateOrder);

    // Save the new payment
    const paymentRepository = connection.getRepository(PaymentEntity);
    const newPayment = paymentRepository.create(validation.data);
    const savedPayment = await paymentRepository.save(newPayment);

    return res.status(200).json({
      success: true,
      message: 'New payment created via dashboard.',
      data: savedPayment,
    });
  } catch (error: any) {
    logger.error('Error creating dashboard payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message || 'Something went wrong',
    });
  }
});

// @desc Update a single Payment
// @route PUT /api/v1/Payment/:id
// @access Public
export const updatePayment = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updatePayment ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();

  const repository = await connection.getRepository(PaymentEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, req.body);
  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: `Update a single Payment of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Payment
// @route DELETE /api/v1/Payment/:id
// @access Public
export const deletePayment = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deletePayment ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(PaymentEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single Payment of id ${req.params.id}`,
    data: result,
  });
});

// @desc Get a single Payment
// @route GET /api/v1/Payment/sucess/trandId
// @access Public
export const sslcommerzSuccessHandler = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: sslcommerzSuccessHandler ${req.method} ${req.url}`);
  const { tranId } = req.params;

  const connection = await getDBConnection();
  const orderRepo = connection.getRepository(OrderEntity);

  if (!tranId) {
    return res.status(400).json({ success: false, message: 'Missing transaction ID' });
  }

  try {
    const order = await orderRepo.findOne({ where: { tranId } });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = PaymentStatus.Paid;
    await orderRepo.save(order);

    const paymentRepo = connection.getRepository(PaymentEntity);

    const newPayment = paymentRepo.create({
      tranId,
      orderId: order.id,
      userId: order.userId,
      paymentDate: new Date().toISOString(),
      paymentType: PaymentType.Debit,
      paymentMethod: PaymentMethod.SSLCOMMERZ,
      amount: order.grandTotal,
    });

    const save = await paymentRepo.save(newPayment);

    // Notification to User (Payment Success)
    const notificationRepo = connection.getRepository(NotificationEntity);
    const notification: NotificationEntity = notificationRepo.create({
      type: NotificationType.PaymentSuccess,
      title: 'Payment Successful',
      message: `Your payment of ${order.grandTotal} for Order #${order.id} was successful. Transaction ID: ${tranId}`,
      userId: order.userId,
      orderId: order.id,
      isRead: false,
    });
    await notificationRepo.save(notification);

    if (save) {
      return res.redirect(`${process.env.FRONT_END_URL}/sslcommerz/success/${tranId}`);
    }

    // return res.redirect(
    //   `${process.env.FRONT_END_URL}/sslcommerz/success/${tranId}`
    // );
  } catch (error) {
    console.error('SSLCommerz Success Handler Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// @desc Get a single Payment
// @route GET /api/v1/Payment/fail:tranId
// @access Public
export const sslcommerzFailHandler = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: sslcommerzFailHandler ${req.method} ${req.url}`);
  const { tranId } = req.params;

  const connection = await getDBConnection();
  const orderRepo = connection.getRepository(OrderEntity);

  if (!tranId) {
    return res.status(400).json({ success: false, message: 'Missing transaction ID' });
  }

  try {
    const order = await orderRepo.findOne({ where: { tranId } });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = PaymentStatus.Failed;
    await orderRepo.save(order);

    const notificationRepo = connection.getRepository(NotificationEntity);

    // Notification to User (Payment Failed)
    const userNotification: NotificationEntity = notificationRepo.create({
      type: NotificationType.PaymentFailed,
      title: 'Payment Failed',
      message: `Payment failed for Order #${order.id}. Please try again.`,
      userId: order.userId,
      orderId: order.id,
      isRead: false,
    });
    await notificationRepo.save(userNotification);

    // Notify Admins about Payment Failure
    const userRepository = connection.getRepository(UserEntity);
    const admins = await userRepository.find({ where: { role: RoleEnum.Admin } });

    const adminNotifications: NotificationEntity[] = admins.map((admin: UserEntity) => ({
      type: NotificationType.AdminPaymentFailed,
      title: 'Order Payment Failed',
      message: `Payment failed for Order #${order.id} (Transaction ID: ${tranId}).`,
      userId: admin.id,
      orderId: order.id,
      isRead: false,
    }));

    if (adminNotifications.length > 0) {
      await notificationRepo.save(adminNotifications);
    }

    return res.redirect(`${process.env.FRONT_END_URL}/sslcommerz/fail/${tranId}`);
  } catch (error) {
    console.error('SSLCommerz Success Handler Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// @desc Get a single Payment
// @route GET /api/v1/Payment/cancel:tranId
// @access Public
export const sslcommerzCancelHandler = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: sslcommerzCancelHandler ${req.method} ${req.url}`);
  const { tranId } = req.params;

  const connection = await getDBConnection();
  const orderRepo = connection.getRepository(OrderEntity);

  if (!tranId) {
    return res.status(400).json({ success: false, message: 'Missing transaction ID' });
  }

  try {
    const order = await orderRepo.findOne({ where: { tranId } });

    console.log('order', order);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = PaymentStatus.Canceled;
    await orderRepo.save(order);
    return res.redirect(`${process.env.FRONT_END_URL}/sslcommerz/cancel/${tranId}`);
  } catch (error) {
    console.error('SSLCommerz Success Handler Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
