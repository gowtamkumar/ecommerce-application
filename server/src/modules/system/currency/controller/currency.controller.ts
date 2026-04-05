import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/middlewares/async.middleware';
import { getDBConnection } from '@/config/db';
import { CurrencyEntity } from '../model/currency.entity';
import { currencyValidationSchema } from '@/validation';
import { updateCurrencyValidationSchema } from '@/validation/currency/updateCurrencyValidation';
import { logger } from '@/middlewares/logger';
import { CustomRequest } from '@/enums/custom-request-type';

// @desc Get all Currency
// @route GET /api/v1/Currency
// @access Public
export const getCurrencies = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getCurrencies ${req.method} ${req.url}`);
  const connection = await getDBConnection();
  const repository = connection.getRepository(CurrencyEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: 'Get all Currency',
    data: result,
  });
});

// @desc Get a single Currency
// @route GET /api/v1/Currency/:id
// @access Public
export const getCurrency = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: getCurrency ${req.method} ${req.url}`);
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(CurrencyEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  return res.status(200).json({
    success: true,
    message: `Get a single Currency of id ${req.params.id}`,
    data: result,
  });
});

// @desc Create a single Currency
// @route POST /api/v1/Currency
// @access Public
export const createCurrency = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createCurrency ${req.method} ${req.url}`);
  const connection = await getDBConnection();
  const validation = currencyValidationSchema.safeParse({
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

  const repository = connection.getRepository(CurrencyEntity);

  const newCurrency = repository.create(validation.data);
  const save = await repository.save(newCurrency);

  return res.status(200).json({
    success: true,
    message: 'Create a new Currency',
    data: save,
  });
});

// @desc Update a single Currency
// @route PUT /api/v1/Currency/:id
// @access Public
export const updateCurrency = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateCurrency ${req.method} ${req.url}`);
  const { id } = req.params;

  const validation = updateCurrencyValidationSchema.safeParse(req.body);

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
  const connection = await getDBConnection();
  const repository = await connection.getRepository(CurrencyEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }
  const updateData = await repository.merge(result, validation.data);
  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: `Update a single Currency of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Currency
// @route DELETE /api/v1/Currency/:id
// @access Public
export const deleteCurrency = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteCurrency ${req.method} ${req.url}`);
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
    message: `Delete a single Currency of id ${req.params.id}`,
    data: result,
  });
});
