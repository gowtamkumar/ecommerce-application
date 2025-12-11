import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../../middlewares/async.middleware';
import { getDBConnection } from '../../../config/db';
import { AuditLogEntity } from '../model/audit-log.entity';
import { logger } from '../../../middlewares/logger';
import { Between, Like } from 'typeorm';
import { CustomRequest } from '../../../enums/custom-request-type';

// @desc Get all audit logs with filters
// @route GET /api/v1/audit-logs
// @access Private (Admin only)
export const getAuditLogs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getAuditLogs ${req.method} ${req.url}`);

    const connection = await getDBConnection();
    const repository = connection.getRepository(AuditLogEntity);

    const {
      userId,
      action,
      resourceType,
      resourceId,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const queryBuilder = repository.createQueryBuilder('audit_log');

    // Apply filters
    if (userId) {
      queryBuilder.andWhere('audit_log.userId = :userId', { userId });
    }

    if (action) {
      queryBuilder.andWhere('audit_log.action = :action', { action });
    }

    if (resourceType) {
      queryBuilder.andWhere('audit_log.resourceType = :resourceType', {
        resourceType,
      });
    }

    if (resourceId) {
      queryBuilder.andWhere('audit_log.resourceId = :resourceId', {
        resourceId,
      });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('audit_log.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      queryBuilder.andWhere('audit_log.createdAt >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('audit_log.createdAt <= :endDate', { endDate });
    }

    if (search) {
      queryBuilder.andWhere(
        '(audit_log.userName ILIKE :search OR audit_log.resourceName ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    queryBuilder.skip(skip).take(Number(limit));

    // Order by newest first
    queryBuilder.orderBy('audit_log.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return res.status(200).json({
      success: true,
      message: 'Get all audit logs',
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  }
);

// @desc Get audit history for a specific resource
// @route GET /api/v1/audit-logs/resource/:resourceType/:resourceId
// @access Private (Admin only)
export const getResourceAuditHistory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getResourceAuditHistory ${req.method} ${req.url}`);

    const { resourceType, resourceId } = req.params;
    const connection = await getDBConnection();
    const repository = connection.getRepository(AuditLogEntity);

    const data = await repository.find({
      where: {
        resourceType,
        resourceId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Get audit history for resource',
      data,
    });
  }
);

// @desc Get current user's activity history
// @route GET /api/v1/audit-logs/my-activity
// @access Private
export const getMyActivity = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    logger.info(`Service: getMyActivity ${req.method} ${req.url}`);

    const connection = await getDBConnection();
    const repository = connection.getRepository(AuditLogEntity);

    const data = await repository.find({
      where: {
        userId: req.id?.toString(),
      },
      order: {
        createdAt: 'DESC',
      },
      take: 50,
    });

    return res.status(200).json({
      success: true,
      message: 'Get my activity history',
      data,
    });
  }
);

// @desc Get audit log statistics
// @route GET /api/v1/audit-logs/statistics
// @access Private (Super Admin only)
export const getAuditStatistics = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getAuditStatistics ${req.method} ${req.url}`);

    const days = Number(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const connection = await getDBConnection();
    const repository = connection.getRepository(AuditLogEntity);

    const queryBuilder = repository.createQueryBuilder('audit_log');
    queryBuilder.where('audit_log.createdAt >= :startDate', { startDate });

    const totalLogs = await queryBuilder.getCount();

    const byAction = await queryBuilder
      .select('audit_log.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit_log.action')
      .getRawMany();

    const byResourceType = await queryBuilder
      .select('audit_log.resourceType', 'resourceType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit_log.resourceType')
      .orderBy('COUNT(*)', 'DESC')
      .limit(10)
      .getRawMany();

    return res.status(200).json({
      success: true,
      message: 'Get audit statistics',
      data: {
        totalLogs,
        byAction,
        byResourceType,
        period: `Last ${days} days`,
      },
    });
  }
);

// @desc Create an audit log entry (used internally by middleware)
// @route POST /api/v1/audit-logs
// @access Private (Internal use only)
export const createAuditLog = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: createAuditLog ${req.method} ${req.url}`);

    const connection = await getDBConnection();
    const repository = connection.getRepository(AuditLogEntity);

    const auditLog = repository.create(req.body);
    const savedLog = await repository.save(auditLog);

    return res.status(201).json({
      success: true,
      message: 'Audit log created',
      data: savedLog,
    });
  }
);
