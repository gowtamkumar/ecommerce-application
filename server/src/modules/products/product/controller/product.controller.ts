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
import { productsQuery } from "../../../../sqlQuery";

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

    restData.slug = (restData.slug ? restData.slug : restData.name)
      .toLowerCase()
      .trim()
      .split(" ")
      .join("-");

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
export const getPublicProducts = async (req: Request, res: Response) => {
  logger.info(`Service: getPublicProducts ${req.method} ${req.url}`);
  const connection = await getDBConnection();
  const { page = 1, perPage = 12 } = req.query;

  const query = await productsQuery(req.query);

  const products = await connection.query(query);
  // Calculate total and totalPages
  const total = products.length > 0 ? products[0].total : 0;
  const totalPages = Math.ceil(total / +perPage);

  return res.status(200).json({
    success: true,
    message: "Get products successfully",
    total,
    page,
    perPage,
    totalPages,
    currentPage: +page,
    data: products,
  });
};

// @desc Get a single Product
// @route GET /api/v1/products/:id
// @access Public
export const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getProduct ${req.method} ${req.url}`);

    const { id } = req.params;

    const connection = await getDBConnection();
    const productRepository = connection.getRepository(ProductEntity);
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
      "discount.discountStrategy",
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

    qb.where({ id });

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

// @desc Get a single Product by slug
// @route GET /api/v1/products/slug/:slug
// @access Public
export const getProductByslug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getProductByslug ${req.method} ${req.url}`);

    const { slug } = req.params;
    const productVariantId = Number(req.query.productVariantId) || null;

    const connection = await getDBConnection();

    const result = await connection.query(
      `
      WITH productTable AS (
        SELECT 
          p.id AS product_id,
          p.name,
          p.slug,
          p.thumbnail_image,
          p.hover_image,
          p.images,
          p.variant,
          p.description,
          p.short_description,
          p.enable_review,
          p.limit_purchase_qty,
          p.tags,
          p.tax_id,
          p.brand_id,
          COALESCE(pv.id, dpv.id) AS product_variant_id,
          COALESCE(pv.unit_price, dpv.unit_price) AS unit_price
        FROM products p
        LEFT JOIN LATERAL (
          SELECT pv.id, pv.unit_price
          FROM product_variants pv
          WHERE pv.product_id = p.id AND pv.id = $2
          LIMIT 1
        ) pv ON true
        LEFT JOIN LATERAL (
          SELECT pv.id, pv.unit_price
          FROM product_variants pv
          WHERE pv.product_id = p.id AND pv.default = true
          ORDER BY pv.id
          LIMIT 1
        ) dpv ON true
        WHERE p.slug = $1 AND p.status = 'Active'
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
        SELECT DISTINCT ON (p.id) 
          p.id AS product_id,  
          dis.discount_strategy,
          dis.value AS discount_value,
          dis.promotion_type
        FROM products p
        LEFT JOIN discounts dis ON (
            (dis.scope = 'Products' AND EXISTS (
                SELECT 1 FROM applicable_products ap WHERE ap.product_id = p.id AND ap.discount_id = dis.id
            )) OR
            (dis.scope = 'Category' AND EXISTS (
                SELECT 1 FROM product_categories pc WHERE pc.product_id = p.id 
                AND pc.category_id IN (
                    SELECT category_id FROM applicable_categories WHERE discount_id = dis.id
                )
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
      )
      SELECT 
        p.product_id AS "id",
        p.name,
        p.slug,
        p.variant,
        p.thumbnail_image AS "thumbnailImage",
        p.hover_image AS "hoverImage",
        p.images,
        p.product_variant_id AS "productVariantId",
        p.description,
        p.short_description AS "shortDescription",
        p.enable_review AS "enableReview",
        p.limit_purchase_qty AS "limitPurchaseQty",
        p.tags,
        sd.discount_strategy AS "discountStrategy",
        sd.discount_value AS "discountValue",
        rt.reviews_count AS "reviewsCount",
        rt.average_rating AS "avgRating",
        ROUND(
            ((p.unit_price) + 
            ((CASE 
                WHEN sd.discount_strategy = 'Percentage' THEN 
                    p.unit_price - (p.unit_price * sd.discount_value / 100)
                WHEN sd.discount_strategy = 'Fixed' THEN 
                    p.unit_price - sd.discount_value
                ELSE 
                    p.unit_price
            END) * COALESCE(t.value, 0) / 100)), 
        2) AS "salePrice",
        ROUND((
          CASE 
            WHEN sd.discount_strategy = 'Percentage' THEN p.unit_price - (p.unit_price * sd.discount_value / 100)
            WHEN sd.discount_strategy = 'Fixed' THEN p.unit_price - sd.discount_value
            ELSE p.unit_price
          END
        ) + (
          CASE 
            WHEN sd.discount_strategy = 'Percentage' THEN p.unit_price - (p.unit_price * sd.discount_value / 100)
            WHEN sd.discount_strategy = 'Fixed' THEN p.unit_price - sd.discount_value
            ELSE p.unit_price
          END * COALESCE(t.value, 0) / 100
        ), 2) AS "finalPrice",
        COALESCE(
          JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'id', pv.id,
              'unitPrice', pv.unit_price,
              'sizeId', pv.size_id,
              'colorId', pv.color_id,
              'material', pv.material,
              'image', pv.image,
              'default', pv.default,
              'stockQty', pv.stock_qty,
              'size', JSONB_BUILD_OBJECT('name', s.name),
              'color', JSONB_BUILD_OBJECT('name', colors.name, 'color', colors.color)
            )
          ) FILTER (WHERE pv.id IS NOT NULL), '[]' 
        ) AS "productVariants",
        JSONB_BUILD_OBJECT('name', t.name, 'value', t.value) AS "tax",
        JSONB_BUILD_OBJECT('name', b.name, 'slug', b.slug, 'image', b.image, 'status', b.status) AS "brand",
        JSONB_AGG(
          JSONB_BUILD_OBJECT('category', JSONB_BUILD_OBJECT('name', c.name, 'slug', c.slug))
        ) FILTER (WHERE pc.product_id IS NOT NULL) AS "productCategories",
        COALESCE(
          JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'id', r.id,
              'rating', r.rating,
              'like', r.like,
              'disLike', r.dis_like,
              'comment', r.comment
            )
          ) FILTER (WHERE r.status = 'Approved'), '[]'
        ) AS "reviews"
      FROM productTable p
      LEFT JOIN selectedDiscount sd ON sd.product_id = p.product_id
      LEFT JOIN reviewsTable rt ON rt.product_id = p.product_id
      LEFT JOIN taxs t ON t.id = p.tax_id
      LEFT JOIN product_categories pc ON pc.product_id = p.product_id
      LEFT JOIN categories c ON c.id = pc.category_id
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN product_variants pv ON pv.product_id = p.product_id
      LEFT JOIN sizes s ON s.id = pv.size_id
      LEFT JOIN colors ON colors.id = pv.color_id
      LEFT JOIN reviews r ON r.product_id = p.product_id
      GROUP BY 
        sd.discount_strategy, sd.discount_value,p.variant,
        p.product_id, p.name, p.slug, p.thumbnail_image, p.hover_image, p.product_variant_id, p.description, 
        p.short_description, p.enable_review, p.limit_purchase_qty, p.tags, rt.reviews_count, 
        rt.average_rating, t.name, t.value, b.id, b.image, b.status, b.name, p.unit_price, p.images;
      `,
      [slug, productVariantId]
    );

    if (!result[0]) {
      return res.status(404).json({
        success: false,
        message: `Resource not found with slug #${slug}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Fetched product with slug #${slug}`,
      data: result[0],
    });
  }
);

