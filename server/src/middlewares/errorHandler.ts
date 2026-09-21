import ErrorResponse from '@/utils/errorResponse';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from './logger';

/** Type for the custom metadata carried by ErrorResponse (Joi / custom errors). */
interface ErrorWithMeta extends Error {
  statusCode?: number;
  joiValidationErrors?: unknown;
  customErrors?: unknown;
}

interface ErrorBody {
  code?: string;
  type?: string;
  syntaxError?: boolean;
}

/**
 * Global error handler - the single place every unhandled error becomes a
 * consistent JSON envelope, and 5xx errors get logged in one spot.
 *
 * Shape: { success: false, status, message } (+ optional issues/errors/stack in dev)
 */
export const errorHandler = (
  err: ErrorWithMeta,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  // 1) Malformed JSON body (body-parser / express.json)
  const parsed = err as ErrorBody;
  if (parsed?.type === 'entity.parse.failed' || parsed?.syntaxError) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: 'Invalid JSON payload in request body',
    });
  }

  // 2) Zod validation errors - keep the same shape controllers return via failValidation()
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: 'Validation Error',
      issues: err.errors.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // 3) Business errors thrown as ErrorResponse (services) - surface any attached issues
  const hasAttachedErrors = err instanceof ErrorResponse && err.customErrors !== undefined;

  const envelope: Record<string, unknown> = {
    success: false,
    status: statusCode,
    message,
    ...(hasAttachedErrors ? { errors: err.customErrors } : {}),
  };

  // 4) 5xx errors are logged centrally (winston) - 4xx stays quiet (client errors)
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${message}`);
    logger.error(err.stack || '');
  }

  if (process.env.NODE_ENV === 'development') {
    envelope.stack = err.stack;
  }

  return res.status(statusCode).json(envelope);
};
