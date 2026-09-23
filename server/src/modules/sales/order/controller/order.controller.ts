import { getDBConnection } from '@/config/db';
import { CustomRequest } from '@/enums/custom-request-type';
import { NotificationType } from '@/enums/notification-type.enum';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { ProductVariantEntity } from '@/modules/catalog/products/product-variant/model/product-variant.entity';
import { CartEntity } from '@/modules/sales/cart/model/cart.entity';
import { AppliedCouponEntity } from '@/modules/sales/coupon/model/applied-coupon.entity';
import { OrderTrackingStatusEnum } from '@/modules/sales/order-tracking/enums/order-tracking-status.enum';
import { OrderTrackingEntity } from '@/modules/sales/order-tracking/model/order-tracking.entity';
import { NotificationEntity } from '@/modules/system/other/notification/model/notification.entity';
import { RoleEnum } from '@/modules/user/auth/enums/role.enum';
import { UserEntity } from '@/modules/user/auth/model/user.entity';
import { sendSms } from '@/utils/sendSms';
import { initiateSSLCommerzPayment } from '@/utils/sslcommerz.utils';
import {
  onlineCreateOrderValidationSchema,
  orderDeliveryManValidationSchema,
  orderStatusUpdateValidationSchema,
  orderUpdateValidationSchema,
} from '@/validation';
import { Request, Response } from 'express';
import { In, Repository } from 'typeorm';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../enums';
import { OrderItemEntity } from '../model/order-item.entity';
import { OrderEntity } from '../model/order.entity';

interface Notification {
  type: string;
  title: string;
  message: string;
  userId: string | number;
  orderId: string | number;
}

interface OrderTracking {
  orderId: number;
  userId: number;
  location: string;
  status: OrderStatus;
}

