import { Request, Response, NextFunction } from 'express';
import { ProductVariantEntity } from '../model/product-variant.entity';
import { asyncHandler } from '../../../../middlewares/async.middleware';
import { logger } from '../../../../middlewares/logger';
import { getDBConnection } from '../../../../config/db';
import { productVariantValidationSchema } from '../../../../validation';
import { CustomRequest } from '../../../../enums/custom-request-type';

// @desc Get all ProductVariants
// @route GET /api/v1/ProductVariants
// @access Public
export const getProductVariants = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getProductVariants ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(ProductVariantEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: 'Get all Product Variants',
    data: result,
  });
});

// @desc Get a single ProductVariant
// @route GET /api/v1/ProductVariants/:id
// @access Public
export const getProductVariant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getProductVariant ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ProductVariantEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single ProductVariant of id ${req.params.id}`,
      data: result,
    });
  },
);

// @desc Create a single ProductVariant
// @route POST /api/v1/ProductVariants
// @access Public
export const createProductVariant = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createProductVariant ${req.method} ${req.url}`);

  const validation = productVariantValidationSchema.safeParse(req.body);

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
  const repository = connection.getRepository(ProductVariantEntity);

  const result = await repository.create(validation.data);
  await repository.save(result);

  return res.status(200).json({
    success: true,
    message: 'Create a new Product Variant',
    data: result,
  });
});

// @desc Update a single ProductVariant
// @route PUT /api/v1/ProductVariants/:id
// @access Public
export const updateProductVariant = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateProductVariant ${req.method} ${req.url}`);

  const { id } = req.params;

  const validation = productVariantValidationSchema.safeParse(req.body);

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

  const repository = await connection.getRepository(ProductVariantEntity);

  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, validation.data);

  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: `Update a single ProductVariant of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single ProductVariant
// @route DELETE /api/v1/ProductVariants/:id
// @access Public
export const deleteProductVariant = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteProductVariant ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(ProductVariantEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single ProductVariant of id ${req.params.id}`,
    data: result,
  });
});
