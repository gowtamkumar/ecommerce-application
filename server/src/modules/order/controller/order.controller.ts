import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { OrderEntity } from "../model/order.entity";
import {
  orderStatusUpdateValidationSchema,
  orderUpdateValidationSchema,
  orderValidationSchema,
} from "../../../validation";
import { OrderItemEntity } from "../model/order-item.entity";
import axios from "axios";
import { OrderTrackingEntity } from "../../order-tracking/model/order-tracking.entity";
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
    "productVariant.id",
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
  qb.leftJoin("orderItems.productVariant", "productVariant");
  qb.leftJoin("productVariant.size", "size");
  qb.leftJoin("productVariant.color", "color");
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
  const validation = orderValidationSchema.safeParse({
    ...req.body,
    userId: req.id,
  });

  // SSLCommerzPayment
  const store_id = process.env.STORE_ID;
  const store_passwd = process.env.STORE_PASSWD;
  const is_live = process.env.IS_LIVE; //true for live, false for sandbox

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const { orderItems, ...orderData } = validation.data;

  const repository = connection.getRepository(OrderEntity);
  // Generate URL slug
  const count = (await repository.count()) + 1;

  const trackingNo = `#N${count.toString().padStart(10, "0")}`;
  const newOrder = repository.create(orderData);
  const savedOrder = await repository.save({ ...newOrder, trackingNo });

  // insert order items data
  if (orderItems && savedOrder.id) {
    const repoOrderitems = connection.getRepository(OrderItemEntity);
    const newOrderItems = await repoOrderitems.create(
      orderItems.map((item) => ({
        ...item,
        orderId: savedOrder.id,
      }))
    );

    // #Todo
    // Here need to condition code for stock increage and decreage from product variant table
    

    await repoOrderitems.save(newOrderItems);
    // Order Tracking Insert
    const repositoryOrderTracking =
      connection.getRepository(OrderTrackingEntity);
    const newOrderTracking = repositoryOrderTracking.create({
      orderId: savedOrder.id,
      userId: req.id,
      location: "অর্ডারটি গ্রহন করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।",
    });
    await repositoryOrderTracking.save(newOrderTracking);
  }

  // if (savedOrder) {
  //   const data = {
  //     total_amount: 100,
  //     currency: "BDT",
  //     tran_id: "REF123", // use unique tran_id for each api call
  //     success_url: "http://localhost:3030/success",
  //     fail_url: "http://localhost:3030/fail",
  //     cancel_url: "http://localhost:3030/cancel",
  //     ipn_url: "http://localhost:3030/ipn",
  //     shipping_method: "Courier",
  //     product_name: "Computer.",
  //     product_category: "Electronic",
  //     product_profile: "general",
  //     cus_name: "Customer Name",
  //     cus_email: "customer@example.com",
  //     cus_add1: "Dhaka",
  //     cus_add2: "Dhaka",
  //     cus_city: "Dhaka",
  //     cus_state: "Dhaka",
  //     cus_postcode: "1000",
  //     cus_country: "Bangladesh",
  //     cus_phone: "01711111111",
  //     cus_fax: "01711111111",
  //     ship_name: "Customer Name",
  //     ship_add1: "Dhaka",
  //     ship_add2: "Dhaka",
  //     ship_city: "Dhaka",
  //     ship_state: "Dhaka",
  //     ship_postcode: 1000,
  //     ship_country: "Bangladesh",
  //   };

  //   try {
  //     const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  //     sslcz.init(data).then((apiResponse: { GatewayPageURL: any }) => {
  //       // Redirect the user to payment gateway
  //       let GatewayPageURL = apiResponse.GatewayPageURL;
  //       res.redirect(GatewayPageURL);
  //       console.log("Redirecting to: ", GatewayPageURL);
  //     });
  //   } catch (error) {
  //     console.error("Payment initiation error:", error);
  //     throw error;
  //   }
  // }

  return res.status(200).json({
    success: true,
    msg: "Create a new Order",
    data: savedOrder,
  });
});

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

  // const reqBodyData = {
  //   // orderDate: validation.data.orderDate,
  //   isPaid: validation.data.isPaid,
  //   isShipped: validation.data.isShipped,
  //   orderTotalAmount: validation.data.orderTotalAmount,
  //   netAmount: validation.data.netAmount,
  //   phoneNo: validation.data.phoneNo,
  //   paymentStatus: validation.data.paymentStatus,
  //   paymentMothod: validation.data.paymentMothod,
  //   note: validation.data.note,
  // };

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

export const orderStatusUpdate = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const validation = orderStatusUpdateValidationSchema.safeParse(req.body);

    console.log("validation.error", validation.error);

    if (!validation.success) {
      return res.status(401).json({
        message: validation.error.formErrors,
      });
    }

    console.log("tesitn.....");

    const repository = await connection.getRepository(OrderEntity);

    const result = await repository.findOne({ where: { id } });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    const updateData = await repository.merge(result, validation.data);

    const save = await repository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Order Status Update of id ${req.params.id}`,
      data: save,
    });
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