// @desc Create a single Order
// @route POST /api/v1/orders
// @access Public
export const createOrder = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createOrder ${req.method} ${req.url}`);

  const tranId = Date.now().toString();
  const userId = req.id as number | string;
  const connection = await getDBConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();

  // Validation should happen BEFORE transaction
  const validation = onlineCreateOrderValidationSchema.safeParse({
    ...req.body,
    userId,
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

  await queryRunner.startTransaction(); // Move here after validation

  try {
    const { shippingCharge, subTotal, paymentMethod, orderItems, ...orderData } = validation.data;

    const repository = queryRunner.manager.getRepository(OrderEntity);
    const lastOrder = await repository
      .createQueryBuilder('order')
      .select(['order.id'])
      .orderBy('order.id', 'DESC')
      .limit(1)
      .getOne();
    const nextId = (lastOrder?.id || 0) + 1;
    const trackingNo = `TRK-${nextId.toString().padStart(10, '0')}`;

    const newOrder = repository.create({
      shippingCharge,
      subTotal,
      paymentMethod,
      paymentStatus: PaymentStatus.NotPaid,
      ...orderData,
      trackingNo,
      tranId,
    });

    const savedOrder = await repository.save(newOrder);

    const orderId = savedOrder.id;

    if (orderItems?.length && orderId) {
      const repoOrderItems = queryRunner.manager.getRepository(OrderItemEntity);
      const newOrderItems = repoOrderItems.create(
        orderItems.map((item: any) => ({
          ...item,
          orderId,
        })),
      );
      await repoOrderItems.save(newOrderItems);

      // clear cart directly using atomic delete
      const cartRepo = queryRunner.manager.getRepository(CartEntity);
      await cartRepo.delete({ userId: Number(userId) });

      // order tracking
      const newOrderTracking = {
        status: savedOrder.status,
        orderId,
        userId: Number(userId),
        location: 'অর্ডারটি গ্রহন করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।',
      } as OrderTracking;
      const orderTrackingRepo = queryRunner.manager.getRepository(OrderTrackingEntity);

      await orderTracking(newOrderTracking, orderTrackingRepo);

      // applied coupon
      if (validation.data.couponId) {
        const couponRepo = queryRunner.manager.getRepository(AppliedCouponEntity);
        const newCouponApplied = couponRepo.create({
          orderId: savedOrder.id,
          userId: Number(userId),
          discountAmount: validation.data.couponDiscount,
          couponId: validation.data.couponId,
        });
        await couponRepo.save(newCouponApplied);
      }

      // notification to User (within transaction)
      const notificationRepo = queryRunner.manager.getRepository(NotificationEntity);
      const userNotification = notificationRepo.create({
        type: NotificationType.OrderPlaced,
        title: 'Order Placed',
        message: `Your order has been placed successfully. Order Tracking No: ${trackingNo}`,
        userId: Number(userId),
        orderId: savedOrder.id,
      });
      await notificationRepo.save(userNotification);

      // Notification to Admins
      const userRepository = queryRunner.manager.getRepository(UserEntity);
      const admins = await userRepository.find({
        where: { role: RoleEnum.Admin },
        select: ['id'],
      });
      if (admins.length > 0) {
        const adminNotifications = admins.map((admin: any) => ({
          type: NotificationType.AdminNewOrder,
          title: 'New Order Received',
          message: `New order #${savedOrder.id} received from User ${userId}. Tracking No: ${trackingNo}`,
          userId: admin.id,
          orderId: savedOrder.id,
        }));
        await notificationRepo.save(notificationRepo.create(adminNotifications as any));

        // Check for High Value Order (e.g. > 10000)
        if (savedOrder.grandTotal > 10000) {
          const highValueNotifications = admins.map((admin: UserEntity) => ({
            type: NotificationType.AdminHighValueOrder,
            title: 'High Value Order Alert',
            message: `High value order #${savedOrder.id} received. Total: ${savedOrder.grandTotal}`,
            userId: admin.id,
            orderId: savedOrder.id,
          }));
          await notificationRepo.save(notificationRepo.create(highValueNotifications as any));
        }
      }
    }

    if (queryRunner.isTransactionActive) {
      await queryRunner.commitTransaction();
    }

    // ssl ecommerce intregration
    let paymentUrl = null;
    if (savedOrder.paymentMethod === PaymentMethod.SSLCOMMERZ) {
      const userRepo = queryRunner.manager.getRepository(UserEntity);
      const user = await userRepo.findOne({ where: { id: userId } });
      if (user) {
        paymentUrl = await initiateSSLCommerzPayment({
          tranId,
          amount: savedOrder.grandTotal,
          user,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: savedOrder.id,
        paymentUrl,
      },
    });
  } catch (error) {
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }
    console.error('Transaction failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create Order',
    });
  } finally {
    await queryRunner.release();
  }
});

export const orderTracking = async (
  value: OrderTracking,
  orderTrackingRepo: Repository<OrderTrackingEntity>,
) => {
  const { orderId, userId, location, status } = value;

  let trackingStatus: OrderTrackingStatusEnum;

  switch (status) {
    case OrderStatus.Pending:
      trackingStatus = OrderTrackingStatusEnum.OrderPlaced;
      break;
    case OrderStatus.Processing:
      trackingStatus = OrderTrackingStatusEnum.Processing;
      break;

    case OrderStatus.Shipped:
      trackingStatus = OrderTrackingStatusEnum.Shipped;
      break;
    case OrderStatus.Delivered:
      trackingStatus = OrderTrackingStatusEnum.OrderDelivered;
      break;
    case OrderStatus.Canceled:
      trackingStatus = OrderTrackingStatusEnum.OrderCanceled;
      break;
    default:
      throw new Error('Invalid Order Status for tracking');
  }

  const newOrderTracking = orderTrackingRepo.create({
    orderId,
    userId,
    location,
    status: trackingStatus,
  });

  await orderTrackingRepo.save(newOrderTracking);
};

export const sendOrderNotification = async (
  notification: Notification,
): Promise<{ success: boolean; message: string }> => {
  logger.info(`Service: sendOrderNotification`);
  const connection = await getDBConnection(); // Consider reusing an existing connection
  const repository = connection.getRepository(NotificationEntity);

  try {
    const newNotification = repository.create(notification);
    await repository.save(newNotification);

    return {
      success: true,
      message: 'Notification sent successfully',
    };
  } catch (error) {
    console.error('Failed to send notification:', error);
    return {
      success: false,
      message: 'Failed to send notification',
    };
  }
};

