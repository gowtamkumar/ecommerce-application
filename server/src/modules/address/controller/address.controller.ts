import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { AddressEntity } from "../model/address.entity";
import { addressValidationSchema } from "../../../validation";

// @desc Get all Address
// @route GET /api/v1/Address
// @access Public
export const getAddress = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(AddressEntity);

  const user = await repository.find();

  return res.status(200).json({
    success: true,
    msg: "Get all Address",
    data: user,
  });
});

// @desc Get a single Address
// @route GET /api/v1/Address/:id
// @access Public
export const getAddres = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(AddressEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Address of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Address
// @route POST /api/v1/Address
// @access Public
export const createAddress = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = addressValidationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(AddressEntity);

  const newAddress = repository.create(validation.data);

  const save = await repository.save(newAddress);

  return res.status(200).json({
    success: true,
    msg: "Create a new Address",
    data: save,
  });
});

// @desc Update a single Address
// @route PUT /api/v1/Address/:id
// @access Public
export const updateAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const repository = await connection.getRepository(AddressEntity);

    const result = await repository.findOneBy({ id });

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a single Address of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single Address
// @route DELETE /api/v1/Address/:id
// @access Public
export const deleteAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(AddressEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a single Address of id ${req.params.id}`,
      data: result,
    });
  }
);
