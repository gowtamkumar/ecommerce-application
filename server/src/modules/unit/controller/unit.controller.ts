import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { UnitEntity } from "../model/unit.entity";
import { unitValidationSchema } from "../../../validation";

// @desc Get all Unit
// @route GET /api/v1/Unit
// @access Public
export const getUnits = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(UnitEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    msg: "Get all Unit",
    data: result,
  });
});

// @desc Get a single Unit
// @route GET /api/v1/Unit/:id
// @access Public
export const getUnit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(UnitEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Unit of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Unit
// @route POST /api/v1/Unit
// @access Public
export const createUnit = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = unitValidationSchema.safeParse({
    ...req.body,
    userId: req.id,
  });

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(UnitEntity);

  const newUnit = repository.create(validation.data);
  const save = await repository.save(newUnit);

  return res.status(200).json({
    success: true,
    msg: "Create a new Unit",
    data: save,
  });
});

// @desc Update a single Unit
// @route PUT /api/v1/Unit/:id
// @access Public
export const updateUnit = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();

  const repository = await connection.getRepository(UnitEntity);

  const result = await repository.findOneBy({ id });

  const updateData = await repository.merge(result, req.body);

  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    msg: `Update a single Unit of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Unit
// @route DELETE /api/v1/Unit/:id
// @access Public
export const deleteUnit = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(UnitEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    msg: `Delete a single Unit of id ${req.params.id}`,
    data: result,
  });
});
