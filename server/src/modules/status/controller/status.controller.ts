import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { StatusEntity } from "../model/status.entity";
import { statusValidationSchema } from "../../../validation/status/statusValidation";
import { logger } from "../../../middlewares/logger";

// @desc Get all Status
// @route GET /api/v1/Status
// @access Public
export const getStatuses = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getStatuses ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(StatusEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: "Get all Status",
    data: result,
  });
});

// @desc Get a single Status
// @route GET /api/v1/Status/:id
// @access Public
export const getStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getStatus ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(StatusEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Status of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Status
// @route POST /api/v1/Status
// @access Public
export const createStatus = asyncHandler(async (req: any, res: Response) => {
  logger.info(`Service: createStatus ${req.method} ${req.url}`);

  const validation = statusValidationSchema.safeParse(req.body);
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
  const repository = connection.getRepository(StatusEntity);
  const newStatus = repository.create(validation.data);
  const save = await repository.save(newStatus);

  return res.status(200).json({
    success: true,
    message: "Create a new Status",
    data: save,
  });
});

// @desc Update a single Status
// @route PUT /api/v1/Status/:id
// @access Public
export const updateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: updateStatus ${req.method} ${req.url}`);

    const { id } = req.params;

    const validation = statusValidationSchema.safeParse(req.body);

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
    const repository = await connection.getRepository(StatusEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    const updateData = await repository.merge(result, validation.data);
    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      message: `Update a single Status of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single Status
// @route DELETE /api/v1/Status/:id
// @access Public
export const deleteStatus = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: deleteStatus ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(StatusEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      message: `Delete a single Status of id ${req.params.id}`,
      data: result,
    });
  }
);