// @desc Get all Order
// @route GET /api/v1/Order
// @access Public
export const getOrders = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: getOrders ${req.method} ${req.url}`);

  const { status, returnedStatus, page, limit } = req.query;

  const connection = await getDBConnection();
  const orderRepository = connection.getRepository(OrderEntity);

  const qb = orderRepository.createQueryBuilder('order');
  qb.select([
    'order',
    'orderItems',
    'productVariant.id',
    'productVariant.material',
    'productVariant.default',
    'productVariant.sku',
    'color.name',
    'color.color',
    'size.name',
    'product',
    'payments',
    'orderTrackings',
    'deliveryMan.name',
    'deliveryMan.phone',
    'deliveryMan.email',
    'user.name',
    'user.email',
    'user.phone',
    'shippingAddress',
    'returns',
  ]);

  qb.leftJoin('order.orderItems', 'orderItems');
  qb.leftJoin('orderItems.product', 'product');
  qb.leftJoin('orderItems.returns', 'returns');
  qb.leftJoin('orderItems.productVariant', 'productVariant');
  qb.leftJoin('productVariant.color', 'color');
  qb.leftJoin('productVariant.size', 'size');
  qb.leftJoin('order.orderTrackings', 'orderTrackings');
  qb.leftJoin('order.deliveryMan', 'deliveryMan');
  qb.leftJoin('order.user', 'user');
  qb.leftJoin('order.payments', 'payments');
  qb.leftJoin('order.shippingAddress', 'shippingAddress');
  qb.addOrderBy('order.trackingNo', 'DESC');

  if (returnedStatus)
    qb.andWhere('order.returnedStatus IN (:...returnedStatus)', {
      returnedStatus: returnedStatus.toString().split(','),
    });

  if (status)
    qb.andWhere('order.status IN (:...status)', {
      status: status.toString().split(','),
    });

  if (page || limit) {
    const pageNum = Math.max(1, parseInt((page || '1') as string, 10));
    const pageSize = Math.max(1, parseInt((limit || '10') as string, 10));
    qb.skip((pageNum - 1) * pageSize).take(pageSize);

    const [results, total] = await qb.getManyAndCount();

    return res.status(200).json({
      success: true,
      message: 'Get all Order',
      total,
      page: pageNum,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      data: results,
    });
  }

  const results = await qb.getMany();

  return res.status(200).json({
    success: true,
    message: 'Get all Order',
    total: results.length,
    data: results,
  });
});

export const getUserOrders = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: getUserOrders ${req.method} ${req.url}`);
  const { status, page, limit } = req.query;
  const userId = req.id;
  const connection = await getDBConnection();
  const orderRepository = connection.getRepository(OrderEntity);

  const qb = orderRepository.createQueryBuilder('order');
  qb.select([
    'order',
    'orderItems',
    'product',
    'payments',
    'orderTrackings',
    'deliveryMan.name',
    'deliveryMan.phone',
    'deliveryMan.email',
    'user.name',
    'user.email',
    'user.phone',
    'shippingAddress',
    'productVariant.id',
    'productVariant.material',
    'productVariant.default',
    'productVariant.sku',
    'color.name',
    'color.color',
    'size.name',
    'returns',
  ]);

  qb.leftJoin('order.orderItems', 'orderItems');
  qb.leftJoin('orderItems.product', 'product');
  qb.leftJoin('orderItems.returns', 'returns');
  qb.leftJoin('orderItems.productVariant', 'productVariant');
  qb.leftJoin('productVariant.color', 'color');
  qb.leftJoin('productVariant.size', 'size');
  qb.leftJoin('order.orderTrackings', 'orderTrackings');
  qb.leftJoin('order.deliveryMan', 'deliveryMan');
  qb.leftJoin('order.user', 'user');
  qb.leftJoin('order.payments', 'payments');
  qb.leftJoin('order.shippingAddress', 'shippingAddress');
  if (userId) {
    qb.where('order.userId = :userId', { userId: Number(userId) });
  }
  if (status) {
    const statusList = status.toString().split(',').filter(Boolean);
    if (statusList.length > 0) {
      qb.andWhere('order.status IN (:...status)', { status: statusList });
    }
  }

  qb.orderBy('order.id', 'DESC');

  if (page || limit) {
    const pageNum = Math.max(1, parseInt((page || '1') as string, 10));
    const pageSize = Math.max(1, parseInt((limit || '10') as string, 10));
    qb.skip((pageNum - 1) * pageSize).take(pageSize);

    const [results, total] = await qb.getManyAndCount();

    return res.status(200).json({
      success: true,
      message: 'Get all Order',
      total,
      page: pageNum,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      data: results,
    });
  }

  const results = await qb.getMany();

  return res.status(200).json({
    success: true,
    message: 'Get all Order',
    total: results.length,
    data: results,
  });
});

