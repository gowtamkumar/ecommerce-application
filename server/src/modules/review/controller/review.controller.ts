import { NextFunction, Request, Response } from 'express';
import { getDBConnection } from '../../../config/db';
import { CustomRequest } from '../../../enums/custom-request-type';
import { NotificationType } from '../../../enums/notification-type.enum';
import { asyncHandler } from '../../../middlewares/async.middleware';
import { logger } from '../../../middlewares/logger';
import { reviewValidationSchema } from '../../../validation';
import { updateReviewValidationSchema } from '../../../validation/review/updateReviewValidation';
import { RoleEnum } from '../../auth/enums';
import { UserEntity } from '../../auth/model/user.entity';
import { NotificationEntity } from '../../other/notification/model/notification.entity';
import { ReviewEntity } from '../model/review.entity';

// @desc Get all Review
// @route GET /api/v1/Review
// @access Public
export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getReviews ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(ReviewEntity);

  const result = await repository.find({
    relations: {
      product: true,
    },
    select: {
      product: {
        name: true,
      },
    },
  });

  return res.status(200).json({
    success: true,
    message: 'Get all Review',
    data: result,
  });
});

// @desc Get a single Review
// @route GET /api/v1/Review/:id
// @access Public
export const getReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: getReview ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(ReviewEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  return res.status(200).json({
    success: true,
    message: `Get a single Review of id ${req.params.id}`,
    data: result,
  });
});

// @desc Create a single Review
// @route POST /api/v1/Review
// @access Public
export const createReview = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createReview ${req.method} ${req.url}`);

  const validation = reviewValidationSchema.safeParse({
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

  const repository = connection.getRepository(ReviewEntity);

  const newReview = repository.create(validation.data);

  const save = await repository.save(newReview);

  const notificationRepo = connection.getRepository(NotificationEntity);
  const userRepo = connection.getRepository(UserEntity);

  // 1. Notify User: Thank You for Review
  await notificationRepo.save(notificationRepo.create({
    type: NotificationType.ReviewSubmitted,
    title: 'Review Submitted',
    message: `Thank you for reviewing the product!`,
    userId: req.id,
    isRead: false,
    orderId: save.id,
  }));

  // 2. Notify Admins: New Review Submitted
  const admins = await userRepo.find({ where: { role: RoleEnum.Admin } });
  const adminNotifications = admins.map((admin: UserEntity) => ({
    type: NotificationType.AdminReviewCreated,
    title: 'New Review Received',
    message: `A new review has been submitted by user #${req.id}.`,
    userId: admin.id,
    isRead: false,
    orderId: save.id,
  }));

  if (adminNotifications.length > 0) {
    await notificationRepo.save(notificationRepo.create(adminNotifications as any));
  }

  return res.status(200).json({
    success: true,
    message: 'Create a new Review',
    data: save,
  });
});

// @desc Update a single Review
// @route PUT /api/v1/Review/:id
// @access Public
export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateReview ${req.method} ${req.url}`);

  const { id } = req.params;
  const validation = updateReviewValidationSchema.safeParse(req.body);

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
  const repository = await connection.getRepository(ReviewEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, validation.data);

  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: `Update a single Review of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Update a single Review
// @route PUT /api/v1/reviews/increage:id
// @access Public
export const reviewLike = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: reviewLike ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();

  const repository = await connection.getRepository(ReviewEntity);

  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.save({ id: result.id, like: result.like + 1 });

  return res.status(200).json({
    success: true,
    message: `Update a single Review of id ${req.params.id}`,
    data: result,
  });
});

export const reviewDisLike = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: reviewDisLike ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();

  const repository = await connection.getRepository(ReviewEntity);

  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.save({ id: result.id, disLike: result.disLike + 1 });

  return res.status(200).json({
    success: true,
    message: `Update a single Review of id ${req.params.id}`,
    data: result,
  });
});

// @desc Delete a single Review
// @route DELETE /api/v1/Review/:id
// @access Public
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteReview ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(ReviewEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single Review of id ${req.params.id}`,
    data: result,
  });
});
