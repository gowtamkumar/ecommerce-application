import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../../middlewares/async.middleware";
import { ProductEntity } from "../model/product.entity";
import { getDBConnection } from "../../../../config/db";
import { productValidationSchema } from "../../../../validation";
import { ProductVariantEntity } from "../../product-variant/model/product-variant.entity";
import { ProductCategoryEntity } from "../../product-category/model/product-category.entity";
import { Brackets } from "typeorm";
import { updateProductValidationSchema } from "../../../../validation/products/product/updateProductValidation";
import { logger } from "../../../../middlewares/logger";
import { fileDeleteFunction } from "../../../../utils/fileDeleteFunction";
import { CustomRequest } from "../../../../enums/custom-request-type";
import { DiscountEntity } from "../../../discount/model/discount.entity";

// @desc Create a Product
// @route POST /api/v1/products
// @access Public
export const createProduct = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    logger.info(`Service: createProduct ${req.method} ${req.url}`);

    // Validate request body
    const validation = productValidationSchema.safeParse({
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
    const productRepository = connection.getRepository(ProductEntity);

    const { productVariants, productCategories, ...restData } = validation.data;
    // // Generate URL slug
    // const count = (await productRepository.count()) + 1;
    // const sku = `SKU-${count.toString().padStart(6, "0")}`;

    // Create product entity
    const product = productRepository.create(restData);

    // Save product to database
    const savedProduct = await productRepository.save(product);
    // Prepare promises for saving product variants and categories
    const promises = [];

    if (productVariants) {
      const productVariantRepository =
        connection.getRepository(ProductVariantEntity);
      const productVariantEntities = productVariants.map((variant) => ({
        ...variant,
        productId: savedProduct.id,
      }));
      promises.push(productVariantRepository.save(productVariantEntities));
    }

    // if (productColors) {
    //   const productColorRepository =
    //     connection.getRepository(ProductColorEntity);
    //   const productColorEntities = productColors.map((color, idx: number) => ({
    //     colorId: +color,
    //     default: idx === 0 ? true : false,
    //     productId: savedProduct.id,
    //   }));
    //   promises.push(productColorRepository.save(productColorEntities));
    // }

    if (productCategories) {
      const productCategoryRepository = connection.getRepository(
        ProductCategoryEntity
      );
      const productCategoryEntities = productCategories.map((item) => ({
        categoryId: +item,
        productId: savedProduct.id,
      }));
      promises.push(productCategoryRepository.save(productCategoryEntities));
    }

    // Execute all promises concurrently
    await Promise.all(promises);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  }
);

