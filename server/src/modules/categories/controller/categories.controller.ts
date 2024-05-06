import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";

import { CategoriesEntity } from "../model/categories.entity";
import { categoriesValidationSchema } from "../../../validation/categories/categoriesValidation";

// @desc Get all Categorys
// @route GET /api/v1/Categorys
// @access Public
export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const repository = connection.getTreeRepository(CategoriesEntity);

    const result = await repository.findTrees();

    return res.status(200).json({
      success: true,
      msg: "Get all Categorys",
      data: result,
    });
  }
);

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
  const validation = categoriesValidationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(401).json({
      status: 401,
      message: validation.error.formErrors,
    });
  }

  const categories = await connection.getRepository(CategoriesEntity);

  if (validation.data.parentId) {
    const maxLevel = 3;

    const parent = await categories.findOne({
      where: { id: validation.data.parentId },
    });

    if (parent.level >= maxLevel) {
      return res.status(401).json({
        status: 400,
        message: "No new child allowed for this Category",
      });
    }

    const newCreateCategory = {
      name: validation.data.name,
      image: validation.data.image,
      urlSlug: validation.data.urlSlug,
      level: parent.level + 1,
      parent: parent,
    };

    const newCategories = categories.create(newCreateCategory);

    const save = await categories.save(newCategories);

    return res.status(200).json({
      message: "Create new categories",
      data: save,
    });
  } else {
    const newCreateCategory = {
      name: validation.data.name,
      image: validation.data.image,
      urlSlug: validation.data.urlSlug,
      level: 1,
      parent: null,
    };

    const newCategories = categories.create(newCreateCategory);
    const save = await categories.save(newCategories);
    return res.status(200).json({
      message: "Create new categories",
      data: save,
    });
  }
});

// @desc Update a single Category
// @route PUT /api/v1/Categorys/:id
// @access Public
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const { id } = req.params;

    const categories = await connection.getRepository(CategoriesEntity);

    const result = await categories.findOneBy({ id });

    const parent = await categories.findOne({
      where: { id: req.body.parentId },
      relations: { children: true },
    });

    console.log("🚀 ~ parent:", parent);

    if (!result) {
      return res.status(400).json({
        status: 400,
        message: "categories not found",
      });
    }

    const newCreateCategory = {
      name: req.body.name,
      image: req.body.image,
      urlSlug: req.body.urlSlug,
      level: parent.level,
      parent: parent,
    };

    const updateData = await categories.merge(result, newCreateCategory);

    await categories.save(updateData);

    return res.status(200).json({
      message: "Update a categories Successfull",
      data: updateData,
    });
    // }

    //   if (categories.data.parentId) {
    //     const maxLevel = 3;

    //     console.log("categories.data.parentId", categories.data.parentId);

    //     const parent = await categories.findOne({
    //       where: { id: req.body.parentId },
    //       relations: { children: true },
    //     });

    //     if (parent.level >= maxLevel) {
    //       return res.status(200).json({
    //         message: "No new child allowed for this Category",
    //       });
    //     }

    //     const newCreateCategory = {
    //       name: req.body.name,
    //       image: req.body.image,
    //       urlSlug: req.body.urlSlug,
    //       level: parent.level + 1,
    //       parent: parent,
    //     };

    //     const updateData = await categories.merge(result, newCreateCategory);
    //     const save = await categories.save(updateData);

    //     return res.status(200).json({
    //       message: "update new categories",
    //       status: 200,
    //       data: save,
    //     });
    //   } else {
    //     const updateData = await categories.merge(result, req.body);

    //     await categories.save(updateData);

    //     return res.status(200).json({
    //       message: "Update a categories Successfull",
    //       data: updateData,
    //     });
    //   }
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

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a single Category of id ${req.params.id}`,
      data: result,
    });
  }
);
