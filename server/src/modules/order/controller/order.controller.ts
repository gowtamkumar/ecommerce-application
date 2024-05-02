import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { OrderEntity } from "../model/order.entity";
import {
  orderUpdateValidationSchema,
  orderValidationSchema,
} from "../../../validation";
import { OrderItemEntity } from "../model/order-item.entity";

// @desc Get all Order
// @route GET /api/v1/Order
// @access Public
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(OrderEntity);

  const user = await repository.find({
    relations: {
      orderItems: true,
    },
  });

  return res.status(200).json({
    success: true,
    msg: "Get all Order",
    data: user,
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

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(OrderEntity);
  const newOrder = repository.create(validation.data);
  const save = await repository.save(newOrder);

  // // insert order items data
  if (validation.data.orderItems && save.id) {
    const repoOrderitems = connection.getRepository(OrderItemEntity);
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
    msg: "Create a new Order",
    data: save,
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
