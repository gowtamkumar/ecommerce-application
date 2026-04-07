export const topSellingProductQuery = `
   WITH orderItems AS (
    SELECT
        oi.product_id AS product_id,
        SUM(COALESCE(oi.sub_total, 0)) AS total_amount
    FROM order_items oi
    LEFT JOIN orders ON orders.id = oi.order_id
    WHERE orders.status = 'Delivered'
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
    rt.average_rating AS "rating",
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
    ROUND(
        (p.unit_price + (p.unit_price * COALESCE(taxs.value, 0) / 100)), 
    2) AS "salePrice",
    ROUND(
        ((CASE 
            WHEN sd.discount_strategy = 'Percentage' THEN 
                p.unit_price - (p.unit_price * sd.discount_value / 100)
            WHEN sd.discount_strategy = 'Fixed' THEN 
                p.unit_price - sd.discount_value
            ELSE 
                p.unit_price
        END) * (1 + COALESCE(taxs.value, 0) / 100)), 
    2) AS "finalPrice",
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
    ) AS "discountedPrice",
    json_agg(
        json_build_object(
            'price', p.unit_price,
            'purchasePrice', p.purchase_price,
            'stockQty', p.stock_qty,
            'size_id', p.size_id,
            'size', json_build_object('name', sizes.name)
        )
    ) FILTER (WHERE p.product_variant_id IS NOT NULL) AS "productVariants",
    json_build_object(
        'name', taxs.name,
        'value', taxs.value
    ) AS "tax",
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

export const productsQuery = async (queryData: any) => {
  const {
    search,
    lowPrice,
    highPrice,
    brandId,
    categoryId,
    minPrice,
    maxPrice,
    page = 1,
    perPage = 12,
    discount,
    discountId,
    discountSlug,
    featured,
    isNewArrival,
  } = queryData;

  const parseFilter = (filter: any) => {
    if (!filter) return [];
    return [...new Set(filter.split(',').filter((id: any) => id.trim() !== '' && !isNaN(id)).map((id: any) => parseInt(id.trim())))];
  };

  const categoryFilter = parseFilter(categoryId);
  const brandFilter = parseFilter(brandId);

  const values: any[] = [];
  let paramIndex = 1;

  let whereClause = 'WHERE 1=1';

  if (featured !== undefined) {
    whereClause += ` AND p.featured = $${paramIndex++}`;
    values.push(featured === 'true' || featured === true);
  }
  if (isNewArrival !== undefined) {
    whereClause += ` AND p.is_new_arrival = $${paramIndex++}`;
    values.push(isNewArrival === 'true' || isNewArrival === true);
  }
  if (categoryFilter.length > 0) {
    whereClause += ` AND p.id IN (SELECT product_id FROM product_categories WHERE category_id = ANY($${paramIndex++}))`;
    values.push(categoryFilter);
  }
  if (brandFilter.length > 0) {
    whereClause += ` AND p.brand_id = ANY($${paramIndex++})`;
    values.push(brandFilter);
  }
  if (search) {
    whereClause += ` AND (p.name ILIKE $${paramIndex} OR p.slug ILIKE $${paramIndex})`;
    values.push(`%${search}%`);
    paramIndex++;
  }

  const query = `
    WITH best_variants AS (
        SELECT DISTINCT ON (pv.product_id)
            pv.product_id,
            pv.unit_price,
            pv.purchase_price,
            pv.id
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
            p.is_new_arrival,
            p.tax_id,
            p.brand_id,
            p.short_description,
            p.discount_id,
            bv.unit_price,
            bv.purchase_price,
            bv.id AS product_variant_id
        FROM products p
        LEFT JOIN best_variants bv ON bv.product_id = p.id
        ${whereClause}
    ),
    reviewsTable AS (
        SELECT 
            product_id,
            COUNT(*) AS reviews_count,
            COALESCE(AVG(CAST(rating AS FLOAT)), 0) AS average_rating
        FROM reviews
        GROUP BY product_id
    ),
    selectedDiscount AS (
        SELECT DISTINCT ON (p.product_id) 
            p.product_id,  
            dis.id AS discount_id,
            dis.discount_strategy,
            dis.value AS discount_value,
            dis.slug AS discount_slug,
            dis.scope,
            dis.promotion_type
        FROM productTable p
        LEFT JOIN discounts dis ON (
            (dis.scope = 'Products' AND EXISTS (
                SELECT 1 FROM applicable_products ap WHERE ap.product_id = p.product_id AND ap.discount_id = dis.id
            )) OR
            (dis.scope = 'Category' AND EXISTS (
                SELECT 1 FROM product_categories pc 
                WHERE pc.product_id = p.product_id 
                AND pc.category_id IN (SELECT category_id FROM applicable_categories WHERE discount_id = dis.id)
            )) OR
            (dis.scope = 'Brand' AND EXISTS (
                SELECT 1 FROM applicable_brands ab WHERE ab.brand_id = p.brand_id AND ab.discount_id = dis.id
            )) OR
            (dis.scope = 'Global') OR
            (dis.scope = 'Product' AND p.discount_id = dis.id) 
        )
        WHERE ((dis.start_date <= NOW() AND dis.end_date >= NOW()) OR dis.id = p.discount_id)
          AND dis.status = 'Active'
        ORDER BY p.product_id, dis.priority DESC, dis.value DESC
    ),
    base_price AS (
        SELECT 
            p.product_id,
            p.name,
            p.slug,
            p.thumbnail_image,
            p.hover_image,
            p.variant,
            p.brand_id,
            p.featured,
            p.is_new_arrival,
            p.tax_id,
            p.short_description,
            p.unit_price,
            p.purchase_price,
            p.product_variant_id,
            sd.discount_id,
            sd.discount_strategy,
            sd.discount_value,
            sd.discount_slug,
            sd.scope,
            sd.promotion_type,
            rt.reviews_count,
            rt.average_rating,
            COALESCE(taxs.value, 0) AS tax_percent,
            CASE 
                WHEN sd.discount_strategy = 'Percentage' THEN p.unit_price - (p.unit_price * sd.discount_value / 100)
                WHEN sd.discount_strategy = 'Fixed' THEN p.unit_price - sd.discount_value
                ELSE p.unit_price
            END AS discounted_price
        FROM productTable p
        LEFT JOIN selectedDiscount sd ON sd.product_id = p.product_id
        LEFT JOIN reviewsTable rt ON rt.product_id = p.product_id
        LEFT JOIN taxs ON taxs.id = p.tax_id
    )
    SELECT 
        product_id AS "id",
        name,
        slug,
        thumbnail_image AS "thumbnailImage",
        hover_image AS "hoverImage",
        variant,
        brand_id AS "brandId",
        discount_id AS "discountId",
        discount_strategy AS "discountStrategy",
        discount_value AS "discountValue",
        discount_slug AS "discountSlug",
        scope,
        promotion_type AS "promotionType",
        featured,
        is_new_arrival AS "isNewArrival",
        unit_price AS "unitPrice",
        purchase_price AS "purchasePrice",
        product_variant_id AS "productVariantId",
        reviews_count AS "reviewsCount",
        average_rating AS "avgRating",
        average_rating AS "rating",
        short_description AS "shortDescription",
        ROUND(unit_price - discounted_price, 2) AS "discountAmount",
        ROUND(discounted_price * tax_percent / 100, 2) AS "taxAmount",
        ROUND(discounted_price + (discounted_price * tax_percent / 100), 2) AS "finalPrice",
        ROUND(unit_price + (unit_price * tax_percent / 100), 2) AS "salePrice",
        ROUND(discounted_price, 2) AS "discountedPrice"
    FROM base_price
    WHERE 1=1
      ${discount ? `AND discount_value <= $${paramIndex++}` : ''}
      ${discountId ? `AND discount_id = $${paramIndex++}` : discountSlug ? `AND discount_slug = $${paramIndex++}` : ''}
      ${minPrice ? `AND (discounted_price + (discounted_price * tax_percent / 100)) >= $${paramIndex++}` : ''}
      ${maxPrice ? `AND (discounted_price + (discounted_price * tax_percent / 100)) <= $${paramIndex++}` : ''}
    ORDER BY ${lowPrice === 'true' ? `"finalPrice" ASC` : `"finalPrice" DESC`}
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;

  if (discount) values.push(parseFloat(discount));
  if (discountId) values.push(parseInt(discountId));
  else if (discountSlug) values.push(discountSlug);
  if (minPrice) values.push(parseFloat(minPrice));
  if (maxPrice) values.push(parseFloat(maxPrice));
  values.push(parseInt(perPage.toString()));
  values.push((parseInt(page.toString()) - 1) * parseInt(perPage.toString()));

  return { query, values };
};

