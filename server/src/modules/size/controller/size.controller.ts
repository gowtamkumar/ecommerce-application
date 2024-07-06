import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { SizeEntity } from "../model/size.entity";
import { sizeValidationSchema } from "../../../validation";

// @desc Get all Size
// @route GET /api/v1/Size
// @access Public
export const getSizes = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(SizeEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    msg: "Get all Size",
    data: result,
  });
});

// @desc Get a single Size
// @route GET /api/v1/Size/:id
// @access Public
export const getSize = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(SizeEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Size of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Size
// @route POST /api/v1/Size
// @access Public
export const createSize = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = sizeValidationSchema.safeParse({
    ...req.body,
    userId: req.id,
  });

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(SizeEntity);

  const newSize = repository.create(validation.data);
  const save = await repository.save(newSize);

  return res.status(200).json({
    success: true,
    msg: "Create a new Size",
    data: save,
  });
});

// @desc Update a single Size
// @route PUT /api/v1/Size/:id
// @access Public
export const updateSize = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();

  const repository = await connection.getRepository(SizeEntity);

  const result = await repository.findOneBy({ id });

  const updateData = await repository.merge(result, req.body);

  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    msg: `Update a single Size of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Size
// @route DELETE /api/v1/Size/:id
// @access Public
export const deleteSize = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(SizeEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    msg: `Delete a single Size of id ${req.params.id}`,
    data: result,
  });
});
