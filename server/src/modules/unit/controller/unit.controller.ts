import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { UnitEntity } from "../model/unit.entity";
import { unitValidationSchema } from "../../../validation";
import { logger } from "../../../middlewares/logger";
import { CustomRequest } from "../../../enums/custom-request-type";

// @desc Get all Unit
// @route GET /api/v1/Unit
// @access Public
export const getUnits = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getUnits ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(UnitEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: "Get all Unit",
    data: result,
  });
});

// @desc Get a single Unit
// @route GET /api/v1/Unit/:id
// @access Public
export const getUnit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getUnit ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(UnitEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Unit of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Unit
// @route POST /api/v1/Unit
// @access Public
export const createUnit = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createUnit ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const validation = unitValidationSchema.safeParse({
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

  const repository = connection.getRepository(UnitEntity);

  const newUnit = repository.create(validation.data);
  const save = await repository.save(newUnit);

  return res.status(200).json({
    success: true,
    message: "Create a new Unit",
    data: save,
  });
});

// @desc Update a single Unit
// @route PUT /api/v1/Unit/:id
// @access Public
export const updateUnit = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateUnit ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(UnitEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, req.body);
  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: `Update a single Unit of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Unit
// @route DELETE /api/v1/Unit/:id
// @access Public
export const deleteUnit = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteUnit ${req.method} ${req.url}`);

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
    message: `Delete a single Unit of id ${req.params.id}`,
    data: result,
  });
});
