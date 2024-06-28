import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { StatusEntity } from "../model/status.entity";
import { statusValidationSchema } from "../../../validation/status/statusValidation";

// @desc Get all Status
// @route GET /api/v1/Status
// @access Public
export const getStatuss = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(StatusEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    msg: "Get all Status",
    data: result,
  });
});

// @desc Get a single Status
// @route GET /api/v1/Status/:id
// @access Public
export const getStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(StatusEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Status of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Status
// @route POST /api/v1/Status
// @access Public
export const createStatus = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = statusValidationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(StatusEntity);

  const newStatus = repository.create(validation.data);

  const save = await repository.save(newStatus);

  return res.status(200).json({
    success: true,
    msg: "Create a new Status",
    data: save,
  });
});

// @desc Update a single Status
// @route PUT /api/v1/Status/:id
// @access Public
export const updateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const repository = await connection.getRepository(StatusEntity);

    const result = await repository.findOneBy({ id });

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a single Status of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single Status
// @route DELETE /api/v1/Status/:id
// @access Public
export const deleteStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(StatusEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a single Status of id ${req.params.id}`,
      data: result,
    });
  }
);
