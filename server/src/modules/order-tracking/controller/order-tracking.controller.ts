import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { OrderTrackingEntity } from "../model/order-tracking.entity";
import { orderTrackingValidationSchema } from "../../../validation";

// @desc Get all OrderTracking
// @route GET /api/v1/OrderTracking
// @access Public
export const getOrderTrackings = asyncHandler(
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const repository = connection.getRepository(OrderTrackingEntity);

    const user = await repository.find();

    return res.status(200).json({
      success: true,
      msg: "Get all OrderTracking",
      data: user,
    });
  }
);

// @desc Get a single OrderTracking
// @route GET /api/v1/OrderTracking/:id
// @access Public
export const getOrderTracking = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(OrderTrackingEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single OrderTracking of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single OrderTracking
// @route POST /api/v1/OrderTracking
// @access Public
export const createOrderTracking = asyncHandler(
  async (req: any, res: Response) => {
    const connection = await getDBConnection();
    const validation = orderTrackingValidationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(401).json({
        message: validation.error.formErrors,
      });
    }

    const repository = connection.getRepository(OrderTrackingEntity);

    const newOrderTracking = repository.create(validation.data);

    const save = await repository.save(newOrderTracking);

    return res.status(200).json({
      success: true,
      msg: "Create a new OrderTracking",
      data: save,
    });
  }
);

// @desc Update a single OrderTracking
// @route PUT /api/v1/OrderTracking/:id
// @access Public
export const updateOrderTracking = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const repository = await connection.getRepository(OrderTrackingEntity);

    const result = await repository.findOneBy({ id });

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a single OrderTracking of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single OrderTracking
// @route DELETE /api/v1/OrderTracking/:id
// @access Public
export const deleteOrderTracking = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(OrderTrackingEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a single OrderTracking of id ${req.params.id}`,
      data: result,
    });
  }
);
