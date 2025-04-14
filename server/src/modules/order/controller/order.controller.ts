import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { OrderEntity } from "../model/order.entity";
import {
  onlineCreateOrderValidationSchema,
  orderDeliveryManValidationSchema,
  orderStatusUpdateValidationSchema,
  orderUpdateValidationSchema,
} from "../../../validation";
import { OrderTrackingEntity } from "../../order-tracking/model/order-tracking.entity";
import { PaymentEntity } from "../../payment/model/payment.entity";
import dayjs from "dayjs";
import { OrderStatus, PaymentStatus } from "../enums";
import { PaymentType } from "../../payment/enums/payment-type.enum";
import { OrderItemEntity } from "../model/order-item.entity";
import { CartEntity } from "../../cart/model/cart.entity";
import { logger } from "../../../middlewares/logger";
import { ProductVariantEntity } from "../../products/product-variant/model/product-variant.entity";
import { CustomRequest } from "../../../enums/custom-request-type";
import { AppliedCouponEntity } from "../../coupon/model/applied-coupon.entity";
import { NotificationEntity } from "../../other/notification/model/notification.entity";
const SSLCommerzPayment = require("sslcommerz-lts");

interface Notification {
  type: string;
  title: string;
  message: string;
  userId: string | number;
  orderId: string | number;
}

// @desc Create a single Order
// @route POST /api/v1/Order
// @access Public
export const createOrder = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    logger.info(`Service: createOrder ${req.method} ${req.url}`);

    const userId = req.id as number | string;

    const connection = await getDBConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const validation = onlineCreateOrderValidationSchema.safeParse({
        ...req.body,
        userId,
      });

      if (!validation.success) {
        const formattedErrors = validation.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          success: false,
          issues: formattedErrors,
        });
      }

      const {
        shippingCharge,
        subTotal,
        paymentMethod,
        orderItems,

        ...orderData
      }: any = validation.data;

      const repository = queryRunner.manager.getRepository(OrderEntity);

      // tracking no start
      const count = (await repository.count()) + 1;
      const trackingNo = `TRK-${count.toString().padStart(10, "0")}`;
      // tracking no end

      const newOrder = repository.create({
        shippingCharge,
        subTotal,
        paymentMethod,
        paymentStatus: PaymentStatus.NotPaid,
        ...orderData,
        trackingNo,
      });
      const savedOrder = await repository.save(newOrder);

      if (orderItems && savedOrder.id) {
        const repoOrderItems =
          queryRunner.manager.getRepository(OrderItemEntity);
        const newOrderItems = repoOrderItems.create(
          orderItems.map((item: any) => ({
            ...item,
            orderId: savedOrder.id,
          }))
        );
        const resultOrderItems = await repoOrderItems.save(newOrderItems);
        const productVariantRepo =
          queryRunner.manager.getRepository(ProductVariantEntity);

        for (const item of resultOrderItems) {
          const findProductVariant = await productVariantRepo.findOne({
            where: { id: item.productVariantId }, // find productvariant by id
          });

          if (findProductVariant) {
            let currentStock =
              (+findProductVariant.stockQty || 0) - (+item.qty || 0); //##ToDo need to validate stockqty
            await productVariantRepo.save({
              id: findProductVariant.id,
              stockQty: currentStock,
            });
          }
        }

        const repositoryOrderTracking =
          queryRunner.manager.getRepository(OrderTrackingEntity);
        const newOrderTracking = repositoryOrderTracking.create({
          orderId: savedOrder.id,
          userId,
          location: "অর্ডারটি গ্রহন করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।",
        });
        await repositoryOrderTracking.save(newOrderTracking);

        if (validation.data.couponId) {
          const couponRepository =
            queryRunner.manager.getRepository(AppliedCouponEntity);

          const newCouponApplied = couponRepository.create({
            orderId: savedOrder.id,
            userId,
            discountAmount: validation.data.couponDiscount,
            couponId: validation.data.couponId,
          });
          await couponRepository.save(newCouponApplied);
        }

        const repositoryCarts = queryRunner.manager.getRepository(CartEntity);

        const cartsList = await repositoryCarts.find({ where: { userId } });

        await repositoryCarts.remove(cartsList);

        const notification: Notification = {
          type: "Order",
          title: "Order Placed",
          message: `Your order has been placed successfully. Order Tracking No: ${trackingNo}`,
          userId,
          orderId: savedOrder.id,
        };

        await sendOrderNotification(notification);
      }

      await queryRunner.commitTransaction();

      return res.status(200).json({
        success: true,
        message: "Create a new Order",
        data: savedOrder,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Transaction failed:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create Order",
      });
    } finally {
      await queryRunner.release();
    }
  }
);

