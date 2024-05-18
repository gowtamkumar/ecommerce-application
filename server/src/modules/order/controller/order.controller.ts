import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { OrderEntity } from "../model/order.entity";
import {
  orderUpdateValidationSchema,
  orderValidationSchema,
} from "../../../validation";
import { OrderItemEntity } from "../model/order-item.entity";
import axios from "axios";
const SSLCommerzPayment = require("sslcommerz-lts");

// @desc Get all Order
// @route GET /api/v1/Order
// @access Public
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(OrderEntity);

  const results = await repository.find({
    relations: {
      orderItems: true,
      payments: true,
      orderTrackings: true,
    },
  });

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
  const validation = orderValidationSchema.safeParse(req.body);

  // SSLCommerzPayment
  const store_id = "ecomm6648b03fa5d37";
  const store_passwd = "ecomm6648b03fa5d37@ssl";
  const is_live = false; //true for live, false for sandbox

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(OrderEntity);
  const newOrder = repository.create(validation.data);
  const savedOrder = await repository.save(newOrder);

  // // insert order items data
  if (validation.data.orderItems && savedOrder.id) {
    const repoOrderitems = connection.getRepository(OrderItemEntity);
    const newOrderItems = await repoOrderitems.create(
      validation.data.orderItems.map((item) => ({
        totalAmount: +item.totalAmount,
        productId: item.productId,
        qty: item.qty,
        orderId: savedOrder.id,
      }))
    );
    await repoOrderitems.save(newOrderItems);
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

  const repository = await connection.getRepository(OrderEntity);

  const result = await repository.findOne({ where: { id } });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const reqBodyData = {
    orderDate: validation.data.orderDate,
    isPaid: validation.data.isPaid,
    isShipped: validation.data.isShipped,
    orderTotalAmount: validation.data.orderTotalAmount,
    netAmount: validation.data.netAmount,
    phoneNo: validation.data.phoneNo,
    paymentStatus: validation.data.paymentStatus,
    paymentType: validation.data.paymentType,
    orderNote: validation.data.orderNote,
  };

  const updateData = await repository.merge(result, reqBodyData);

  const save = await repository.save(updateData);

  if (validation.data.orderItems && save.id) {
    const repoOrderitems = connection.getRepository(OrderItemEntity);
    // remove order items
    await repoOrderitems.remove(validation.data.orderItems);
    // new order items data
    const newOrderItems = await repoOrderitems.create(
      validation.data.orderItems.map((item) => ({
        totalAmount: +item.totalAmount,
        productId: item.productId,
        qty: item.qty,
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
