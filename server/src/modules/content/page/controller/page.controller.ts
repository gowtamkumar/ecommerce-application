import { NextFunction, Request, Response } from 'express';
import { getDBConnection } from '@/config/db';
import { CustomRequest } from '@/enums/custom-request-type';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { createPageValidation } from '@/validation/page/createPageValidation';
import { updatePageValidation } from '@/validation/page/updatePageValidation';
import { PageEntity } from '../model/page.entity';

// @desc Get all Pages
// @route GET /api/v1/pages
// @access Public
export const getPages = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: getPages ${req.method} ${req.url}`);
    const { status } = req.query;
    const connection = await getDBConnection();
    const repository = connection.getRepository(PageEntity);

    const customQuery: any = {};
    if (status) {
      customQuery.status = status;
    }

    const result = await repository.find({ where: customQuery });
    return res.status(200).json({
      success: true,
      message: 'Get all Pages',
      data: result,
    });
  },
);

// @desc Get a single Page by ID
// @route GET /api/v1/pages/:id
// @access Public
export const getPage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getPage ${req.method} ${req.url}`);
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(PageEntity);
    const result = await repository.findOneBy({ id: parseInt(id as string) });

    if (!result) {
      throw new Error(`Page not found with id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Page of id ${req.params.id}`,
      data: result,
    });
  },
);

// @desc Get a single Page by Slug
// @route GET /api/v1/pages/slug/:slug
// @access Public
export const getPageBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getPageBySlug ${req.method} ${req.url}`);
    const { slug } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(PageEntity);
    const result = await repository.findOneBy({ slug });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Page not found with slug: ${slug}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Get Page by slug: ${slug}`,
      data: result,
    });
  },
);

// @desc Create a new Page
// @route POST /api/v1/pages
// @access Private
export const createPage = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    logger.info(`Service: createPage ${req.method} ${req.url}`);
    const connection = await getDBConnection();
    console.log("req.body", req.body);
    console.log("req.id", req.id);
    const validation = createPageValidation.safeParse({
      ...req.body,
      userId: req.id,
    });

    console.log("validation", validation);
    

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

    const repository = connection.getRepository(PageEntity);

    // Check if slug already exists
    const existingPage = await repository.findOneBy({
      slug: validation.data.slug,
    });
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: 'Page with this slug already exists',
      });
    }

    const newPage = repository.create(validation.data);
    const save = await repository.save(newPage);

    return res.status(201).json({
      success: true,
      message: 'Page created successfully',
      data: save,
    });
  },
);

// @desc Update a single Page
// @route PUT /api/v1/pages/:id
// @access Private
export const updatePage = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: updatePage ${req.method} ${req.url}`);
    const { id } = req.params;
    const connection = await getDBConnection();

    const validation = updatePageValidation.safeParse(req.body);

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

    const repository = await connection.getRepository(PageEntity);

    const result = await repository.findOneBy({ id: parseInt(id as string) });

    if (!result) {
      throw new Error(`Page not found`);
    }

    // Check if updating slug and if it already exists
    if (req.body.slug && req.body.slug !== result.slug) {
      const existingPage = await repository.findOneBy({
        slug: req.body.slug,
      });
      if (existingPage) {
        return res.status(400).json({
          success: false,
          message: 'Page with this slug already exists',
        });
      }
    }

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      message: `Page updated successfully`,
      data: updateData,
    });
  },
);

// @desc Delete a single Page
// @route DELETE /api/v1/pages/:id
// @access Private
export const deletePage = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: deletePage ${req.method} ${req.url}`);
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(PageEntity);

    const result = await repository.findOneBy({ id: parseInt(id as string) });
    if (!result) {
      throw new Error(`Page not found with id #${req.params.id}`);
    }

    await repository.delete({ id: parseInt(id as string) });

    return res.status(200).json({
      success: true,
      message: `Page deleted successfully`,
      data: result,
    });
  },
);
