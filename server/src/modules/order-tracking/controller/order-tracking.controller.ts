import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { OrderTrackingEntity } from "../model/order-tracking.entity";
import { orderTrackingValidationSchema } from "../../../validation";
import { updateOrderTrackingValidationSchema } from "../../../validation/order-tracking/updateOrderTrackingValidation";

// @desc Get all OrderTracking
// @route GET /api/v1/OrderTracking
// @access Public
export const getOrderTrackings = asyncHandler(
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const repository = connection.getRepository(OrderTrackingEntity);

    const results = await repository.find();

    return res.status(200).json({
      success: true,
      message: "Get all OrderTracking",
      data: results,
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
      message: `Get a single OrderTracking of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single OrderTracking
// @route POST /api/v1/OrderTracking
// @access Public
export const createOrderTracking = asyncHandler(
  async (req: any, res: Response) => {
    const validation = orderTrackingValidationSchema.safeParse({
      ...req.body,
      userId: req.id,
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

    const connection = await getDBConnection();

    const repository = connection.getRepository(OrderTrackingEntity);

    const newOrderTracking = repository.create(validation.data);

    const save = await repository.save(newOrderTracking);

    return res.status(200).json({
      success: true,
      message: "Create a new OrderTracking",
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
    const validation = updateOrderTrackingValidationSchema.safeParse(req.body);

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

    const repository = await connection.getRepository(OrderTrackingEntity);

    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    const updateData = await repository.merge(result, validation.data); // orderId update hobe na

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      message: `Update a single OrderTracking of id ${req.params.id}`,
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
      message: `Delete a single OrderTracking of id ${req.params.id}`,
      data: result,
    });
  }
);
