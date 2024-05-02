import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { ProductVariantEntity } from "../model/product-variant.entity";

// @desc Get all ProductVariants
// @route GET /api/v1/ProductVariants
// @access Public
export const getProductVariants = asyncHandler(
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const repository = connection.getRepository(ProductVariantEntity);

    const result = await repository.find();

    console.log("🚀 ~ Variants:", result);
    return res.status(200).json({
      success: true,
      msg: "Get all Product Variants",
      data: result,
    });
  }
);

// @desc Get a single ProductVariant
// @route GET /api/v1/ProductVariants/:id
// @access Public
export const getProductVariant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ProductVariantEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single ProductVariant of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single ProductVariant
// @route POST /api/v1/ProductVariants
// @access Public
export const createProductVariant = asyncHandler(
  async (req: any, res: Response) => {
    const connection = await getDBConnection();
    const repository = connection.getRepository(ProductVariantEntity);

    const result = await repository.create(req.body);
    await repository.save(result);

    return res.status(200).json({
      success: true,
      msg: "Create a new Product Variant",
      data: result,
    });
  }
);

// @desc Update a single ProductVariant
// @route PUT /api/v1/ProductVariants/:id
// @access Public
export const updateProductVariant = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const repository = await connection.getRepository(ProductVariantEntity);

    const result = await repository.findOneBy({ id });

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a single ProductVariant of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single ProductVariant
// @route DELETE /api/v1/ProductVariants/:id
// @access Public
export const deleteProductVariant = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ProductVariantEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a single ProductVariant of id ${req.params.id}`,
      data: result,
    });
  }
);
