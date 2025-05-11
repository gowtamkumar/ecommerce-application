import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { ReturnEntity } from "../model/return.entity";
import { logger } from "../../../middlewares/logger";
import { CustomRequest } from "../../../enums/custom-request-type";
import { returnValidationSchema } from "../../../validation/return/returnValidation";
import { ReturnStatus } from "../enums/return-status.enum";
import { OrderItemEntity } from "../../order/model/order-item.entity";
import { OrderEntity } from "../../order/model/order.entity";

// @desc Get all Return
// @route GET /api/v1/Return
// @access Public
export const getReturns = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getReturns ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(ReturnEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: "Get all Return",
    data: result,
  });
});

// @desc Get a single Return
// @route GET /api/v1/Return/:id
// @access Public
export const getReturn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getReturn ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ReturnEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Return of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Return
// @route POST /api/v1/Return
// @access Public
export const createReturn = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    logger.info(`Service: createReturn ${req.method} ${req.url}`);

    const userId = req.id;

    const validation = returnValidationSchema.safeParse({
      ...req.body,
      userId,
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
    const orderItemId = validation.data.orderItemId;
    const returnQty = validation.data.returnQty;

    const connection = await getDBConnection();
    const repository = connection.getRepository(ReturnEntity);
    const repositoryOrder = connection.getRepository(OrderEntity);

    const order = await repositoryOrder.findOne({
      where: { id: validation.data.orderId, userId },
      relations: ["orderItems"],
    });

    if (!order) {
      throw new Error(`Order not found or does not belong to user`);
    }

    const item = order.orderItems.find(
      (i: { id: number }) => i.id === orderItemId
    );

    if (!item) {
      throw new Error("Product not found in this order");
    }

    if (returnQty > item.qty) {
      throw new Error(`You can only return up to ${item.qty} units`);
    }

    const newReturn = repository.create(validation.data);
    const save = await repository.save(newReturn);

    if (save.orderItemId) {
      const repositoryOrder = connection.getRepository(OrderItemEntity);
      const findOrderItem = repositoryOrder.findOneBy(save.orderItemId);
      // if(findOrderItem)
    }

    return res.status(200).json({
      success: true,
      message: "Create a new Return",
      data: save,
    });
  }
);

// @desc Update a single Return
// @route PUT /api/v1/Return/:id
// @access Public
export const updateReturn = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: updateReturn ${req.method} ${req.url}`);

    const { id } = req.params;

    const { status } = req.body;

    // const validation = ReturnValidationSchema.safeParse(req.body);

    // if (!validation.success) {
    //   const formattedErrors = validation.error.issues.map((issue) => ({
    //     path: issue.path.join("."),
    //     message: issue.message,
    //   }));

    //   return res.status(400).json({
    //     success: false,
    //     issues: formattedErrors,
    //   });
    // }

    const connection = await getDBConnection();
    const repository = await connection.getRepository(ReturnEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    // if(status === ReturnStatus.Approved){
    //   const repositoryOrderItem = await connection.getRepository(OrderItemEntity);

    //   const findOrderItems = repositoryOrderItem.find()

    // }

    const updateData = await repository.merge(result, req.body);
    await repository.save(updateData);

    return res.status(200).json({
      success: true,
      message: `Update a single Return of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single Return
// @route DELETE /api/v1/Return/:id
// @access Public
export const deleteReturn = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: deleteReturn ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(ReturnEntity);

    const result = await repository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await repository.delete({ id });

    return res.status(200).json({
      success: true,
      message: `Delete a single Return of id ${req.params.id}`,
      data: result,
    });
  }
);
