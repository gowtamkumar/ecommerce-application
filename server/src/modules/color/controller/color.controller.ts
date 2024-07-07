import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { ColorEntity } from "../model/color.entity";
import { colorValidationSchema } from "../../../validation";

// @desc Get all Color
// @route GET /api/v1/Color
// @access Public
export const getColors = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(ColorEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    msg: "Get all Color",
    data: result,
  });
});

// @desc Get a single Color
// @route GET /api/v1/Color/:id
// @access Public
export const getColor = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ColorEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Color of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Color
// @route POST /api/v1/Color
// @access Public
export const createColor = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = colorValidationSchema.safeParse({
    ...req.body,
    userId: req.id,
  });

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(ColorEntity);

  const newColor = repository.create(validation.data);
  const save = await repository.save(newColor);

  return res.status(200).json({
    success: true,
    msg: "Create a new Color",
    data: save,
  });
});

// @desc Update a single Color
// @route PUT /api/v1/Color/:id
// @access Public
export const updateColor = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();

  const repository = await connection.getRepository(ColorEntity);

  const result = await repository.findOneBy({ id });

  const updateData = await repository.merge(result, req.body);

  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    msg: `Update a single Color of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Color
// @route DELETE /api/v1/Color/:id
// @access Public
export const deleteColor = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(ColorEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    msg: `Delete a single Color of id ${req.params.id}`,
    data: result,
  });
});
