import { CustomRequest } from '@/enums/custom-request-type';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { failValidation, ok } from '@/utils/apiResponse';
import { parsePagination } from '@/utils/pagination';
import { brandValidationSchema } from '@/validation';
import { updateBrandValidationSchema } from '@/validation/brand/updateBrandValidation';
import { Request, Response } from 'express';
import { brandsService } from '../service/brand.service';
import { CreateBrandInput, UpdateBrandInput } from '../types/brand.types';

const log = (fn: string, req: Request) => logger.info(`Service: ${fn} ${req.method} ${req.url}`);

// @desc  Get all Brands (paginated)
// @route GET /api/v1/brands
// @access Public
export const getBrands = asyncHandler(async (req: Request, res: Response) => {
  log('getBrands', req);
  const { data, total, page, perPage } = await brandsService.getAll(parsePagination(req.query));
  return ok(res, data, 'Get all Brands', 200, { totalItem: total, page, perPage });
});

// @desc  Get a single Brand
// @route GET /api/v1/brands/:id
// @access Public
export const getBrand = asyncHandler(async (req: Request, res: Response) => {
  log('getBrand', req);
  const data = await brandsService.getById(String(req.params.id));
  return ok(res, data, `Get a single Brand of id ${req.params.id}`);
});

// @desc  Create a Brand
// @route POST /api/v1/brands
// @access Private
export const createBrand = asyncHandler(async (req: CustomRequest, res: Response) => {
  log('createBrand', req);

  const validation = brandValidationSchema.safeParse({ ...req.body, userId: req.id });
  if (!validation.success) {
    const issues = validation.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return failValidation(res, issues);
  }

  const data = await brandsService.create(validation.data as CreateBrandInput);
  return ok(res, data, 'Brand created successfully', 200);
});

// @desc  Update a Brand
// @route PATCH /api/v1/brands/:id
// @access Private
export const updateBrand = asyncHandler(async (req: CustomRequest, res: Response) => {
  log('updateBrand', req);

  const validation = updateBrandValidationSchema.safeParse(req.body);
  if (!validation.success) {
    const issues = validation.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return failValidation(res, issues);
  }

  const data = await brandsService.update(
    String(req.params.id),
    validation.data as UpdateBrandInput,
  );
  return ok(res, data, 'Brand updated successfully', 200);
});

// @desc  Delete a Brand
// @route DELETE /api/v1/brands/:id
// @access Private
export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  log('deleteBrand', req);
  const data = await brandsService.remove(String(req.params.id));
  return ok(res, data, `Delete a single Brand of id ${req.params.id}`);
});
