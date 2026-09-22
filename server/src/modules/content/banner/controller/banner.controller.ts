import { getDBConnection } from '@/config/db';
import { CustomRequest } from '@/enums/custom-request-type';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { getPublicFileUrl, removeFileFromMinio } from '@/services/minio.service';
import { bannerValidationSchema } from '@/validation';
import { updateBannerValidationSchema } from '@/validation/banner/updateBannerValidation';
import { NextFunction, Request, Response } from 'express';
import { BannerEntity } from '../model/banner.entity';

// @desc Get all Banner
// @route GET /api/v1/Banner
// @access Public
export const getBanners = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getBanners ${req.method} ${req.url}`);
  const { type, page, limit, active } = req.query;
  const connection = await getDBConnection();
  const repository = connection.getRepository(BannerEntity);

  const customQuery: any = {};
  if (active !== undefined && active !== 'all') {
    customQuery.active = active === 'true';
  }
  if (type) {
    customQuery.type = type;
  }

  if (page || limit) {
    const pageNum = Math.max(1, parseInt((page || '1') as string, 10));
    const pageSize = Math.max(1, parseInt((limit || '10') as string, 10));

    const [result, total] = await repository.findAndCount({
      where: customQuery,
      order: { id: 'DESC' },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

    const normalizedResult = result.map((banner: any) => ({
      ...banner,
      image: banner.image ? getPublicFileUrl(banner.image) : banner.image,
    }));

    return res.status(200).json({
      success: true,
      message: 'Get all Banner',
      total,
      page: pageNum,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      data: normalizedResult,
    });
  }

  const result = await repository.find({
    where: customQuery,
    order: { id: 'DESC' },
  });

  const normalizedResult = result.map((banner: any) => ({
    ...banner,
    image: banner.image ? getPublicFileUrl(banner.image) : banner.image,
  }));

  return res.status(200).json({
    success: true,
    message: 'Get all Banner',
    total: result.length,
    data: normalizedResult,
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

  const normalizedResult = {
    ...result,
    image: result.image ? getPublicFileUrl(result.image) : result.image,
  };

  return res.status(200).json({
    success: true,
    message: `Get a single Banner of id ${req.params.id}`,
    data: normalizedResult,
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
    const formattedErrors = validation.error.issues.map((issue: any) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      issues: formattedErrors,
    });
  }

  const repository = connection.getRepository(BannerEntity);

  const bannerData = {
    ...validation.data,
    image: validation.data.image ? getPublicFileUrl(validation.data.image) : validation.data.image,
  };

  const newBanner = repository.create(bannerData);
  const save = await repository.save(newBanner);

  return res.status(200).json({
    success: true,
    message: 'Banner created successfully',
    data: {
      ...save,
      image: save.image ? getPublicFileUrl(save.image) : save.image,
    },
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
    const formattedErrors = validation.error.issues.map((issue: any) => ({
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

  const updateBody = { ...req.body };
  if (updateBody.image) {
    const newImageUrl = getPublicFileUrl(updateBody.image);
    // If the image changed, remove the old one from MinIO
    if (result.image && result.image !== newImageUrl && result.image !== updateBody.image) {
      await removeFileFromMinio(result.image);
    }
    updateBody.image = newImageUrl;
  }

  const updateData = await repository.merge(result, updateBody);

  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: 'Banner updated successfully',
    data: {
      ...updateData,
      image: updateData.image ? getPublicFileUrl(updateData.image) : updateData.image,
    },
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

  // Delete image from MinIO
  if (result.image) {
    await removeFileFromMinio(result.image);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Banner deleted successfully`,
    data: result,
  });
});
