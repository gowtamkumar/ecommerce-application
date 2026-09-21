import { Response } from 'express';

interface ValidationIssue {
  path: string;
  message: string;
}

/**
 * Standardized success envelope: { success, message, data, ...extra }
 * Use `extra` for pagination metadata (totalItem, page, perPage, ...).
 */
export const ok = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  extra: Record<string, unknown> = {},
) => res.status(statusCode).json({ success: true, message, data, ...extra });

/**
 * Standardized failure envelope: { success: false, message, ...extra }
 */
export const fail = (
  res: Response,
  message = 'Something went wrong',
  statusCode = 400,
  extra: Record<string, unknown> = {},
) => res.status(statusCode).json({ success: false, message, ...extra });

/**
 * Standardized Zod/validation failure envelope: { success: false, issues: [...] }
 */
export const failValidation = (res: Response, issues: ValidationIssue[]) =>
  res.status(400).json({ success: false, issues });

export const notFound = (res: Response, message = 'Resource not found') => fail(res, message, 404);
