import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { CouponEntity } from "../model/coupon.entity";
import { logger } from "../../../middlewares/logger";
import { CustomRequest } from "../../../enums/custom-request-type";
import { CouponProductEntity } from "../model/coupon-product.entity";

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
  const result = await repository.find({ where: newQuery, relations: ['products'] });
  return res.status(200).json({
    success: true,
    message: "Get all Coupons",
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
    const result = await repository.findOneBy({ id });

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
export const createCoupon = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createCoupon ${req.method} ${req.url}`);
  
  const connection = await getDBConnection();
  
  // Start a transaction
  await connection.transaction(async (transactionManager: any) => {
    const couponRepository = transactionManager.getRepository(CouponEntity);
    const couponProductRepository = transactionManager.getRepository(CouponProductEntity);
    
    // Create and save the coupon
    const newCoupon = couponRepository.create({
      ...req.body,
      userId: req.id,
    });
    const savedCoupon = await couponRepository.save(newCoupon);
    
    // Handle coupon-product associations
    if (req.body.couponProducts && Array.isArray(req.body.couponProducts)) {
      const couponProducts = req.body.couponProducts.map((productId: number) => ({
        productId,
        couponId: savedCoupon.id,
      }));
      
      const newCouponProducts = couponProductRepository.create(couponProducts);
      await couponProductRepository.save(newCouponProducts);
    }
    
    // Final response
    res.status(200).json({
      success: true,
      message: "Create a new Coupon",
      data: savedCoupon,
    });
  });
});

// @desc Update a single Coupon
// @route PUT /api/v1/Coupons/:id
// @access Public
export const updateCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: updateCoupon ${req.method} ${req.url}`);
    const { id } = req.params;

    // const validation = updateCouponValidation.safeParse(req.body);

    // if (!validation.success) {
    //   const formattedErrors = validation.error.issues.map((issue) => ({
    //     path: issue.path.join("."),
    //     message: issue.message,
    //   }));

    //   return res.status(400).json({
    //     success: false,
    //     issues: formattedErrors,
    //   });
    // }

    const connection = await getDBConnection();

    const repository = await connection.getRepository(CouponEntity);

    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      message: `Update a single Coupon of id ${req.params.id}`,
      data: updateData,
    });
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
