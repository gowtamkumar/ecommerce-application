import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { sendSms } from '../../../common/sendSms';
import { getDBConnection } from '../../../config/db';
import { CustomRequest } from '../../../enums/custom-request-type';
import { NotificationType } from '../../../enums/notification-type.enum';
import { asyncHandler } from '../../../middlewares/async.middleware';
import { logger } from '../../../middlewares/logger';
import {
  onlineCreateOrderValidationSchema,
  orderDeliveryManValidationSchema,
  orderStatusUpdateValidationSchema,
  orderUpdateValidationSchema,
} from '../../../validation';
import { RoleEnum } from '../../auth/enums/role.enum';
import { UserEntity } from '../../auth/model/user.entity';
import { CartEntity } from '../../cart/model/cart.entity';
import { AppliedCouponEntity } from '../../coupon/model/applied-coupon.entity';
import { OrderTrackingStatusEnum } from '../../order-tracking/enums/order-tracking-status.enum';
import { OrderTrackingEntity } from '../../order-tracking/model/order-tracking.entity';
import { NotificationEntity } from '../../other/notification/model/notification.entity';
import { ProductVariantEntity } from '../../products/product-variant/model/product-variant.entity';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../enums';
import { OrderItemEntity } from '../model/order-item.entity';
import { OrderEntity } from '../model/order.entity';
const SSLCommerzPayment = require('sslcommerz-lts');

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
    const count = (await repository.count()) + 1;
    const trackingNo = `TRK-${count.toString().padStart(10, '0')}`;

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

      // clear cart
      const cartRepo = queryRunner.manager.getRepository(CartEntity);
      const cartsList = await cartRepo.find({ where: { userId } });
      await cartRepo.remove(cartsList);

      // order tracking
      const newOrderTracking = {
        status: savedOrder.status,
        orderId,
        userId,
        location: 'অর্ডারটি গ্রহন করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।',
      } as OrderTracking;
      const orderTrackingRepo = queryRunner.manager.getRepository(OrderTrackingEntity);

      await orderTracking(newOrderTracking, orderTrackingRepo);

      // applied coupon
      if (validation.data.couponId) {
        const couponRepo = queryRunner.manager.getRepository(AppliedCouponEntity);
        const newCouponApplied = couponRepo.create({
          orderId: savedOrder.id,
          userId,
          discountAmount: validation.data.couponDiscount,
          couponId: validation.data.couponId,
        });
        await couponRepo.save(newCouponApplied);
      }

      // notification to User
      const notification: Notification = {
        type: NotificationType.OrderPlaced,
        title: 'Order Placed',
        message: `Your order has been placed successfully. Order Tracking No: ${trackingNo}`,
        userId,
        orderId: savedOrder.id,
      };
      await sendOrderNotification(notification);

      // Notification to Admins
      const userRepository = queryRunner.manager.getRepository(UserEntity);
      const admins = await userRepository.find({ where: { role: RoleEnum.Admin } });
      const adminNotifications = admins.map((admin: any) => ({
        type: NotificationType.AdminNewOrder,
        title: 'New Order Received',
        message: `New order #${savedOrder.id} received from User ${userId}. Tracking No: ${trackingNo}`,
        userId: admin.id,
        orderId: savedOrder.id,
      }));
      
      const notificationRepo = queryRunner.manager.getRepository(NotificationEntity);
      const createdNotifications = notificationRepo.create(adminNotifications as any); // Cast slightly to match if needed, or loop
      await notificationRepo.save(createdNotifications);

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

    if (queryRunner.isTransactionActive) {
      await queryRunner.commitTransaction();
    }

    // ssl ecommerce intregration
    let paymentUrl = null;
    if (savedOrder.paymentMethod === PaymentMethod.SSLCOMMERZ) {
      const onlinePaymentRes = await onlinePayment(req, res, savedOrder);
      paymentUrl = onlinePaymentRes;
    }

    return res.status(200).json({
      success: true,
      message: 'Order created',
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

export const onlinePayment = async (req: CustomRequest, res: Response, savedOrder: any) => {
  logger.info(`Service: onlinePayment ${req.method} ${req.url}`);
  const userId = req.id as number | string;
  const tranId = savedOrder.tranId;
  const connection = await getDBConnection();
  // SSLCOMMERZ payment gateway
  const store_id = process.env.STORE_ID;
  const store_passwd = process.env.STORE_PASSWD;
  const BACK_END_URL = process.env.BACK_END_URL;
  const is_live = process.env.IS_LIVE;

  const userRepository = connection.getRepository(UserEntity);
  const customer = await userRepository.findOne({
    where: { id: userId },
  });

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  const paymentPayload = {
    total_amount: savedOrder.grandTotal,
    currency: 'BDT',
    tran_id: tranId,
    success_url: `${BACK_END_URL}/payments/success/${tranId}`,
    fail_url: `${BACK_END_URL}/payments/fail/${tranId}`,
    cancel_url: `${BACK_END_URL}/payments/cancel/${tranId}`,
    ipn_url: `${BACK_END_URL}/payment-ipn/${tranId}`,

    shipping_method: 'Courier',
    product_name: 'productNames',
    product_category: 'General',
    product_profile: 'general',

    cus_name: customer.name,
    cus_email: customer.email,
    cus_add1: customer.address || 'Dhaka',
    cus_city: customer.city || 'Dhaka',
    cus_postcode: customer.postcode || '1000',
    cus_country: 'Bangladesh',
    cus_phone: customer.phone || '01711111111',

    ship_name: customer.name,
    ship_add1: customer.address || 'Dhaka',
    ship_city: customer.city || 'Dhaka',
    ship_postcode: customer.postcode || 1000,
    ship_country: 'Bangladesh',

    // cus_add1: "Dhaka",
    // cus_state: "Dhaka",
    // cus_fax: "01711111111",
    // ship_add2: "Dhaka",
    // ship_state: "Dhaka",
  };
  const apiResponse = await sslcz.init(paymentPayload);
  console.log('apiResponse', apiResponse);

  return apiResponse.GatewayPageURL;
};

// @desc Get all Order
// @route GET /api/v1/Order
// @access Public
export const getOrders = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: getOrders ${req.method} ${req.url}`);

  const { status, returnedStatus } = req.query;

  const connection = await getDBConnection();
  const orderRepository = connection.getRepository(OrderEntity);

  const qb = orderRepository.createQueryBuilder('order');
  qb.select([
    'order',
    'orderItems',
    'productVariant.id',
    'productVariant.material',
    'productVariant.default',
    'color.name',
    'color.color',
    'size.name',
    'product',
    'payments',
    'orderTrackings',
    'deliveryMan.name',
    'user.name',
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
  qb.addOrderBy('order.trackingNo', 'DESC');

  if (returnedStatus)
    qb.andWhere('order.returnedStatus IN (:...returnedStatus)', {
      returnedStatus: returnedStatus.toString().split(','),
    });

  if (status)
    qb.andWhere('order.status IN (:...status)', {
      status: status.toString().split(','),
    });

  const results = await qb.getMany();

  return res.status(200).json({
    success: true,
    message: 'Get all Order',
    data: results,
  });
});

export const getUserOrders = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: getUserOrders ${req.method} ${req.url}`);
  const { status } = req.query;
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
    'user.name',
    'shippingAddress',
    'productVariant.id',
    'productVariant.material',
    'productVariant.default',
    'color.name',
    'color.color',
    'size.name',
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
  if (userId) qb.where({ userId });
  if (status)
    qb.andWhere('order.status IN (:...status)', {
      status: status.toString().split(','),
    });
  const results = await qb.getMany();

  return res.status(200).json({
    success: true,
    message: 'Get all Order',
    data: results,
  });
});

