import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../../middlewares/async.middleware';
import { getDBConnection } from '../../../config/db';
import { BannerEntity } from '../model/banner.entity';
import { bannerValidationSchema } from '../../../validation';
import { updateBannerValidationSchema } from '../../../validation/banner/updateBannerValidation';
import { logger } from '../../../middlewares/logger';
import { CustomRequest } from '../../../enums/custom-request-type';

// @desc Get all Banner
// @route GET /api/v1/Banner
// @access Public
export const getBanners = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getBanners ${req.method} ${req.url}`);
  const { type } = req.query;
  const connection = await getDBConnection();
  const repository = connection.getRepository(BannerEntity);

  const customQuery = { active: true } as any;
  if (type) {
    customQuery.type = type;
  }
  const result = await repository.find({ where: customQuery });
  return res.status(200).json({
    success: true,
    message: 'Get all Banner',
    data: result,
  });
});

// @desc Get a single Banner
// @route GET /api/v1/Banner/:id
// @access Public
export const getBanner = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: getBanner ${req.method} ${req.url}`);
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(BannerEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  return res.status(200).json({
    success: true,
    message: `Get a single Banner of id ${req.params.id}`,
    data: result,
  });
});

// @desc Create a single Banner
// @route POST /api/v1/Banner
// @access Public
export const createBanner = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createBanner ${req.method} ${req.url}`);
  const connection = await getDBConnection();
  const validation = bannerValidationSchema.safeParse({
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

  const repository = connection.getRepository(BannerEntity);

  const newBanner = repository.create(validation.data);
  const save = await repository.save(newBanner);

  return res.status(200).json({
    success: true,
    message: 'Create a new Banner',
    data: save,
  });
});

// @desc Update a single Banner
// @route PUT /api/v1/Banner/:id
// @access Public
export const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateBanner ${req.method} ${req.url}`);
  const { id } = req.params;
  const connection = await getDBConnection();

  const validation = updateBannerValidationSchema.safeParse(req.body);

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

  const repository = await connection.getRepository(BannerEntity);

  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Banner Not found`);
  }

  const updateData = await repository.merge(result, req.body);

  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: `Update a single Banner of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Banner
// @route DELETE /api/v1/Banner/:id
// @access Public
export const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteBanner ${req.method} ${req.url}`);
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(BannerEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single Banner of id ${req.params.id}`,
    data: result,
  });
});