// @desc Get a single Order
// @route GET /api/v1/orders/query?id=1
// @access Public
export const getOrderQuery = asyncHandler(async (req: Request, res: Response) => {
  const { id, trackingNo } = req.query;
  logger.info(`Service: getOrderQuery ${req.method} ${req.url}`);

  if (!id && !trackingNo) {
    return res.status(400).json({
      success: false,
      message: 'Order ID or tracking number is required.',
    });
  }

  const connection = await getDBConnection();
  const orderRepository = connection.getRepository(OrderEntity);

  const qb = orderRepository.createQueryBuilder('order');

  qb.select([
    'order',
    'orderItems',
    'productVariant',
    'color',
    'size',
    'product',
    'payments',
    'orderTrackings',
    'deliveryMan',
    'user',
    'shippingAddress',
  ]);

  qb.leftJoin('order.orderItems', 'orderItems');
  qb.leftJoin('orderItems.product', 'product');
  qb.leftJoin('orderItems.productVariant', 'productVariant');
  qb.leftJoin('productVariant.color', 'color');
  qb.leftJoin('productVariant.size', 'size');
  qb.leftJoin('order.orderTrackings', 'orderTrackings');
  qb.leftJoin('order.deliveryMan', 'deliveryMan');
  qb.leftJoin('order.user', 'user');
  qb.leftJoin('order.payments', 'payments');
  qb.leftJoin('order.shippingAddress', 'shippingAddress');

  if (id) {
    qb.where('order.id = :id', { id: Number(id) });
  } else {
    qb.where('order.trackingNo = :trackingNo', { trackingNo: String(trackingNo) });
  }

  const order = await qb.getOne();

  if (!order) {
    return res.status(404).json({
      success: false,
      message: `Order not found with provided ${id ? `ID #${id}` : `Tracking No #${trackingNo}`}.`,
    });
  }

  const totalCredit = (order.payments || [])
    .filter((p: any) => p.paymentType === 'Credit')
    .reduce((acc: number, p: any) => acc + (Number(p.amount) || 0), 0);

  const totalDebit = (order.payments || [])
    .filter((p: any) => p.paymentType === 'Debit')
    .reduce((acc: number, p: any) => acc + (Number(p.amount) || 0), 0);

  return res.status(200).json({
    success: true,
    message: `Order with ID ${order.id} retrieved successfully`,
    data: {
      ...order,
      totalCredit,
      totalDebit,
      paid: (totalDebit - totalCredit).toFixed(2),
      due: (+order.grandTotal - totalDebit + totalCredit).toFixed(2),
    },
  });
});

