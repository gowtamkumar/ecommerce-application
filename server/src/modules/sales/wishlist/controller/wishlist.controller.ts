import { getDBConnection } from '@/config/db';
import { CustomRequest } from '@/enums/custom-request-type';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { RoleEnum } from '@/modules/user/auth/enums/role.enum';
import { wishListhValidationSchema } from '@/validation';
import { NextFunction, Request, Response } from 'express';
import { WishListEntity } from '../model/wishlist.entity';

// @desc Get all Wishlists
// @route GET /api/v1/Wishlists
// @access Public
export const getWishlists = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: getWishlists ${req.method} ${req.url}`);

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const connection = await getDBConnection();
  const repository = connection.getRepository(WishListEntity);

  const [data, total] = await repository.findAndCount({
    relations: {
      product: true,
      user: true,
    },
    order: {
      createdAt: 'DESC',
    },
    skip,
    take: limit,
  });

  return res.status(200).json({
    success: true,
    message: 'Get all Wishlists',
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// @desc Get a single Wishlist
// @route GET /api/v1/Wishlists/:id
// @access Public
export const getWishlist = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
});

// @desc Get a single Wishlist
// @route GET /api/v1/Wishlists/:id
// @access Public
export const getUserWishlist = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    logger.info(`Service: getUserWishlist ${req.method} ${req.url}`);
    const userId = req.id;
    const connection = await getDBConnection();
    const products = await connection.query(
      `
      WITH productTable AS (
      SELECT 
        p.*,
        pv.unit_price,
        pv.purchase_price,
        pv.id AS product_variant_id,
        w.id AS wishlist_id
      FROM 
        products p
      JOIN LATERAL (
        SELECT 
          pv.unit_price, 
          pv.purchase_price, 
          pv.id
        FROM 
          product_variants pv
        WHERE 
          pv.product_id = p.id
        ORDER BY 
          pv.default DESC, pv.id
        LIMIT 1
      ) pv ON true
      INNER JOIN wishlists w ON w.product_id = p.id  -- ✅ Ensuring Wishlist items are treated as products
      WHERE w.user_id =$1
  ),
  reviewsTable AS (
      SELECT 
        product_id,
        COUNT(*) AS reviews_count,
        COALESCE(AVG(CAST(rating AS FLOAT)), 0) AS average_rating
      FROM reviews
      GROUP BY product_id
  ),
  validDiscount AS (
      SELECT 
          dis.id AS discount_id,
          dis.discount_strategy,
          dis.value AS discount_value,
          dis.scope,
          dis.promotion_type,
          dis.start_date,
          dis.end_date,
          dis.priority,
          ROW_NUMBER() OVER (PARTITION BY dis.scope ORDER BY dis.priority DESC, dis.value DESC) AS rank
      FROM discounts dis
      WHERE (dis.start_date <= NOW() AND dis.end_date >= NOW())
  ),
  selectedDiscount AS (
      SELECT DISTINCT ON (p.id) 
          p.id AS product_id, 
          dis.discount_id,
          dis.discount_strategy,
          dis.discount_value,
          dis.scope,
          dis.promotion_type
      FROM products p
      LEFT JOIN validDiscount dis ON (
          (dis.scope = 'Products' AND EXISTS (
              SELECT 1 FROM applicable_products ap WHERE ap.product_id = p.id AND ap.discount_id = dis.discount_id
          )) OR
          (dis.scope = 'Category' AND EXISTS (
              SELECT 1 FROM product_categories pc 
              WHERE pc.product_id = p.id 
              AND pc.category_id IN 
                  (SELECT category_id FROM applicable_categories WHERE discount_id = dis.discount_id)
          )) OR
          (dis.scope = 'Brand' AND EXISTS (
              SELECT 1 FROM applicable_brands ab WHERE ab.brand_id = p.brand_id AND ab.discount_id = dis.discount_id
          )) OR
          (dis.scope = 'Global') OR
          (dis.scope = 'Product' AND p.discount_id = dis.discount_id) 
      )   
      ORDER BY p.id, dis.priority DESC, dis.discount_value DESC
  )
  SELECT 
      p.id AS "id",
      p.name,
      p.slug,
      p.thumbnail_image AS "thumbnailImage",
      p.hover_image AS "hoverImage",
      p.variant,
      sd.discount_id AS "discountId",
      sd.discount_strategy AS "discountStrategy",
      sd.discount_value AS "discountValue",
      sd.scope,
      sd.promotion_type AS "promotionType",
      p.featured,
      p.wishlist_id as "wishlistId",
      p.unit_price AS "unitPrice",
      p.purchase_price AS "purchasePrice",
      p.product_variant_id AS "productVariantId",
      rt.reviews_count AS "reviewsCount",
      rt.average_rating AS "avgRating",
      -- ✅ Calculate tax amount based on the discounted price
      ROUND(
          ((CASE 
              WHEN sd.discount_strategy = 'Percentage' THEN 
                  p.unit_price - (p.unit_price * sd.discount_value / 100)
              WHEN sd.discount_strategy = 'Fixed' THEN 
                  p.unit_price - sd.discount_value
              ELSE 
                  p.unit_price
          END) * COALESCE(taxs.value, 0) / 100), 
      2) AS "taxAmount",
        -- ✅ Calculate Sale Price
        ROUND(
            ((p.unit_price) + 
            ((CASE 
                WHEN sd.discount_strategy = 'Percentage' THEN 
                    p.unit_price - (p.unit_price * sd.discount_value / 100)
                WHEN sd.discount_strategy = 'Fixed' THEN 
                    p.unit_price - sd.discount_value
                ELSE 
                    p.unit_price
            END) * COALESCE(taxs.value, 0) / 100)), 
        2) AS "salePrice",


        -- ✅ Calculate Final Price
        -- This is the final price after applying the discount and tax
        -- finalPrice = salePrice + tax
      ROUND(
          ((CASE 
              WHEN sd.discount_strategy = 'Percentage' THEN 
                  p.unit_price - (p.unit_price * sd.discount_value / 100)
              WHEN sd.discount_strategy = 'Fixed' THEN 
                  p.unit_price - sd.discount_value
              ELSE 
                  p.unit_price
          END) + 
          ((CASE 
              WHEN sd.discount_strategy = 'Percentage' THEN 
                  p.unit_price - (p.unit_price * sd.discount_value / 100)
              WHEN sd.discount_strategy = 'Fixed' THEN 
                  p.unit_price - sd.discount_value
              ELSE 
                  p.unit_price
          END) * COALESCE(taxs.value, 0) / 100)), 
      2) AS "finalPrice",

      -- ✅ Calculate Discounted Price
      ROUND(
          CASE 
              WHEN sd.discount_strategy = 'Percentage' THEN 
                  p.unit_price - (p.unit_price * sd.discount_value / 100)
              WHEN sd.discount_strategy = 'Fixed' THEN 
                  p.unit_price - sd.discount_value
              ELSE 
                  p.unit_price  -- No discount applied
          END, 
          2
      ) AS "discountedPrice"
  FROM 
      productTable p
  LEFT JOIN 
      selectedDiscount sd ON sd.product_id = p.id
  LEFT JOIN 
      reviewsTable rt ON rt.product_id = p.id
  LEFT JOIN 
      taxs ON taxs.id = p.tax_id
  LEFT JOIN 
      product_categories pc ON pc.product_id = p.id
  GROUP BY 
      sd.discount_id, sd.discount_strategy, sd.discount_value, sd.scope, sd.promotion_type,
      p.id, p.name, p.slug, p.thumbnail_image, p.hover_image, p.product_variant_id,
      p.variant, p.featured, rt.reviews_count, rt.average_rating, taxs.value, 
      p.unit_price, p.purchase_price, p.wishlist_id;
   `,
      [userId],
    );

    return res.status(200).json({
      success: true,
      message: `Gets User Wishlist`,
      data: products,
    });
  },
);

// @desc Create a single Wishlist
// @route POST /api/v1/Wishlists
// @access Public
export const createWishlist = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createWishlist ${req.method} ${req.url}`);

  const userId = (req.role === RoleEnum.Admin || req.role === RoleEnum.Admin) && req.body.userId 
    ? req.body.userId 
    : req.id;

  const validation = wishListhValidationSchema.safeParse({
    ...req.body,
    userId: userId,
  });

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
    message: 'Add a new Wishlist',
    data: save,
  });
});

// @desc Update a single Wishlist
// @route PUT /api/v1/Wishlists/:id
// @access Public
export const updateWishlist = asyncHandler(async (req: Request, res: Response) => {
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
});

// @desc Delete a single Wishlist
// @route DELETE /api/v1/Wishlists/:id
// @access Public
export const deleteWishlist = asyncHandler(async (req: Request, res: Response) => {
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
});
