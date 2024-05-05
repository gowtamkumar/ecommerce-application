import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { PaymentEntity } from "../model/payment.entity";
import { paymentValidationSchema } from "../../../validation";

// @desc Get all Payment
// @route GET /api/v1/Payment
// @access Public
export const getPayment = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(PaymentEntity);

  const user = await repository.find({
    relations: {
      order: true,
    },
  });

  return res.status(200).json({
    success: true,
    msg: "Get all Payment",
    data: user,
  });
});

// @desc Get a single Payment
// @route GET /api/v1/Payment/:id
// @access Public
export const getAddres = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(PaymentEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Payment of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Payment
// @route POST /api/v1/Payment
// @access Public
export const createPayment = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const validation = paymentValidationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const repository = connection.getRepository(PaymentEntity);

  const newPayment = repository.create(validation.data);

  const save = await repository.save(newPayment);

  return res.status(200).json({
    success: true,
    msg: "Create a new Payment",
    data: save,
  });
});

// @desc Update a single Payment
// @route PUT /api/v1/Payment/:id
// @access Public
export const updatePayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const repository = await connection.getRepository(PaymentEntity);

    const result = await repository.findOneBy({ id });

    const updateData = await repository.merge(result, req.body);

    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a single Payment of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single Payment
// @route DELETE /api/v1/Payment/:id
// @access Public
export const deletePayment = asyncHandler(
  async (req: Request, res: Response) => {
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
      msg: `Delete a single Payment of id ${req.params.id}`,
      data: result,
    });
  }
);