export const sendOrderNotification = async (
  notification: Notification
): Promise<{ success: boolean; message: string }> => {
  logger.info(`Service: sendOrderNotification`);
  const connection = await getDBConnection(); // Consider reusing an existing connection
  const repository = connection.getRepository(NotificationEntity);

  try {
    const newNotification = repository.create(notification);
    await repository.save(newNotification);

    return {
      success: true,
      message: "Notification sent successfully",
    };
  } catch (error) {
    console.error("Failed to send notification:", error);
    return {
      success: false,
      message: "Failed to send notification",
    };
  } finally {
    // Optionally release the connection if it's not reused
    // await connection.close(); // Only if you're not reusing the connection
  }
};

export const onlinePayment = async () => {
  const connection = await getDBConnection();
  // const store_id = "ecomm6648b03fa5d37";
  // const store_passwd = "ecomm6648b03fa5d37@ssl";
  // const is_live = false; //true for live, false for sandbox
  // payment
  // const data = {
  //   total_amount: 100,
  //   currency: "BDT",
  //   tran_id: "REF123", // use unique tran_id for each api call
  //   success_url: "http://localhost:3030/success",
  //   fail_url: "http://localhost:3030/fail",
  //   cancel_url: "http://localhost:3030/cancel",
  //   ipn_url: "http://localhost:3030/ipn",
  //   shipping_method: "Courier",
  //   product_name: "Computer.",
  //   product_category: "Electronic",
  //   product_profile: "general",
  //   cus_name: "Customer Name",
  //   cus_email: "customer@example.com",
  //   cus_add1: "Dhaka",
  //   cus_add2: "Dhaka",
  //   cus_city: "Dhaka",
  //   cus_state: "Dhaka",
  //   cus_postcode: "1000",
  //   cus_country: "Bangladesh",
  //   cus_phone: "01711111111",
  //   cus_fax: "01711111111",
  //   ship_name: "Customer Name",
  //   ship_add1: "Dhaka",
  //   ship_add2: "Dhaka",
  //   ship_city: "Dhaka",
  //   ship_state: "Dhaka",
  //   ship_postcode: 1000,
  //   ship_country: "Bangladesh",
  // };
  // const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  // sslcz.init(data).then((apiResponse: { GatewayPageURL: any }) => {
  // logger.info(`Service: getMemu ${req.method} ${req.url}`);
  //   // Redirect the user to payment gateway
  //   let GatewayPageURL = apiResponse.GatewayPageURL;
  //   res.redirect(GatewayPageURL);
  //   console.log("Redirecting to: ", GatewayPageURL);
  // });

  const repositoryPayment = connection.getRepository(PaymentEntity);

  const newPayment = repositoryPayment.create({
    orderId: 1,
    userId: 1,
    paymentDate: dayjs(),
    paymentMethod: "Cash | SSLEcommerc",
    paymentType: PaymentType.Debit,
    amount: 4000,
  });
  await repositoryPayment.save(newPayment);
};