// @desc Get all Products
// @route GET /api/v1/products
// @access Public
export const getProducts = async (req: Request, res: Response) => {
  logger.info(`Service: getProducts ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const {
    search,
    lowPrice,
    highPrice,
    brandId,
    colorId,
    categoryId,
    minPrice,
    maxPrice,
    discount,
    page = 1,
    limit = 10,
  } = req.query;

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
  const colorFilter = parseFilter(colorId);

  const products = await connection.query(
    `
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
)
SELECT 
    p.product_id AS "id",
    p.name,
    p.slug,
    p.thumbnail_image as "thumbnailImage", -- ✅ Use the correct alias with double quotes
    p.hover_image as  "hoverImage", -- ✅ Use the correct alias with double quotes
    p.variant,
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
    ROUND(SUM((p.unit_price * COALESCE(t.value, 0)) / 100), 2) AS "taxAmount",
    
    -- Calculate Discounted Price
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
        selectedDiscount sd ON sd.product_id = p.product_id
    LEFT JOIN 
        reviewsTable rt ON rt.product_id = p.product_id
    LEFT JOIN 
        taxs t ON t.id = p.tax_id

      LEFT JOIN 
          product_categories pc ON pc.product_id = p.product_id
      LEFT JOIN 
          brands b ON b.id = p.brand_id   
    WHERE 1=1
        ${
          categoryFilter.length
            ? `AND pc.category_id IN (${categoryFilter.join(",")})`
            : ""
        }
        ${
          brandFilter.length
            ? `AND p.brand_id IN (${brandFilter.join(",")})`
            : ""
        }
        ${
          minPrice && maxPrice
            ? `AND p.unit_price BETWEEN ${minPrice} AND ${maxPrice}`
            : ""
        }
        ${discount ? `AND dis.value BETWEEN 0 AND ${discount}` : ""}
        ${
          search
            ? `
          AND (
            LOWER(p.name) ILIKE LOWER('%${search}%') OR
            LOWER(p.description) ILIKE LOWER('%${search}%') OR
            LOWER(p.short_description) ILIKE LOWER('%${search}%')
          )
        `
            : ""
        }

    GROUP BY 
        sd.discount_id, sd.discount_strategy, sd.discount_value, sd.scope, sd.promotion_type,
        p.product_id, p.name, p.slug, p.thumbnail_image, p.hover_image, p.product_variant_id,
        p.variant, p.featured, rt.reviews_count, rt.average_rating, t.value, p.unit_price, p.purchase_price
      ${lowPrice ? "ORDER BY p.unit_price ASC" : ""}
      ${
        highPrice && !lowPrice ? "ORDER BY p.unit_price DESC" : ""
      } -- ✅ Avoids duplicate ORDER BY
      LIMIT ${limit} OFFSET ${(+page - 1) * +limit} -- ✅ Better pagination
    `
  );

  return res.status(200).json({
    success: true,
    message: "Get product successfully",
    totalCount: products.length,
    data: products,
  });
};

// @desc Get all Products
// @route GET /api/v1/products
// @access Public
export const getProductsOld = async (req: Request, res: Response) => {
  logger.info(`Service: getProducts ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const {
    search,
    lowPrice,
    highPrice,
    brandId,
    colorId,
    categoryId,
    minPrice,
    maxPrice,
    discount,
    page = 1,
    limit = 10,
  } = req.query;

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
  const colorFilter = parseFilter(colorId);

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
        dis.discount_strategy AS "discountType",
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
      LEFT JOIN 
        product_categories pc ON pc.product_id = p.id
      LEFT JOIN 
        brands b ON b.id = p.brand_id
      WHERE 1=1
        ${
          categoryFilter.length
            ? `AND pc.category_id IN (${categoryFilter.join(",")})`
            : ""
        }
        ${
          brandFilter.length
            ? `AND p.brand_id IN (${brandFilter.join(",")})`
            : ""
        }
        ${
          minPrice && maxPrice
            ? `AND p.unit_price BETWEEN ${minPrice} AND ${maxPrice}`
            : ""
        }
        ${discount ? `AND dis.value BETWEEN 0 AND ${discount}` : ""}
        ${
          search
            ? `
          AND (
            LOWER(p.name) ILIKE LOWER('%${search}%') OR
            LOWER(p.description) ILIKE LOWER('%${search}%') OR
            LOWER(p.short_description) ILIKE LOWER('%${search}%')
          )
        `
            : ""
        }
      
      GROUP BY 
        p.id, p.name, p.thumbnail_image, p.hover_image, p.variant, p.discount_id, p.featured, 
        p.unit_price, p.purchase_price, p.product_variant_id, p.slug,
        rt.reviews_count, rt.average_rating, taxs.value, dis.discount_strategy, dis.value
      ${lowPrice ? "ORDER BY p.unit_price ASC" : ""}
      ${highPrice ? "ORDER BY p.unit_price DESC" : ""}
      ${page && limit ? `OFFSET ${(+page - 1) * +limit} LIMIT ${limit}` : ""}
    `
  );

  return res.status(200).json({
    success: true,
    message: "Get product filter data",
    totalCount: products.length,
    data: products,
  });
};

// @desc Get all Products
// @route GET /api/v1/products
// @access Public
export const getDashboardProducts = async (req: Request, res: Response) => {
  logger.info(`Service: getDashboardProducts ${req.method} ${req.url}`);
  const connection = await getDBConnection();
  const productRepository = connection.getRepository(ProductEntity);
  const {
    search,
    lowPrice,
    highPrice,
    brandId,
    status,
    categoryId,
    minPrice,
    maxPrice,
    discount,
  } = req.query;

  try {
    const qb = productRepository.createQueryBuilder("product");
    qb.select([
      "product",
      "user.id",
      "user.name",
      "brand.id",
      "brand.name",
      "reviews.id",
      "reviews.rating",
      "reviews.comment",
      "tax.name",
      "tax.value",
      "productVariants",
      "productCategories",
      "category.id",
      "category.name",
      "size.name",
      "color.name",
      "discount.discountType",
      "discount.value",
    ]);
    qb.leftJoin("product.user", "user");
    qb.leftJoin("product.brand", "brand");
    qb.leftJoin("product.reviews", "reviews");
    qb.leftJoin("product.tax", "tax");
    qb.leftJoin("product.discount", "discount");
    qb.leftJoin("product.productVariants", "productVariants");
    qb.leftJoin("product.productCategories", "productCategories");
    qb.leftJoin("productCategories.category", "category");
    qb.leftJoin("productVariants.size", "size");
    qb.leftJoin("productVariants.color", "color");
    qb.orderBy("productVariants.id", "DESC");
    qb.addOrderBy("product.slug", "ASC");

    if (status) qb.andWhere({ status });

    if (categoryId)
      qb.andWhere("productCategories.categoryId IN (:...categoryIds)", {
        categoryIds: categoryId.toString().split(","),
      });

    if (brandId)
      qb.andWhere("product.brandId IN (:...brandIds)", {
        brandIds: brandId.toString().split(","),
      });

    if (minPrice && maxPrice)
      qb.andWhere(
        `productVariants.unit_price BETWEEN ${minPrice} AND ${maxPrice}`
      );

    if (discount) qb.andWhere(`discount.value BETWEEN 0 AND ${discount}`);

    // if (discount) qb.andWhere(`discount.value = :value`, { value: discount });

    if (lowPrice) qb.orderBy("productVariants.unit_price", "ASC");
    if (highPrice) qb.orderBy("productVariants.unit_price", "DESC");

    if (search) {
      qb.andWhere(
        new Brackets((db) => {
          db.orWhere("LOWER(product.name) ILIKE LOWER(:search)", {
            search: `%${search}%`,
          });
          db.orWhere("LOWER(product.description) ILIKE LOWER(:search)", {
            search: `%${search}%`,
          });
          db.orWhere("LOWER(product.shortDescription) ILIKE LOWER(:search)", {
            search: `%${search}%`,
          });
          db.orWhere("LOWER(brand.name) ILIKE LOWER(:search)", {
            search: `%${search}%`,
          });
        })
      );
    }

    const results = await qb.getMany();

    res.status(200).json({
      success: true,
      message: "Fetched all products successfully",
      totalItem: results.length,
      data: results,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the products.",
      error: error.message,
    });
  }
};

// @desc Get a single Product
// @route GET /api/v1/products/:id
// @access Public
export const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getProduct ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();

    const result = await connection.query(
      `
     WITH productTable AS (
    SELECT 
        p.*,
        p.id AS product_id,
        pv.*,
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
    WHERE p.id = $1
),
reviewsTable AS (
    SELECT 
        product_id,
        COUNT(*) AS reviews_count,
        COALESCE(AVG(CAST(rating AS FLOAT)), 0) AS average_rating
    FROM reviews
    WHERE product_id = $1
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
    WHERE p.id = $1
    ORDER BY p.id, dis.priority DESC, dis.discount_value DESC
)
SELECT 
    p.product_id AS "id",
    p.name,
    p.slug,
    p.thumbnail_image AS "thumbnailImage",
    p.hover_image AS "hoverImage",
    p.images,
    p.variant,
    p.featured,
    p.unit_price AS "unitPrice",
    p.purchase_price AS "purchasePrice",
    p.product_variant_id AS "productVariantId",
    p.description,
    p.short_description as "shortDescription",
    p.enable_review as "enableReview",
    p.limit_purchase_qty as "limitPurchaseQty",
    p.alert_qty as "alertQty",
    p.tags,
    sd.discount_id AS "discountId",
    sd.discount_strategy AS "discountStrategy",
    sd.discount_value AS "discountValue",
    sd.scope,
    sd.promotion_type AS "promotionType",
    rt.reviews_count AS "reviewsCount",
    rt.average_rating AS "avgRating",
    b.name AS "brandName",
    ROUND(SUM((p.unit_price * COALESCE(t.value, 0)) / 100), 2) AS "taxAmount",
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
  -- Fetch all product variants as JSON array
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', pv.id,
                'sku', pv.sku,
                'unitPrice', pv.unit_price,
                'purchasePrice', pv.purchase_price,
                'productId', pv.product_id,
                'sizeId', pv.size_id,
                'colorId', pv.color_id,
                'material', pv.material,
                'image', pv.image,
                'default', pv.default,
                'stockQty', pv.stock_qty,
                 'size', JSON_BUILD_OBJECT(
                    'id', s.id,
                    'name', s.name
                ),
                'color', JSON_BUILD_OBJECT(
                    'name', colors.name
                )
            )
        ) FILTER (WHERE pv.id IS NOT NULL), '[]' 
    ) AS "productVariants",
    -- Tax object
    json_build_object(
        'name', t.name,
        'value', t.value
    ) AS "tax",
        -- brand object
            json_build_object(
                'id', b.id,
                'name', b.name,
                'image', b.image,
                'status', b.status
            ) AS "brand", 
    -- Categories as JSON array
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'categoryId', pc.category_id,
            'productId', pc.product_id,
            'category', JSON_BUILD_OBJECT(
                'id', c.id,
                'name', c.name
            )
        )
    ) FILTER (WHERE pc.product_id IS NOT NULL) AS "productCategories",
    -- Reviews as JSON array (proper join to fetch reviews)
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', r.id,
                'rating', r.rating,
                'comment', r.comment
            )
        ) FILTER (WHERE r.product_id = p.product_id AND r.status = 'Approved'), '[]'
    ) AS "reviews"