export const productDetailQuery = (slug: string, productVariantId: number | null) => {
  const values: any[] = [slug];
  let variantCondition = '';
  if (productVariantId) {
    values.push(productVariantId);
    variantCondition = 'AND pv.id = $2';
  }

  const query = `
    WITH productTable AS (
        SELECT 
            p.*,
            pv.id AS selected_variant_id,
            pv.unit_price AS selected_unit_price,
            pv.purchase_price AS selected_purchase_price
        FROM products p
        LEFT JOIN LATERAL (
            SELECT id, unit_price, purchase_price
            FROM product_variants
            WHERE product_id = p.id ${variantCondition}
            ORDER BY "default" DESC, id ASC
            LIMIT 1
        ) pv ON true
        WHERE p.slug = $1 AND p.status = 'Active'
    ),
    reviewsAggregation AS (
        SELECT 
            product_id,
            COUNT(*) AS reviews_count,
            COALESCE(AVG(CAST(rating AS FLOAT)), 0) AS average_rating
        FROM reviews
        WHERE status = 'Approved'
        GROUP BY product_id
    ),
    selectedDiscount AS (
        SELECT DISTINCT ON (p.id) 
            p.id AS product_id,  
            dis.id AS discount_id,
            dis.discount_strategy,
            dis.value AS discount_value,
            dis.promotion_type
        FROM products p
        LEFT JOIN discounts dis ON (
            (dis.scope = 'Products' AND EXISTS (
                SELECT 1 FROM applicable_products ap WHERE ap.product_id = p.id AND ap.discount_id = dis.id
            )) OR
            (dis.scope = 'Category' AND EXISTS (
                SELECT 1 FROM product_categories pc 
                WHERE pc.product_id = p.id 
                AND pc.category_id IN (SELECT category_id FROM applicable_categories WHERE discount_id = dis.id)
            )) OR
            (dis.scope = 'Brand' AND EXISTS (
                SELECT 1 FROM applicable_brands ab WHERE ab.brand_id = p.brand_id AND ab.discount_id = dis.id
            )) OR
            (dis.scope = 'Global') OR
            (dis.scope = 'Product' AND p.discount_id = dis.id) 
        )
        WHERE ((dis.start_date <= NOW() AND dis.end_date >= NOW()) OR dis.id = p.discount_id)
          AND dis.status = 'Active'
        ORDER BY p.id, dis.priority DESC, dis.value DESC
    ),
    base_price AS (
        SELECT 
            p.id,
            p.name,
            p.slug,
            p.variant,
            p.thumbnail_image,
            p.hover_image,
            p.images,
            p.selected_variant_id,
            p.selected_unit_price,
            p.selected_purchase_price,
            p.description,
            p.short_description,
            p.enable_review,
            p.limit_purchase_qty,
            p.alert_qty,
            p.tags,
            sd.discount_strategy,
            sd.discount_value,
            ra.reviews_count,
            ra.average_rating,
            COALESCE(t.value, 0) AS tax_percent,
            CASE 
                WHEN sd.discount_strategy = 'Percentage' THEN p.selected_unit_price - (p.selected_unit_price * sd.discount_value / 100)
                WHEN sd.discount_strategy = 'Fixed' THEN p.selected_unit_price - sd.discount_value
                ELSE p.selected_unit_price
            END AS discounted_price,
            t.name AS tax_name, t.value AS tax_value,
            b.id AS brand_id, b.name AS brand_name, b.slug AS brand_slug, b.image AS brand_image, b.status AS brand_status
        FROM productTable p
        LEFT JOIN selectedDiscount sd ON sd.product_id = p.id
        LEFT JOIN reviewsAggregation ra ON ra.product_id = p.id
        LEFT JOIN taxs t ON t.id = p.tax_id
        LEFT JOIN brands b ON b.id = p.brand_id
    )
    SELECT 
        bp.id,
        bp.name,
        bp.slug,
        bp.variant,
        bp.thumbnail_image AS "thumbnailImage",
        bp.hover_image AS "hoverImage",
        bp.images,
        bp.selected_variant_id AS "productVariantId",
        bp.description,
        bp.short_description AS "shortDescription",
        bp.enable_review AS "enableReview",
        bp.limit_purchase_qty AS "limitPurchaseQty",
        bp.alert_qty AS "alertQty",
        bp.tags,
        bp.discount_strategy AS "discountStrategy",
        bp.discount_value AS "discountValue",
        bp.reviews_count AS "reviewsCount",
        bp.average_rating AS "avgRating",
        bp.average_rating AS "rating",
        
        bp.selected_unit_price AS "unitPrice",
        bp.selected_purchase_price AS "purchasePrice",

        ROUND(bp.selected_unit_price - bp.discounted_price, 2) AS "discountAmount",
        ROUND(bp.discounted_price * bp.tax_percent / 100, 2) AS "taxAmount",
        ROUND(bp.discounted_price + (bp.discounted_price * bp.tax_percent / 100), 2) AS "finalPrice",
        ROUND(bp.selected_unit_price + (bp.selected_unit_price * bp.tax_percent / 100), 2) AS "salePrice",
        ROUND(bp.discounted_price, 2) AS "discountedPrice",

        COALESCE(
            (SELECT JSONB_AGG(JSONB_BUILD_OBJECT(
                'id', pv.id,
                'unitPrice', pv.unit_price,
                'purchasePrice', pv.purchase_price,
                'sizeId', pv.size_id,
                'colorId', pv.color_id,
                'material', pv.material,
                'image', pv.image,
                'default', pv.default,
                'stockQty', pv.stock_qty,
                'size', JSONB_BUILD_OBJECT('name', s.name),
                'color', JSONB_BUILD_OBJECT('name', cl.name, 'color', cl.color)
            )) FROM product_variants pv
            LEFT JOIN sizes s ON s.id = pv.size_id
            LEFT JOIN colors cl ON cl.id = pv.color_id
            WHERE pv.product_id = bp.id), '[]'
        ) AS "productVariants",
        JSONB_BUILD_OBJECT('name', bp.tax_name, 'value', bp.tax_value) AS "tax",
        JSONB_BUILD_OBJECT('id', bp.brand_id, 'name', bp.brand_name, 'slug', bp.brand_slug, 'image', bp.brand_image, 'status', bp.brand_status) AS "brand",
        COALESCE(
            (SELECT JSONB_AGG(JSONB_BUILD_OBJECT('categoryId', pc.category_id, 'category', JSONB_BUILD_OBJECT('id', c.id, 'name', c.name, 'slug', c.slug)))
             FROM product_categories pc
             JOIN categories c ON c.id = pc.category_id
             WHERE pc.product_id = bp.id), '[]'
        ) AS "productCategories",
        COALESCE(
            (SELECT JSONB_AGG(JSONB_BUILD_OBJECT(
                'id', r.id,
                'rating', r.rating,
                'like', r.like,
                'disLike', r.dis_like,
                'comment', r.comment,
                'user', JSONB_BUILD_OBJECT('name', u.name, 'image', u.image)
            )) FROM reviews r
            LEFT JOIN users u ON u.id = r.user_id
            WHERE r.product_id = bp.id AND r.status = 'Approved'), '[]'
        ) AS "reviews"
    FROM base_price bp;
  `;
  return { query, values };
};