// @desc Get all Order
// @route GET /api/v1/Order
// @access Public
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getOrders ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const orderRepository = connection.getRepository(OrderEntity);

  const qb = orderRepository.createQueryBuilder("order");
  qb.select([
    "order",
    "orderItems",
    "productVariant.id",
    "productVariant.material",
    "productVariant.default",
    "color.name",
    "color.color",
    "size.name",
    "product",
    "payments",
    "orderTrackings",
    "deliveryMan.name",
    "user.name",
    "shippingAddress",
  ]);

  qb.leftJoin("order.orderItems", "orderItems");
  qb.leftJoin("orderItems.product", "product");
  qb.leftJoin("orderItems.productVariant", "productVariant");
  qb.leftJoin("productVariant.color", "color");
  qb.leftJoin("productVariant.size", "size");
  qb.leftJoin("order.orderTrackings", "orderTrackings");
  qb.leftJoin("order.deliveryMan", "deliveryMan");
  qb.leftJoin("order.user", "user");
  qb.leftJoin("order.payments", "payments");
  qb.leftJoin("order.shippingAddress", "shippingAddress");
  qb.addOrderBy("order.trackingNo", "DESC");

  const results = await qb.getMany();

  return res.status(200).json({
    success: true,
    message: "Get all Order",
    data: results,
  });
});

export const getUserOrders = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    logger.info(`Service: getUserOrders ${req.method} ${req.url}`);

    const userId = req.id;
    const connection = await getDBConnection();
    const orderRepository = connection.getRepository(OrderEntity);

    const qb = orderRepository.createQueryBuilder("order");
    qb.select([
      "order",
      "orderItems",
      "product",
      "payments",
      "orderTrackings",
      "deliveryMan.name",
      "user.name",
      "shippingAddress",
    ]);

    qb.leftJoin("order.orderItems", "orderItems");
    qb.leftJoin("orderItems.product", "product");
    qb.leftJoin("order.orderTrackings", "orderTrackings");
    qb.leftJoin("order.deliveryMan", "deliveryMan");
    qb.leftJoin("order.user", "user");
    qb.leftJoin("order.payments", "payments");
    qb.leftJoin("order.shippingAddress", "shippingAddress");
    if (userId) qb.where({ userId });
    const results = await qb.getMany();

    return res.status(200).json({
      success: true,
      message: "Get all Order",
      data: results,
    });
  }
);

// @desc Get a single Order
// @route GET /api/v1/Order/:id
// @access Public
export const getOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getOrder ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
  const orderRepository = connection.getRepository(OrderEntity);

  const qb = orderRepository.createQueryBuilder("order");
  qb.select([
    "order",
    "orderItems",
    "productVariant.id",
    "productVariant.material",
    "productVariant.default",
    "color.name",
    "color.color",
    "size.name",
    "product",
    "payments",
    "orderTrackings",
    "deliveryMan.name",
    "user.name",
    "shippingAddress",
  ]);
  qb.where({id})
  qb.leftJoin("order.orderItems", "orderItems");
  qb.leftJoin("orderItems.product", "product");
  qb.leftJoin("orderItems.productVariant", "productVariant");
  qb.leftJoin("productVariant.color", "color");
  qb.leftJoin("productVariant.size", "size");
  qb.leftJoin("order.orderTrackings", "orderTrackings");
  qb.leftJoin("order.deliveryMan", "deliveryMan");
  qb.leftJoin("order.user", "user");
  qb.leftJoin("order.payments", "payments");
  qb.leftJoin("order.shippingAddress", "shippingAddress");
  qb.addOrderBy("order.trackingNo", "DESC");


  const result = await qb.getOne();


     if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

  return res.status(200).json({
    success: true,
    message: "Get Order",
    data: result,
  })}

  //   const connection = await getDBConnection();
  //   const repository = await connection.getRepository(OrderEntity);
  //   const result = await repository.findOne({
  //     where: { id },
  //     relations: {
  //       orderItems: true,
  //       payments: true,
  //       orderTrackings: true,
  //     },
  //   });

  //   if (!result) {
  //     throw new Error(`Resource not found of id #${req.params.id}`);
  //   }

  //   return res.status(200).json({
  //     success: true,
  //     message: `Get a single Order of id ${req.params.id}`,
  //     data: result,
  //   });
  // }
);

