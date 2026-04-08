import { NextFunction, Request, Response } from 'express';
import { getDBConnection } from '@/config/db';
import { CustomRequest } from '@/enums/custom-request-type';
import { NotificationType } from '@/enums/notification-type.enum';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { productVariantValidationSchema } from '@/validation';
import { NotificationEntity } from '@/modules/system/other/notification/model/notification.entity';
import { WishListEntity } from '@/modules/sales/wishlist/model/wishlist.entity';
import { ProductVariantEntity } from '../model/product-variant.entity';

// @desc Get all ProductVariants
// @route GET /api/v1/ProductVariants
// @access Public
export const getProductVariants = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getProductVariants ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(ProductVariantEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: 'Get all Product Variants',
    data: result,
  });
});

// @desc Get a single ProductVariant
// @route GET /api/v1/ProductVariants/:id
// @access Public
export const getProductVariant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getProductVariant ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ProductVariantEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single ProductVariant of id ${req.params.id}`,
      data: result,
    });
  },
);

// @desc Create a single ProductVariant
// @route POST /api/v1/ProductVariants
// @access Public
export const createProductVariant = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createProductVariant ${req.method} ${req.url}`);

  const validation = productVariantValidationSchema.safeParse(req.body);

  if (!validation.success) {
    const formattedErrors = validation.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      issues: formattedErrors,
    });
  }

  const connection = await getDBConnection();
  const repository = connection.getRepository(ProductVariantEntity);

  const result = await repository.create(validation.data);
  await repository.save(result);

  return res.status(200).json({
    success: true,
    message: 'Create a new Product Variant',
    data: result,
  });
});

// @desc Update a single ProductVariant
// @route PUT /api/v1/ProductVariants/:id
// @access Public
export const updateProductVariant = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateProductVariant ${req.method} ${req.url}`);

  const { id } = req.params;

  const validation = productVariantValidationSchema.safeParse(req.body);

  if (!validation.success) {
    const formattedErrors = validation.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      issues: formattedErrors,
    });
  }

  const connection = await getDBConnection();

  const repository = await connection.getRepository(ProductVariantEntity);

  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, validation.data);

  // Check for Price Drop or Back in Stock
  const oldPrice = parseFloat(result.unitPrice.toString());
  const newPrice = validation.data.price ? parseFloat(validation.data.price.toString()) : oldPrice;

  const oldStock = result.stockQty || 0;
  const newStock = validation.data.stockQty !== undefined ? validation.data.stockQty : oldStock;

  // We only notify if there's a meaningful change
  const priceDropped = newPrice < oldPrice;
  const backInStock = oldStock === 0 && newStock > 0;

  await repository.save(updateData);

  if (priceDropped || backInStock) {
    const wishlistRepo = connection.getRepository(WishListEntity);
    const notificationRepo = connection.getRepository(NotificationEntity);

    // Find all users who wishlisted this product
    const wishlists = await wishlistRepo.find({
      where: { productId: result.productId },
      relations: ['user'],
    });

    const notifications: NotificationEntity[] = [];

    for (const item of wishlists) {
      if (priceDropped) {
        notifications.push(
          notificationRepo.create({
            type: NotificationType.WishlistPriceDrop,
            title: 'Price Drop Alert!',
            message: `Good news! An item in your wishlist has dropped in price to ${newPrice}.`,
            userId: item.userId,
            isRead: false,
          }),
        );
      }

      if (backInStock) {
        notifications.push(
          notificationRepo.create({
            type: NotificationType.ProductBackInStock,
            title: 'Back in Stock!',
            message: `An item in your wishlist is back in stock!`,
            userId: item.userId,
            isRead: false,
          }),
        );
      }

      // Low Stock Alert for Wishlist users
      // If stock drops to <= 5 and it wasn't low before (or just notify if low)
      // user requested: "Product Low Stock Alert (for pre-order or subscription)"
      if (newStock <= 5 && newStock > 0 && oldStock > 5) {
        notifications.push(
          notificationRepo.create({
            type: NotificationType.ProductLowStock,
            title: 'Low Stock Alert!',
            message: `Hurry! An item in your wishlist is running low on stock (Only ${newStock} left).`,
            userId: item.userId,
            isRead: false,
          }),
        );
      }
    }

    if (notifications.length > 0) {
      await notificationRepo.save(notifications);
    }
  }

  return res.status(200).json({
    success: true,
    message: `Update a single ProductVariant of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single ProductVariant
// @route DELETE /api/v1/ProductVariants/:id
// @access Public
export const deleteProductVariant = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteProductVariant ${req.method} ${req.url}`);

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
    message: `Delete a single ProductVariant of id ${req.params.id}`,
    data: result,
  });
});