FROM 
    productTable p
LEFT JOIN 
    selectedDiscount sd ON sd.product_id = p.product_id
LEFT JOIN 
    reviews r ON r.product_id = p.product_id  -- Ensure proper join here
LEFT JOIN 
    reviewsTable rt ON rt.product_id = p.product_id

LEFT JOIN 
    taxs t ON t.id = p.tax_id
LEFT JOIN 
    product_categories pc ON pc.product_id = p.product_id
LEFT JOIN 
    categories c ON c.id = pc.category_id
LEFT JOIN 
    brands b ON b.id = p.brand_id   
LEFT JOIN 
    product_variants pv ON pv.product_id = p.product_id
LEFT JOIN
   sizes s ON s.id = pv.size_id
LEFT JOIN
   colors ON colors.id = pv.size_id
GROUP BY 
    sd.discount_id, sd.discount_strategy, sd.discount_value, sd.scope, sd.promotion_type,
    p.product_id, p.name, p.slug, p.thumbnail_image, p.hover_image, p.product_variant_id, p.description, p.short_description,
    p.alert_qty, p.enable_review,p.limit_purchase_qty,p.tags,
    p.variant, p.featured, rt.reviews_count, rt.average_rating, t.value, p.unit_price, p.purchase_price, b.name,
    p.images, t.name, t.value, b.id, b.image, b.status, b.name;
      `,
      [id]
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Resource not found with id #${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Fetched product with id #${id}`,
      data: result,
    });
  }
);