// export const getProductByslug = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     logger.info(`Service: getProductByslug ${req.method} ${req.url}`);

//     const { slug } = req.params;
//     const productVariantid = 7;
//     const connection = await getDBConnection();

//     const result = await connection.query(
//       `
//       WITH productTable AS (
//       SELECT
//           p.*,
//           p.id AS product_id,
//           pv.id AS product_variant_id,
//           pv.unit_price,
//           pv.purchase_price
//       FROM products p
//       LEFT JOIN LATERAL (
//           SELECT pv.id, pv.unit_price, pv.purchase_price
//           FROM product_variants pv
//           WHERE pv.product_id = p.id  ${
//             productVariantid ? `AND pv.id = ${productVariantid}` : ""
//           }
//           ORDER BY  pv.id ${productVariantid ? "" : `,pv.default`}  DESC
//           LIMIT 1
//       ) pv ON true
//       WHERE p.slug = $1
//   ),
//   reviewsTable AS (
//       SELECT
//           product_id,
//           COUNT(*) AS reviews_count,
//           COALESCE(AVG(CAST(rating AS FLOAT)), 0) AS average_rating
//       FROM reviews
//       GROUP BY product_id
//   ),
//   selectedDiscount AS (
//       SELECT DISTINCT ON (p.id)
//           p.id AS product_id,
//           dis.id AS discount_id,
//           dis.discount_strategy,
//           dis.value AS discount_value,
//           dis.scope,
//           dis.promotion_type
//       FROM products p
//       LEFT JOIN discounts dis ON (
//           (dis.scope = 'Products' AND EXISTS (
//               SELECT 1 FROM applicable_products ap WHERE ap.product_id = p.id AND ap.discount_id = dis.id
//           )) OR
//           (dis.scope = 'Category' AND EXISTS (
//               SELECT 1 FROM product_categories pc WHERE pc.product_id = p.id
//               AND pc.category_id IN (
//                   SELECT category_id FROM applicable_categories WHERE discount_id = dis.id
//               )
//           )) OR
//           (dis.scope = 'Brand' AND EXISTS (
//               SELECT 1 FROM applicable_brands ab WHERE ab.brand_id = p.brand_id AND ab.discount_id = dis.id
//           )) OR
//           (dis.scope = 'Global') OR
//           (dis.scope = 'Product' AND p.discount_id = dis.id)
//       )
//       WHERE
//           ((dis.start_date <= NOW() AND dis.end_date >= NOW()) OR dis.id = p.discount_id)
//           AND dis.status = 'Active'
//       ORDER BY p.id, dis.priority DESC, dis.value DESC
//   )
//   SELECT
//       p.product_id AS "id",
//       p.name,
//       p.slug,
//       p.thumbnail_image AS "thumbnailImage",
//       p.hover_image AS "hoverImage",
//       p.images,
//       p.unit_price AS "unitPrice",
//       p.purchase_price AS "purchasePrice",
//       p.product_variant_id AS "productVariantId",
//       p.description,
//       p.short_description AS "shortDescription",
//       p.enable_review AS "enableReview",
//       p.limit_purchase_qty AS "limitPurchaseQty",
//       p.alert_qty AS "alertQty",
//       p.tags,
//       sd.discount_id as "discountId",
//       sd.discount_strategy AS "discountStrategy",
//       sd.discount_value AS "discountValue",
//       sd.scope,
//       sd.promotion_type AS "promotionType",
//       rt.reviews_count AS "reviewsCount",
//       rt.average_rating AS "avgRating",
//       -- ✅ Calculate tax amount based on the discounted price
//     ROUND(
//         ((CASE
//             WHEN sd.discount_strategy = 'Percentage' THEN
//                 pv.unit_price - (pv.unit_price * sd.discount_value / 100)
//             WHEN sd.discount_strategy = 'Fixed' THEN
//                 pv.unit_price - sd.discount_value
//             ELSE
//                 pv.unit_price
//         END) * COALESCE(t.value, 0) / 100),
//     2) AS "taxAmount",

