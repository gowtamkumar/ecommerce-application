import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { StockAdjustEntity } from "../model/stock-adjust.entity";
import { logger } from "../../../middlewares/logger";
import { CustomRequest } from "../../../enums/custom-request-type";
import { createStockAdjustValidation } from "../../../validation/stock-adjust/stockAdjustValidation";

// @desc Get all StockAdjust
// @route GET /api/v1/StockAdjust
// @access Public
export const getStockAdjusts = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: getStockAdjusts ${req.method} ${req.url}`);

    const connection = await getDBConnection();
    const repository = connection.getRepository(StockAdjustEntity);

    const result = await repository.find();

    return res.status(200).json({
      success: true,
      message: "Get all StockAdjust",
      data: result,
    });
  }
);

// @desc Get a single StockAdjust
// @route GET /api/v1/StockAdjust/:id
// @access Public
export const getStockAdjust = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getStockAdjust ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(StockAdjustEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Stock Adjust of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single StockAdjust
// @route POST /api/v1/StockAdjust
// @access Public
export const createStockAdjust = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    logger.info(`Service: createStockAdjust ${req.method} ${req.url}`);

    const validation = createStockAdjustValidation.safeParse({
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
    const repository = connection.getRepository(StockAdjustEntity);
    const newStockAdjust = repository.create(validation.data);
    const save = await repository.save(newStockAdjust);

    return res.status(200).json({
      success: true,
      message: "Create a new StockAdjust",
      data: save,
    });
  }
);

// @desc Update a single StockAdjust
// @route PUT /api/v1/StockAdjust/:id
// @access Public
// export const updateStockAdjust = asyncHandler(
//   async (req: Request, res: Response) => {
//     logger.info(`Service: updateStockAdjust ${req.method} ${req.url}`);

//     const { id } = req.params;
//     const validation = updateStockAdjustValidationSchema.safeParse(req.body);

//     if (!validation.success) {
//       const formattedErrors = validation.error.issues.map((issue) => ({
//         path: issue.path.join("."),
//         message: issue.message,
//       }));

//       return res.status(400).json({
//         success: false,
//         issues: formattedErrors,
//       });
//     }
//     const connection = await getDBConnection();
//     const repository = await connection.getRepository(StockAdjustEntity);
//     const result = await repository.findOneBy({ id });
//     if (!result) {
//       throw new Error(`Resource not found of id #${req.params.id}`);
//     }

//     const updateData = await repository.merge(result, validation.data);
//     await repository.save(updateData);

//     return res.status(200).json({
//       success: true,
//       message: `Update a single StockAdjust of id ${req.params.id}`,
//       data: updateData,
//     });
//   }
// );

// @desc Delete a single StockAdjust
// @route DELETE /api/v1/StockAdjust/:id
// @access Public
export const deleteStockAdjust = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: deleteStockAdjust ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(StockAdjustEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      message: `Delete a single StockAdjust of id ${req.params.id}`,
      data: result,
    });
  }
);
