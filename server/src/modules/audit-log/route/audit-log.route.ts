import express from 'express';
import {
  getAuditLogs,
  getResourceAuditHistory,
  getMyActivity,
  getAuditStatistics,
  createAuditLog,
} from '../controller/audit-log.controller';
import { isAuthorize } from '../../../middlewares/auth.middleware';
import { RoleEnum } from '../../auth/enums/role.enum';

const router = express.Router();

// Get all audit logs (Admin only)
router.get('/', isAuthorize(RoleEnum.Admin), getAuditLogs);

// Get audit history for a specific resource (Admin only)
router.get(
  '/resource/:resourceType/:resourceId',
  isAuthorize(RoleEnum.Admin),
  getResourceAuditHistory
);

// Get current user's activity history
router.get('/my-activity', isAuthorize(RoleEnum.Admin), getMyActivity);

// Get audit log statistics (SuperAdmin only)
router.get('/statistics', isAuthorize(RoleEnum.Admin), getAuditStatistics);

// Create audit log (Internal use only - can be used by middleware)
router.post('/', isAuthorize(RoleEnum.Admin), createAuditLog);

export default router;
