import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { ShippingChargeEntity } from "../model/shipping-charge.entity";
import { shippingChargeValidationSchema } from "../../../validation/shipping-charge/shipping-chargeValidation";
// import { shippingChargeValidationSchema } from "../../../validation";

// @desc Get all shippingCharge
// @route GET /api/v1/shippingCharge
// @access Public
export const getShippingCharges = asyncHandler(
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const repository = connection.getRepository(ShippingChargeEntity);

    const { divisionId } = req.query;

    let customQuery = {} as any;

    if (divisionId) {
      customQuery.divisionId = divisionId;
    }

    const result = await repository.find({
      relations: ["division"],
      where: { divisionId: customQuery.divisionId },
    });

    return res.status(200).json({
      success: true,
      msg: "Get all shippingCharge",
      data: result,
    });
  }
);

// @desc Get a single shippingCharge
// @route GET /api/v1/shipping-charge/:id
// @access Public
export const getShippingCharge = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ShippingChargeEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single shippingCharge of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single shippingCharge
// @route POST /api/v1/shippingCharge
// @access Public
export const createShippingCharge = asyncHandler(
  async (req: any, res: Response) => {
    const connection = await getDBConnection();
    const validation = shippingChargeValidationSchema.safeParse({
      ...req.body,
      userId: req.id,
    });

    if (!validation.success) {
      return res.status(401).json({
        message: validation.error.formErrors,
      });
    }

    const repository = connection.getRepository(ShippingChargeEntity);

    const newshippingCharge = repository.create(validation.data);
    const save = await repository.save(newshippingCharge);

    return res.status(200).json({
      success: true,
      msg: "Create a new shippingCharge",
      data: save,
    });
  }
);

// @desc Update a single shippingCharge
// @route PUT /api/v1/shipping-charge/:id
// @access Public
export const updateShippingCharge = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const repository = await connection.getRepository(ShippingChargeEntity);

    const result = await repository.findOneBy({ id });

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a single shippingCharge of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single shippingCharge
// @route DELETE /api/v1/shipping-charge/:id
// @access Public
export const deleteShippingCharge = asyncHandler(
  async (req: Request, res: Response) => {
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
      msg: `Delete a single shippingCharge of id ${req.params.id}`,
      data: result,
    });
  }
);
