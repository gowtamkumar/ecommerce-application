import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { PaymentEntity } from "../model/payment.entity";
import { paymentValidationSchema } from "../../../validation";
import { logger } from "../../../middlewares/logger";

// @desc Get all Payment
// @route GET /api/v1/Payment
// @access Public
export const getPayments = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getPayments ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(PaymentEntity);

  const result = await repository.find({
    relations: {
      order: true,
      user: true,
    },
    select: {
      user: {
        name: true,
      },
    },
    order: { id: "DESC" },
  });

  return res.status(200).json({
    success: true,
    message: "Get all Payment",
    data: result,
  });
});

// @desc Get a single Payment
// @route GET /api/v1/Payment/:id
// @access Public
export const getPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getPayment ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(PaymentEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Payment of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Payment
// @route POST /api/v1/Payment
// @access Public
export const createPayment = asyncHandler(async (req: any, res: Response) => {
  logger.info(`Service: createPayment ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const validation = paymentValidationSchema.safeParse({
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
  const repository = connection.getRepository(PaymentEntity);
  const newPayment = repository.create(validation.data);
  const save = await repository.save(newPayment);

  return res.status(200).json({
    success: true,
    message: "Create a new Payment",
    data: save,
  });
});

export const createDashboardPayment = asyncHandler(
  async (req: any, res: Response) => {
    logger.info(`Service: createDashboardPayment ${req.method} ${req.url}`);

    const connection = await getDBConnection();
    const validation = paymentValidationSchema.safeParse(req.body);

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
    const repository = connection.getRepository(PaymentEntity);
    const newPayment = repository.create(validation.data);
    const save = await repository.save(newPayment);

    return res.status(200).json({
      success: true,
      message: "Create a new Payment by dashboard",
      data: save,
    });
  }
);

// @desc Update a single Payment
// @route PUT /api/v1/Payment/:id
// @access Public
export const updatePayment = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: updatePayment ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();

    const repository = await connection.getRepository(PaymentEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    const updateData = await repository.merge(result, req.body);
    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      message: `Update a single Payment of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single Payment
// @route DELETE /api/v1/Payment/:id
// @access Public
export const deletePayment = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: deletePayment ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(PaymentEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      message: `Delete a single Payment of id ${req.params.id}`,
      data: result,
    });
  }
);
