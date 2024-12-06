import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../../middlewares/async.middleware";
import { getDBConnection } from "../../../../config/db";
import { ProductColorEntity } from "../model/product-color.entity";
import { productColorValidationSchema } from "../../../../validation";
import { logger } from "../../../../middlewares/logger";

// @desc Get all ProductColors
// @route GET /api/v1/ProductColors
// @access Public
export const getProductColors = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: getProductColors ${req.method} ${req.url}`);

    const connection = await getDBConnection();
    const repository = connection.getRepository(ProductColorEntity);

    const result = await repository.find();

    return res.status(200).json({
      success: true,
      message: "Get all ProductColor",
      data: result,
    });
  }
);

// @desc Get a single ProductColor
// @route GET /api/v1/ProductColors/:id
// @access Public
export const getProductColor = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getProductColor ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ProductColorEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single ProductColor of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single ProductColor
// @route POST /api/v1/ProductColors
// @access Public
export const createProductColor = asyncHandler(
  async (req: any, res: Response) => {
    logger.info(`Service: createProductColor ${req.method} ${req.url}`);

    const validation = productColorValidationSchema.safeParse(req.body);

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
    const repository = connection.getRepository(ProductColorEntity);

    const newProductColor = repository.create(validation.data);

    const save = await repository.save(newProductColor);

    return res.status(200).json({
      success: true,
      message: "Create a new Product Color",
      data: save,
    });
  }
);

// @desc Update a single ProductColor
// @route PUT /api/v1/ProductColors/:id
// @access Public
export const updateProductColor = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: updateProductColor ${req.method} ${req.url}`);

    const { id } = req.params;
    const validation = productColorValidationSchema.safeParse(req.body);

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
    const repository = await connection.getRepository(ProductColorEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    const updateData = await repository.merge(result, validation.data);
    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      message: `Update a single ProductColor of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single ProductColor
// @route DELETE /api/v1/ProductColors/:id
// @access Public
export const deleteProductColor = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: deleteProductColor ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ProductColorEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      message: `Delete a single ProductColor of id ${req.params.id}`,
      data: result,
    });
  }
);