// @desc Update a single Order
// @route PUT /api/v1/Order/:id
// @access Public
export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateOrder ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const validation = orderUpdateValidationSchema.safeParse(req.body);

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

  const { orderItems, ...orderData } = validation.data;

  const repository = await connection.getRepository(OrderEntity);

  const result = await repository.findOne({ where: { id } });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }
  const updateData = await repository.merge(result, orderData);

  const save = await repository.save(updateData);

  if (orderItems && save.id) {
    const repoOrderitems = connection.getRepository(OrderItemEntity);

    // remove order items
    const existingVariants = await repoOrderitems.find({
      where: { orderId: id },
    });

    await repoOrderitems.remove(existingVariants);
    // new order items data
    const newOrderItems = await repoOrderitems.create(
      orderItems.map((item) => ({
        productId: +item.productId,
        qty: item.qty,
        unitPrice: item.unitPrice,
        orderId: save.id,
      })),
    );
    await repoOrderitems.save(newOrderItems);
  }

  return res.status(200).json({
    success: true,
    message: 'Order updated successfully',
    data: updateData,
  });
});

// @desc Update a single Order
// @route PUT /api/v1/orders/review:id
// @access Public
export const orderReview = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: orderReview ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();

  const repository = await connection.getRepository(OrderItemEntity);

  const result = await repository.find({ where: { orderId: id } });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  return res.status(200).json({
    success: true,
    message: `Order Review ${req.params.id}`,
    data: {},
  });
});
// @desc assign DeliveryMan
// @route patch /api/v1/order/assign/:id
// @access Public
export const assignDeliveryMan = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: assignDeliveryMan ${req.method} ${req.url}`);

  const { id } = req.params;
  const validation = orderDeliveryManValidationSchema.safeParse(req.body);

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

  const connection = await getDBConnection();

  const repository = await connection.getRepository(OrderEntity);

  const result = await repository.findOne({ where: { id } });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const save = await repository.save({
    id: result.id,
    deliveryId: validation.data.deliveryId,
  });

  return res.status(200).json({
    success: true,
    message: 'Delivery person assigned successfully',
    data: save,
  });
});

export const orderStatusUpdate = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: orderStatusUpdate ${req.method} ${req.url}`);

  const userId = req.id as string | number;
  const { id } = req.params;

  const validation = orderStatusUpdateValidationSchema.safeParse(req.body);

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

  const status = validation.data.status;
  const location = validation.data.location;

  const connection = await getDBConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  const repository = queryRunner.manager.getRepository(OrderEntity);
  const result = await repository.findOne({
    where: { id: Number(id) },
    relations: ['orderItems'],
  });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  if (
    status === OrderStatus.Canceled &&
    ![OrderStatus.Pending, OrderStatus.Processing].includes(result.status as OrderStatus)
  ) {
    throw new Error(`Sorry, you can't cancel this order because it's already '${result.status}'.`);
  }

  try {
    if (
      [OrderStatus.Canceled, OrderStatus.Delivered, OrderStatus.Shipped].includes(
        status as OrderStatus,
      )
    ) {
      const productVariantRepo = queryRunner.manager.getRepository(ProductVariantEntity);

      const isStockIncrease = [OrderStatus.Canceled].includes(status as OrderStatus);

      await adjustStock(result.orderItems, isStockIncrease, productVariantRepo);
    }

    const save = await repository.save({
      id: result.id,
      ...validation.data,
    });

    const message = `Your order has been ${status}. Order Tracking No: ${result.trackingNo}`;
    const targetUserId = result.userId || userId;
    const userRepository = queryRunner.manager.getRepository(UserEntity);
    const getuser = await userRepository.findOne({
      where: { id: targetUserId },
      select: ['phone'],
    });
    if (getuser?.phone) {
      await sendSms(getuser.phone, message);
    }

    let notificationType = NotificationType.Order;
    if (status === OrderStatus.Shipped) notificationType = NotificationType.OrderShipped;
    if (status === OrderStatus.Delivered) notificationType = NotificationType.OrderDelivered;
    if (status === OrderStatus.Canceled) notificationType = NotificationType.OrderCanceled;

    const notificationRepo = queryRunner.manager.getRepository(NotificationEntity);
    const customerNotification = notificationRepo.create({
      type: notificationType,
      title: status,
      message,
      userId: targetUserId,
      orderId: result.id,
    });
    await notificationRepo.save(customerNotification);

    // Notification: Request Review on Delivery
    if (status === OrderStatus.Delivered) {
      await notificationRepo.save(
        notificationRepo.create({
          type: NotificationType.ReviewRequest,
          title: 'How was your order?',
          message: `Your order #${result.id} has been delivered. We'd love to hear your feedback!`,
          userId: targetUserId,
          orderId: result.id,
          isRead: false,
        }),
      );
    }

    const newOrderTracking = {
      status: status,
      orderId: result.id,
      userId: targetUserId,
      location,
    } as OrderTracking;

    const orderTrackingRepo = queryRunner.manager.getRepository(OrderTrackingEntity);
    await orderTracking(newOrderTracking, orderTrackingRepo);

    // Notify Admins if Order is Canceled
    if (status === OrderStatus.Canceled) {
      const admins = await userRepository.find({
        where: { role: RoleEnum.Admin },
        select: ['id'],
      });
      if (admins.length > 0) {
        const adminNotifications = admins.map((admin: any) => ({
          type: NotificationType.AdminOrderCanceled,
          title: 'Order Canceled',
          message: `Order #${result.id} has been canceled.`,
          userId: admin.id,
          orderId: result.id,
        }));
        await notificationRepo.save(notificationRepo.create(adminNotifications as any));
      }
    }

    await queryRunner.commitTransaction();

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: save,
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update order status',
    });
  } finally {
    await queryRunner.release();
  }
});

