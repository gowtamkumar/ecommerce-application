import { getDBConnection } from '@/config/db';
import { CustomRequest } from '@/enums/custom-request-type';
import { NotificationType } from '@/enums/notification-type.enum';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { UserEntity } from '@/modules/user/auth/model/user.entity';
import { ok } from '@/utils/apiResponse';
import { parsePagination } from '@/utils/pagination';
import { notificationValidationSchema } from '@/validation';
import { NextFunction, Request, Response } from 'express';
import { NotificationEntity } from '../model/notification.entity';

// @desc Get all Notification
// @route GET /api/v1/Notification
// @access Public
export const getNotifications = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: getNotifications ${req.method} ${req.url}`);

  const { page, limit, perPage, status, isRead, type, search } = req.query as any;

  const connection = await getDBConnection();
  const repository = connection.getRepository(NotificationEntity);

  const qb = repository
    .createQueryBuilder('notification')
    .where('notification.userId = :userId', { userId: req.id });

  if (status === 'read' || status === 'true' || isRead === 'true' || isRead === true) {
    qb.andWhere('notification.isRead = :isRead', { isRead: true });
  } else if (status === 'unread' || status === 'false' || isRead === 'false' || isRead === false) {
    qb.andWhere('notification.isRead = :isRead', { isRead: false });
  }

  if (type) {
    if (type.includes(',')) {
      const types = type.split(',').map((t: string) => t.trim());
      qb.andWhere('notification.type IN (:...types)', { types });
    } else {
      qb.andWhere('notification.type ILIKE :type', { type: `%${type}%` });
    }
  }

  if (search) {
    qb.andWhere('(notification.title ILIKE :search OR notification.message ILIKE :search)', {
      search: `%${search}%`,
    });
  }

  qb.orderBy('notification.createdAt', 'DESC').addOrderBy('notification.id', 'DESC');

  if (page || limit || perPage) {
    const pagination = parsePagination(req.query);
    const [result, total] = await qb.skip(pagination.skip).take(pagination.take).getManyAndCount();

    return ok(res, result, 'Get all Notification', 200, {
      totalItem: total,
      total,
      page: pagination.page,
      limit: pagination.perPage,
      perPage: pagination.perPage,
      totalPages: Math.ceil(total / pagination.perPage),
    });
  }

  const [result, total] = await qb.getManyAndCount();

  return ok(res, result, 'Get all Notification', 200, {
    totalItem: total,
    total,
    page: 1,
    limit: total,
    perPage: total,
    totalPages: 1,
  });
});

// @desc Get all Notification for Admin
// @route GET /api/v1/Notification/admin
// @access Private (Admin)
export const getNotificationsForAdmin = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: getNotificationsForAdmin ${req.method} ${req.url}`);

  const { page, limit, perPage, status, isRead, type, search, userId } = req.query as any;

  const connection = await getDBConnection();
  const repository = connection.getRepository(NotificationEntity);

  const qb = repository
    .createQueryBuilder('notification')
    .leftJoinAndSelect('notification.user', 'user');

  if (userId) {
    qb.andWhere('notification.userId = :userId', { userId: Number(userId) });
  }

  if (status === 'read' || status === 'true' || isRead === 'true' || isRead === true) {
    qb.andWhere('notification.isRead = :isRead', { isRead: true });
  } else if (status === 'unread' || status === 'false' || isRead === 'false' || isRead === false) {
    qb.andWhere('notification.isRead = :isRead', { isRead: false });
  }

  if (type) {
    if (type.includes(',')) {
      const types = type.split(',').map((t: string) => t.trim());
      qb.andWhere('notification.type IN (:...types)', { types });
    } else {
      qb.andWhere('notification.type ILIKE :type', { type: `%${type}%` });
    }
  }

  if (search) {
    qb.andWhere(
      '(notification.title ILIKE :search OR notification.message ILIKE :search OR user.name ILIKE :search OR user.email ILIKE :search)',
      { search: `%${search}%` },
    );
  }

  qb.orderBy('notification.createdAt', 'DESC').addOrderBy('notification.id', 'DESC');

  if (page || limit || perPage) {
    const pagination = parsePagination(req.query);
    const [result, total] = await qb.skip(pagination.skip).take(pagination.take).getManyAndCount();

    return ok(res, result, 'Get all Notification', 200, {
      totalItem: total,
      total,
      page: pagination.page,
      limit: pagination.perPage,
      perPage: pagination.perPage,
      totalPages: Math.ceil(total / pagination.perPage),
    });
  }

  const [result, total] = await qb.getManyAndCount();

  return ok(res, result, 'Get all Notification', 200, {
    totalItem: total,
    total,
    page: 1,
    limit: total,
    perPage: total,
    totalPages: 1,
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
  const result = await repository.findOneBy({ id: Number(id) as any });

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

// @desc Mark all notifications as read for current user
// @route GET /api/v1/Notification/read-all
// @access Private
export const readAllNotifications = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: readAllNotifications ${req.method} ${req.url}`);
  const connection = await getDBConnection();
  const repository = connection.getRepository(NotificationEntity);

  await repository.update({ userId: req.id, isRead: false }, { isRead: true });

  return res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
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
    const formattedErrors = validation.error.issues.map((issue: any) => ({
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
    message: 'Notification sent successfully',
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
    message: 'Notification updated successfully',
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
