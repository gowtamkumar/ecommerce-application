import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { CartEntity } from "../model/cart.entity";
import { cartValidationSchema } from "../../../validation";

// @desc Get all Cart
// @route GET /api/v1/Cart
// @access Public
export const getCarts = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(CartEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    msg: "Get all Cart",
    data: result,
  });
});

// @desc Get a single Cart
// @route GET /api/v1/Cart/:id
// @access Public
export const getCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(CartEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Cart of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Cart
// @route POST /api/v1/Cart
// @access Public
export const createCart = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = cartValidationSchema.safeParse({
    ...req.body,
    userId: req.id,
  });

  console.log("validation", validation.error);

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(CartEntity);

  const newCart = repository.create(validation.data);

  const save = await repository.save(newCart);

  return res.status(200).json({
    success: true,
    msg: "Create a new Cart",
    data: save,
  });
});

// @desc Update a single Cart
// @route PUT /api/v1/Cart/:id
// @access Public
export const updateCart = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    console.log("req.body", req.body);

    const repository = await connection.getRepository(CartEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a single Cart of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single Cart
// @route DELETE /api/v1/Cart/:id
// @access Public
export const deleteCart = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(CartEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a single Cart of id ${req.params.id}`,
      data: result,
    });
  }
);
