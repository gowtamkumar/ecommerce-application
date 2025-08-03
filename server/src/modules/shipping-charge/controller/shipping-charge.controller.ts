import { NextFunction, Request, Response } from "express";
import { getDBConnection } from "../../../config/db";
import { CustomRequest } from "../../../enums/custom-request-type";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { logger } from "../../../middlewares/logger";
import { shippingChargeValidationSchema } from "../../../validation/shipping-charge/shippingChargeValidation";
import { updateShippingChargeValidationSchema } from "../../../validation/shipping-charge/updateShippingChargeValidation";
import { ShippingChargeEntity } from "../model/shipping-charge.entity";
// import { shippingChargeValidationSchema } from "../../../validation";

// @desc Get all shippingCharge
// @route GET /api/v1/shippingCharge
// @access Public
export const getShippingCharges = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: getShippingCharges ${req.method} ${req.url}`);

    const connection = await getDBConnection();
    const repository = connection.getRepository(ShippingChargeEntity);

    const { districtId } = req.query;

    let customQuery = {} as any;

    if (districtId) {
      customQuery.districtId = districtId;
    }

    const result = await repository.find({
      relations: ["district"],
      where: { districtId: customQuery.districtId },
    });

    return res.status(200).json({
      success: true,
      message: "Get all shippingCharge",
      data: result,
    });
  }
);

// @desc Get a single shippingCharge
// @route GET /api/v1/shipping-charge/:id
// @access Public
export const getShippingCharge = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getShippingCharge ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ShippingChargeEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single shippingCharge of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single shippingCharge
// @route POST /api/v1/shippingCharge
// @access Public
export const createShippingCharge = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    logger.info(`Service: createShippingCharge ${req.method} ${req.url}`);

    const validation = shippingChargeValidationSchema.safeParse({
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

    const repository = connection.getRepository(ShippingChargeEntity);

    const newshippingCharge = repository.create(validation.data);
    const save = await repository.save(newshippingCharge);

    return res.status(200).json({
      success: true,
      message: "Create a new shippingCharge",
      data: save,
    });
  }
);

// @desc Update a single shippingCharge
// @route PUT /api/v1/shipping-charge/:id
// @access Public
export const updateShippingCharge = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: updateShippingCharge ${req.method} ${req.url}`);

    const { id } = req.params;
    const validation = updateShippingChargeValidationSchema.safeParse(req.body);

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
    const repository = await connection.getRepository(ShippingChargeEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    const updateData = await repository.merge(result, validation.data);
    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      message: `Update a single shippingCharge of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single shippingCharge
// @route DELETE /api/v1/shipping-charge/:id
// @access Public
export const deleteShippingCharge = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: deleteShippingCharge ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ShippingChargeEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      message: `Delete a single shippingCharge of id ${req.params.id}`,
      data: result,
    });
  }
);
