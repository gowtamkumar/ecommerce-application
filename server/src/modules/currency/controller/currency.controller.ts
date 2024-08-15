import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { CurrencyEntity } from "../model/currency.entity";
import { currencyValidationSchema } from "../../../validation";

// @desc Get all Currency
// @route GET /api/v1/Currency
// @access Public
export const getCurrencies = asyncHandler(
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const repository = connection.getRepository(CurrencyEntity);

    const result = await repository.find();

    return res.status(200).json({
      success: true,
      msg: "Get all Currency",
      data: result,
    });
  }
);

// @desc Get a single Currency
// @route GET /api/v1/Currency/:id
// @access Public
export const getCurrency = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(CurrencyEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Currency of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Currency
// @route POST /api/v1/Currency
// @access Public
export const createCurrency = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = currencyValidationSchema.safeParse({
    ...req.body,
    userId: req.id,
  });

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(CurrencyEntity);

  const newCurrency = repository.create(validation.data);
  const save = await repository.save(newCurrency);

  return res.status(200).json({
    success: true,
    msg: "Create a new Currency",
    data: save,
  });
});

// @desc Update a single Currency
// @route PUT /api/v1/Currency/:id
// @access Public
export const updateCurrency = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const repository = await connection.getRepository(CurrencyEntity);

    const result = await repository.findOneBy({ id });

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a single Currency of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single Currency
// @route DELETE /api/v1/Currency/:id
// @access Public
export const deleteCurrency = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(CurrencyEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a single Currency of id ${req.params.id}`,
      data: result,
    });
  }
);
