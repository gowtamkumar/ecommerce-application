export const topSellingProductQuery = `
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
`;
// this is currect calculation
// discountAmount = 1000 * 0.10 = ৳100
// salePrice = 1000 - 100 = ৳900
// tax = 900 * 0.05 = ৳45
// finalPrice = 900 + 45 = ৳945

export const productsQuery = async (queryData: any) => {
  const {
    search,
    lowPrice,
    highPrice,
    brandId,
    categoryId,
    minPrice,
    maxPrice,
    discount,
    page = 1,
    perPage = 12,
    discountId,
    featured,
  } = queryData;

  // Helper function to parse filters
  const parseFilter = (filter: any) => {
    if (!filter) return [];
    return [
      ...new Set(
        filter
          .split(",")
          .filter((id: any) => id.trim() !== "" && !isNaN(id)) // Ensure valid numbers
          .map((id: any) => parseInt(id.trim()))
      ),
    ];
  };

  const categoryFilter = parseFilter(categoryId);
  const brandFilter = parseFilter(brandId);

  const query = `
  WITH productTable AS (
      SELECT 
          p.id AS product_id,
          p.name,
          p.slug,
          p.thumbnail_image ,
          p.hover_image,
          p.variant,
          p.featured,
          p.tax_id,
          p.brand_id,
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
      ) pv ON true ${featured ? `WHERE p.featured = ${featured}` : ""}
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
      LEFT JOIN products p ON p.discount_id = dis.id
      WHERE 
          ((dis.start_date <= NOW() AND dis.end_date >= NOW()) OR dis.id = p.discount_id)
          AND dis.status = 'Active'
      ORDER BY dis.value DESC
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
                  SELECT 1 
                  FROM applicable_products ap 
                  WHERE ap.product_id = p.id AND ap.discount_id = dis.discount_id
              )) OR
              (dis.scope = 'Category' AND EXISTS (
                  SELECT 1 
                  FROM product_categories pc 
                  WHERE pc.product_id = p.id 
                  AND pc.category_id IN 
                      (SELECT category_id FROM applicable_categories WHERE discount_id = dis.discount_id)
              )) OR
              (dis.scope = 'Brand' AND EXISTS (
                  SELECT 1 
                  FROM applicable_brands ab 
                  WHERE ab.brand_id = p.brand_id AND ab.discount_id = dis.discount_id
              )) OR
              (dis.scope = 'Global') OR
              (dis.scope = 'Product' AND p.discount_id = dis.discount_id) 
          )   
      ORDER BY p.id, dis.priority DESC, dis.discount_value DESC
  ),
  filteredProducts AS (
  SELECT 
          p.product_id AS "id",
          p.name,
          p.slug,
          p.thumbnail_image as "thumbnailImage",
          p.hover_image as "hoverImage",
          p.variant,
          p.brand_id as "brandId",
          sd.discount_id as "discountId",
          sd.discount_strategy AS "discountStrategy",
          sd.discount_value AS "discountValue",
          sd.scope,
          sd.promotion_type AS "promotionType",
          p.featured,
          p.unit_price AS "unitPrice",
          p.purchase_price AS "purchasePrice",
          p.product_variant_id as "productVariantId",
          rt.reviews_count AS "reviewsCount",
          rt.average_rating AS "avgRating",

          -- ✅ Calculate amunt
          ROUND(
              (CASE 
                  WHEN sd.discount_strategy = 'Percentage' THEN 
                     (p.unit_price * sd.discount_value / 100)
                  WHEN sd.discount_strategy = 'Fixed' THEN 
                     sd.discount_value
              END),
          2) AS "discountAmount",

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
                      p.unit_price
              END, 
              2
          ) AS "discountedPrice"

      FROM 
          productTable p
      LEFT JOIN 
          selectedDiscount sd ON sd.product_id = p.product_id
      LEFT JOIN 
          reviewsTable rt ON rt.product_id = p.product_id
      LEFT JOIN 
          taxs ON taxs.id = p.tax_id
      LEFT JOIN 
          product_categories pc ON pc.product_id = p.product_id
      LEFT JOIN 
          brands b ON b.id = p.brand_id
  )
  SELECT
  *,
  COUNT(*) OVER() AS total
FROM filteredProducts
WHERE 1=1
  ${
    categoryFilter.length
      ? `
    AND "id" IN (
      SELECT product_id 
      FROM product_categories 
      WHERE category_id IN (${categoryFilter.join(",")})
    )
  `
      : ""
  }
  ${brandFilter.length ? `AND "brandId" IN (${brandFilter.join(",")})` : ""}
  ${
    minPrice && maxPrice
      ? `AND "discountedPrice" BETWEEN ${minPrice} AND ${maxPrice}`
      : ""
  }
  ${discount ? `AND "discountValue" BETWEEN 0 AND ${discount}` : ""}
  ${
    search
      ? `
    AND (
      LOWER("name") ILIKE LOWER('%${search}%') OR
      LOWER("slug") ILIKE LOWER('%${search}%')
    )
  `
      : ""
  }
  ${discountId ? `AND "discountId" = ${discountId}` : ""}
ORDER BY ${
    lowPrice && !highPrice ? `"discountedPrice" ASC` : `"discountedPrice" DESC`
  }
LIMIT ${perPage} OFFSET ${(+page - 1) * +perPage}
`;
  return query;
};

