import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { BrandEntity } from "../model/brand.entity";
import { brandValidationSchema } from "../../../validation";

// @desc Get all Brands
// @route GET /api/v1/Brands
// @access Public
export const getBrands = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(BrandEntity);

  const user = await repository.find();

  return res.status(200).json({
    success: true,
    msg: "Get all Brands",
    data: user,
  });
});

// @desc Get a single Brand
// @route GET /api/v1/Brands/:id
// @access Public
export const getBrand = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(BrandEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Brand of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Brand
// @route POST /api/v1/Brands
// @access Public
export const createBrand = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = brandValidationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(BrandEntity);

  const newBrand = repository.create(validation.data);

  const save = await repository.save(newBrand);

  return res.status(200).json({
    success: true,
    msg: "Create a new Brand",
    data: save,
  });
});

// @desc Update a single Brand
// @route PUT /api/v1/Brands/:id
// @access Public
export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();

  const repository = await connection.getRepository(BrandEntity);

  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }
  
  const updateData = await repository.merge(result, req.body);

  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    msg: `Update a single Brand of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Brand
// @route DELETE /api/v1/Brands/:id
// @access Public
export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(BrandEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    msg: `Delete a single Brand of id ${req.params.id}`,
    data: result,
  });
});
