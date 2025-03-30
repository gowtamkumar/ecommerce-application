import { Request, Response } from "express";
import { asyncHandler } from "../../../../../middlewares/async.middleware";
import { logger } from "../../../../../middlewares/logger";
import { getDBConnection } from "../../../../../config/db";
import { BannerEntity } from "../../../../banner/model/banner.entity";
import { DiscountEntity } from "../../../../discount/model/discount.entity";
import { CategoriesEntity } from "../../../../categories/model/categories.entity";

// @desc Get getHome data
// @route GET /api/v1/home
// @access Public
export const getHome = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getHome ${req.method} ${req.url}`);
  const connection = await getDBConnection();

  const bannerRepository = connection.getRepository(BannerEntity);

  const banners = await bannerRepository.find({
    where: { active: true },
    select: {
      id: true,
      title: true,
      image: true,
      url: true,
      description: true,
    },
  });

  const topSellingProduct = await connection.query(
    `
     WITH orderItems AS (
  SELECT
      oi.product_id AS product_id,
      SUM(COALESCE(oi.sub_total, 0)) AS total_amount
  FROM order_items oi
  LEFT JOIN orders ON orders.id = oi.order_id
  WHERE orders.status = 'Completed'
  GROUP BY oi.product_id
),
productTable AS (
  SELECT 
      p.*, 
      pv.unit_price, 
      pv.purchase_price, 
      pv.stock_qty,
      pv.size_id,
      pv.id AS product_variant_id
  FROM products p
  JOIN LATERAL (
      SELECT 
          pv.unit_price, 
          pv.purchase_price, 
          pv.stock_qty,
          pv.size_id,
          pv.id
      FROM product_variants pv
      WHERE pv.product_id = p.id
      ORDER BY pv.default DESC, pv.id
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
  WHERE 
      dis.status = 'Active'
      AND (dis.start_date <= NOW() AND dis.end_date >= NOW())
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
  oi.total_amount AS "totalAmount",
  sd.discount_id AS "discountId",
  sd.discount_strategy AS "discountStrategy",
  sd.discount_value AS "discountValue",
  sd.scope,
  sd.promotion_type AS "promotionType",
  p.featured,
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
  ) AS "discountedPrice",
  -- ✅ Product Variants Aggregation
  json_agg(
      json_build_object(
          'price', p.unit_price,
          'purchasePrice', p.purchase_price,
          'stockQty', p.stock_qty,
          'size_id', p.size_id,
          'size', json_build_object('name', sizes.name)
      )
  ) FILTER (WHERE p.product_variant_id IS NOT NULL) AS "productVariants",
  -- ✅ Tax object
  json_build_object(
      'name', taxs.name,
      'value', taxs.value
  ) AS "tax",
  -- ✅ Reviews Aggregation
  json_agg(
      json_build_object(
          'id', r.id,
          'rating', r.rating,
          'comment', r.comment
      )
  ) FILTER (WHERE r.id IS NOT NULL) AS "reviews"
FROM 
  orderItems oi
LEFT JOIN 
  productTable p ON p.id = oi.product_id
LEFT JOIN 
  selectedDiscount sd ON sd.product_id = p.id
LEFT JOIN 
  reviewsTable rt ON rt.product_id = p.id
LEFT JOIN 
  sizes ON sizes.id = p.size_id
LEFT JOIN 
  taxs ON taxs.id = p.tax_id
LEFT JOIN 
  reviews r ON r.product_id = p.id
GROUP BY 
  oi.product_id, oi.total_amount, 
  p.id, p.name, p.slug, p.thumbnail_image, p.hover_image, p.variant, 
  p.featured, p.product_variant_id, p.unit_price, p.purchase_price,
  sd.discount_id, sd.discount_strategy, sd.discount_value, sd.scope, sd.promotion_type,
  rt.reviews_count, rt.average_rating, taxs.name, taxs.value
ORDER BY 
  oi.total_amount DESC 
LIMIT 20;

  `
  );

  const discountRepository = connection.getRepository(DiscountEntity);
  const discounts = await discountRepository.find();

  const categoriesRepository = connection.getRepository(CategoriesEntity);
  const categories = await categoriesRepository.find({
    where: { active: true },
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      description: true,
      active: true,
    },
  });

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
  p.thumbnail_image as "thumbnailImage",
  p.hover_image as "hoverImage",
  p.variant,
  p.discount_id as "discountId",
  dis.discount_strategy AS "discountStrategy",
  dis.value as "discountValue",
  p.featured,
  p.unit_price as "unitPrice", 
  p.purchase_price as "purchasePrice",
  p.product_variant_id as "productVariantId",
  rt.reviews_count as "reviewsCount",
  rt.average_rating as "averageRating",

  ROUND(SUM((p.unit_price * COALESCE(taxs.value, 0)) / 100), 2) AS "taxAmount",

  ROUND(
    SUM(
      CASE 
        WHEN dis.discount_strategy = 'Percentage' THEN 
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

GROUP BY 
  p.id, p.name, p.thumbnail_image, p.hover_image, p.variant, p.discount_id, p.featured, 
  p.unit_price, p.purchase_price, p.product_variant_id, p.slug,
  rt.reviews_count, rt.average_rating, taxs.value, dis.discount_strategy, dis.value;
 `
  );

  return res.status(200).json({
    success: true,
    message: "Get Home page data",
    data: { products, topSellingProduct, banners, discounts, categories },
  });
});
