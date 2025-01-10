import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { DiscountEntity } from "../model/discount.entity";
import { discountValidationSchema } from "../../../validation";
import { updateDiscountValidation } from "../../../validation/discount/updateDiscountValidation";
import { logger } from "../../../middlewares/logger";
import { CustomRequest } from "../../../enums/custom-request-type";

// @desc Get all Discounts
// @route GET /api/v1/Discounts
// @access Public
export const getDiscounts = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: getDiscounts ${req.method} ${req.url}`);

    const { type } = req.query;
    const connection = await getDBConnection();
    const repository = connection.getRepository(DiscountEntity);
    const newQuery = {} as any;
    if (type) newQuery.type = type;
    const result = await repository.find({ where: newQuery });
    return res.status(200).json({
      success: true,
      message: "Get all Discounts",
      data: result,
    });
  }
);

// @desc Get a single Discount
// @route GET /api/v1/Discounts/:id
// @access Public
export const getDiscount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getDiscount ${req.method} ${req.url}`);
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(DiscountEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Discount of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Discount
// @route POST /api/v1/Discounts
// @access Public
export const createDiscount = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createDiscount ${req.method} ${req.url}`);
  const connection = await getDBConnection();

  const validation = discountValidationSchema.safeParse({
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

  const repository = connection.getRepository(DiscountEntity);
  const newDiscount = repository.create(validation.data);
  const save = await repository.save(newDiscount);

  return res.status(200).json({
    success: true,
    message: "Create a new Discount",
    data: save,
  });
});

// @desc Update a single Discount
// @route PUT /api/v1/Discounts/:id
// @access Public
export const updateDiscount = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: updateDiscount ${req.method} ${req.url}`);
    const { id } = req.params;

    const validation = updateDiscountValidation.safeParse(req.body);

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

    const repository = await connection.getRepository(DiscountEntity);

    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      message: `Update a single Discount of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single Discount
// @route DELETE /api/v1/Discounts/:id
// @access Public
export const deleteDiscount = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: deleteDiscount ${req.method} ${req.url}`);
    
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(DiscountEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      message: `Delete a single Discount of id ${req.params.id}`,
      data: result,
    });
  }
);
