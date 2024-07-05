import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { DiscountEntity } from "../model/discount.entity";
import { discountValidationSchema } from "../../../validation";

// @desc Get all Discounts
// @route GET /api/v1/Discounts
// @access Public
export const getDiscounts = asyncHandler(
  async (req: Request, res: Response) => {
    const { type } = req.query;
    const connection = await getDBConnection();
    const repository = connection.getRepository(DiscountEntity);
    const newQuery = {} as any;
    if (type) newQuery.type = type;
    const result = await repository.find({ where: newQuery });
    return res.status(200).json({
      success: true,
      msg: "Get all Discounts",
      data: result,
    });
  }
);

// @desc Get a single Discount
// @route GET /api/v1/Discounts/:id
// @access Public
export const getDiscount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(DiscountEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Discount of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Discount
// @route POST /api/v1/Discounts
// @access Public
export const createDiscount = asyncHandler(async (req: any, res: Response) => {
  console.log("🚀 ~ req:", req.id);
  const connection = await getDBConnection();

  const validation = discountValidationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  console.log("validation.data", validation.data);
  

  const repository = connection.getRepository(DiscountEntity);

  const newDiscount = repository.create(validation.data);

  const save = await repository.save(newDiscount);

  return res.status(200).json({
    success: true,
    msg: "Create a new Discount",
    data: save,
  });
});

// @desc Update a single Discount
// @route PUT /api/v1/Discounts/:id
// @access Public
export const updateDiscount = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
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
      msg: `Update a single Discount of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single Discount
// @route DELETE /api/v1/Discounts/:id
// @access Public
export const deleteDiscount = asyncHandler(
  async (req: Request, res: Response) => {
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
      msg: `Delete a single Discount of id ${req.params.id}`,
      data: result,
    });
  }
);