//       ROUND(
//           CASE
//               WHEN sd.discount_strategy = 'Percentage' THEN
//                   p.unit_price - (p.unit_price * sd.discount_value / 100)
//               WHEN sd.discount_strategy = 'Fixed' THEN
//                   p.unit_price - sd.discount_value
//               ELSE
//                   p.unit_price
//           END,
//           2
//       ) AS "discountedPrice",
//       -- Product Variants as JSONB array
//       COALESCE(
//           JSONB_AGG(
//               JSONB_BUILD_OBJECT(
//                   'id', pv.id,
//                   'unitPrice', pv.unit_price,
//                   'purchasePrice', pv.purchase_price,
//                   'sizeId', pv.size_id,
//                   'colorId', pv.color_id,
//                   'material', pv.material,
//                   'image', pv.image,
//                   'default', pv.default,
//                   'stockQty', pv.stock_qty,
//                   'size', JSONB_BUILD_OBJECT(
//                       'name', s.name
//                   ),
//                   'color', JSONB_BUILD_OBJECT(
//                       'name', colors.name
//                   )
//               )
//           ) FILTER (WHERE pv.id IS NOT NULL), '[]'
//       ) AS "productVariants",
//       -- Tax object
//       JSONB_BUILD_OBJECT(
//           'name', t.name,
//           'value', t.value
//       ) AS "tax",
//       -- Brand object
//       JSONB_BUILD_OBJECT(
//           'id', b.id,
//           'name', b.name,
//           'image', b.image,
//           'status', b.status
//       ) AS "brand",
//       -- Categories as JSONB array
//       JSONB_AGG(
//           JSONB_BUILD_OBJECT(
//               'categoryId', pc.category_id,
//               'category', JSONB_BUILD_OBJECT(
//                   'id', c.id,
//                   'name', c.name
//               )
//           )
//       ) FILTER (WHERE pc.product_id IS NOT NULL) AS "productCategories",
//       -- Reviews as JSONB array
//       COALESCE(
//           JSONB_AGG(
//               JSONB_BUILD_OBJECT(
//                   'id', r.id,
//                   'rating', r.rating,
//                   'like', r.like,
//                   'disLike', r.dis_like,
//                   'comment', r.comment
//               )
//           ) FILTER (WHERE r.product_id = p.product_id AND r.status = 'Approved'), '[]'
//       ) AS "reviews"
//   FROM
//       productTable p
//   LEFT JOIN
//       selectedDiscount sd ON sd.product_id = p.product_id
//   LEFT JOIN
//       reviewsTable rt ON rt.product_id = p.product_id
//   LEFT JOIN
//       taxs t ON t.id = p.tax_id
//   LEFT JOIN
//       product_categories pc ON pc.product_id = p.product_id
//   LEFT JOIN
//       categories c ON c.id = pc.category_id
//   LEFT JOIN
//       brands b ON b.id = p.brand_id
//   LEFT JOIN
//       product_variants pv ON pv.product_id = p.product_id
//   LEFT JOIN
//       sizes s ON s.id = pv.size_id
//   LEFT JOIN
//       colors ON colors.id = pv.size_id
//   LEFT JOIN
//       reviews r ON r.product_id = p.product_id
//   GROUP BY
//       sd.discount_id, sd.discount_strategy, sd.discount_value, sd.scope, sd.promotion_type,
//       p.product_id, p.name, p.slug, p.thumbnail_image, p.hover_image, p.product_variant_id, p.description, p.short_description,
//       p.alert_qty, p.enable_review,p.limit_purchase_qty,p.tags,pv.unit_price,
//       p.variant, p.featured, rt.reviews_count, rt.average_rating, t.value, p.unit_price, p.purchase_price,
//       p.images, t.name, t.value, b.id, b.image, b.status, b.name;
//       `,
//       [slug]
//     );

//     if (!result[0]) {
//       return res.status(404).json({
//         success: false,
//         message: `Resource not found with slug #${slug}`,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: `Fetched product with slug #${slug}`,
//       data: result[0],
//     });
//   }
// );

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
      "discount.discountStrategy",
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

    const { productVariants, productCategories, ...restData } = validation.data;

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
            await repoProductVariant.save({
              ...item,
              purchasePrice: +item.purchasePrice,
              unitPrice: +item.unitPrice,
            });
          } else {
            const productVariantCreate = repoProductVariant.create({
              unitPrice: +item.unitPrice,
              purchasePrice: +item.purchasePrice,
              productId: id,
              ...item,
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
