import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { BrandEntity } from "../model/brand.entity";
import { brandValidationSchema } from "../../../validation";
import { join } from "path";
import { FileEntity } from "../../other/file/model/file.entity";
import fs from "fs";
import { updateBrandValidationSchema } from "../../../validation/brand/updateBrandValidation";
import { logger } from "../../../middlewares/logger";

// @desc Get all Brands
// @route GET /api/v1/Brands
// @access Public
export const getBrands = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getBrands ${req.method} ${req.url}`);
  const connection = await getDBConnection();
  const repository = connection.getRepository(BrandEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: "Get all Brands",
    data: result,
  });
});

// @desc Get a single Brand
// @route GET /api/v1/Brands/:id
// @access Public
export const getBrand = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getBrand ${req.method} ${req.url}`);
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(BrandEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Brand of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Brand
// @route POST /api/v1/Brands
// @access Public
export const createBrand = asyncHandler(async (req: any, res: Response) => {
  logger.info(`Service: createBrand ${req.method} ${req.url}`);
  const connection = await getDBConnection();

  const validation = brandValidationSchema.safeParse({
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
  const repository = connection.getRepository(BrandEntity);

  const newBrand = repository.create(validation.data);
  const save = await repository.save(newBrand);

  return res.status(200).json({
    success: true,
    message: "Create a new Brand",
    data: save,
  });
});

// @desc Update a single Brand
// @route PUT /api/v1/Brands/:id
// @access Public
export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateBrand ${req.method} ${req.url}`);
  const { id } = req.params;
  const connection = await getDBConnection();

  const validation = updateBrandValidationSchema.safeParse({
    ...req.body,
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

  const repository = await connection.getRepository(BrandEntity);
  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }
  const updateData = await repository.merge(result, validation.data);
  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: `Update a single Brand of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Brand
// @route DELETE /api/v1/Brands/:id
// @access Public
export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteBrand ${req.method} ${req.url}`);
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(BrandEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  if (result.image) {
    const repository = connection.getRepository(FileEntity);
    const directory = join(process.cwd(), "/public/uploads");
    const filePath = `${directory}/${result.image}`;
    const [deleteFile] = await Promise.all([
      repository.findOne({ where: { filename: result.image } }),
      fs.promises.unlink(filePath),
    ]);
    await repository.remove(deleteFile);
  }
  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single Brand of id ${req.params.id}`,
    data: result,
  });
});
