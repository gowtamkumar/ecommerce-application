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
import { OrderStatus, RefundStatus } from "../../order/enums";
import dayjs from "dayjs";
import { ProductVariantEntity } from "../../products/product-variant/model/product-variant.entity";
import { returnFullOrderValidationSchema } from "../../../validation/return/returnfullOrderValidation";

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

    const { orderItemId, orderId, returnedQty, status } = validation.data;

    const connection = await getDBConnection();
    const repositoryReturn = connection.getRepository(ReturnEntity);
    const repositoryOrder = connection.getRepository(OrderEntity);

    const order = await repositoryOrder
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.orderItems", "orderItem")
      .leftJoinAndSelect("orderItem.product", "product")
      .where("order.id = :orderId", { orderId })
      .andWhere("order.userId = :userId", { userId })
      .select([
        "order.id",
        "order.status",
        "order.updatedAt",
        "orderItem.id",
        "orderItem.qty",
        "product.id",
        "product.name",
        "product.isReturnable",
      ])
      .getOne();

    if (!order) {
      throw new Error(`Order not found or does not belong to user`);
    }

    if (order.status !== OrderStatus.Completed) {
      throw new Error("Return is allowed only after delivery");
    }

    const item = order.orderItems.find(
      (i: { id: number }) => i.id === orderItemId
    );

    if (!item) {
      throw new Error("Product not found in this order");
    }

    if (!item.product.isReturnable) {
      throw new Error("This product is not eligible for return");
    }

    // ✅ Check return window (7 days from delivery)
    const deliveredAt = order.updatedAt; // Assuming updatedAt = deliveredAt
    const now = new Date();

    const sevenDaysLater = dayjs(deliveredAt).add(7, "day"); //here need to dynamic day from setting
    if (dayjs(now).isAfter(sevenDaysLater)) {
      throw new Error("Return window expired");
    }

    // ✅ Total returned quantity logic
    const existingReturns = await repositoryReturn.find({
      where: { orderItemId },
    });

    const alreadyReturnedQty = existingReturns.reduce(
      (sum: any, r: any) => sum + r.returnQty,
      0
    );

    const remainingQty = item.qty - alreadyReturnedQty;

    if (returnedQty > remainingQty) {
      throw new Error(`You can only return up to ${remainingQty} units`);
    }

    // ✅ Create and save the return request
    const newReturn = repositoryReturn.create(validation.data);
    const save = await repositoryReturn.save(newReturn);

    // repositoryOrder.save()

    return res.status(200).json({
      success: true,
      message: "Return request created successfully",
      data: save,
    });
  }
);

// @desc Update a single Return
// @route PUT /api/v1/Return/:id
// @access Public

export const updateReturn = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    logger.info(`Service: updateReturn ${req.method} ${req.url}`);
    const userId = req.id;
    const { id } = req.params;
    const { status } = req.body;

    const connection = await getDBConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const returnRepository = queryRunner.manager.getRepository(ReturnEntity);
      const result = await returnRepository.findOneBy({ id });

      if (!result) {
        await queryRunner.rollbackTransaction();
        return res.status(404).json({
          success: false,
          message: `Return resource not found for ID #${id}`,
        });
      }

      if (result.status === ReturnStatus.Completed) {
        await queryRunner.rollbackTransaction();
        return res.status(400).json({
          success: false,
          message: `Return has already been completed.`,
        });
      }

      if (status === ReturnStatus.Completed) {
        const orderRepository = queryRunner.manager.getRepository(OrderEntity);
        const order = await orderRepository
          .createQueryBuilder("order")
          .leftJoinAndSelect("order.orderItems", "orderItem")
          .leftJoinAndSelect("orderItem.product", "product")
          .where("order.id = :orderId", { orderId: result.orderId })
          .andWhere("order.userId = :userId", { userId })
          .getOne();

        if (!order) {
          await queryRunner.rollbackTransaction();
          return res.status(404).json({
            success: false,
            message: "Order not found or does not belong to the user",
          });
        }

        if (order.status !== OrderStatus.Completed) {
          await queryRunner.rollbackTransaction();
          return res.status(400).json({
            success: false,
            message: "Return is only allowed after delivery",
          });
        }

        const item = order.orderItems.find(
          (i: { id: number }) => i.id === result.orderItemId
        );

        if (!item) {
          await queryRunner.rollbackTransaction();
          return res.status(404).json({
            success: false,
            message: "Product not found in this order",
          });
        }

        if (!item.product.isReturnable) {
          await queryRunner.rollbackTransaction();
          return res.status(400).json({
            success: false,
            message: "This product is not eligible for return",
          });
        }

        const refundableAmount = +item.subTotal / +item.qty;
        const totalRefund = +refundableAmount * +result.returnedQty;

        // Update order refund
        await orderRepository.save({
          id: order.id,
          totalReturned: (+order.totalReturned || 0) + totalRefund,
          returnedQty: +result.returnedQty,
          refundStatus: RefundStatus.None,
        });

        const productVariantRepository =
          queryRunner.manager.getRepository(ProductVariantEntity);
        const findProductVariant = await productVariantRepository.findOne({
          where: { id: item.productVariantId },
        });

        if (!findProductVariant) {
          await queryRunner.rollbackTransaction();
          return res.status(404).json({
            success: false,
            message: "Product variant not found",
          });
        }

        const updatedStockQty =
          +findProductVariant.stockQty + +result.returnedQty;

        await productVariantRepository.save({
          id: item.productVariantId,
          stockQty: updatedStockQty,
        });

        const orderItemRepository =
          queryRunner.manager.getRepository(OrderItemEntity);
        await orderItemRepository.save({
          id: item.id,
          returnedQty: result.returnedQty,
        });
      }

      // Update return record
      const updated = returnRepository.merge(result, req.body);
      await returnRepository.save(updated);

      await queryRunner.commitTransaction();

      return res.status(200).json({
        success: true,
        message: `Updated return request for ID ${id}`,
        data: updated,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error("Error updating return:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing the return request",
      });
    } finally {
      await queryRunner.release();
    }
  }
);

