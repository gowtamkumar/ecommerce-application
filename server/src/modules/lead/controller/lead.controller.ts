import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { LeadEntity } from "../model/lead.entity";
import { leadValidationSchema } from "../../../validation";

// @desc Get all Lead
// @route GET /api/v1/Lead
// @access Public
export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(LeadEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    msg: "Get all Lead",
    data: result,
  });
});

// @desc Get a single Lead
// @route GET /api/v1/Lead/:id
// @access Public
export const getLead = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(LeadEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Lead of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Lead
// @route POST /api/v1/Lead
// @access Public
export const createLead = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = leadValidationSchema.safeParse({
    ...req.body,
  });

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(LeadEntity);

  const newLead = repository.create(validation.data);
  const save = await repository.save(newLead);

  return res.status(200).json({
    success: true,
    msg: "Create a new Lead",
    data: save,
  });
});

// @desc Update a single Lead
// @route PUT /api/v1/Lead/:id
// @access Public
export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();

  const repository = await connection.getRepository(LeadEntity);

  const result = await repository.findOneBy({ id });

  const updateData = await repository.merge(result, req.body);

  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    msg: `Update a single Lead of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Lead
// @route DELETE /api/v1/Lead/:id
// @access Public
export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
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
    msg: `Delete a single Lead of id ${req.params.id}`,
    data: result,
  });
});
