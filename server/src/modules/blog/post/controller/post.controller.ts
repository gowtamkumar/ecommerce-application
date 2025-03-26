import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../../middlewares/async.middleware";
import { getDBConnection } from "../../../../config/db";
import { PostEntity } from "../model/post.entity";
import { postValidationSchema } from "../../../../validation";
import { PostCategoryEntity } from "../model/post-category.entity";
import { updatePostValidationSchema } from "../../../../validation/post/updatePostValidation";
import { logger } from "../../../../middlewares/logger";
import { CustomRequest } from "../../../../enums/custom-request-type";

// @desc Get all Post
// @route GET /api/v1/Post
// @access Public
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getPosts ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(PostEntity);

  const qb = repository.createQueryBuilder("post");
  qb.select([
    "post",
    "postCategories",
    "user.name",
    "category.name",
    "comments",
  ]);

  qb.leftJoin("post.postCategories", "postCategories");
  qb.leftJoin("post.comments", "comments");
  qb.leftJoin("postCategories.category", "category");
  qb.leftJoin("post.user", "user");

  const result = await qb.getMany();

  return res.status(200).json({
    success: true,
    message: "Get all Post",
    data: result,
  });
});

// @desc Get a single Post
// @route GET /api/v1/Post/:id
// @access Public
export const getPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getPost ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(PostEntity);

    const qb = repository.createQueryBuilder("post");
    qb.select([
      "post",
      "postCategories",
      "user.name",
      "user.image",
      "category",
    ]);

    qb.leftJoin("post.postCategories", "postCategories");
    qb.leftJoin("postCategories.category", "category");
    qb.leftJoin("post.user", "user");
    qb.where({ id });
    const result = await qb.getOne();

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Post of id ${req.params.id}`,
      data: result,
    });
  }
);

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
      path: issue.path.join("."),
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

    const newPost = repository.create(resetData);

    const save = await repository.save(newPost);

    if (postCategories?.length) {
      const postCategoryRepository =
        queryRunner.manager.getRepository(PostCategoryEntity);
      const postCategoryEntities = postCategories.map((item) => ({
        categoryId: item,
        postId: save.id,
      }));
      await postCategoryRepository.save(postCategoryEntities);
    }

    await queryRunner.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Create a new Post",
      data: save,
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Transaction failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Post",
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
      path: issue.path.join("."),
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
      }))
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
