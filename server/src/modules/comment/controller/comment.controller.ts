import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { CommentEntity } from "../model/comment.entity";
import {commentValidationSchema } from "../../../validation";
import { updateCommentValidationSchema } from "../../../validation/comment/updateCommentValidation";

// @desc Get all Comment
// @route GET /api/v1/Comment
// @access Public
export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(CommentEntity);

  const result = await repository.find({
    relations: {
      product: true,
    },
    select: {
      product: {
        name: true,
      },
    },
  });

  return res.status(200).json({
    success: true,
    msg: "Get all Comment",
    data: result,
  });
});

// @desc Get a single Comment
// @route GET /api/v1/Comment/:id
// @access Public
export const getComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(CommentEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Comment of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Comment
// @route POST /api/v1/Comment
// @access Public
export const createComment = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = commentValidationSchema.safeParse({
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

  const repository = connection.getRepository(CommentEntity);

  const newComment = repository.create(validation.data);

  const save = await repository.save(newComment);

  return res.status(200).json({
    success: true,
    msg: "Create a new Comment",
    data: save,
  });
});

// @desc Update a single Comment
// @route PUT /api/v1/Comment/:id
// @access Public
export const updateComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const validation = updateCommentValidationSchema.safeParse(req.body);
  
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

    const repository = await connection.getRepository(CommentEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    const updateData = await repository.merge(result, validation.data);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a single Comment of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Update a single Comment
// @route PUT /api/v1/Comments/increage:id
// @access Public
export const commentLike = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();

  const repository = await connection.getRepository(CommentEntity);

  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.save({ id: result.id, like: result.like + 1 });

  return res.status(200).json({
    success: true,
    msg: `Update a single Comment of id ${req.params.id}`,
    data: result,
  });
});

export const commentDisLike = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const repository = await connection.getRepository(CommentEntity);

    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.save({ id: result.id, disLike: result.disLike + 1 });

    return res.status(200).json({
      success: true,
      msg: `Update a single Comment of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Delete a single Comment
// @route DELETE /api/v1/Comment/:id
// @access Public
export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(CommentEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a single Comment of id ${req.params.id}`,
      data: result,
    });
  }
);
