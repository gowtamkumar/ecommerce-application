import { CustomRequest } from '@/enums/custom-request-type';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { failValidation, ok } from '@/utils/apiResponse';
import { parsePagination } from '@/utils/pagination';
import {
  categoriesValidationSchema,
  updateCategoryValidationSchema,
} from '@/validation/categories/categoriesValidation';
import { Request, Response } from 'express';
import { categoriesService } from '../service/categories.service';
import { CreateCategoryInput, UpdateCategoryInput } from '../types/categories.types';

const log = (fn: string, req: Request) => logger.info(`Service: ${fn} ${req.method} ${req.url}`);

// @desc  Public categories (paginated)
// @route GET /api/v1/categories/all
// @access Public
export const getPublicCategories = asyncHandler(async (req: Request, res: Response) => {
  log('getPublicCategories', req);
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const { page, perPage, limit } = req.query;

  if (page || perPage || limit) {
    const pagination = parsePagination(req.query);
    const {
      data,
      total,
      page: curPage,
      perPage: curPerPage,
    } = await categoriesService.getAll(pagination, search);
    return ok(res, data, 'Get all categories', 200, {
      totalItem: total,
      total,
      page: curPage,
      perPage: curPerPage,
      limit: curPerPage,
      totalPages: Math.ceil(total / curPerPage),
    });
  }

  const { data, total } = await categoriesService.getAll(undefined, search);
  return ok(res, data, 'Get all categories', 200, {
    totalItem: total,
    total,
    page: 1,
    perPage: total,
    limit: total,
    totalPages: 1,
  });
});

// @desc  Admin tree for the antd table + parent select (single fetch)
// @route GET /api/v1/categories/antd
// @access Public (data drives public admin UI list; no PII)
export const getAntdCategories = asyncHandler(async (req: Request, res: Response) => {
  log('getAntdCategories', req);
  const data = await categoriesService.getTree();
  return ok(res, data, 'Get all for antd table Categorys');
});

// @desc  Active nested menu for the storefront
// @route GET /api/v1/categories/menu
// @access Public
export const getCategoriesForMenu = asyncHandler(async (req: Request, res: Response) => {
  log('getCategoriesForMenu', req);
  const data = await categoriesService.getMenu();
  return ok(res, data, 'Get all for Menu');
});

// @desc  Admin categories (paginated)
// @route GET /api/v1/categories
// @access Private
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  log('getCategories', req);
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const { page, perPage, limit } = req.query;

  if (page || perPage || limit) {
    const pagination = parsePagination(req.query);
    const {
      data,
      total,
      page: curPage,
      perPage: curPerPage,
    } = await categoriesService.getAll(pagination, search);
    return ok(res, data, 'Get all categories', 200, {
      totalItem: total,
      total,
      page: curPage,
      perPage: curPerPage,
      limit: curPerPage,
      totalPages: Math.ceil(total / curPerPage),
    });
  }

  const { data, total } = await categoriesService.getAll(undefined, search);
  return ok(res, data, 'Get all categories', 200, {
    totalItem: total,
    total,
    page: 1,
    perPage: total,
    limit: total,
    totalPages: 1,
  });
});

// @desc  Get a single category
// @route GET /api/v1/categories/:id
// @access Public
export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  log('getCategory', req);
  const data = await categoriesService.getById(String(req.params.id));
  return ok(res, data, 'Get a single category');
});

// @desc  Create a category
// @route POST /api/v1/categories
// @access Private
export const createCategory = asyncHandler(async (req: CustomRequest, res: Response) => {
  log('createCategory', req);

  const validation = categoriesValidationSchema.safeParse({ ...req.body, userId: req.id });
  if (!validation.success) {
    const issues = validation.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return failValidation(res, issues);
  }

  const data = await categoriesService.create(validation.data as unknown as CreateCategoryInput);
  return ok(res, data, 'Category created successfully', 200);
});

// @desc  Update a category
// @route PUT /api/v1/categories/:id
// @access Private
export const updateCategory = asyncHandler(async (req: CustomRequest, res: Response) => {
  log('updateCategory', req);

  const validation = updateCategoryValidationSchema.safeParse(req.body);
  if (!validation.success) {
    const issues = validation.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return failValidation(res, issues);
  }

  const data = await categoriesService.update(
    String(req.params.id),
    validation.data as UpdateCategoryInput,
  );
  return ok(res, data, 'Category updated successfully', 200);
});

// @desc  Delete a category
// @route DELETE /api/v1/categories/:id
// @access Private
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  log('deleteCategory', req);
  const data = await categoriesService.remove(String(req.params.id));
  return ok(res, data, `Delete a single Category of id ${req.params.id}`);
});
