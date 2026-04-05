import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/middlewares/async.middleware';
import { getDBConnection } from '@/config/db';
import { ContactEntity } from '../model/contact.entity';
import { logger } from '@/middlewares/logger';
import { CustomRequest } from '@/enums/custom-request-type';
import { contactCreateValidation } from '@/validation/contact/contactCreateValidation';

// @desc Get all Contact
// @route GET /api/v1/Contact
// @access Public
export const getContacts = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getContacts ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(ContactEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: 'Get all Contact',
    data: result,
  });
});

// @desc Get a single Contact
// @route GET /api/v1/Contact/:id
// @access Public
export const getContact = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: getContact ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(ContactEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  return res.status(200).json({
    success: true,
    message: `Get a single Contact of id ${req.params.id}`,
    data: result,
  });
});

// @desc Create a single Contact
// @route POST /api/v1/Contact
// @access Public
export const createContact = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createContact${req.method} ${req.url}`);
  const connection = await getDBConnection();
  const validation = contactCreateValidation.safeParse({
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

  const repository = connection.getRepository(ContactEntity);

  const newContact = repository.create(validation.data);
  const save = await repository.save(newContact);

  return res.status(200).json({
    success: true,
    message: 'Your Message was successfully sent',
    data: save,
  });
});
// @desc Update a single Contact
// @route PUT /api/v1/Contact/:id
// @access Public
export const updateContact = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateContact ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(ContactEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, req.body);
  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: `Update a single Contact of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Contact
// @route DELETE /api/v1/Contact/:id
// @access Public
export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteContact ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(ContactEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single Contact of id ${req.params.id}`,
    data: result,
  });
});
