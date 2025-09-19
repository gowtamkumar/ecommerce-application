import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../../middlewares/async.middleware';
import { getDBConnection } from '../../../config/db';
import { shippingAddressValidationSchema } from '../../../validation';
import { ShippingAddressEntity } from '../model/shipping-address.entity';
import { updateShippingAddressValidationSchema } from '../../../validation/shipping-address/updateShippingAddressValidation';
import { logger } from '../../../middlewares/logger';
import { CustomRequest } from '../../../enums/custom-request-type';

// @desc Get all ShippingAddress
// @route GET /api/v1/shipping-address
// @access Public
export const getShippingAddresses = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getShippingAddresses ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(ShippingAddressEntity);

  const result = await repository.find({
    relations: ['division', 'district', 'upazila', 'union', 'user'],
  });

  return res.status(200).json({
    success: true,
    message: 'Get all ShippingAddress',
    data: result,
  });
});

// @desc Get all ShippingAddress
// @route GET /api/v1/shipping-address
// @access Public
export const getUserShippingAddresses = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: getUserShippingAddresses ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(ShippingAddressEntity);

  const result = await repository.find({
    where: { userId: req.id },
    relations: ['division', 'district', 'upazila', 'union', 'user'],
  });

  return res.status(200).json({
    success: true,
    message: 'Get all ShippingAddress',
    data: result,
  });
});

// @desc Get a single ShippingAddress
// @route GET /api/v1/shipping-address/:id
// @access Public
export const getShippingAddress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getShippingAddress ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ShippingAddressEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Shipping Address of id ${req.params.id}`,
      data: result,
    });
  },
);

// @desc Create a single ShippingAddress
// @route POST /api/v1/shipping-address
// @access Public
export const createShippingAddress = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createShippingAddress ${req.method} ${req.url}`);

  const validation = shippingAddressValidationSchema.safeParse({
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
  const repository = connection.getRepository(ShippingAddressEntity);
  const result = await repository.findOneBy({ userId: req.id, status: true });

  if (result) {
    await repository.save({ id: result.id, status: false });
  }
  // await repository.save(
  //   result.map((item: { id: number; status: boolean }) => ({
  //     id: item.id,
  //     status: false,
  //   }))
  // );
  const newShippingAddress = repository.create(validation.data);
  const save = await repository.save(newShippingAddress);
  return res.status(200).json({
    success: true,
    message: 'Create a new Shipping Address',
    data: save,
  });
});

// @desc Update a single ShippingAddress
// @route PUT /api/v1/shipping-address/:id
// @access Public
export const updateShippingAddress = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateShippingAddress ${req.method} ${req.url}`);

  const { id } = req.params;

  const validation = updateShippingAddressValidationSchema.safeParse(req.body);

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
  const repository = await connection.getRepository(ShippingAddressEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, req.body);
  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: `Update a single ShippingAddress of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Update a single ShippingAddress
// @route PUT /api/v1/shipping-address/:id
// @access Public
export const activeShippingAddress = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: activeShippingAddress ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();

  const repository = await connection.getRepository(ShippingAddressEntity);
  const findOneAddress = await repository.findOneBy({ id });

  const result = await repository.find({ where: { userId: req.id } });

  if (result) {
    await repository.save(
      result.map((item: { id: number; status: boolean }) => ({
        id: item.id,
        status: false,
      })),
    );
  }

  await repository.save({ id: findOneAddress.id, status: true });

  return res.status(200).json({
    success: true,
    message: `Active Shipping address of id ${req.params.id}`,
    data: findOneAddress,
  });
});

// @desc Delete a single ShippingAddress
// @route DELETE /api/v1/shipping-address/:id
// @access Public
export const deleteShippingAddress = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteShippingAddress ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(ShippingAddressEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single ShippingAddress of id ${req.params.id}`,
    data: result,
  });
});
