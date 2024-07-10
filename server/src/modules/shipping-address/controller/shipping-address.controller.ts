import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { shippingAddressValidationSchema } from "../../../validation";
import { ShippingAddressEntity } from "../model/shipping-address.entity";

// @desc Get all ShippingAddress
// @route GET /api/v1/ShippingAddress
// @access Public
export const getShippingAddresses = asyncHandler(
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const repository = connection.getRepository(ShippingAddressEntity);

    const result = await repository.find();

    return res.status(200).json({
      success: true,
      msg: "Get all ShippingAddress",
      data: result,
    });
  }
);

// @desc Get a single ShippingAddress
// @route GET /api/v1/ShippingAddress/:id
// @access Public
export const getShippingAddress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ShippingAddressEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single ShippingAddress of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single ShippingAddress
// @route POST /api/v1/ShippingAddress
// @access Public
export const createShippingAddress = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = shippingAddressValidationSchema.safeParse({
    ...req.body,
    userId: req.id,
  });

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }
 

  const repository = connection.getRepository(ShippingAddressEntity);

  const newShippingAddress = repository.create(validation.data);
  const save = await repository.save(newShippingAddress);

  return res.status(200).json({
    success: true,
    msg: "Create a new ShippingAddress",
    data: save,
  });
});

// @desc Update a single ShippingAddress
// @route PUT /api/v1/ShippingAddress/:id
// @access Public
export const updateShippingAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const repository = await connection.getRepository(ShippingAddressEntity);

    const result = await repository.findOneBy({ id });

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a single ShippingAddress of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single ShippingAddress
// @route DELETE /api/v1/ShippingAddress/:id
// @access Public
export const deleteShippingAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ShippingAddressEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a single ShippingAddress of id ${req.params.id}`,
      data: result,
    });
  }
);
