import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../../middlewares/async.middleware';
import { getDBConnection } from '../../../config/db';
import { StockAdjustEntity } from '../model/stock-adjust.entity';
import { logger } from '../../../middlewares/logger';
import { CustomRequest } from '../../../enums/custom-request-type';
import { createStockAdjustValidation } from '../../../validation/stock-adjust/stockAdjustValidation';
import { StockAdjustTypeEnum } from '../enum/stock-adjust-type.status.enum';
import { ProductVariantEntity } from '../../products/product-variant/model/product-variant.entity';

// @desc Get all StockAdjust
// @route GET /api/v1/stock-adjust
// @access Public
export const getStockAdjusts = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getStockAdjusts ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(StockAdjustEntity);

  const result = await repository.find({
    relations: ['product'],
    select: {
      // id:true,
      qty: true,
      type: true,

      product: {
        name: true,
      },
    },
  });

  return res.status(200).json({
    success: true,
    message: 'Get all StockAdjust',
    data: result,
  });
});

// @desc Get a single StockAdjust
// @route GET /api/v1/stock-adjust/:id
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
  },
);

// @desc Create a single StockAdjust
// @route POST /api/v1/stock-adjust
// @access Public
export const createStockAdjust = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createStockAdjust ${req.method} ${req.url}`);

  const validation = createStockAdjustValidation.safeParse({
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
      message: 'Validation error',
      issues: formattedErrors,
    });
  }

  const { type, productVariants, productId, userId } = validation.data;

  const connection = await getDBConnection();
  const stockAdjustRepo = connection.getRepository(StockAdjustEntity);
  const productVariantRepo = connection.getRepository(ProductVariantEntity);

  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const savedStockAdjustments = [];

    for (const item of productVariants) {
      const productVariant = await productVariantRepo.findOne({
        where: { id: item.id, productId },
      });

      if (!productVariant) {
        await queryRunner.rollbackTransaction();
        return res.status(404).json({
          success: false,
          message: `Product variant with ID ${item.id} not found`,
        });
      }

      let newStockQty = productVariant.stockQty;

      if (type === StockAdjustTypeEnum.Add) {
        newStockQty += item.qty;
      } else if (type === StockAdjustTypeEnum.Subtract) {
        if (productVariant.stockQty < item.qty) {
          await queryRunner.rollbackTransaction();
          return res.status(400).json({
            success: false,
            message: `Insufficient stock to subtract for variant ID ${item.id}`,
          });
        }
        newStockQty -= item.qty;
      }

      productVariant.stockQty = newStockQty;
      await queryRunner.manager.save(productVariant);

      const newStockAdjust = stockAdjustRepo.create({
        productId,
        productVariantId: item.id,
        qty: item.qty,
        type,
        userId,
      });

      const savedStockAdjust = await queryRunner.manager.save(newStockAdjust);
      savedStockAdjustments.push(savedStockAdjust);
    }

    await queryRunner.commitTransaction();

    return res.status(201).json({
      success: true,
      message: 'Stock adjustments created successfully',
      data: savedStockAdjustments,
    });
  } catch (error: any) {
    logger.error(`createStockAdjust Error: ${error.message}`);
    await queryRunner.rollbackTransaction();
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  } finally {
    await queryRunner.release();
  }
});

// @desc Update a single StockAdjust
// @route PUT /api/v1/stock-adjust/:id
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
// @route DELETE /api/v1/stock-adjust/:id
// @access Public
export const deleteStockAdjust = asyncHandler(async (req: Request, res: Response) => {
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
});
