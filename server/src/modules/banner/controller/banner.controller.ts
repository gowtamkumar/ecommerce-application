import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { BannerEntity } from "../model/banner.entity";
import { bannerValidationSchema } from "../../../validation";

// @desc Get all Banner
// @route GET /api/v1/Banner
// @access Public
export const getBanners = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(BannerEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    msg: "Get all Banner",
    data: result,
  });
});

// @desc Get a single Banner
// @route GET /api/v1/Banner/:id
// @access Public
export const getBanner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(BannerEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Banner of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Banner
// @route POST /api/v1/Banner
// @access Public
export const createBanner = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = bannerValidationSchema.safeParse({
    ...req.body,
    userId: req.id,
  });

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(BannerEntity);

  const newBanner = repository.create(validation.data);
  const save = await repository.save(newBanner);

  return res.status(200).json({
    success: true,
    msg: "Create a new Banner",
    data: save,
  });
});

// @desc Update a single Banner
// @route PUT /api/v1/Banner/:id
// @access Public
export const updateBanner = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const repository = await connection.getRepository(BannerEntity);

    const result = await repository.findOneBy({ id });

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a single Banner of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single Banner
// @route DELETE /api/v1/Banner/:id
// @access Public
export const deleteBanner = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(BannerEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a single Banner of id ${req.params.id}`,
      data: result,
    });
  }
);
