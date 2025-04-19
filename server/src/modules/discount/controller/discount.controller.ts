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

    const query = repository.query(`
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
  discountProducts AS (
	select * from discounts dis
	left join applicable_products ap on ap.discount_id = dis.id
  ),
   reviewsTable AS (
      SELECT 
          product_id,
          COUNT(*) AS reviews_count,
          COALESCE(AVG(CAST(rating AS FLOAT)), 0) AS average_rating
      FROM reviews
      GROUP BY product_id
  )
  -- select * from discountProducts;  
  select 
   p.product_id AS "id",
          p.name,
          p.slug,
          p.thumbnail_image as "thumbnailImage",
          p.hover_image as "hoverImage",
          p.variant,
          p.brand_id as "brandId",
          dp.discount_id as "discountId",
          dp.discount_strategy AS "discountStrategy",
          dp.value AS "discountValue",
          dp.scope,
          p.featured,
          p.unit_price AS "unitPrice",
          p.purchase_price AS "purchasePrice",
          p.product_variant_id as "productVariantId",
		  rt.reviews_count AS "reviewsCount",
          rt.average_rating AS "avgRating",
		      ROUND(
              ((CASE 
                  WHEN dp.discount_strategy = 'Percentage' THEN 
                      p.unit_price - (p.unit_price * dp.value / 100)
                  WHEN dp.discount_strategy = 'Fixed' THEN 
                      p.unit_price - dp.value
                  ELSE 
                      p.unit_price
              END) * COALESCE(t.value, 0) / 100), 
          2) AS "taxAmount",
		    ROUND(
              CASE 
                  WHEN dp.discount_strategy = 'Percentage' THEN 
                      p.unit_price - (p.unit_price * dp.value / 100)
                  WHEN dp.discount_strategy = 'Fixed' THEN 
                      p.unit_price - dp.value
                  ELSE 
                      p.unit_price
              END, 
              2
          ) AS "discountedPrice"
  from discountProducts dp
  LEFT JOIN productTable p on p.product_id = dp.product_id
  LEFT JOIN taxs t ON t.id = p.tax_id
  LEFT JOIN  reviewsTable rt ON rt.product_id = p.product_id

      `)

    

    const result = await repository.findOne({
      where: { id },
      relations: [
        "applicableProducts",
        "applicableBrands",
        "applicableCategories",
      ],
    });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Discount of id ${req.params.id}`,
      data: result,
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