export const requestFullOrderReturn = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.id;

    const validation = returnFullOrderValidationSchema.safeParse({
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

    const { orderId, reason, phone, image } = validation.data;

    const connection = await getDBConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orderRepository = queryRunner.manager.getRepository(OrderEntity);
      const returnRepository = queryRunner.manager.getRepository(ReturnEntity);

      const order = await orderRepository
        .createQueryBuilder("order")
        .leftJoinAndSelect("order.orderItems", "orderItem")
        .leftJoinAndSelect("orderItem.product", "product")
        .where("order.id = :orderId", { orderId })
        .andWhere("order.userId = :userId", { userId })
        .getOne();

      if (!order) {
        await queryRunner.rollbackTransaction();
        return res.status(404).json({
          success: false,
          message: "Order not found or not owned by user",
        });
      }

      if (order.status !== OrderStatus.Completed) {
        await queryRunner.rollbackTransaction();
        return res.status(400).json({
          success: false,
          message: "Only completed orders can be returned",
        });
      }

      const createdReturns = [];

      for (const item of order.orderItems) {
        if (!item.product.isReturnable) continue;

        const alreadyReturned = await returnRepository.findOneBy({
          orderItemId: item.id,
          status: ReturnStatus.Requested,
        });

        if (alreadyReturned) continue;

        const remainingQty = +item.qty - (+item.returnedQty || 0);
        if (remainingQty <= 0) continue;

        const newReturn = returnRepository.create({
          userId,
          orderId: order.id,
          reason,
          phone,
          image,
          orderItemId: item.id,
          returnedQty: remainingQty,
          status: ReturnStatus.Requested,
        });

        const saved = await returnRepository.save(newReturn);
        createdReturns.push(saved);
      }

      await queryRunner.commitTransaction();
      return res.status(200).json({
        success: true,
        message: "Return request submitted for all eligible items",
        data: createdReturns,
      });
    } catch (err) {
      console.log("err", err);

      await queryRunner.rollbackTransaction();
      return res.status(500).json({
        success: false,
        message: "An error occurred while submitting the return request",
      });
    } finally {
      await queryRunner.release();
    }
  }
);

export const completeFullOrderReturn = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const connection = await getDBConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const returnRepository = queryRunner.manager.getRepository(ReturnEntity);
      const orderItemRepository =
        queryRunner.manager.getRepository(OrderItemEntity);
      const orderRepository = queryRunner.manager.getRepository(OrderEntity);
      const variantRepository =
        queryRunner.manager.getRepository(ProductVariantEntity);

      const requestedReturns = await returnRepository.find({
        where: { orderId, status: ReturnStatus.Requested },
      });

      if (requestedReturns.length === 0) {
        await queryRunner.rollbackTransaction();
        return res.status(404).json({
          success: false,
          message: "No requested returns found for this order",
        });
      }

      let totalRefund = 0;
      let returnedQty = 0;

      for (const ret of requestedReturns) {
        const orderItem = await orderItemRepository.findOneBy({
          id: ret.orderItemId,
        });
        if (!orderItem) continue;

        const refundAmount =
          (+orderItem.subTotal / +orderItem.qty) * ret.returnedQty;
        totalRefund += refundAmount;
        returnedQty += orderItem.qty;

        // Update product variant stock
        const variant = await variantRepository.findOneBy({
          id: orderItem.productVariantId,
        });
        if (variant) {
          await variantRepository.save({
            id: variant.id,
            stockQty: +variant.stockQty + ret.returnedQty,
          });
        }

        // Update order item
        await orderItemRepository.save({
          id: orderItem.id,
          returnedQty: (+orderItem.returnedQty || 0) + ret.returnedQty,
        });

        // Mark return as completed
        await returnRepository.save({
          id: ret.id,
          status: ReturnStatus.Completed,
        });
      }

      // Update order totalReturned
      const order = await orderRepository.findOneBy({ id: orderId });
      await orderRepository.save({
        id: order.id,
        totalReturned: (+order?.totalReturned || 0) + totalRefund,
        returnedQty,
        refundStatus: RefundStatus.None,
        status: OrderStatus.Returned,
      });

      await queryRunner.commitTransaction();

      return res.status(200).json({
        success: true,
        message: "Return completed for all pending items",
        totalRefund,
      });
    } catch (err) {
      console.log("err", err);

      await queryRunner.rollbackTransaction();
      return res.status(500).json({
        success: false,
        message: "Failed to complete return",
      });
    } finally {
      await queryRunner.release();
    }
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
