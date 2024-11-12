import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { TaxEntity } from "../model/tax.entity";
import { taxValidationSchema } from "../../../validation";

// @desc Get all Tax
// @route GET /api/v1/Tax
// @access Public
export const getTaxs = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(TaxEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: "Get all Tax",
    data: result,
  });
});

// @desc Get a single Tax
// @route GET /api/v1/Tax/:id
// @access Public
export const getTax = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(TaxEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Tax of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Tax
// @route POST /api/v1/Tax
// @access Public
export const createTax = asyncHandler(async (req: any, res: Response) => {
  const validation = taxValidationSchema.safeParse({
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

  const repository = connection.getRepository(TaxEntity);

  const newTax = repository.create(validation.data);
  const save = await repository.save(newTax);

  return res.status(200).json({
    success: true,
    message: "Create a new Tax",
    data: save,
  });
});

// @desc Update a single Tax
// @route PUT /api/v1/Tax/:id
// @access Public
export const updateTax = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const validation = taxValidationSchema.safeParse(req.body);

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

  const repository = await connection.getRepository(TaxEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, validation.data);

  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: `Update a single Tax of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Tax
// @route DELETE /api/v1/Tax/:id
// @access Public
export const deleteTax = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(TaxEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single Tax of id ${req.params.id}`,
    data: result,
  });
});
