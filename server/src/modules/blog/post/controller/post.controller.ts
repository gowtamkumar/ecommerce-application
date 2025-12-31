import { Request, Response } from 'express';
import { getDBConnection } from '../../../../config/db';
import { CustomRequest } from '../../../../enums/custom-request-type';
import { asyncHandler } from '../../../../middlewares/async.middleware';
import { logger } from '../../../../middlewares/logger';
import { postValidationSchema } from '../../../../validation';
import { updatePostValidationSchema } from '../../../../validation/post/updatePostValidation';
import { PostCategoryEntity } from '../model/post-category.entity';
import { PostEntity } from '../model/post.entity';

// @desc Get all Post
// @route GET /api/v1/Post
// @access Public
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getPosts ${req.method} ${req.url}`);
  const { limit = 10, page = 1, categoryId } = req.query;

  const connection = await getDBConnection();
  const repository = connection.getRepository(PostEntity);

  const qb = repository.createQueryBuilder('post');
  qb.select(['post', 'postCategories.categoryId', 'user.name', 'category.name']);

  qb.leftJoin('post.postCategories', 'postCategories');
  qb.leftJoin('postCategories.category', 'category');
  qb.leftJoin('post.user', 'user');
  if (categoryId) {
    qb.where('postCategories.categoryId = :categoryId', { categoryId });
  }
  if (limit) {
    qb.take(Number(limit));
  }
  if (page) {
    qb.skip((+page - 1) * Number(limit));
  }

  const result = await qb.getMany();

  return res.status(200).json({
    success: true,
    message: 'Get all Post',
    data: {
      posts: result,
      total: await qb.getCount(), // Total count for pagination
      page: page ? Number(page) : 1,
      pageSize: limit ? Number(limit) : result.length,
    },
  });
});

// @desc Get a single Post
// @route GET /api/v1/Post/:id
// @access Public
export const getPost = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getPost ${req.method} ${req.url}`);

  const { slug } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(PostEntity);

  const qb = repository.createQueryBuilder('post');
  qb.select([
    'post',
    'postCategories.categoryId',
    'user.name',
    'user.image',
    'commentUser.name',
    'commentUser.image',
    'category.name',
    'comments.content',
    'comments.createdAt',
  ]);
  qb.leftJoin('post.postCategories', 'postCategories');
  qb.leftJoin('postCategories.category', 'category');
  qb.leftJoin('post.comments', 'comments');
  qb.leftJoin('comments.user', 'commentUser');
  qb.leftJoin('post.user', 'user');
  qb.where({ slug });
  const result = await qb.getOne();

  if (!result) {
    throw new Error(`Resource not found of slug #${req.params.slug}`);
  }

  return res.status(200).json({
    success: true,
    message: `Get a single Post of slug ${req.params.slug}`,
    data: result,
  });
});

// @desc Create a single Post
// @route POST /api/v1/Post
// @access Public
export const createPost = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createPost ${req.method} ${req.url}`);

  const validation = postValidationSchema.safeParse({
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

  const connection = await getDBConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { postCategories, ...resetData } = validation.data;
    const repository = queryRunner.manager.getRepository(PostEntity);

    // const slug = resetData.title.toLowerCase().trim().split(" ").join("-");

    resetData.slug = (resetData.slug ? resetData.slug : resetData.title)
      .toLowerCase()
      .trim()
      .split(' ')
      .join('-');

    const newPost = repository.create(resetData);

    const save = await repository.save(newPost);

    if (postCategories?.length) {
      const postCategoryRepository = queryRunner.manager.getRepository(PostCategoryEntity);
      const postCategoryEntities = postCategories.map((item) => ({
        categoryId: item,
        postId: save.id,
      }));
      await postCategoryRepository.save(postCategoryEntities);
    }

    await queryRunner.commitTransaction();

    return res.status(200).json({
      success: true,
      message: 'Create a new Post',
      data: save,
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Transaction failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create Post',
    });
  } finally {
    await queryRunner.release();
  }
});

// @desc Update a single Post
// @route PUT /api/v1/Post/:id
// @access Public
export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updatePost ${req.method} ${req.url}`);

  const { id } = req.params;

  const validation = updatePostValidationSchema.safeParse(req.body);

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

  const { postCategories, ...postData } = validation.data;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(PostEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, postData);
  await repository.save(updateData);

  if (postCategories && id) {
    const repoPostCategories = connection.getRepository(PostCategoryEntity);
    // remove post category
    const existingVariants = await repoPostCategories.find({
      where: { postId: id },
    });

    await repoPostCategories.remove(existingVariants);
    // new post category data
    const newOrderItems = await repoPostCategories.create(
      postCategories.map((item: any) => ({
        categoryId: item,
        postId: id,
      })),
    );
    await repoPostCategories.save(newOrderItems);
  }

  return res.status(200).json({
    success: true,
    message: `Update a single Post of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Post
// @route DELETE /api/v1/Post/:id
// @access Public
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deletePost ${req.method} ${req.url}`);

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
    message: `Delete a single Post of id ${req.params.id}`,
    data: result,
  });
});