async function adjustStock(
  orderItems: OrderItemEntity[],
  isStockIncrease: boolean,
  productVariantRepo: Repository<ProductVariantEntity>,
) {
  if (!orderItems || orderItems.length === 0) return;

  const variantIds = orderItems.map((item) => item.productVariantId).filter(Boolean);
  if (variantIds.length === 0) return;

  const variants = await productVariantRepo.findBy({ id: In(variantIds) });
  const variantMap = new Map(variants.map((v) => [v.id, v]));

  const lowStockVariants: { id: number; stockQty: number }[] = [];
  const variantsToUpdate: ProductVariantEntity[] = [];

  for (const item of orderItems) {
    const variant = variantMap.get(item.productVariantId);
    if (!variant) continue;

    const currentStock = +(variant.stockQty ?? 0);
    const itemQty = +(item.qty ?? 0);

    // Check if stock is enough before reducing
    if (!isStockIncrease && currentStock < itemQty) {
      throw new Error(
        `Insufficient stock for product variant ID ${item.productVariantId}. Required: ${itemQty}, Available: ${currentStock}`,
      );
    }

    const newStockQty = isStockIncrease ? currentStock + itemQty : currentStock - itemQty;
    variant.stockQty = newStockQty;
    variantsToUpdate.push(variant);

    if (newStockQty < 5) {
      lowStockVariants.push({ id: variant.id, stockQty: newStockQty });
    }
  }

  if (variantsToUpdate.length > 0) {
    await productVariantRepo.save(variantsToUpdate);
  }

  if (lowStockVariants.length > 0) {
    try {
      const manager = productVariantRepo.manager;
      const userRepository = manager.getRepository(UserEntity);
      const admins = await userRepository.find({
        where: { role: RoleEnum.Admin },
        select: ['id'],
      });

      if (admins.length > 0) {
        const notificationRepo = manager.getRepository(NotificationEntity);
        const adminNotifications = admins.flatMap((admin: any) =>
          lowStockVariants.map((item) => ({
            type: NotificationType.AdminLowStock,
            title: 'Low Stock Alert',
            message: `Product Variant (ID: ${item.id}) is running low. Current Stock: ${item.stockQty}`,
            userId: admin.id,
          })),
        );
        await notificationRepo.save(notificationRepo.create(adminNotifications as any));
      }
    } catch (err) {
      console.error('Failed to send low stock notification', err);
    }
  }
}

// @desc Delete a single Order
// @route DELETE /api/v1/orders/:id
// @access Public
export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteOrder ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(OrderEntity);

  const result = await repository.findOneBy({ id: Number(id) });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id: Number(id) });

  return res.status(200).json({
    success: true,
    message: `Delete a single Order of id ${req.params.id}`,
    data: result,
  });
});

