import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { PostEntity } from "../model/post.entity";
import { postValidationSchema } from "../../../validation";

// @desc Get all Post
// @route GET /api/v1/Post
// @access Public
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(PostEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    msg: "Get all Post",
    data: result,
  });
});

// @desc Get a single Post
// @route GET /api/v1/Post/:id
// @access Public
export const getPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(PostEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Post of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Post
// @route POST /api/v1/Post
// @access Public
export const createPost = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = postValidationSchema.safeParse({
    ...req.body,
    userId: req.id,
  });

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(PostEntity);

  const newPost = repository.create(validation.data);
  const save = await repository.save(newPost);

  return res.status(200).json({
    success: true,
    msg: "Create a new Post",
    data: save,
  });
});

// @desc Update a single Post
// @route PUT /api/v1/Post/:id
// @access Public
export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();

  const repository = await connection.getRepository(PostEntity);

  const result = await repository.findOneBy({ id });

  const updateData = await repository.merge(result, req.body);

  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    msg: `Update a single Post of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Post
// @route DELETE /api/v1/Post/:id
// @access Public
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(PostEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    msg: `Delete a single Post of id ${req.params.id}`,
    data: result,
  });
});
