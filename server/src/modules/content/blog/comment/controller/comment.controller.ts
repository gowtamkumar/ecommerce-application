import { Request, Response } from 'express';
import { getDBConnection } from '@/config/db';
import { CustomRequest } from '@/enums/custom-request-type';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { commentValidationSchema } from '@/validation';
import { updateCommentValidationSchema } from '@/validation/comment/updateCommentValidation';
import { CommentEntity } from '../model/comment.entity';

// @desc Get all Comment
// @route GET /api/v1/Comment
// @access Public
export const getComments = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getComments ${req.method} ${req.url}`);
  const connection = await getDBConnection();
  const repository = connection.getRepository(CommentEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: 'Get all Comment',
    data: result,
  });
});

// @desc Get a single Comment
// @route GET /api/v1/Comment/:id
// @access Public
export const getComment = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getComment ${req.method} ${req.url}`);
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(CommentEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  return res.status(200).json({
    success: true,
    message: `Get a single Comment of id ${req.params.id}`,
    data: result,
  });
});

// @desc Create a single Comment
// @route POST /api/v1/Comment
// @access Public
export const createComment = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createComment ${req.method} ${req.url}`);
  const connection = await getDBConnection();
  console.log('req.body', req.body);

  const validation = commentValidationSchema.safeParse({
    ...req.body,
    userId: req.id,
  });

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

  const repository = connection.getRepository(CommentEntity);

  const newComment = repository.create(validation.data);

  const save = await repository.save(newComment);

  return res.status(200).json({
    success: true,
    message: 'Create a new Comment',
    data: save,
  });
});

// @desc Update a single Comment
// @route PUT /api/v1/Comment/:id
// @access Public
export const updateComment = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateComment ${req.method} ${req.url}`);
  const { id } = req.params;
  const connection = await getDBConnection();

  const validation = updateCommentValidationSchema.safeParse(req.body);

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
  const repository = await connection.getRepository(CommentEntity);
  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }
  const updateData = await repository.merge(result, validation.data);
  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: `Update a single Comment of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Update a single Comment
// @route PUT /api/v1/Comments/increage:id
// @access Public
export const commentLike = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: commentLike ${req.method} ${req.url}`);
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
    message: `Update a single Comment of id ${req.params.id}`,
    data: result,
  });
});

export const commentDisLike = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: commentDisLike ${req.method} ${req.url}`);
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
    message: `Update a single Comment of id ${req.params.id}`,
    data: result,
  });
});

// @desc Delete a single Comment
// @route DELETE /api/v1/Comment/:id
// @access Public
export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteComment ${req.method} ${req.url}`);
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
    message: `Delete a single Comment of id ${req.params.id}`,
    data: result,
  });
});
