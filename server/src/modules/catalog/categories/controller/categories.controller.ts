import { getDBConnection } from '@/config/db';
import { CustomRequest } from '@/enums/custom-request-type';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { FileEntity } from '@/modules/system/other/file/model/file.entity';
import { categoriesValidationSchema } from '@/validation/categories/categoriesValidation';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { join } from 'path';
import { CategoriesEntity } from '../model/categories.entity';

// @desc Get all Categorys
// @route GET /api/v1/categories/all
// @access Public
export const getPublicCategories = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getPublicCategories ${req.method} ${req.url}`);
  const connection = await getDBConnection();
  const repository = connection.getRepository(CategoriesEntity);

  const categories = await repository.find();

  return res.status(200).json({
    success: true,
    message: 'Get all categories',
    data: categories,
  });
});

export const getAntdCategories = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getPublicCategorie ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getTreeRepository(CategoriesEntity);

  const result = await repository.findTrees();

  const formatted = result.map(formatCategoryTree);

  return res.status(200).json({
    success: true,
    message: 'Get all for antd table Categorys',
    data: formatted,
  });
});

export const getCategoriesForMenu = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getCategoriesForMenu ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  // const repository = connection.getTreeRepository(CategoriesEntity);

  // const result = await repository.findTrees({
  //   where: { active: true },
  // });

  const result = await connection
  .getRepository(CategoriesEntity)
  .createQueryBuilder("category")
  .leftJoin("category.children", "children")
  .select([
    "category.id",
    "category.name",
    "category.slug",
    "category.image",
    "category.description",
    "category.level",
    "category.active",
    "category.isFeatured",
    "category.createdAt",
    "category.updatedAt",
    "children.id",
    "children.name",
    "children.slug",
    "children.image",
    "children.description",
    "children.level",
    "children.active",
    "children.isFeatured",
    "children.createdAt",
    "children.updatedAt",
  ])
  .where("category.active = :active", { active: true })
  .andWhere("category.parentId IS NULL")
  .andWhere("(children.id IS NULL OR children.active = :active)", { active: true })
  .getMany();

  console.log("result", result);
  
  return res.status(200).json({
    success: true,
    message: 'Get all for Menu',
    data: result,
  });
});

// @desc Get all Categorys
// @route GET /api/v1/categories
// @access Public
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getCategories ${req.method} ${req.url}`);
  const connection = await getDBConnection();
  const repository = connection.getRepository(CategoriesEntity);

  const user = await repository.find();

  return res.status(200).json({
    success: true,
    message: 'Get all categories',
    data: user,
  });
});

// @desc Get a single Category
// @route GET /api/v1/categories/:id
// @access Public
export const getCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: getCategory ${req.method} ${req.url}`);
  const connection = await getDBConnection();
  const { id } = req.params;

  const categories = await connection.getRepository(CategoriesEntity);
  const result = await categories.findOne({
    where: { id },
    relations: { children: true },
  });

  if (!result) {
    return res.status(400).json({
      message: 'categories not found',
    });
  }

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  return res.status(200).json({
    success: true,
    message: `Get a single Category of id ${req.params.id}`,
    data: result,
  });
});

// @desc Create a single Category
// @route POST /api/v1/categories
// @access Public
export const createCategory = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createCategory ${req.method} ${req.url}`);
  const connection = await getDBConnection();
  // Validate request body
  const validation = categoriesValidationSchema.safeParse({
    ...req.body,
    userId: req.id,
  });

  if (!validation.success) {
    const formattedErrors = validation.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      issues: formattedErrors,
    });
  }

  const { name, image, userId, parentId, description, isFeatured } = validation.data;
  const categoriesRepository = connection.getRepository(CategoriesEntity);

  const slug = name.toLowerCase().trim().split(' ').join('-');

  let level = 1;
  let parent = null;

  // If parentId is provided, fetch parent category
  if (parentId) {
    parent = await categoriesRepository.findOne({ where: { id: parentId } });

    if (!parent) {
      return res.status(400).json({
        status: 400,
        message: 'Parent category not found',
      });
    }

    if (parent.level >= 3) {
      return res.status(400).json({
        status: 400,
        message: 'No new child allowed for this category',
      });
    }

    level = parent.level + 1;
  }

  // Create the new category
  const newCategory = categoriesRepository.create({
    name,
    slug,
    image,
    userId,
    level,
    description,
    parent,
    isFeatured,
  });

  // Save the category
  const savedCategory = await categoriesRepository.save(newCategory);

  return res.status(200).json({
    success: true,
    message: 'Category created successfully',
    data: savedCategory,
  });
});

// @desc Update a single Category
// @route PUT /api/v1/categories/:id
// @access Public
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateCategory ${req.method} ${req.url}`);
  const connection = await getDBConnection();
  const { id } = req.params;
  const { parentId, name, image, slug, description, active, isFeatured } = req.body;

  const categoriesRepository = connection.getRepository(CategoriesEntity);

  // Fetch the category to be updated
  const category = await categoriesRepository.findOne({ where: { id } });

  if (!category) {
    return res.status(400).json({
      status: 400,
      message: 'Category not found',
    });
  }

  // If a parentId is provided, fetch the parent category
  if (parentId) {
    const parentCategory = await categoriesRepository.findOne({
      where: { id: parentId },
      relations: { children: true },
    });

    if (!parentCategory) {
      return res.status(400).json({
        status: 400,
        message: 'Parent category not found',
      });
    }
    // Merge the new data with the existing category
    Object.assign(category, {
      name,
      image,
      slug,
      description,
      level: parentCategory.level,
      parent: parentCategory,
      active,
      isFeatured,
    });
  } else {
    // Merge the new data without changing the parent
    Object.assign(category, { name, image, slug, description, active, isFeatured });
  }

  // Save the updated category
  await categoriesRepository.save(category);

  return res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: category,
  });
});

// @desc Delete a single Category
// @route DELETE /api/v1/Categorys/:id
// @access Public
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteCategory ${req.method} ${req.url}`);
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(CategoriesEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  if (result.image) {
    const repository = connection.getRepository(FileEntity);
    const directory = join(process.cwd(), '/public/uploads');
    const filePath = `${directory}/${result.image}`;
    const [deleteFile] = await Promise.all([
      repository.findOne({ where: { filename: result.image } }),
      fs.promises.unlink(filePath),
    ]);
    await repository.remove(deleteFile);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single Category of id ${req.params.id}`,
    data: result,
  });
});

function formatCategoryTree(node: any): any {
  return {
    ...node,
    key: node.id.toString(),
    value: node.id,
    label: node.name,
    title: node.name,
    children: node.children?.length > 0 ? node.children?.map(formatCategoryTree) : null,
  };
}
