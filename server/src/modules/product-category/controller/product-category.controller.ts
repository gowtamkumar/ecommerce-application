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
      msg: "Get all ProductCategory",
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
      msg: `Get a single ProductCategory of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single ProductCategory
// @route POST /api/v1/ProductCategorys
// @access Public
export const createProductCategory = asyncHandler(
  async (req: any, res: Response) => {
    const connection = await getDBConnection();
    const validation = productCategoryValidationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(401).json({
        message: validation.error.formErrors,
      });
    }

    const repository = connection.getRepository(ProductCategoryEntity);

    const newProductCategory = repository.create(validation.data);

    const save = await repository.save(newProductCategory);

    return res.status(200).json({
      success: true,
      msg: "Create a new Product Category",
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
    const connection = await getDBConnection();

    const repository = await connection.getRepository(ProductCategoryEntity);

    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a single ProductCategory of id ${req.params.id}`,
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
      msg: `Delete a single ProductCategory of id ${req.params.id}`,
      data: result,
    });
  }
);
