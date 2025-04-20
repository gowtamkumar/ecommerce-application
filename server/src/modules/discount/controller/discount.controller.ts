import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { DiscountEntity } from "../model/discount.entity";
import { discountValidation } from "../../../validation";
import { updateDiscountValidation } from "../../../validation/discount/updateDiscountValidation";
import { logger } from "../../../middlewares/logger";
import { CustomRequest } from "../../../enums/custom-request-type";
import { ApplicableProductEntity } from "../model/applicable-products.entity";
import { ApplicableBrandEntity } from "../model/applicable-brand.entity";
import { ApplicableCategoryEntity } from "../model/applicable-category.entity";
import { Repository } from "typeorm";
import { ScopeEnum } from "../enum";

// @desc Get all Discounts
// @route GET /api/v1/Discounts
// @access Public
export const getDiscounts = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: getDiscounts ${req.method} ${req.url}`);

    const { scope } = req.query;
    const connection = await getDBConnection();
    const repository = connection.getRepository(DiscountEntity);
    const newQuery = {} as any;
    if (scope) newQuery.scope = scope;
    const result = await repository.find({
      where: newQuery,
    });
    return res.status(200).json({
      success: true,
      message: "Get all Discounts",
      data: result,
    });
  }
);

// @desc Get a single Discount
// @route GET /api/v1/Discounts/:id
// @access Public
export const getDiscount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getDiscount ${req.method} ${req.url}`);
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(DiscountEntity);

    const query = await repository.query(`
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
    (d.scope = 'Products' AND EXISTS (
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
  d.id AS "discountId",
  d.discount_strategy AS "discountStrategy",
  d.value AS "discountValue",
  d.scope,
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
GROUP BY d.id, d.discount_strategy, d.value, d.scope;

      `);

    // const result = await repository.findOne({
    //   where: { id },
    //   relations: [
    //     "applicableProducts",
    //     "applicableBrands",
    //     "applicableCategories",
    //   ],
    // });

    if (!query[0]) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Discount of id ${req.params.id}`,
      data: query[0],
      total: query[0].products?.length,
    });
  }
);

// @desc Create a single Discount
// @route POST /api/v1/Discounts
// @access Public
export const createDiscount = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    logger.info(`Service: createDiscount ${req.method} ${req.url}`);

    const validation = discountValidation.safeParse({
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
    const repository = connection.getRepository(DiscountEntity);

    const {
      applicableProducts,
      applicableBrands,
      applicableCategories,
      ...restData
    } = validation.data as any;

    const newDiscount = repository.create(restData);
    const saveDiscount = await repository.save(newDiscount);

    const promises = [];

    if (
      applicableProducts?.length > 0 &&
      validation.data.scope === ScopeEnum.Products
    ) {
      const applicationProductRepository = connection.getRepository(
        ApplicableProductEntity
      );
      const applicableProductEntities = applicableProducts.map(
        (item: number | string) => ({
          productId: item,
          discountId: saveDiscount.id,
        })
      );
      const createApplicableProduct = applicationProductRepository.create(
        applicableProductEntities
      );

      promises.push(applicationProductRepository.save(createApplicableProduct));
    }

    if (
      applicableBrands?.length > 0 &&
      validation.data.scope === ScopeEnum.Brand
    ) {
      const applicableBrandRepository = connection.getRepository(
        ApplicableBrandEntity
      );
      const applicableBrandEntities = applicableBrands.map(
        (item: number | string) => ({
          brandId: item,
          discountId: saveDiscount.id,
        })
      );

      const createApplicableBrand = applicableBrandRepository.create(
        applicableBrandEntities
      );

      promises.push(applicableBrandRepository.save(createApplicableBrand));
    }

    if (
      applicableCategories?.length > 0 &&
      validation.data.scope === ScopeEnum.Category
    ) {
      const applicableCategoryRepository = connection.getRepository(
        ApplicableCategoryEntity
      );
      const abbplicableCategoryEntities = applicableCategories.map(
        (item: number | string) => ({
          categoryId: item,
          discountId: saveDiscount.id,
        })
      );

      const createApplicableCategory = applicableCategoryRepository.create(
        abbplicableCategoryEntities
      );

      promises.push(
        applicableCategoryRepository.save(createApplicableCategory)
      );
    }

    await Promise.all(promises);

    return res.status(200).json({
      success: true,
      message: "Create a new Discount",
      data: saveDiscount,
    });
  }
);

// @desc Update a single Discount
// @route PUT /api/v1/Discounts/:id
// @access Public
export const updateDiscount = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: updateDiscount ${req.method} ${req.url}`);

    const { id } = req.params;
    const validation = updateDiscountValidation.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        issues: validation.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const connection = await getDBConnection();
    const repository = connection.getRepository(DiscountEntity);

    const existingDiscount = await repository.findOneBy({ id });
    if (!existingDiscount) {
      return res.status(404).json({
        success: false,
        message: `Discount with id ${id} not found`,
      });
    }

    const {
      applicableProducts,
      applicableBrands,
      applicableCategories,
      ...restData
    } = validation.data as any;

    // Helper function for handling applicable entities
    const handleApplicableEntities = async (
      repo: Repository<any>,
      entityData: any[],
      discountKey: string
    ) => {
      if (entityData?.length > 0) {
        await repo.delete({ discountId: id }); // Bulk delete
        const newEntities = entityData.map((item) => ({
          [discountKey]: item,
          discountId: id,
        }));
        await repo.save(newEntities);
      }
    };

    // Run all entity updates concurrently
    await Promise.all([
      handleApplicableEntities(
        connection.getRepository(ApplicableProductEntity),
        applicableProducts,
        "productId"
      ),
      handleApplicableEntities(
        connection.getRepository(ApplicableBrandEntity),
        applicableBrands,
        "brandId"
      ),
      handleApplicableEntities(
        connection.getRepository(ApplicableCategoryEntity),
        applicableCategories,
        "categoryId"
      ),
    ]);

    const updatedDiscount = repository.merge(existingDiscount, restData);
    await repository.save(updatedDiscount);

    return res.status(200).json({
      success: true,
      message: `Updated Discount with id ${id}`,
      data: updatedDiscount,
    });
  }
);

// @desc Delete a single Discount
// @route DELETE /api/v1/Discounts/:id
// @access Public
export const deleteDiscount = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: deleteDiscount ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(DiscountEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      message: `Delete a single Discount of id ${req.params.id}`,
      data: result,
    });
  }
);
