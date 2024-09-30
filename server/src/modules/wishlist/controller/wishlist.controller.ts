import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { wishListhValidationSchema } from "../../../validation";
import { WishListEntity } from "../model/wishlist.entity";

// @desc Get all Wishlists
// @route GET /api/v1/Wishlists
// @access Public
export const getWishlists = asyncHandler(
  async (req: any, res: Response) => {
    const { userId }: any = req.query;
    const connection = await getDBConnection();
    const repository = connection.getRepository(WishListEntity);


    const result = await repository.find({
      relations: {
        product: true,
      },
    });

    return res.status(200).json({
      success: true,
      msg: "Get all Wishlists",
      data: result,
    });
  }
);

// @desc Get a single Wishlist
// @route GET /api/v1/Wishlists/:id
// @access Public
export const getWishlist = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(WishListEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Wishlist of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Wishlist
// @route POST /api/v1/Wishlists
// @access Public
export const createWishlist = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = wishListhValidationSchema.safeParse({
    ...req.body,
    userId: req.id,
  });

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(WishListEntity);
  const result = await repository.findOneBy({
    userId: req.id,
    productId: req.body.productId,
  });
  console.log("🚀 ~ result:", result);

  if (result) {
    throw new Error(`Product Already in Wishlist`);
  }

  const newwishlist = repository.create(validation.data);
  const save = await repository.save(newwishlist);

  return res.status(200).json({
    success: true,
    msg: "Create a new Wishlist",
    data: save,
  });
});

// @desc Update a single Wishlist
// @route PUT /api/v1/Wishlists/:id
// @access Public
export const updateWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const validation = await wishListhValidationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(401).json({
        message: validation.error.formErrors,
      });
    }

    const repository = await connection.getRepository(WishListEntity);

    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    const updateData = await repository.merge(result, req.body);
    console.log("🚀 ~ updateData:", updateData);

    const updateWishdata = await repository.save(updateData);

    console.log("updateWishdata", updateWishdata);

    return res.status(200).json({
      success: true,
      msg: `Update a single Wishlist of id ${req.params.id}`,
      data: updateWishdata,
    });
  }
);

// @desc Delete a single Wishlist
// @route DELETE /api/v1/Wishlists/:id
// @access Public
export const deleteWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(WishListEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a single Wishlist of id ${req.params.id}`,
      data: result,
    });
  }
);