export const singleDiscountQuery = async (id: string) => {
  const query = `
          WITH product_variants_dedup AS (
            SELECT DISTINCT ON (pv.product_id)
                pv.product_id,
                pv.unit_price,
                pv.purchase_price,
                pv.id AS product_variant_id
            FROM product_variants pv
            ORDER BY pv.product_id, pv.default DESC, pv.id
          ),
          productTable AS (
            SELECT 
              p.id AS product_id,
              p.name,
              p.slug,
              p.thumbnail_image,
              p.hover_image,
              p.variant,
              p.featured,
              p.tax_id,
              p.brand_id,
              pc.category_id,
              pv.unit_price,
              pv.purchase_price,
              pv.product_variant_id
            FROM products p
            LEFT JOIN product_variants_dedup pv ON pv.product_id = p.id
            LEFT JOIN product_categories pc ON pc.product_id = p.id
          ),
          reviewsTable AS (
            SELECT 
              product_id,
              COUNT(*) AS reviews_count,
              COALESCE(AVG(CAST(rating AS FLOAT)), 0) AS average_rating
            FROM reviews
            GROUP BY product_id
          ),
          discountInfo AS (
            SELECT * FROM discounts WHERE id = ${id}
          ),
          targetProducts AS (
            SELECT 
              p.*
            FROM discountInfo d
            JOIN productTable p ON
                (d.scope = 'Global')
              OR (d.scope = 'Products' AND EXISTS (
                SELECT 1 FROM applicable_products ap WHERE ap.discount_id = d.id AND ap.product_id = p.product_id
              ))
              OR (d.scope = 'Brand' AND EXISTS (
                SELECT 1 FROM applicable_brands ab WHERE ab.discount_id = d.id AND ab.brand_id = p.brand_id
              ))
              OR (d.scope = 'Category' AND EXISTS (
                SELECT 1 FROM applicable_categories ac WHERE ac.discount_id = d.id AND ac.category_id = p.category_id
              ))
          )
          SELECT 
            d.id AS "id",
            d.name,
            d.key,
            d.slug,
            d.value AS "discountValue",
            d.scope,
            d.promotion_type AS "promotionType",
            d.start_date AS "startDate",
            d.end_date AS "endDate",
            d.priority,
            d.stackable,
            d.image,
            d.status,
            d.offer_details AS "offerDetails",
            d.description,
            d.discount_strategy AS "discountStrategy",
            d.created_at AS "createdAt",
            json_agg(
              json_build_object(
                'id', tp.product_id,
                'name', tp.name,
                'slug', tp.slug,
                'thumbnailImage', tp.thumbnail_image,
                'hoverImage', tp.hover_image,
                'variant', tp.variant,
                'featured', tp.featured,
                'unitPrice', tp.unit_price,
                'purchasePrice', tp.purchase_price,
                'productVariantId', tp.product_variant_id,
                'reviewsCount', rt.reviews_count,
                'avgRating', rt.average_rating,
                'taxAmount', ROUND((
                  CASE 
                    WHEN d.discount_strategy = 'Percentage' THEN 
                      tp.unit_price - (tp.unit_price * d.value / 100)
                    WHEN d.discount_strategy = 'Fixed' THEN 
                      tp.unit_price - d.value
                    ELSE tp.unit_price
                  END
                ) * COALESCE(t.value, 0) / 100, 2),
                'discountedPrice', ROUND((
                  CASE 
                    WHEN d.discount_strategy = 'Percentage' THEN 
                      tp.unit_price - (tp.unit_price * d.value / 100)
                    WHEN d.discount_strategy = 'Fixed' THEN 
                      tp.unit_price - d.value
                    ELSE tp.unit_price
                  END
                ), 2)
              )
            ) AS products
          FROM discountInfo d
          LEFT JOIN targetProducts tp ON true
          LEFT JOIN taxs t ON t.id = tp.tax_id
          LEFT JOIN reviewsTable rt ON rt.product_id = tp.product_id
          GROUP BY d.id, d.name, d.slug, d.key, d.discount_strategy, d.value, d.scope, d.promotion_type,
           d.start_date, d.end_date, d.priority, d.stackable, d.image, d.status, d.offer_details, d.description,d.created_at 
          `;
  return query;
};
