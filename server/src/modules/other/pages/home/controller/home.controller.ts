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
  const { type } = req.query;
  const connection = await getDBConnection();

  const bannerRepository = connection.getRepository(BannerEntity);

  const banners = await bannerRepository.find({
    where: { active: true },
    select: {
      id: true,
      title: true,
      type: true,
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
              SUM(((COALESCE(oi.price, 0) + COALESCE(oi.tax, 0)) * COALESCE(oi.qty, 0)) - COALESCE(oi.discount_amount, 0) * COALESCE(oi.qty, 0)) AS total_amount
          FROM
              order_items oi
          LEFT JOIN
              orders ON orders.id = oi.order_id
          WHERE
              orders.status = 'Completed'
          GROUP BY
              oi.product_id
        )
        SELECT
            oI.product_id AS id,
            oI.total_amount AS "totalAmount",
            products.name,
            products.images,
            products.discount_id as "discountId",
            products.alert_qty AS "alertQty",
            
            -- Aggregation for product variants
            json_agg(
                json_build_object(
                    'price', pv.sale_price,
                    'purchasePrice', pv.purchase_price,
                    'stockQty', pv.stock_qty,
                    'size_id', pv.size_id,
                    'size', json_build_object('name', sizes.name) -- Direct join for sizes
                )
            ) FILTER (WHERE pv.product_id IS NOT NULL) AS "productVariants",

            -- Tax object
            json_build_object(
                'name', taxs.name,
                'value', taxs.value
            ) AS "tax", 

            -- discount object
            json_build_object(
                'discountType', d.discount_type,
                'value', d.value
            ) AS "discount", 

            -- Aggregation for reviews
            json_agg(
                json_build_object(
                    'id', reviews.id,
                    'rating', reviews.rating,
                    'comment', reviews.comment
                )
            ) FILTER (WHERE reviews.id IS NOT NULL) AS "reviews" 

        FROM
            orderItems oI
        LEFT JOIN
            products ON products.id = oI.product_id
        LEFT JOIN
            product_variants pv ON pv.product_id = oI.product_id
        LEFT JOIN
            sizes ON sizes.id = pv.size_id
        LEFT JOIN
            taxs ON taxs.id = products.tax_id
        LEFT JOIN
            discounts d ON d.id = products.discount_id    
        LEFT JOIN
            reviews ON reviews.product_id = products.id
        GROUP BY
            oI.product_id, oI.total_amount, products.name,
             products.images, products.alert_qty, taxs.name,
              taxs.value, d.value, d.discount_type,
              products.discount_id
        ORDER BY
            oI.total_amount DESC LIMIT 20;
    `
  );

  const discountRepository = connection.getRepository(DiscountEntity);
  const discounts = await discountRepository.find({
    where: { active: true },
    select: {
      id: true,
      discountType: true,
      couponCode: true,
      type: true,
      value: true,
      startDate: true,
      expiryDate: true,
      minOrderAmount: true,
      maxUser: true,
      usageCount: true,
      active: true,
    },
  });

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
    pv.sale_price,
    pv.purchase_price,
    pv.id AS product_variant_id
  FROM 
    products p
  JOIN LATERAL (
    SELECT 
      pv.sale_price, 
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
  p.variant,
  p.discount_id as "discountId",
  dis.discount_type as "discountType",
  dis.value as "discountValue",
  p.featured,
  p.sale_price as "salePrice", 
  p.purchase_price as "purchasePrice",
  p.product_variant_id as "productVariantId",
  rt.reviews_count as "reviewsCount",
  rt.average_rating as "averageRating",

  ROUND(SUM((p.sale_price * COALESCE(taxs.value, 0)) / 100), 2) AS "taxAmount",

  ROUND(
    SUM(
      CASE 
        WHEN dis.discount_type = 'Percentage' THEN 
          (p.sale_price + (p.sale_price * COALESCE(taxs.value, 0) / 100)) * dis.value / 100
        ELSE 
          dis.value
      END
    ), 
    2
  ) AS "disAmount",

  ROUND(
    p.sale_price + (p.sale_price * COALESCE(taxs.value, 0) / 100) -
    COALESCE(
      CASE 
        WHEN dis.discount_type = 'Percentage' THEN 
          (p.sale_price + (p.sale_price * COALESCE(taxs.value, 0) / 100)) * dis.value / 100
        ELSE 
          dis.value
      END, 0
    ),
    2
  ) AS "price",

  ROUND(
    SUM(p.sale_price + (p.sale_price * COALESCE(taxs.value, 0) / 100)), 
    2
  ) AS "taxWithPrice"

FROM 
  productTable p
LEFT JOIN 
  reviewsTable rt ON rt.product_id = p.id
LEFT JOIN 
  taxs ON taxs.id = p.tax_id
LEFT JOIN 
  discounts dis ON dis.id = p.discount_id

GROUP BY 
  p.id, p.name, p.thumbnail_image, p.variant, p.discount_id, p.featured, 
  p.sale_price, p.purchase_price, p.product_variant_id, p.slug,
  rt.reviews_count, rt.average_rating, taxs.value, dis.discount_type, dis.value;

 `
  );

  // const productRepository = connection.getRepository(ProductEntity);
  // const qb = productRepository.createQueryBuilder("product");
  // qb.select([
  //   "product.id",
  //   "product.name",
  //   "product.thumbnailImage",
  //   // "product.images",
  //   // "product.slug",
  //   "product.variant",
  //   "product.featured",
  //   // "product.taxId",
  //   // "product.tags",
  //   // "product.brandId",
  //   // "product.unitId",
  //   // "product.discountId",
  //   // "product.enableReview",
  //   // "product.limitPurchaseQty",
  //   // "product.alertQty",
  //   // "product.status",
  //   // "brand.name",
  //   // "reviews.id",
  //   "reviews.rating",
  //   "tax.name",
  //   "tax.value",
  //   "productVariants",
  //   "discount.discountType",
  //   "discount.value",
  //   "discount.type",
  // ]);
  // qb.leftJoin("product.reviews", "reviews");
  // qb.leftJoin("product.tax", "tax");
  // qb.leftJoin("product.discount", "discount");
  // qb.leftJoin("product.productVariants", "productVariants");
  // qb.orderBy("productVariants.id", "DESC");
  // qb.addOrderBy("product.slug", "ASC");

  // const products = await qb.getMany();

  return res.status(200).json({
    success: true,
    message: "Get Home page data",
    data: { products, topSellingProduct, banners, discounts, categories },
  });
});

