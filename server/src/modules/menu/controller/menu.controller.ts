import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
// import { memuValidationSchema } from "../../../validation";
// import { join } from "path";
// import { FileEntity } from "../../other/file/model/file.entity";
// import fs from "fs";
import { MenuEntity } from "../model/menu.entity";
import { menuValidationSchema } from "../../../validation/menu/menuValidation";
import { updateMenuValidationSchema } from "../../../validation/menu/updateMenuValidation";
import { logger } from "../../../middlewares/logger";
import { CustomRequest } from "../../../enums/custom-request-type";

// @desc Get all memus
// @route GET /api/v1/memus
// @access Public
export const getMemus = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getMemus ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(MenuEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: "Get all memus",
    data: result,
  });
});

// @desc Get all memus
// @route GET /api/v1/memus
// @access Public
export const getDashboardMemus = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: getDashboardMemus ${req.method} ${req.url}`);

    const connection = await getDBConnection();
    const repository = connection.getRepository(MenuEntity);

    const result = await repository.find();

    return res.status(200).json({
      success: true,
      message: "Get all Dashboard memus",
      data: result,
    });
  }
);

// @desc Get a single Memu
// @route GET /api/v1/memus/:id
// @access Public
export const getMemu = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getMemu ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(MenuEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Memu of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Memu
// @route POST /api/v1/memus
// @access Public
export const createMemu = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createMemu ${req.method} ${req.url}`);

  const validation = menuValidationSchema.safeParse({
    items: req.body.children,
    name: req.body.name,
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
  const repository = connection.getRepository(MenuEntity);
  const newMemu = repository.create(validation.data);
  const save = await repository.save(newMemu);

  return res.status(200).json({
    success: true,
    message: "Create a new Memu",
    data: save,
  });
});

// @desc Update a single Memu
// @route PUT /api/v1/memus/:id
// @access Public
export const updateMemu = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateMemu ${req.method} ${req.url}`);

  const { id } = req.params;
  const validation = updateMenuValidationSchema.safeParse({
    ...req.body,
  });

  console.log("req.body", req.body);
  
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
  const repository = await connection.getRepository(MenuEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, req.body);
  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: `Update a single Memu of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Memu
// @route DELETE /api/v1/memus/:id
// @access Public
export const deleteMemu = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteMemu ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(MenuEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single Memu of id ${req.params.id}`,
    data: result,
  });
});
