import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { OrderEntity } from "../model/order.entity";
import {
  orderDeliveryManValidationSchema,
  orderStatusUpdateValidationSchema,
  orderUpdateValidationSchema,
  orderValidationSchema,
} from "../../../validation";
import axios from "axios";
import { OrderTrackingEntity } from "../../order-tracking/model/order-tracking.entity";
import { ProductVariantEntity } from "../../product-variant/model/product-variant.entity";
import { PaymentEntity } from "../../payment/model/payment.entity";
import dayjs from "dayjs";
import { OrderPaymentMethod, OrderStatus, PaymentStatus } from "../enums";
import { PaymentType } from "../../payment/enums/payment-type.enum";
import { OrderItemEntity } from "../model/order-item.entity";
import { CartEntity } from "../../cart/model/cart.entity";
const SSLCommerzPayment = require("sslcommerz-lts");

// @desc Get all Order
// @route GET /api/v1/Order
// @access Public
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const orderRepository = connection.getRepository(OrderEntity);

  const qb = orderRepository.createQueryBuilder("order");
  qb.select([
    "order",
    "orderItems",
    "size.name",
    "color.name",
    "product",
    "payments",
    "orderTrackings",
    "deliveryMan.name",
    "user.name",
    "shippingAddress",
  ]);

  qb.leftJoin("order.orderItems", "orderItems");
  qb.leftJoin("orderItems.product", "product");
  qb.leftJoin("orderItems.size", "size");
  qb.leftJoin("orderItems.color", "color");
  qb.leftJoin("order.orderTrackings", "orderTrackings");
  qb.leftJoin("order.deliveryMan", "deliveryMan");
  qb.leftJoin("order.user", "user");
  qb.leftJoin("order.payments", "payments");
  qb.leftJoin("order.shippingAddress", "shippingAddress");

  const results = await qb.getMany();

  return res.status(200).json({
    success: true,
    msg: "Get all Order",
    data: results,
  });
});

export const getUserOrders = asyncHandler(async (req: any, res: Response) => {
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
    msg: "Get all Order",
    data: results,
  });
});

// @desc Get a single Order
// @route GET /api/v1/Order/:id
// @access Public
export const getOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(OrderEntity);
    const result = await repository.findOne({
      where: { id },
      relations: {
        orderItems: true,
        payments: true,
        orderTrackings: true,
      },
    });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Order of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Order
// @route POST /api/v1/Order
// @access Public
export const createOrder = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  const store_id = "ecomm6648b03fa5d37";
  const store_passwd = "ecomm6648b03fa5d37@ssl";
  const is_live = false; //true for live, false for sandbox

  try {
    const validation = orderValidationSchema.safeParse({
      ...req.body,
      userId: req.id,
    });

    if (!validation.success) {
      return res.status(401).json({
        message: validation.error.formErrors,
      });
    }

    const {
      shippingAmount,
      orderTotalAmount,
      orderDate,
      paymentMethod,
      orderItems,
      ...orderData
    }: any = validation.data;

    const repository = queryRunner.manager.getRepository(OrderEntity);
    const count = (await repository.count()) + 1;

    const trackingNo = `N${count.toString().padStart(10, "0")}`;

    const newOrder = repository.create({
      shippingAmount,
      orderTotalAmount,
      orderDate,
      paymentMethod,
      paymentStatus:
        paymentMethod === OrderPaymentMethod.Cash
          ? PaymentStatus.NotPaid
          : PaymentStatus.Paid,
      ...orderData,
    });
    const savedOrder = await repository.save({ ...newOrder, trackingNo });

    if (orderItems && savedOrder.id) {
      const repositoryCarts = queryRunner.manager.getRepository(CartEntity);
      const repoOrderItems = queryRunner.manager.getRepository(OrderItemEntity);
      const newOrderItems = repoOrderItems.create(
        orderItems.map((item: any) => ({
          ...item,
          orderId: savedOrder.id,
        }))
      );
      const orderSaleItems = await repoOrderItems.save(newOrderItems);

      const productVariantRepo =
        queryRunner.manager.getRepository(ProductVariantEntity);
      for (const item of orderSaleItems) {
        const findProductVariant = await productVariantRepo.findOne({
          where: { id: item.productVariantId },
        });

        if (findProductVariant) {
          let currentStock =
            (+findProductVariant.stockQty || 0) - (+item.qty || 0);

          await productVariantRepo.save({
            id: findProductVariant.id,
            stockQty: currentStock,
            // stockQty:
            // findProductVariant.stockQty <= item.qty ? currentStock : null,
          });
        }
      }

      const repositoryOrderTracking =
        queryRunner.manager.getRepository(OrderTrackingEntity);
      const newOrderTracking = repositoryOrderTracking.create({
        orderId: savedOrder.id,
        userId: req.id,
        location: "অর্ডারটি গ্রহন করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।",
      });
      await repositoryOrderTracking.save(newOrderTracking);

      await repositoryCarts.remove(orderItems);
    }

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
    //   // Redirect the user to payment gateway
    //   let GatewayPageURL = apiResponse.GatewayPageURL;
    //   res.redirect(GatewayPageURL);
    //   console.log("Redirecting to: ", GatewayPageURL);
    // });

    const repositoryPayment = queryRunner.manager.getRepository(PaymentEntity);

    const newPayment = repositoryPayment.create({
      orderId: savedOrder.id,
      userId: req.id,
      paymentDate: dayjs(),
      paymentMethod,
      paymentType: PaymentType.Debit,
      amount: +(+shippingAmount + +orderTotalAmount),
    });
    await repositoryPayment.save(newPayment);

    await queryRunner.commitTransaction();

    return res.status(200).json({
      success: true,
      msg: "Create a new Order",
      data: savedOrder,
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Transaction failed:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to create Order",
    });
  } finally {
    await queryRunner.release();
  }
});

