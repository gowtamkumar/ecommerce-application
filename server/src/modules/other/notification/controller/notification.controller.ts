import { NextFunction, Request, Response } from 'express';
import { getDBConnection } from '../../../../config/db';
import { CustomRequest } from '../../../../enums/custom-request-type';
import { NotificationType } from '../../../../enums/notification-type.enum';
import { asyncHandler } from '../../../../middlewares/async.middleware';
import { logger } from '../../../../middlewares/logger';
import { notificationValidationSchema } from '../../../../validation';
import { UserEntity } from '../../../auth/model/user.entity';
import { NotificationEntity } from '../model/notification.entity';

// @desc Get all Notification
// @route GET /api/v1/Notification
// @access Public
export const getNotifications = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: getNotifications ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(NotificationEntity);

  const result = await repository.find({
    where: { userId: req.id },
    order: { createdAt: 'DESC' },
  });

  return res.status(200).json({
    success: true,
    message: 'Get all Notification',
    data: result,
  });
});

// @desc Get all Notification
// @route GET /api/v1/Notification
// @access Public
export const getNotificationsForAdmin = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: getNotifications ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(NotificationEntity);

  const result = await repository.find({
    order: { createdAt: 'DESC' },
  });

  return res.status(200).json({
    success: true,
    message: 'Get all Notification',
    data: result,
  });
});

// @desc Get a single Notification
// @route GET /api/v1/Notification/:id
// @access Public
export const getNotification = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getNotification ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(NotificationEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Notification of id ${req.params.id}`,
      data: result,
    });
  },
);

// @desc Read a single Notification
// @route GET /api/v1/Notification/read:id
// @access Public
export const readNotification = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: readNotification ${req.method} ${req.url}`);
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(NotificationEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const readData = await repository.merge(result, { isRead: true });
  await repository.save(readData);

  return res.status(200).json({
    success: true,
    message: `Read a single Notification of id ${req.params.id}`,
    data: readData,
  });
});

// @desc Create a single Notification
// @route POST /api/v1/Notification
// @access Public
export const createNotification = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createNotification ${req.method} ${req.url}`);

  const validation = notificationValidationSchema.safeParse({
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
  const repository = connection.getRepository(NotificationEntity);

  const newNotification = repository.create(validation.data);
  const save = await repository.save(newNotification);

  return res.status(200).json({
    success: true,
    message: 'Create a new Notification',
    data: save,
  });
});

// @desc Update a single Notification
// @route PUT /api/v1/Notification/:id
// @access Public
export const updateNotification = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateNotification ${req.method} ${req.url}`);
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(NotificationEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, req.body);
  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: `Update a single Notification of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Notification
// @route DELETE /api/v1/Notification/:id
// @access Public
export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteNotification ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(NotificationEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single Notification of id ${req.params.id}`,
    data: result,
  });
});

// @desc clear all  Notification
// @route DELETE /api/v1/Notification/clear
// @access Public
export const clearNotification = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: clearNotification ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(NotificationEntity);

  const result = await repository.find({ where: { userId: req.id } });

  await repository.remove(result);

  return res.status(200).json({
    success: true,
    message: `Clear Notification`,
    data: result,
  });
});

// @desc Send Promotional Notification (Admin Only)
// @route POST /api/v1/Notification/promote
// @access Private (Admin)
export const sendPromotionalNotification = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    logger.info(`Service: sendPromotionalNotification ${req.method} ${req.url}`);

    const { title, message, type, offerUrl } = req.body; // Expect title, message, and optionally type (default to NewOffer)

    if (!title || !message) {
      throw new Error('Title and Message are required');
    }

    const connection = await getDBConnection();
    const userRepo = connection.getRepository(UserEntity);
    const notificationRepo = connection.getRepository(NotificationEntity);
    // 1. Get all users (or maybe filter by subscribers? For now, all users)
    // Optimization: In a real large scale app, this should be a job. Here we do it inline for simplicity.
    const users = await userRepo.find();

    const notifications = users.map((user: UserEntity) =>
      notificationRepo.create({
        type: type || NotificationType.NewOffer, // Default to NewOffer
        title: title,
        offerUrl: offerUrl,
        message: message,
        userId: user.id,
        isRead: false,
      }),
    );

    if (notifications.length > 0) {
      // Save in chunks if necessary, but typeorm save handles array.
      await notificationRepo.save(notifications);
    }

    return res.status(200).json({
      success: true,
      message: `Promotional notification sent to ${users.length} users.`,
    });
  },
);