// WITH productTable AS (
//   SELECT
//     *,
//     (
//       SELECT pv.sale_price
//       FROM product_variants pv
//       WHERE
//         pv.product_id = products.id
//         AND (
//           (pv.default = true)
//           OR (pv.default = false)
//         )
//       LIMIT 1
//     ) AS sale_price,
//      (
//     SELECT pv.purchase_price
//     FROM product_variants pv
//     WHERE
//       pv.product_id = products.id
//       AND (
//         (pv.default = true)
//         OR (pv.default = false)
//       )
//     LIMIT 1
//   ) AS purchase_price,
//    (
//     SELECT pv.id
//     FROM product_variants pv
//     WHERE
//       pv.product_id = products.id
//       AND (
//         (pv.default = true)
//         OR (pv.default = false)
//       )
//     LIMIT 1
//   ) AS product_variant_id
//   FROM products
// ),

// reviewsTable AS (
//   SELECT
//     product_id,
//     COUNT(*) AS reviews_count,
//     COALESCE(SUM(CAST(rating AS FLOAT)) / COUNT(rating), 0) AS average_rating
//   FROM reviews
//   WHERE product_id IS NOT NULL
//   GROUP BY product_id
// )

// SELECT
//   p.id,
//   p.name,
//   p.thumbnail_image as "thumbnailImage",
//   p.variant,
//   p.discount_id as "discountId",
//   dis.discount_type as "discountType",
//   dis.value as "discountValue",
//   p.featured,
//   p.sale_price as "salePrice",
//   p.purchase_price as "purchasePrice",
//   p.product_variant_id as "productVariantId",
//   rt.reviews_count as "reviewsCount",
//   rt.average_rating as "averageRating",
//   SUM((COALESCE(p.sale_price, 0) * COALESCE(taxs.value, 0)) / 100) AS "taxAmount",

//   SUM(
//     ROUND(CASE
//       WHEN dis.discount_type = 'Percentage' THEN
//         ((COALESCE(p.sale_price, 0) + (COALESCE(p.sale_price, 0) * COALESCE(taxs.value, 0) / 100)) * COALESCE(dis.value, 0)) / 100
//       ELSE
//         COALESCE(dis.value, 0)
//     END
//   ,2)) AS "disAmount",

//   CASE
//     WHEN p.discount_id IS NOT NULL THEN
//       ROUND(
//         (
//           (COALESCE(p.sale_price, 0) + ((COALESCE(p.sale_price, 0) * COALESCE(taxs.value, 0)) / 100)) -
//           SUM(
//             CASE
//               WHEN dis.discount_type = 'Percentage' THEN
//                 ((COALESCE(p.sale_price, 0) + (COALESCE(p.sale_price, 0) * COALESCE(taxs.value, 0) / 100)) * COALESCE(dis.value, 0)) / 100
//               ELSE
//                 COALESCE(dis.value, 0)
//             END
//           )
//         ), 2
//       )
//     ELSE
//       ROUND(
//         COALESCE(p.sale_price, 0) + ((COALESCE(p.sale_price, 0) * COALESCE(taxs.value, 0)) / 100),
//         2
//       )
//   END AS "price",

//   SUM(
//     ROUND(
//       COALESCE(p.sale_price, 0) + ((COALESCE(p.sale_price, 0) * COALESCE(taxs.value, 0)) / 100),
//       2
//     )
//   ) AS "taxWithPrice"

// FROM
//   productTable p
// LEFT JOIN
//   reviewsTable rt ON rt.product_id = p.id
// LEFT JOIN
//   taxs ON taxs.id = p.tax_id
// LEFT JOIN
//   discounts dis ON dis.id = p.discount_id

// GROUP BY
//   p.id,
//   p.name,
//   p.thumbnail_image,
//   p.variant,
//   p.discount_id,
//   p.featured,
//   p.sale_price,
//   p.purchase_price,
//   p.product_variant_id,
//   rt.reviews_count,
//   rt.average_rating,
//   taxs.value,
//   dis.discount_type,
//   dis.value
