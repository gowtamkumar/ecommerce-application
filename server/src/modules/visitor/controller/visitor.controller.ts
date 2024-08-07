import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { VisitorEntity } from "../model/visitor.entity";

// @desc Get all Visitor
// @route GET /api/v1/Visitor
// @access Public
export const getVisitors = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(VisitorEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    msg: "Get all Visitor",
    data: result,
  });
});

// @desc Get a single Visitor
// @route GET /api/v1/Visitor/:id
// @access Public
export const getVisitor = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(VisitorEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Visitor of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Visitor
// @route POST /api/v1/Visitor
// @access Public
export const createVisitor = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();

  const visitorRepository = connection.getRepository(VisitorEntity);

  let visit = await visitorRepository.findOneBy({ id: 1 });

  if (!visit) {
    visit = visitorRepository.create({ count: 1 });
  } else {
    visit.count++;
  }

  await visitorRepository.save(visit);

  return res.status(200).json({
    success: true,
    msg: "Create a new Visitor",
    data: visit,
  });
});

// @desc Update a single Visitor
// @route PUT /api/v1/Visitor/:id
// @access Public
export const updateVisitor = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const repository = await connection.getRepository(VisitorEntity);

    const result = await repository.findOneBy({ id });

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a single Visitor of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single Visitor
// @route DELETE /api/v1/Visitor/:id
// @access Public
export const deleteVisitor = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(VisitorEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a single Visitor of id ${req.params.id}`,
      data: result,
    });
  }
);
