import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { wishListhValidationSchema } from "../../../validation";
import { WishListEntity } from "../model/wishlist.entity";
import { logger } from "../../../middlewares/logger";

// @desc Get all Wishlists
// @route GET /api/v1/Wishlists
// @access Public
export const getWishlists = asyncHandler(async (req: any, res: Response) => {
  logger.info(`Service: getWishlists ${req.method} ${req.url}`);

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
    message: "Get all Wishlists",
    data: result,
  });
});

// @desc Get a single Wishlist
// @route GET /api/v1/Wishlists/:id
// @access Public
export const getWishlist = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getWishlist ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(WishListEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Wishlist of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Wishlist
// @route POST /api/v1/Wishlists
// @access Public
export const createWishlist = asyncHandler(async (req: any, res: Response) => {
  logger.info(`Service: createWishlist ${req.method} ${req.url}`);

  const validation = wishListhValidationSchema.safeParse({
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
  const connection = await getDBConnection();
  const repository = connection.getRepository(WishListEntity);
  const result = await repository.findOneBy({
    userId: validation.data.userId,
    productId: validation.data.productId,
  });

  if (result) {
    throw new Error(`Product Already in Wishlist`);
  }

  const newwishlist = repository.create(validation.data);
  const save = await repository.save(newwishlist);

  return res.status(200).json({
    success: true,
    message: "Create a new Wishlist",
    data: save,
  });
});

// @desc Update a single Wishlist
// @route PUT /api/v1/Wishlists/:id
// @access Public
export const updateWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: updateWishlist ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();

    const repository = await connection.getRepository(WishListEntity);

    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    const updateData = await repository.merge(result, req.body);

    const updateWishdata = await repository.save(updateData);

    return res.status(200).json({
      success: true,
      message: `Update a single Wishlist of id ${req.params.id}`,
      data: updateWishdata,
    });
  }
);

// @desc Delete a single Wishlist
// @route DELETE /api/v1/Wishlists/:id
// @access Public
export const deleteWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: deleteWishlist ${req.method} ${req.url}`);

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
      message: `Delete a single Wishlist of id ${req.params.id}`,
      data: result,
    });
  }
);
