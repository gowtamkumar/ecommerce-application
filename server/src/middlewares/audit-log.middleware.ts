import { getDBConnection } from '@/config/db';
import { CustomRequest } from '@/enums/custom-request-type';
import { AuditAction, AuditLogEntity } from '@/modules/system/audit-log/model/audit-log.entity';
import { NextFunction, Response } from 'express';
import { logger } from './logger';

/**
 * Global audit logging middleware
 * Automatically logs POST, PUT, DELETE requests
 */
export const auditLogMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  // Only log write operations (POST, PUT, DELETE)
  const methodsToLog = ['POST', 'PUT', 'DELETE'];
  if (!methodsToLog.includes(req.method)) {
    return next();
  }

  // Skip certain routes
  const skipRoutes = [
    '/api/v1/auth/login',
    '/api/v1/auth/logout',
    '/api/v1/auth/register',
    '/api/v1/files', // Skip file uploads
    '/api/v1/audit-logs', // Prevent infinite loop
  ];

  if (skipRoutes.some((route) => req.path.startsWith(route))) {
    return next();
  }

  // Store original send function
  const originalSend = res.send;

  // Override res.send to capture response
  res.send = function (body: any): Response {
    // Only log successful responses (2xx status codes)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      // Execute audit logging asynchronously (non-blocking)
      setImmediate(async () => {
        try {
          await createAuditLog(req, body);
        } catch (error) {
          logger.error('Audit log failed:', error);
        }
      });
    }

    // Call original send
    return originalSend.call(this, body);
  };

  next();
};

/**
 * Create audit log entry
 */
async function createAuditLog(req: CustomRequest, responseBody: any) {
  try {
    const connection = await getDBConnection();
    const auditRepository = connection.getRepository(AuditLogEntity);

    // Determine action based on HTTP method
    const actionMap: Record<string, AuditAction> = {
      POST: AuditAction.CREATE,
      PUT: AuditAction.UPDATE,
      DELETE: AuditAction.DELETE,
    };
    const action = actionMap[req.method];

    // Extract resource info from URL
    // Example: /api/v1/categories/123 -> resourceType: "categories", resourceId: "123"
    const pathParts = req.path.split('/').filter(Boolean);
    const resourceType = pathParts[2] || 'Unknown'; // api/v1/[resourceType]
    const resourceId = req.params.id || pathParts[3] || undefined;

    // Get resource name from response or request body
    let resourceName: string | undefined;
    try {
      const parsedBody = typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;
      resourceName =
        parsedBody?.data?.name || parsedBody?.data?.title || parsedBody?.data?.username;
    } catch (e) {
      // If parsing fails, try request body
      resourceName = req.body?.name || req.body?.title || req.body?.username;
    }

    // Prepare old/new values (simplified version)
    const newValues = req.method === 'DELETE' ? undefined : req.body;
    const oldValues = req.method === 'POST' ? undefined : undefined; // Would need separate lookup

    // Create audit log
    await auditRepository.save({
      userId: req?.id?.toString(),
      userName: req?.name || 'Unknown',
      userEmail: req?.email || 'Unknown',
      userRole: req?.role || 'Unknown',
      action,
      resourceType: capitalize(resourceType),
      resourceId,
      resourceName,
      oldValues,
      newValues,
      metadata: {
        ip: req?.ip || (req?.headers['x-forwarded-for'] as string),
        userAgent: req?.headers['user-agent'],
        method: req?.method,
        path: req.originalUrl, // Full URL including query params and ID
      },
    });

    logger.info(`Audit log created: ${action} ${resourceType} ${resourceId || ''}`);
  } catch (error) {
    logger.error('Failed to create audit log:', error);
    // Don't throw - audit logging should never break the main request
  }
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
