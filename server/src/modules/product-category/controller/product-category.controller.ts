import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { ProductCategoryEntity } from "../model/product-category.entity";
import { productCategoryValidationSchema } from "../../../validation";

// @desc Get all ProductCategorys
// @route GET /api/v1/ProductCategorys
// @access Public
export const getProductCategorys = asyncHandler(
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const repository = connection.getRepository(ProductCategoryEntity);

    const result = await repository.find();

    return res.status(200).json({
      success: true,
      message: "Get all ProductCategory",
      data: result,
    });
  }
);

// @desc Get a single ProductCategory
// @route GET /api/v1/ProductCategorys/:id
// @access Public
export const getProductCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ProductCategoryEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single ProductCategory of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single ProductCategory
// @route POST /api/v1/ProductCategorys
// @access Public
export const createProductCategory = asyncHandler(
  async (req: any, res: Response) => {
    const validation = productCategoryValidationSchema.safeParse(req.body);

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
    const repository = connection.getRepository(ProductCategoryEntity);

    const newProductCategory = repository.create(validation.data);

    const save = await repository.save(newProductCategory);

    return res.status(200).json({
      success: true,
      message: "Create a new Product Category",
      data: save,
    });
  }
);

// @desc Update a single ProductCategory
// @route PUT /api/v1/ProductCategorys/:id
// @access Public
export const updateProductCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const validation = productCategoryValidationSchema.safeParse(req.body);

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

    const repository = await connection.getRepository(ProductCategoryEntity);

    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    const updateData = await repository.merge(result, validation.data);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      message: `Update a single ProductCategory of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single ProductCategory
// @route DELETE /api/v1/ProductCategorys/:id
// @access Public
export const deleteProductCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ProductCategoryEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      message: `Delete a single ProductCategory of id ${req.params.id}`,
      data: result,
    });
  }
);