// // @desc Create a single Order
// // @route POST /api/v1/Order
// // @access Public
// export const createOrder = asyncHandler(
//   async (req: CustomRequest, res: Response) => {
//     logger.info(`Service: createOrder ${req.method} ${req.url}`);

//     const userId = req.id as number | string;

//     const connection = await getDBConnection();
//     const queryRunner = connection.createQueryRunner();

//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       const validation = onlineCreateOrderValidationSchema.safeParse({
//         ...req.body,
//         userId,
//       });

//       if (!validation.success) {
//         const formattedErrors = validation.error.issues.map((issue) => ({
//           path: issue.path.join("."),
//           message: issue.message,
//         }));

//         return res.status(400).json({
//           success: false,
//           issues: formattedErrors,
//         });
//       }

//       const {
//         shippingCharge,
//         subTotal,
//         paymentMethod,
//         orderItems,

//         ...orderData
//       }: any = validation.data;

//       const repository = queryRunner.manager.getRepository(OrderEntity);

//       // tracking no start
//       const count = (await repository.count()) + 1;
//       const trackingNo = `TRK-${count.toString().padStart(10, "0")}`;
//       // tracking no end

//       const newOrder = repository.create({
//         shippingCharge,
//         subTotal,
//         paymentMethod,
//         paymentStatus: PaymentStatus.NotPaid,
//         ...orderData,
//         trackingNo,
//       });
//       const savedOrder = await repository.save(newOrder);

//       if (orderItems && savedOrder.id) {
//         const repoOrderItems =
//           queryRunner.manager.getRepository(OrderItemEntity);
//         const newOrderItems = repoOrderItems.create(
//           orderItems.map((item: any) => ({
//             ...item,
//             orderId: savedOrder.id,
//           }))
//         );
//         const resultOrderItems = await repoOrderItems.save(newOrderItems);
//         const productVariantRepo =
//           queryRunner.manager.getRepository(ProductVariantEntity);

//         for (const item of resultOrderItems) {
//           const findProductVariant = await productVariantRepo.findOne({
//             where: { id: item.productVariantId }, // find productvariant by id
//           });

//           if (findProductVariant) {
//             let currentStock =
//               (+findProductVariant.stockQty || 0) - (+item.qty || 0); //##ToDo need to validate stockqty
//             await productVariantRepo.save({
//               id: findProductVariant.id,
//               stockQty: currentStock,
//             });
//           }
//         }

//         const repositoryOrderTracking =
//           queryRunner.manager.getRepository(OrderTrackingEntity);
//         const newOrderTracking = repositoryOrderTracking.create({
//           orderId: savedOrder.id,
//           userId,
//           location: "অর্ডারটি গ্রহন করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।",
//         });
//         await repositoryOrderTracking.save(newOrderTracking);

//         if (validation.data.couponId) {
//           const couponRepository =
//             queryRunner.manager.getRepository(AppliedCouponEntity);

//           const newCouponApplied = couponRepository.create({
//             orderId: savedOrder.id,
//             userId,
//             discountAmount: validation.data.couponDiscount,
//             couponId: validation.data.couponId,
//           });
//           await couponRepository.save(newCouponApplied);
//         }

//         const repositoryCarts = queryRunner.manager.getRepository(CartEntity);

//         const cartsList = await repositoryCarts.find({ where: { userId } });

//         await repositoryCarts.remove(cartsList);

//         const notification: Notification = {
//           type: "Order",
//           title: "Order Placed",
//           message: `Your order has been placed successfully. Order Tracking No: ${trackingNo}`,
//           userId,
//           orderId: savedOrder.id,
//         };

//         await sendOrderNotification(notification);
//       }

