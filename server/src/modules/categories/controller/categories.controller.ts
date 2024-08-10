import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";

import { CategoriesEntity } from "../model/categories.entity";
import { categoriesValidationSchema } from "../../../validation/categories/categoriesValidation";
import { FileEntity } from "../../other/file/model/file.entity";
import { join } from "path";
import fs from "fs";

// @desc Get all Categorys
// @route GET /api/v1/categories/all
// @access Public
export const getAllCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const repository = connection.getRepository(CategoriesEntity);

    const user = await repository.find();

    return res.status(200).json({
      success: true,
      msg: "Get all categories",
      data: user,
    });
  }
);

// @desc Get all Categorys
// @route GET /api/v1/Categorys
// @access Public

export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const repository = connection.getTreeRepository(CategoriesEntity);

    const result = await repository.findTrees();

    const ress = result.map((lavel_1: any) => ({
      ...lavel_1,
      key: lavel_1.id,
      value: lavel_1.id,
      title: lavel_1.name,
      children:
        lavel_1?.children &&
        lavel_1?.children.map((lavel_2: any) => ({
          ...lavel_2,
          key: lavel_2.id,
          value: lavel_2.id,
          title: lavel_2.name,
          children:
            lavel_2.children &&
            lavel_2?.children.map((lavel_3: any) => ({
              ...lavel_3,
              key: lavel_3.id,
              value: lavel_3.id,
              title: lavel_3.name,
            })),
        })),
    }));

    return res.status(200).json({
      success: true,
      msg: "Get all Categorys",
      data: ress,
    });
  }
);

// @desc Get a single Category
// @route GET /api/v1/Categorys/:id
// @access Public
export const getCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const connection = await getDBConnection();
    const { id } = req.params;

    const categories = await connection.getRepository(CategoriesEntity);
    const result = await categories.findOne({
      where: { id },
      relations: { children: true },
    });

    if (!result) {
      return res.status(400).json({
        message: "categories not found",
      });
    }

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Category of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Category
// @route POST /api/v1/Categorys
// @access Public
export const createCategory = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();

  // Validate request body
  const validation = categoriesValidationSchema.safeParse({
    ...req.body,
    userId: req.id,
  });

  if (!validation.success) {
    return res.status(401).json({
      status: 401,
      message: validation.error.formErrors,
    });
  }
  const { name, image, userId, parentId } = validation.data;
  const categoriesRepository = connection.getRepository(CategoriesEntity);

  let level = 1;
  let parent = null;

  // If parentId is provided, fetch parent category
  if (parentId) {
    parent = await categoriesRepository.findOne({ where: { id: parentId } });

    if (!parent) {
      return res.status(400).json({
        status: 400,
        message: "Parent category not found",
      });
    }

    if (parent.level >= 3) {
      return res.status(400).json({
        status: 400,
        message: "No new child allowed for this category",
      });
    }

    level = parent.level + 1;
  }

  // Create the new category
  const newCategory = categoriesRepository.create({
    name,
    image,
    userId,
    level,
    parent,
  });

  // Save the category
  const savedCategory = await categoriesRepository.save(newCategory);

  return res.status(200).json({
    message: "Category created successfully",
    data: savedCategory,
  });
});

// @desc Update a single Category
// @route PUT /api/v1/Categorys/:id
// @access Public
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const { id } = req.params;
    const { parentId, name, image, urlSlug } = req.body;

    const categoriesRepository = connection.getRepository(CategoriesEntity);

    // Fetch the category to be updated
    const category = await categoriesRepository.findOne({ where: { id } });

    if (!category) {
      return res.status(400).json({
        status: 400,
        message: "Category not found",
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
          message: "Parent category not found",
        });
      }
      // Merge the new data with the existing category
      Object.assign(category, {
        name,
        image,
        urlSlug,
        level: parentCategory.level,
        parent: parentCategory,
      });
    } else {
      // Merge the new data without changing the parent
      Object.assign(category, { name, image, urlSlug });
    }

    // Save the updated category
    await categoriesRepository.save(category);

    return res.status(200).json({
      message: "Category updated successfully",
      data: category,
    });
  }
);

// @desc Delete a single Category
// @route DELETE /api/v1/Categorys/:id
// @access Public
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(CategoriesEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    if (result.image) {
      const repository = connection.getRepository(FileEntity);
      const directory = join(process.cwd(), "/public/uploads");
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
      msg: `Delete a single Category of id ${req.params.id}`,
      data: result,
    });
  }
);
