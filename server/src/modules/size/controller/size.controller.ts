import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { SizeEntity } from "../model/size.entity";
import { sizeValidationSchema } from "../../../validation";
import { logger } from "../../../middlewares/logger";
import { CustomRequest } from "../../../enums/custom-request-type";

// @desc Get all Size
// @route GET /api/v1/Size
// @access Public
export const getSizes = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getSizes ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(SizeEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: "Get all Size",
    data: result,
  });
});

// @desc Get a single Size
// @route GET /api/v1/Size/:id
// @access Public
export const getSize = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getSize ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(SizeEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Size of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Size
// @route POST /api/v1/Size
// @access Public
export const createSize = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createSize ${req.method} ${req.url}`);

  const validation = sizeValidationSchema.safeParse({
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
  const repository = connection.getRepository(SizeEntity);

  const newSize = repository.create(validation.data);
  const save = await repository.save(newSize);

  return res.status(200).json({
    success: true,
    message: "Create a new Size",
    data: save,
  });
});

// @desc Update a single Size
// @route PUT /api/v1/Size/:id
// @access Public
export const updateSize = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateSize ${req.method} ${req.url}`);

  const { id } = req.params;

  const validation = sizeValidationSchema.safeParse(req.body);

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
  const repository = await connection.getRepository(SizeEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, validation.data);
  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: `Update a single Size of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Size
// @route DELETE /api/v1/Size/:id
// @access Public
export const deleteSize = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteSize ${req.method} ${req.url}`);

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
    message: `Delete a single Size of id ${req.params.id}`,
    data: result,
  });
});
