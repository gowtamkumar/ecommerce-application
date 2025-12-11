import express from 'express';
import {
  getAuditLogs,
  getResourceAuditHistory,
  getMyActivity,
  getAuditStatistics,
  createAuditLog,
} from '../controller/audit-log.controller';

const router = express.Router();

// Note: AuthGuard and isAuthorize are applied in routes.ts
// These routes are already protected at the router level

// Get all audit logs (Admin only)
router.get('/', getAuditLogs);

// Get audit history for a specific resource (Admin only)
router.get('/resource/:resourceType/:resourceId', getResourceAuditHistory);

// Get current user's activity history
router.get('/my-activity', getMyActivity);

// Get audit log statistics (Admin only)
router.get('/statistics', getAuditStatistics);

// Create audit log (Internal use only)
router.post('/', createAuditLog);

export default router;