// @desc Get a single Order
// @route GET /api/v1/orders/query?id=1
// @access Public
export const getOrderQuery = asyncHandler(async (req: Request, res: Response) => {
  const { id, trackingNo } = req.query; // Assuming the order ID will be passed in the URL as a parameter (e.g., /orders/:id)
  logger.info(`Service: getOrderQuery ${req.method} ${req.url}`);

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

  qb.addSelect(
    (subQuery: any) =>
      subQuery
        .select('COALESCE(SUM(p.amount), 0)', 'totalCredit')
        .from('payments', 'p')
        .where('p.order_id = order.id')
        .andWhere('p.payment_type = :credit', { credit: 'Credit' }),
    'order_totalCredit',
  );

  qb.addSelect(
    (subQuery: any) =>
      subQuery
        .select('COALESCE(SUM(p.amount), 0)', 'totalDebit')
        .from('payments', 'p')
        .where('p.order_id = order.id')
        .andWhere('p.payment_type = :debit', { debit: 'Debit' }),
    'order_totalDebit',
  );

  // Filter to get a single order by ID
  qb.where('order.id = :id', { id });
  qb.orWhere('order.trackingNo = :trackingNo', { trackingNo });

  const results = await qb.getRawAndEntities();

  if (!results.entities.length) {
    return res.status(404).json({
      success: false,
      message: `Order with ID ${id} not found.`,
    });
  }

  const raw = results.raw[0];
  const order = results.entities[0];

  const totalCredit = Number(raw.order_totalCredit) || 0;
  const totalDebit = Number(raw.order_totalDebit) || 0;

  return res.status(200).json({
    success: true,
    message: `Order with ID ${id} retrieved successfully`,
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
    message: `Update a single Order of id ${req.params.id}`,
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
    message: 'Assign Delivery man',
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
    where: { id },
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
    const userRepository = await connection.getRepository(UserEntity);
    const getuser = await userRepository.findOne({ where: { id: userId } });
    const ssmsRes = await sendSms(getuser.phone, message);

    let notificationType = NotificationType.Order;
    if (status === OrderStatus.Shipped) notificationType = NotificationType.OrderShipped;
    if (status === OrderStatus.Delivered) notificationType = NotificationType.OrderDelivered;
    if (status === OrderStatus.Canceled) notificationType = NotificationType.OrderCanceled;

    const notification: Notification = {
      type: notificationType,
      title: status,
      message,
      userId,
      orderId: result.id,
    };

    // Notification: Request Review on Delivery
    if (status === OrderStatus.Delivered) {
       const notificationRepo = queryRunner.manager.getRepository(NotificationEntity);
       await notificationRepo.save(notificationRepo.create({
          type: NotificationType.ReviewRequest,
          title: 'How was your order?',
          message: `Your order #${result.id} has been delivered. We'd love to hear your feedback!`,
          userId,
          orderId: result.id,
          isRead: false,
       }));
    }

    const newOrderTracking = {
      status: status,
      orderId: result.id,
      userId,
      location,
    } as OrderTracking;

    const orderTrackingRepo = queryRunner.manager.getRepository(OrderTrackingEntity);

    await orderTracking(newOrderTracking, orderTrackingRepo);

    await sendOrderNotification(notification);

    // Notify Admins if Order is Canceled
    if (status === OrderStatus.Canceled) {
       const userRepository = queryRunner.manager.getRepository(UserEntity);
       const admins = await userRepository.find({ where: { role: RoleEnum.Admin } });
       const adminNotifications = admins.map((admin: UserEntity) => ({
         type: NotificationType.AdminOrderCanceled,
         title: 'Order Canceled',
         message: `Order #${result.id} has been canceled.`,
         userId: admin.id,
         orderId: result.id,
       }));
       
       const notificationRepo = queryRunner.manager.getRepository(NotificationEntity);
       await notificationRepo.save(notificationRepo.create(adminNotifications as any));
    }

    await queryRunner.commitTransaction();

    return res.status(200).json({
      success: true,
      message: `Order Status Update of id ${req.params.id}`,
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
  for (const item of orderItems) {
    const findProductVariant: any = await productVariantRepo.findOne({
      where: { id: item.productVariantId },
    });

    if (!findProductVariant) continue;

    const currentStock = +findProductVariant.stockQty || 0;
    const itemQty = +item.qty || 0;

    // ❗Check if stock is enough before reducing
    if (!isStockIncrease && currentStock < itemQty) {
      throw new Error(
        `Insufficient stock for product variant ID ${item.productVariantId}. Required: ${itemQty}, Available: ${currentStock}`,
      );
    }

    const newStockQty = isStockIncrease ? currentStock + itemQty : currentStock - itemQty;

    await productVariantRepo.save({
      id: findProductVariant.id,
      stockQty: newStockQty,
    });

    // Check for Low Stock
    if (newStockQty < 5) {
       // We need a way to send notification here. Since this might be inside a transaction, 
       // and we don't have direct access to queryRunner here easily without passing it, 
       // or we can use a separate connection/repository if strictly needed, 
       // but typically we should pass the manager or repository. 
       // Ideally trigger an event or just do it here.
       // Let's assume we can get connection or use the repo's manager if possible.
       // For simplicity, we'll fetch admins and save notification using the repo's manager if available or get new connection.
       // Note: productVariantRepo belongs to the transaction manager passed in.
       
       try {
           const manager = productVariantRepo.manager;
           const userRepository = manager.getRepository(UserEntity);
           const admins = await userRepository.find({ where: { role: RoleEnum.Admin } });
           const notificationRepo = manager.getRepository(NotificationEntity);

           const adminNotifications = admins.map((admin: UserEntity) => ({
             type: NotificationType.AdminLowStock,
             title: 'Low Stock Alert',
             message: `Product Variant (ID: ${findProductVariant.id}) is running low. Current Stock: ${newStockQty}`,
             userId: admin.id,
            //  orderId: null, // Optional, might not be linked to specific order in schema directly if not nullable
           }));
           // Casting to any to avoid strict type checks if orderId is missing/nullable 
           await notificationRepo.save(notificationRepo.create(adminNotifications as any));
       } catch (err) {
           console.error("Failed to send low stock notification", err);
       }
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

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

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