// @desc Get a single Order
// @route GET /api/v1/Order/:id
// @access Public
// export const orderTracking = asyncHandler(
//   async (req: any, res: Response, next: NextFunction) => {
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
//       msg: `Get a single Tracking No of ${trackingNo}`,
//       data: result,
//     });
//   }
// );

// @desc Update a single Order
// @route PUT /api/v1/Order/:id
// @access Public
export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();
  const validation = orderUpdateValidationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
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
        productId: item.productId,
        qty: item.qty,
        price: item.price,
        orderId: save.id,
      }))
    );
    await repoOrderitems.save(newOrderItems);
  }

  return res.status(200).json({
    success: true,
    msg: `Update a single Order of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Update a single Order
// @route PUT /api/v1/Order/:id
// @access Public
export const orderReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();

  const repository = await connection.getRepository(OrderItemEntity);

  const result = await repository.find({ where: { orderId: id } });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  // const save = await repository.save(updateData);

  // if (orderItems && save.id) {
  //   const repoOrderitems = connection.getRepository(OrderItemEntity);

  //   // remove order items
  //   const existingVariants = await repoOrderitems.find({
  //     where: { orderId: id },
  //   });

  //   await repoOrderitems.remove(existingVariants);
  //   // new order items data
  //   const newOrderItems = await repoOrderitems.create(
  //     orderItems.map((item) => ({
  //       productId: item.productId,
  //       qty: item.qty,
  //       price: item.price,
  //       orderId: save.id,
  //     }))
  //   );
  //   await repoOrderitems.save(newOrderItems);
  // }

  return res.status(200).json({
    success: true,
    msg: `Update a single Order of id ${req.params.id}`,
    data: {},
  });
});
// @desc Update a single Order
// @route patch /api/v1/order/assign/:id
// @access Public
export const assignDeliveryMan = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const validation = orderDeliveryManValidationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(401).json({
        message: validation.error.formErrors,
      });
    }
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
      msg: `Assign Delivery man`,
      data: save,
    });
  }
);

export const orderStatusUpdate = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const validation = orderStatusUpdateValidationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(401).json({
        message: validation.error.formErrors,
      });
    }

    const repository = await queryRunner.manager.getRepository(OrderEntity);

    const result = await repository.findOne({
      where: { id },
      relations: ["orderItems"],
    });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    try {
      if (validation.data.status === OrderStatus.Returned) {
        const productVariantRepo =
          queryRunner.manager.getRepository(ProductVariantEntity);
        for (const item of result.orderItems) {
          const findProductVariant = await productVariantRepo.findOne({
            where: { id: item.productVariantId },
          });

          if (findProductVariant) {
            let currentStock =
              (+findProductVariant.stockQty || 0) + (+item.qty || 0);

            await productVariantRepo.save({
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
        status: validation.data.status,
      });

      await queryRunner.commitTransaction();

      return res.status(200).json({
        success: true,
        msg: `Order Status Update of id ${req.params.id}`,
        data: save,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Transaction failed:", error);
      return res.status(500).json({
        success: false,
        msg: "Failed to create Order",
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
    msg: `Delete a single Order of id ${req.params.id}`,
    data: result,
  });
});
