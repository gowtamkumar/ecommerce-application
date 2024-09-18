import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { CartEntity } from "../model/cart.entity";
import { cartValidationSchema } from "../../../validation";

// @desc Get all Cart
// @route GET /api/v1/Cart
// @access Public
export const getCartByUser = asyncHandler(async (req: any, res: Response) => {
  const userId = req.id;
  const connection = await getDBConnection();
  const repository = connection.getRepository(CartEntity);

  const qb = repository.createQueryBuilder("cart");
  qb.select([
    "cart.id",
    "cart.qty",
    "product.name",
    "product.urlSlug",
    "product.images",
    "product.limitPurchaseQty",
    "product.limitPurchaseQty",
    "product.discountId",
    "user.name",
    "tax.name",
    "tax.value",
    "discount.discountType",
    "discount.type",
    "discount.value",
    "brand.name",
    "productVariant.id",
    "productVariant.price",
    "productVariant.purchasePrice",
    "productVariant.stockQty",
    "productVariant.weight",
    "color.name",
    "color.id",
    "size.id",
    "size.name",
  ]);

  qb.leftJoin("cart.user", "user");
  qb.leftJoin("cart.product", "product");
  qb.leftJoin("product.tax", "tax");
  qb.leftJoin("product.discount", "discount");
  qb.leftJoin("product.brand", "brand");
  qb.leftJoin("cart.productVariant", "productVariant");
  qb.leftJoin("productVariant.color", "color");
  qb.leftJoin("productVariant.size", "size");

  if (userId) qb.where({ userId });
  const results = await qb.getMany();

  // const result = await repository.find();

  return res.status(200).json({
    success: true,
    msg: "Get cart by users",
    data: results,
  });
});

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
export const updateCart = asyncHandler(async (req: Request, res: Response) => {
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
});

// @desc Delete a single Cart
// @route DELETE /api/v1/Cart/:id
// @access Public
export const deleteCart = asyncHandler(async (req: Request, res: Response) => {
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
});
