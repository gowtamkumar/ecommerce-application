import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { ReviewEntity } from "../model/review.entity";
import { reviewValidationSchema } from "../../../validation";

// @desc Get all Review
// @route GET /api/v1/Review
// @access Public
export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(ReviewEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    msg: "Get all Review",
    data: result,
  });
});

// @desc Get a single Review
// @route GET /api/v1/Review/:id
// @access Public
export const getReview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ReviewEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Review of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Review
// @route POST /api/v1/Review
// @access Public
export const createReview = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = reviewValidationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(ReviewEntity);

  const newReview = repository.create(validation.data);

  const save = await repository.save(newReview);

  return res.status(200).json({
    success: true,
    msg: "Create a new Review",
    data: save,
  });
});

// @desc Update a single Review
// @route PUT /api/v1/Review/:id
// @access Public
export const updateReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const repository = await connection.getRepository(ReviewEntity);

    const result = await repository.findOneBy({ id });

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a single Review of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single Review
// @route DELETE /api/v1/Review/:id
// @access Public
export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ReviewEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a single Review of id ${req.params.id}`,
      data: result,
    });
  }
);
