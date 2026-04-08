import { getDBConnection } from '@/config/db';
import { CustomRequest } from '@/enums/custom-request-type';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { singleDiscountQuery } from '@/sqlQuery';
import { discountValidation } from '@/validation';
import { updateDiscountValidation } from '@/validation/discount/updateDiscountValidation';
import { updateStatusDiscountValidation } from '@/validation/discount/updateStatusDiscountValidation';
import { NextFunction, Request, Response } from 'express';
import { In, MoreThan, Repository } from 'typeorm';
import { ScopeEnum } from '../enum';
import { ApplicableBrandEntity } from '../model/applicable-brand.entity';
import { ApplicableCategoryEntity } from '../model/applicable-category.entity';
import { ApplicableProductEntity } from '../model/applicable-products.entity';
import { DiscountEntity } from '../model/discount.entity';

// @desc Get all Discounts
// @route GET /api/v1/Discounts
// @access Public
export const getDiscounts = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getDiscounts ${req.method} ${req.url}`);

  const { scope, status, startDate, endDate } = req.query as any;
  const connection = await getDBConnection();
  const repository = connection.getRepository(DiscountEntity);
  const whereClause: any = {};

  if (scope) {
    const scopesArray = scope.split(',').map((s: string) => s.trim());
    whereClause.scope = In(scopesArray);
  }
  if (status) {
    whereClause.status = status;
  }
  if (startDate) {
    whereClause.startDate = MoreThan(startDate);
  }
  if (endDate) {
    whereClause.endDate = MoreThan(endDate);
  }
  const result = await repository.find({ where: whereClause });

  return res.status(200).json({
    success: true,
    message: 'Get all Discounts',
    data: result,
  });
});

// @desc Get a single Discount
// @route GET /api/v1/Discounts/:id
// @access Public
export const getDiscount = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: getDiscount ${req.method} ${req.url}`);
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(DiscountEntity);

  const result = await repository.findOne({
    where: { id },
    relations: ['applicableProducts', 'applicableBrands', 'applicableCategories'],
  });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  return res.status(200).json({
    success: true,
    message: `Get a single Discount of id ${req.params.id}`,
    data: result,
  });
});
// @desc Get a single Discount
// @route GET /api/v1/Discounts/details/:id
// @access Public
export const getDiscountDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getDiscountDetails ${req.method} ${req.url}`);
    const { id } = req.params;
    const connection = await getDBConnection();
    const query = await singleDiscountQuery(id as string);
    const result = await connection.query(query);

    if (!result[0]) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Discount of id ${req.params.id}`,
      data: result[0],
    });
  },
);

// @desc Get a single Discount
// @route GET /api/v1/discounts/slug/:slug
// @access Public
export const getDiscountBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getDiscountBySlug ${req.method} ${req.url}`);
    const { slug } = await req.params;

    const connection = await getDBConnection();
    const repository = await connection.getRepository(DiscountEntity);

    const result = await repository.findOne({
      where: { slug },
    });

    if (!result) {
      throw new Error(`Resource not found of slug #${slug}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Discount of slug ${slug}`,
      data: result,
    });
  },
);

// @desc Create a single Discount
// @route POST /api/v1/Discounts
// @access Public
export const createDiscount = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createDiscount ${req.method} ${req.url}`);

  const validation = discountValidation.safeParse({
    ...req.body,
    userId: req.id,
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
  const repository = connection.getRepository(DiscountEntity);

  const { applicableProducts, applicableBrands, applicableCategories, ...restData } =
    validation.data as any;

  restData.slug = restData.name.toLowerCase().trim().split(' ').join('-');

  const newDiscount = repository.create(restData);
  const saveDiscount = await repository.save(newDiscount);

  const promises = [];

  if (applicableProducts?.length > 0 && validation.data.scope === ScopeEnum.Products) {
    const applicationProductRepository = connection.getRepository(ApplicableProductEntity);
    const applicableProductEntities = applicableProducts.map((item: number | string) => ({
      productId: item,
      discountId: saveDiscount.id,
    }));
    const createApplicableProduct = applicationProductRepository.create(applicableProductEntities);

    promises.push(applicationProductRepository.save(createApplicableProduct));
  }

  if (applicableBrands?.length > 0 && validation.data.scope === ScopeEnum.Brand) {
    const applicableBrandRepository = connection.getRepository(ApplicableBrandEntity);
    const applicableBrandEntities = applicableBrands.map((item: number | string) => ({
      brandId: item,
      discountId: saveDiscount.id,
    }));

    const createApplicableBrand = applicableBrandRepository.create(applicableBrandEntities);

    promises.push(applicableBrandRepository.save(createApplicableBrand));
  }

  if (applicableCategories?.length > 0 && validation.data.scope === ScopeEnum.Category) {
    const applicableCategoryRepository = connection.getRepository(ApplicableCategoryEntity);
    const abbplicableCategoryEntities = applicableCategories.map((item: number | string) => ({
      categoryId: item,
      discountId: saveDiscount.id,
    }));

    const createApplicableCategory = applicableCategoryRepository.create(
      abbplicableCategoryEntities,
    );

    promises.push(applicableCategoryRepository.save(createApplicableCategory));
  }

  await Promise.all(promises);

  return res.status(200).json({
    success: true,
    message: 'Create a new Discount',
    data: saveDiscount,
  });
});

// @desc Update a single Discount
// @route PUT /api/v1/Discounts/:id
// @access Public
export const updateDiscount = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateDiscount ${req.method} ${req.url}`);

  const { id } = req.params;
  const validation = updateDiscountValidation.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      issues: validation.error.issues.map((issue) => ({
        path: issue.path.join('.'),
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

  const { applicableProducts, applicableBrands, applicableCategories, ...restData } =
    validation.data as any;

  // Helper function for handling applicable entities
  const handleApplicableEntities = async (
    repo: Repository<any>,
    entityData: any[],
    discountKey: string,
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
      'productId',
    ),
    handleApplicableEntities(
      connection.getRepository(ApplicableBrandEntity),
      applicableBrands,
      'brandId',
    ),
    handleApplicableEntities(
      connection.getRepository(ApplicableCategoryEntity),
      applicableCategories,
      'categoryId',
    ),
  ]);

  const updatedDiscount = repository.merge(existingDiscount, restData);
  await repository.save(updatedDiscount);

  return res.status(200).json({
    success: true,
    message: `Updated Discount with id ${id}`,
    data: updatedDiscount,
  });
});
// @desc Update a single Discount
// @route PUT /api/v1/Discounts/status:id
// @access Public
export const discountStatusUpdate = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: discountStatusUpdate ${req.method} ${req.url}`);
  const { id } = req.params;
  const validation = updateStatusDiscountValidation.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      issues: validation.error.issues.map((issue) => ({
        path: issue.path.join('.'),
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

  const result = await repository.save({
    id: existingDiscount.id,
    status: validation.data.status,
  });

  return res.status(200).json({
    success: true,
    message: `Updated Discount with id ${id}`,
    data: result,
  });
});

// @desc Delete a single Discount
// @route DELETE /api/v1/Discounts/:id
// @access Public
export const deleteDiscount = asyncHandler(async (req: Request, res: Response) => {
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
});