// @desc Get a single Order
// @route GET /api/v1/Order/:id
// @access Public
// export const orderTracking = asyncHandler(
//   async (req: CustomRequest, res: Response, next: NextFunction) => {

//     const { trackingNo } = req.query;
//     const userId = req.id;
//     const connection = await getDBConnection();
//     const repository = await connection.getRepository(OrderEntity);
//     const qb = repository.createQueryBuilder("order");
//     qb.select([
//       "order",
//       "orderItems",
//       "product",
//       "payments",
//       "orderTrackings",
//       "deliveryMan.name",
//       "shippingAddress",
//     ]);

//     qb.leftJoin("order.orderItems", "orderItems");
//     qb.leftJoin("orderItems.product", "product");
//     qb.leftJoin("order.orderTrackings", "orderTrackings");
//     qb.leftJoin("order.deliveryMan", "deliveryMan");
//     qb.leftJoin("order.user", "user");
//     qb.leftJoin("order.payments", "payments");
//     qb.leftJoin("order.shippingAddress", "shippingAddress");
//     if (userId) qb.where({ userId });
//     if (trackingNo) qb.andWhere({ trackingNo });
//     const result = await qb.getOne();

//     if (!result) {
//       throw new Error(`Resource not found of #${trackingNo}`);
//     }

//     return res.status(200).json({
//       success: true,
//       message: `Get a single Tracking No of ${trackingNo}`,
//       data: result,
//     });
//   }
// );

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
      path: issue.path.join("."),
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
      }))
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
// @route PUT /api/v1/Order/:id
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
export const assignDeliveryMan = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: assignDeliveryMan ${req.method} ${req.url}`);

    const { id } = req.params;
    const validation = orderDeliveryManValidationSchema.safeParse(req.body);

    if (!validation.success) {
      const formattedErrors = validation.error.issues.map((issue) => ({
        path: issue.path.join("."),
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
      message: "Assign Delivery man",
      data: save,
    });
  }
);

export const orderStatusUpdate = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    logger.info(`Service: orderStatusUpdate ${req.method} ${req.url}`);

    const userId = req.id as string | number;

    const { id } = req.params;

    const validation = orderStatusUpdateValidationSchema.safeParse(req.body);

    if (!validation.success) {
      const formattedErrors = validation.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        issues: formattedErrors,
      });
    }

    const connection = await getDBConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const repository = await queryRunner.manager.getRepository(OrderEntity);

    const result = await repository.findOne({
      where: { id },
      relations: ["orderItems"],
    });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    try {
      if (
        validation.data.status === OrderStatus.Returned ||
        validation.data.status ||
        OrderStatus.Canceled
      ) {
        const productVariantRepo =
          queryRunner.manager.getRepository(ProductVariantEntity);
        for (const item of result.orderItems) {
          const findProductVariant = await productVariantRepo.findOne({
            where: { id: item.productVariantId },
          });

          if (findProductVariant) {
            let currentStock =
              (+findProductVariant.stockQty || 0) + (+item.qty || 0);
            const returnVariatn = await productVariantRepo.save({
              id: findProductVariant.id,
              stockQty: currentStock,
            });
          }
        }
      }

      // const updateData = await repository.merge({
      //   id: result.id,
      //   status: validation.data.status,
      // });

      const save = await repository.save({
        id: result.id,
        ...validation.data,
      });

      const notification: Notification = {
        type: "Order",
        title: validation.data.status,
        message: `Your order has been ${validation.data.status}. Order Tracking No: ${result.trackingNo}`,
        userId,
        orderId: result.id,
      };

      await sendOrderNotification(notification);

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
        message: "Failed to create Order",
      });
    } finally {
      await queryRunner.release();
    }
  }
);

// @desc Delete a single Order
// @route DELETE /api/v1/Order/:id
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