// @desc Get a single Product
// @route GET /api/v1/products/:id
// @access Public
// @desc Get a single Product by slug
// @route GET /api/v1/products/:slug
// @access Public
export const getProductByslug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getProduct ${req.method} ${req.url}`);

    const { slug } = req.params;
    const connection = await getDBConnection();

    const result = await connection.query(
      `
     WITH productTable AS (
    SELECT 
        p.*,
        p.id AS product_id,
        pv.*,
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
    WHERE p.slug = $1  -- Change this line to match the slug
),
reviewsTable AS (
    SELECT 
        product_id,
        COUNT(*) AS reviews_count,
        COALESCE(AVG(CAST(rating AS FLOAT)), 0) AS average_rating
    FROM reviews
    WHERE product_id = $1
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
    WHERE p.slug = $1 -- Change this line to match the slug
    ORDER BY p.id, dis.priority DESC, dis.discount_value DESC
)
SELECT 
    p.product_id AS "id",
    p.name,
    p.slug,
    p.thumbnail_image AS "thumbnailImage",
    p.hover_image AS "hoverImage",
    p.images,
    p.variant,
    p.featured,
    p.unit_price AS "unitPrice",
    p.purchase_price AS "purchasePrice",
    p.product_variant_id AS "productVariantId",
    p.description,
    p.short_description as "shortDescription",
    p.enable_review as "enableReview",
    p.limit_purchase_qty as "limitPurchaseQty",
    p.alert_qty as "alertQty",
    p.tags,
    sd.discount_id AS "discountId",
    sd.discount_strategy AS "discountStrategy",
    sd.discount_value AS "discountValue",
    sd.scope,
    sd.promotion_type AS "promotionType",
    rt.reviews_count AS "reviewsCount",
    rt.average_rating AS "avgRating",
    b.name AS "brandName",
    ROUND(SUM((p.unit_price * COALESCE(t.value, 0)) / 100), 2) AS "taxAmount",
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
    -- Fetch all product variants as JSON array
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', pv.id,
                'sku', pv.sku,
                'unitPrice', pv.unit_price,
                'purchasePrice', pv.purchase_price,
                'productId', pv.product_id,
                'sizeId', pv.size_id,
                'colorId', pv.color_id,
                'material', pv.material,
                'image', pv.image,
                'default', pv.default,
                'stockQty', pv.stock_qty,
                'size', JSON_BUILD_OBJECT(
                    'id', s.id,
                    'name', s.name
                ),
                'color', JSON_BUILD_OBJECT(
                    'name', colors.name
                )
            )
        ) FILTER (WHERE pv.id IS NOT NULL), '[]' 
    ) AS "productVariants",
    -- Tax object
    json_build_object(
        'name', t.name,
        'value', t.value
    ) AS "tax",
    -- brand object
    json_build_object(
        'id', b.id,
        'name', b.name,
        'image', b.image,
        'status', b.status
    ) AS "brand", 
    -- Categories as JSON array
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'categoryId', pc.category_id,
            'productId', pc.product_id,
            'category', JSON_BUILD_OBJECT(
                'id', c.id,
                'name', c.name
            )
        )
    ) FILTER (WHERE pc.product_id IS NOT NULL) AS "productCategories",
    -- Reviews as JSON array (proper join to fetch reviews)
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', r.id,
                'rating', r.rating,
                'comment', r.comment
            )
        ) FILTER (WHERE r.product_id = p.product_id AND r.status = 'Approved'), '[]'
    ) AS "reviews"
