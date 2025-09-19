import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../../middlewares/async.middleware';
import { getDBConnection } from '../../../config/db';
import { LeadEntity } from '../model/lead.entity';
import { leadValidationSchema } from '../../../validation';
import { logger } from '../../../middlewares/logger';
import { CustomRequest } from '../../../enums/custom-request-type';

// @desc Get all Lead
// @route GET /api/v1/Lead
// @access Public
export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getLeads ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(LeadEntity);
  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: 'Get all Lead',
    data: result,
  });
});

// @desc Get a single Lead
// @route GET /api/v1/Lead/:id
// @access Public
export const getLead = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: getLead ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(LeadEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  return res.status(200).json({
    success: true,
    message: `Get a single Lead of id ${req.params.id}`,
    data: result,
  });
});

// @desc Create a single Lead
// @route POST /api/v1/Lead
// @access Public
export const createLead = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createLead ${req.method} ${req.url}`);

  const validation = leadValidationSchema.safeParse(req.body);

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
  const repository = connection.getRepository(LeadEntity);

  const result = await repository.findOne({
    where: { email: validation.data.email },
  });

  if (result) {
    throw new Error(`Email already exists #${validation.data.email}`);
  }

  const newLead = repository.create(validation.data);
  const save = await repository.save(newLead);

  return res.status(200).json({
    success: true,
    message: 'Create a new Lead',
    data: save,
  });
});

// @desc Update a single Lead
// @route PUT /api/v1/Lead/:id
// @access Public
export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateLead ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();

  const validation = leadValidationSchema.safeParse({
    ...req.body,
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

  const repository = await connection.getRepository(LeadEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, validation.data);
  await repository.save(updateData);
  return res.status(200).json({
    success: true,
    message: `Update a single Lead of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Lead
// @route DELETE /api/v1/Lead/:id
// @access Public
export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteLead ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(LeadEntity);

  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single Lead of id ${req.params.id}`,
    data: result,
  });
});
