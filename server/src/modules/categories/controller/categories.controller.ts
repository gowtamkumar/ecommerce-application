import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { CategoriesEntity } from "../model/categories.entity";
import { categoriesValidationSchema } from "../../../validation/categories/categoriesValidation";
import { FileEntity } from "../../other/file/model/file.entity";
import { join } from "path";
import fs from "fs";
import { logger } from "../../../middlewares/logger";
import { CustomRequest } from "../../../enums/custom-request-type";

// @desc Get all Categorys
// @route GET /api/v1/categories/all
// @access Public
export const getPublicCategories = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: getPublicCategories ${req.method} ${req.url}`);
    const connection = await getDBConnection();
    const repository = connection.getRepository(CategoriesEntity);

    const categories = await repository.find();

    return res.status(200).json({
      success: true,
      message: "Get all categories",
      data: categories,
    });
  }
);

// @desc Get all for antd Categorys
// @route GET /api/v1/categories/antd
// @access Public
// export const getAntdCategories = asyncHandler(
//   async (req: Request, res: Response) => {
//     logger.info(`Service: getPublicCategorie ${req.method} ${req.url}`);
//     const connection = await getDBConnection();
//     const repository = connection.getTreeRepository(CategoriesEntity);

//     const result = await repository.findTrees();

//     const ress = result.map((lavel_1: any) => ({
//       ...lavel_1,
//       key: lavel_1.id,
//       value: lavel_1.id,
//       title: lavel_1.name,
//       children:
//         lavel_1?.children &&
//         lavel_1?.children.map((lavel_2: any) => ({
//           ...lavel_2,
//           key: lavel_2.id,
//           value: lavel_2.id,
//           title: lavel_2.name,
//           children:
//             lavel_2.children &&
//             lavel_2?.children.map((lavel_3: any) => ({
//               ...lavel_3,
//               key: lavel_3.id,
//               value: lavel_3.id,
//               title: lavel_3.name,
//             })),
//         })),
//     }));

//     return res.status(200).json({
//       success: true,
//       message: "Get all for antd table Categorys",
//       data: ress,
//     });
//   }
// );

export const getAntdCategories = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: getPublicCategorie ${req.method} ${req.url}`);

    const connection = await getDBConnection();
    const repository = connection.getTreeRepository(CategoriesEntity);

    const result = await repository.findTrees();

    const formatted = result.map(formatCategoryTree);

    return res.status(200).json({
      success: true,
      message: "Get all for antd table Categorys",
      data: formatted,
    });
  }
);

// @desc Get all Categorys
// @route GET /api/v1/categories
// @access Public
export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: getCategories ${req.method} ${req.url}`);
    const connection = await getDBConnection();
    const repository = connection.getRepository(CategoriesEntity);

    const user = await repository.find();

    return res.status(200).json({
      success: true,
      message: "Get all categories",
      data: user,
    });
  }
);

// @desc Get a single Category
// @route GET /api/v1/categories/:id
// @access Public
export const getCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
        message: "categories not found",
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
  }
);

// @desc Create a single Category
// @route POST /api/v1/categories
// @access Public
export const createCategory = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    logger.info(`Service: createCategory ${req.method} ${req.url}`);
    const connection = await getDBConnection();
    // Validate request body
    const validation = categoriesValidationSchema.safeParse({
      ...req.body,
      userId: req.id,
    });

    if (!validation.success) {
      const formattedErrors = validation.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        issues: formattedErrors,
      });
    }

    const { name, image, userId, parentId, description } = validation.data;
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
      description,
      parent,
    });

    // Save the category
    const savedCategory = await categoriesRepository.save(newCategory);

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: savedCategory,
    });
  }
);

// @desc Update a single Category
// @route PUT /api/v1/categories/:id
// @access Public
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: updateCategory ${req.method} ${req.url}`);
    const connection = await getDBConnection();
    const { id } = req.params;
    const { parentId, name, image, slug, description, active } = req.body;

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
        slug,
        description,
        level: parentCategory.level,
        parent: parentCategory,
        active,
      });
    } else {
      // Merge the new data without changing the parent
      Object.assign(category, { name, image, slug, description, active });
    }

    // Save the updated category
    await categoriesRepository.save(category);

    return res.status(200).json({
      success: true,
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
      message: `Delete a single Category of id ${req.params.id}`,
      data: result,
    });
  }
);

function formatCategoryTree(node: any): any {
  return {
    // ...node,
    key: node.id.toString(),
    // value: node.id.toString(),
    slug: node.slug,
    active: node.active,
    label: node.name,
    title: node.name,
    children:
      node.children?.length > 0 ? node.children?.map(formatCategoryTree) : null,
  };
}