FROM 
    productTable p
LEFT JOIN 
    selectedDiscount sd ON sd.product_id = p.product_id
LEFT JOIN 
    reviews r ON r.product_id = p.product_id  -- Ensure proper join here
LEFT JOIN 
    reviewsTable rt ON rt.product_id = p.product_id
LEFT JOIN 
    taxs t ON t.id = p.tax_id
LEFT JOIN 
    product_categories pc ON pc.product_id = p.product_id
LEFT JOIN 
    categories c ON c.id = pc.category_id
LEFT JOIN 
    brands b ON b.id = p.brand_id   
LEFT JOIN 
    product_variants pv ON pv.product_id = p.product_id
LEFT JOIN
   sizes s ON s.id = pv.size_id
LEFT JOIN
   colors ON colors.id = pv.size_id
GROUP BY 
    sd.discount_id, sd.discount_strategy, sd.discount_value, sd.scope, sd.promotion_type,
    p.product_id, p.name, p.slug, p.thumbnail_image, p.hover_image, p.product_variant_id, p.description, p.short_description,
    p.alert_qty, p.enable_review,p.limit_purchase_qty,p.tags,
    p.variant, p.featured, rt.reviews_count, rt.average_rating, t.value, p.unit_price, p.purchase_price, b.name,
    p.images, t.name, t.value, b.id, b.image, b.status, b.name;
      `,
      [slug]
    );

    if (!result || result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Resource not found with slug #${slug}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Fetched product with slug #${slug}`,
      data: result.rows[0],  // Since result.rows will contain an array of results, get the first row
    });
  }
);

