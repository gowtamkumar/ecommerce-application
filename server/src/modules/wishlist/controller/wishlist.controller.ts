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

// @desc Get a single Wishlist
// @route GET /api/v1/Wishlists/:id
// @access Public
export const getUserWishlist = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
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
      pv.id AS product_variant_id
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
),
reviewsTable AS (
    SELECT 
      product_id,
      COUNT(*) AS reviews_count,
      COALESCE(AVG(CAST(rating AS FLOAT)), 0) AS average_rating
    FROM reviews
    GROUP BY product_id
)
SELECT 
    p.id,
    p.name,
    p.slug,
    p.thumbnail_image AS "thumbnailImage",
    p.hover_image AS "hoverImage",
    p.variant,
    p.discount_id AS "discountId",
    dis.discount_type AS "discountType",
    dis.value AS "discountValue",
    p.featured,
    p.unit_price AS "unitPrice", 
    p.purchase_price AS "purchasePrice",
    p.product_variant_id AS "productVariantId",
    rt.reviews_count AS "reviewsCount",
    rt.average_rating AS "averageRating",
    ROUND(SUM((p.unit_price * COALESCE(taxs.value, 0)) / 100), 2) AS "taxAmount",
    ROUND(
      SUM(
        CASE 
          WHEN dis.discount_type = 'Percentage' THEN 
            (p.unit_price + (p.unit_price * COALESCE(taxs.value, 0) / 100)) * dis.value / 100
          ELSE 
            dis.value
        END
      ), 
      2
    ) AS "discountAmount"
FROM 
    productTable p
LEFT JOIN 
    reviewsTable rt ON rt.product_id = p.id
LEFT JOIN 
    taxs ON taxs.id = p.tax_id
LEFT JOIN 
    discounts dis ON dis.id = p.discount_id
INNER JOIN 
    wishlists w ON w.product_id = p.id
WHERE 
    w.user_id = ${userId} 
GROUP BY 
    p.id, p.name, p.thumbnail_image, p.hover_image, p.variant, p.discount_id, p.featured, 
    p.unit_price, p.purchase_price, p.product_variant_id, p.slug,
    rt.reviews_count, rt.average_rating, taxs.value, dis.discount_type, dis.value

   `
    );

    return res.status(200).json({
      success: true,
      message: `Get a single Wishlist of id ${req.params.id}`,
      data: products,
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