export const singleDiscountQuery = (id: string) => {
  const values: any[] = [parseInt(id)];
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
        SELECT * FROM discounts WHERE id = $1
    ),
    targetProducts AS (
        SELECT DISTINCT p.product_id, p.name, p.slug, p.thumbnail_image, p.variant
        FROM discountInfo d
        JOIN productTable p ON
            (d.scope = 'Global')
            OR (d.scope = 'Products' AND EXISTS (SELECT 1 FROM applicable_products ap WHERE ap.discount_id = d.id AND ap.product_id = p.product_id))
            OR (d.scope = 'Brand' AND EXISTS (SELECT 1 FROM applicable_brands ab WHERE ab.discount_id = d.id AND ab.brand_id = p.brand_id))
            OR (d.scope = 'Category' AND EXISTS (SELECT 1 FROM applicable_categories ac WHERE ac.discount_id = d.id AND ac.category_id = p.category_id))
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
        COALESCE(
            (SELECT JSONB_AGG(JSONB_BUILD_OBJECT(
                'id', tp.product_id,
                'name', tp.name,
                'slug', tp.slug,
                'thumbnailImage', tp.thumbnail_image,
                'variant', tp.variant,
                'reviewsCount', rt.reviews_count,
                'avgRating', rt.average_rating
            )) FROM targetProducts tp
            LEFT JOIN reviewsTable rt ON rt.product_id = tp.product_id), '[]'
        ) AS products
    FROM discountInfo d;
  `;
  return { query, values };
};