export const getProductOld = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getProduct ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = connection.getRepository(ProductEntity);

    const qb = repository.createQueryBuilder("product");
    qb.select([
      "product",
      "user.id",
      "user.name",
      "reviewUser.name",
      "brand",
      "reviews.id",
      "reviews.rating",
      "reviews.comment",
      "reviews.like",
      "reviews.disLike",
      "tax",
      "productVariants",
      "category.id",
      "category.name",
      "size.id",
      "size.name",
      "discount.discountStrategy",
      "discount.value",
      "productCategories",
      "color.name",
    ]);
    qb.leftJoin("product.user", "user");
    qb.leftJoin("product.brand", "brand");
    qb.leftJoin("product.reviews", "reviews");
    qb.leftJoin("reviews.user", "reviewUser");
    qb.leftJoin("product.tax", "tax");
    qb.leftJoin("product.discount", "discount");
    qb.leftJoin("product.productVariants", "productVariants");
    qb.leftJoin("product.productCategories", "productCategories");
    qb.leftJoin("productCategories.category", "category");
    qb.leftJoin("productVariants.size", "size");
    qb.leftJoin("productVariants.color", "color");
    qb.orderBy("productVariants.id", "DESC");
    qb.where("product.id = :id", { id });

    const result = await qb.getOne();

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Resource not found with id #${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Fetched product with id #${id}`,
      data: result,
    });
  }
);

// @desc Get a single Product
// @route GET /api/v1/products/:id
// @access Public
export const getProductByslugOld = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getProductByslugOld ${req.method} ${req.url}`);

    const { slug } = req.params;
    const connection = await getDBConnection();
    const repository = connection.getRepository(ProductEntity);

    const qb = repository.createQueryBuilder("product");
    qb.select([
      "product.id",
      "product.name",
      "product.hoverImage",
      "product.images",
      "product.thumbnailImage",
      "product.limitPurchaseQty",
      "product.slug",
      "product.tags",
      "product.taxId",
      "product.variant",
      "product.shortDescription",
      "product.discountId",

      "brand.id",
      "brand.name",
      "brand.image",

      "reviewUser.name",
      "reviews.id",
      "reviews.rating",
      "reviews.comment",
      "reviews.like",
      "reviews.disLike",

      "tax.name",
      "tax.value",

      "productVariants.id",
      "productVariants.sizeId",
      "productVariants.default",
      "productVariants.purchasePrice",
      "productVariants.unitPrice",
      "productVariants.stockQty",

      "size.id",
      "size.name",

      "discount.discountType",
      "discount.value",
      "color.name",
    ]);
    qb.leftJoin("product.brand", "brand");
    qb.leftJoin("product.reviews", "reviews");
    qb.leftJoin("reviews.user", "reviewUser");
    qb.leftJoin("product.tax", "tax");
    qb.leftJoin("product.discount", "discount");
    qb.leftJoin("product.productVariants", "productVariants");
    qb.leftJoin("productVariants.size", "size");
    qb.leftJoin("productVariants.color", "color");
    qb.orderBy("productVariants.id", "DESC");
    qb.where({ slug });

    const result = await qb.getOne();

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Resource not found with id #${slug}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Fetched product with id #${slug}`,
      data: result,
    });
  }
);

