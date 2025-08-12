import { NextFunction, Request, Response } from "express";
import { getDBConnection } from "../../../config/db";
import { CustomRequest } from "../../../enums/custom-request-type";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { logger } from "../../../middlewares/logger";
import { CouponProductEntity } from "../model/coupon-product.entity";
import { CouponEntity } from "../model/coupon.entity";

// @desc Get all Coupons
// @route GET /api/v1/Coupons
// @access Public
export const getCoupons = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getCoupons ${req.method} ${req.url}`);

  const { type } = req.query;
  const connection = await getDBConnection();
  const repository = connection.getRepository(CouponEntity);
  const newQuery = {} as any;
  if (type) newQuery.type = type;
  const result = await repository.find({
    where: newQuery,
    relations: ["products"],
  });
  return res.status(200).json({
    success: true,
    message: "Get all Coupons",
    total: result.length,
    data: result,
  });
});

// @desc Get a single Coupon
// @route GET /api/v1/Coupons/:id
// @access Public
export const getCoupon = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getCoupon ${req.method} ${req.url}`);
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(CouponEntity);
    const result = await repository.findOne({
      where: { id },
      relations: ["products", "products.product"],
      select: {
        id: true,
        type: true,
        code: true,
        discountType: true,
        value: true,
        startDate: true,
        expiryDate: true,
        minOrderAmount: true,
        mincartValue: true,
        maxUser: true,
        maxDiscountValue: true,
        usageCount: true,
        usageLimit: true,
        usagePerUser: true,
        image: true,
        active: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        products: {
          id: true, // optional — only if you want to include CouponProductEntity id
          productId: true,
          product: {
            name: true,
          },
        },
      },
    });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Coupon of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Coupon
// @route POST /api/v1/Coupons
// @access Public
export const createCoupon = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    logger.info(`Service: createCoupon ${req.method} ${req.url}`);

    const connection = await getDBConnection();

    // Start a transaction
    await connection.transaction(async (transactionManager: any) => {
      const couponRepository = transactionManager.getRepository(CouponEntity);
      const couponProductRepository =
        transactionManager.getRepository(CouponProductEntity);

      // Create and save the coupon
      const newCoupon = couponRepository.create({
        ...req.body,
        userId: req.id,
      });

      const savedCoupon = await couponRepository.save(newCoupon);

      // Handle coupon-product associations
      if (req.body.products && Array.isArray(req.body.products)) {
        const products = req.body.products.map((productId: number) => ({
          productId,
          couponId: savedCoupon.id,
        }));

        const newCouponProducts = couponProductRepository.create(products);
        await couponProductRepository.save(newCouponProducts);
      }

      // Final response
      res.status(200).json({
        success: true,
        message: "Create a new Coupon",
        data: savedCoupon,
      });
    });
  }
);

// @desc Update a single Coupon
// @route PUT /api/v1/Coupons/:id
// @access Public
export const updateCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: updateCoupon ${req.method} ${req.url}`);

    const { id } = req.params;
    const { products = [], ...restData } = req.body;

    const connection = await getDBConnection();
    const couponRepository = connection.getRepository(CouponEntity);
    const couponProductRepository =
      connection.getRepository(CouponProductEntity);

    const existingCoupon = await couponRepository.findOneBy({ id });

    if (!existingCoupon) {
      logger.error(`Coupon not found with id: ${id}`);
      return res.status(404).json({
        success: false,
        message: `Coupon not found with id: ${id}`,
      });
    }

    try {
      // ✅ Remove existing coupon-product relations if new products are given
      if (Array.isArray(products) && products.length > 0) {
        const existingCouponProducts = await couponProductRepository.find({
          where: { couponId: id },
        });

        if (existingCouponProducts.length > 0) {
          await couponProductRepository.remove(existingCouponProducts);
        }

        // ✅ Insert new coupon-product relations
        const newCouponProducts = products.map((productId: string) =>
          couponProductRepository.create({ productId, couponId: id })
        );
        await couponProductRepository.save(newCouponProducts);
      }

      // ✅ Merge and save updated coupon data
      const updatedCoupon = couponRepository.merge(existingCoupon, restData);
      await couponRepository.save(updatedCoupon);

      return res.status(200).json({
        success: true,
        message: `Coupon with ID ${id} updated successfully`,
        data: updatedCoupon,
      });
    } catch (error: any) {
      logger.error(`Error updating coupon with ID ${id}: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the coupon",
        error: error.message,
      });
    }
  }
);

// @desc Delete a single Coupon
// @route DELETE /api/v1/Coupons/:id
// @access Public
export const deleteCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: deleteCoupon ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(CouponEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      message: `Delete a single Coupon of id ${req.params.id}`,
      data: result,
    });
  }
);