//       // payment and sslcommerz
//       const store_id = "ecomm6648b03fa5d37";
//       const store_passwd = "ecomm6648b03fa5d37@ssl";
//       const is_live = false; //true for live, false for sandbox
//       // payment
//       const data = {
//         total_amount: 100,
//         currency: "BDT",
//         tran_id: `TXN_${Date.now()}`, // use unique tran_id for each api call
//         success_url: "http://localhost:3000/api/success",
//         fail_url: "http://localhost:3000/api/fail",
//         cancel_url: "http://localhost:3000/api/cancel",
//         ipn_url: "http://localhost:3000/api/payment-ipn",
//         shipping_method: "Courier",
//         product_name: "Computer.",
//         product_category: "Electronic",
//         product_profile: "general",
//         cus_name: "Customer Name",
//         cus_email: "customer@example.com",
//         cus_add1: "Dhaka",
//         cus_add2: "Dhaka",
//         cus_city: "Dhaka",
//         cus_state: "Dhaka",
//         cus_postcode: "1000",
//         cus_country: "Bangladesh",
//         cus_phone: "01711111111",
//         cus_fax: "01711111111",
//         ship_name: "Customer Name",
//         ship_add1: "Dhaka",
//         ship_add2: "Dhaka",
//         ship_city: "Dhaka",
//         ship_state: "Dhaka",
//         ship_postcode: 1000,
//         ship_country: "Bangladesh",
//       };
//       const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

//       const apiResponse = await sslcz
//         .init(data)
//         .then((apiResponse: { GatewayPageURL: any }) => {
//           logger.info(`Service: getMemu ${req.method} ${req.url}`);
//           let GatewayPageURL = apiResponse.GatewayPageURL;
//           res.redirect(GatewayPageURL);
//           console.log("Redirecting to: ", GatewayPageURL);
//         });

//       console.log("apiResponse", apiResponse);

//       // const repositoryPayment = connection.getRepository(PaymentEntity);

//       // const newPayment = repositoryPayment.create({
//       //   orderId: 1,
//       //   userId: 1,
//       //   paymentDate: dayjs(),
//       //   paymentMethod: "Cash | SSLEcommerc",
//       //   paymentType: PaymentType.Debit,
//       //   amount: 4000,
//       // });
//       // await repositoryPayment.save(newPayment);

//       // payment end

//       await queryRunner.commitTransaction();

//       return res.status(200).json({
//         success: true,
//         message: "Create a new Order",
//         data: savedOrder,
//       });
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       console.error("Transaction failed:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to create Order",
//       });
//     } finally {
//       await queryRunner.release();
//     }
//   }
// );

// @desc Get a single Order
// @route GET /api/v1/orders/:id
// @access Public
// export const getOrder = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     logger.info(`Service: getOrder ${req.method} ${req.url}`);

//     const { id } = req.params;
//     const connection = await getDBConnection();
//     const orderRepository = connection.getRepository(OrderEntity);

//     const qb = orderRepository.createQueryBuilder("order");
//     qb.select([
//       "order",
//       "orderItems",
//       "productVariant.id",
//       "productVariant.material",
//       "productVariant.default",
//       "color.name",
//       "color.color",
//       "size.name",
//       "product",
//       "payments",
//       "orderTrackings",
//       "deliveryMan.name",
//       "user.name",
//       "shippingAddress",
//     ]);
//     qb.where({ id });
//     qb.leftJoin("order.orderItems", "orderItems");
//     qb.leftJoin("orderItems.product", "product");
//     qb.leftJoin("orderItems.productVariant", "productVariant");
//     qb.leftJoin("productVariant.color", "color");
//     qb.leftJoin("productVariant.size", "size");
//     qb.leftJoin("order.orderTrackings", "orderTrackings");
//     qb.leftJoin("order.deliveryMan", "deliveryMan");
//     qb.leftJoin("order.user", "user");
//     qb.leftJoin("order.payments", "payments");
//     qb.leftJoin("order.shippingAddress", "shippingAddress");
//     qb.addOrderBy("order.trackingNo", "DESC");

//     const result = await qb.getOne();

//     if (!result) {
//       throw new Error(`Resource not found of id #${req.params.id}`);
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Get Order",
//       data: result,
//     });
//   }
// );