// @desc Update a single Product
// @route PUT /api/v1/products/:id
// @access Public
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: updateProduct ${req.method} ${req.url}`);

    const { id } = req.params;
    // Validate request body
    const validation = updateProductValidationSchema.safeParse(req.body);
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

    const { productVariants, productCategories, ...restData } = req.body;
    // Get DB connection
    const connection = await getDBConnection();
    const repository = connection.getRepository(ProductEntity);

    // Find the existing product
    const product = await repository.findOneBy({ id });

    if (!product) {
      throw new Error(`Product not found`);
    }
    // Handle product variants
    let productVariantPromise = Promise.resolve();
    if (productVariants.length) {
      productVariantPromise = (async () => {
        const repoProductVariant =
          connection.getRepository(ProductVariantEntity);

        const productVariantItems = productVariants.map(async (item: any) => {
          if (item.id) {
            await repoProductVariant.save(item);
          } else {
            const productVariantCreate = repoProductVariant.create({
              ...item,
              productId: id,
            });
            await repoProductVariant.save(productVariantCreate);
          }
        });
      })();
    }

    // Handle product categories
    let productCategoryPromise = Promise.resolve();
    if (productCategories) {
      productCategoryPromise = (async () => {
        const repoPCategory = connection.getRepository(ProductCategoryEntity);

        const existingCategories = await repoPCategory.find({
          where: { productId: id },
        });

        if (existingCategories) {
          const res = await repoPCategory.remove(existingCategories);
        }

        const productCategoryItems = productCategories.map((item: number) => {
          return {
            categoryId: +item,
            productId: +id,
          };
        });
        await repoPCategory.save(productCategoryItems);
      })();
    }

    // Handle product color
    // let productColorPromise = Promise.resolve();
    // if (productColors) {
    //   productColorPromise = (async () => {
    //     const repoPCategory = connection.getRepository(ProductColorEntity);

    //     const existingColors = await repoPCategory.find({
    //       where: { productId: id },
    //     });

    //     await repoPCategory.remove(existingColors);

    //     const productCategoryItems = productColors.map((item: number) => ({
    //       colorId: item,
    //       productId: id,
    //     }));

    //     await repoPCategory.save(productCategoryItems);
    //   })();
    // }

    // Wait for both operations to complete
    await Promise.all([productVariantPromise, productCategoryPromise]);

    // Merge and save the updated product data
    const updatedProduct = repository.merge(product, restData);
    await repository.save(updatedProduct);

    return res.status(200).json({
      success: true,
      message: `Updated product with id ${id}`,
      data: updatedProduct,
    });

    // try {

    // } catch (error: any) {
    //   console.error("Error updating product:", error);
    //   return res.status(500).json({
    //     success: false,
    //     message: "An error occurred while updating the product.",
    //     error: error.message,
    //   });
    // }
  }
);

// @desc Get active Products
// @route GET /api/v1/products/active
// @access Public
// export const getActiveProducts = asyncHandler(
//   async (req: Request, res: Response) => {

//     const activeProduct = new ProductModel() as any;

//     const results = await activeProduct.findActive();

//     if (!results) {
//       throw new Error(`Resource not found`);
//     }
//     return res.status(200).json({
//       success: true,
//       message: `Get active products`,
//       data: results,
//     });
//   }
// );

// @desc Find Products by name
// @route GET /api/v1/products/findbyname
// @access Public
// export const getFindByName = asyncHandler(async (req: Request, res: Response) => {

//   const results = await ProductModel.findByName();
//   if (!results) {
//     throw new Error(`Resource not found`);
//   }
//   return res.status(200).json({
//     success: true,
//     message: `Find products by name`,
//     data: results,
//   });
// });

// @desc Query helper for Products
// @route GET /api/v1/products/queryhelper
// @access Public
// export const getQueryHelper = asyncHandler(async (req: Request, res: Response) => {
//   const product = new ProductModel() as any;

//   const results = product.find().queryhelper("react") as any;
//   if (!results) {
//     throw new Error(`Resource not found`);
//   }
//   return res.status(200).json({
//     success: true,
//     message: `Query by product name`,
//     data: results,
//   });
// });

// @desc Delete a single Product
// @route DELETE /api/v1/products/:id
// @access Public
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: deleteProduct ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const productRepository = await connection.getRepository(ProductEntity);

    // Check if the product exists
    const product = await productRepository.findOneBy({ id });
    if (!product) {
      throw new Error(`Product not found with id #${id}`);
    }

    // If there are images associated with the product, delete them
    if (product.images && product.images.length > 0) {
      fileDeleteFunction(product.images);
    }

    // Delete the product
    await productRepository.delete({ id });

    return res.status(200).json({
      success: true,
      message: `Product with id ${id} deleted successfully.`,
      data: product,
    });
  }
);
