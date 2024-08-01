import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { OrderEntity } from "../../order/model/order.entity";
import dayjs from "dayjs";

// @desc Get all ProductCategorys
// @route GET /api/v1/dashboard-report
// @access Public
export const getDashboardReport = asyncHandler(
  async (req: Request, res: Response) => {
    const { status, startDate, endDate }: any = req.query;
    const connection = await getDBConnection();

    const fromDate = dayjs(startDate).toISOString();
    const toDate = dayjs(endDate).toISOString();

    const orderRepository = connection.getRepository(OrderEntity);
    const qb = orderRepository.createQueryBuilder("order");
    qb.select([
      "order",
      "orderItems",
      "product",
      "payments",
      "user.name",
      // "orderTrackings",
      // "deliveryMan.name",
      // "shippingAddress",
    ]);

    qb.leftJoin("order.orderItems", "orderItems");
    qb.leftJoin("orderItems.product", "product");
    qb.leftJoin("order.user", "user");
    qb.leftJoin("order.payments", "payments");
    // qb.leftJoin("order.orderTrackings", "orderTrackings");
    // qb.leftJoin("order.deliveryMan", "deliveryMan");
    // qb.leftJoin("order.shippingAddress", "shippingAddress");

    if (status) qb.where({ status }); //here need to multiple status agree
    if (fromDate && toDate)
      qb.andWhere(`order.orderDate BETWEEN '${fromDate}' AND '${toDate}'`);
    const orders = await qb.getMany();

    const user = await connection.query(
      `SELECT
          SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) AS total_active_user,
          SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) AS total_inactive_user,
          SUM(CASE WHEN status = 'Block' THEN 1 ELSE 0 END) AS total_block_user
      FROM users`
    );

    const results = await connection.query(`
      SELECT
          SUM(CASE WHEN status = 'Processing' THEN 1 ELSE 0 END) AS total_processing_count,
          SUM(CASE WHEN status = 'Shipped' THEN 1 ELSE 0 END) AS total_shipped_count,
          SUM(CASE WHEN status = 'On Shipping' THEN 1 ELSE 0 END) AS total_on_shipping_count,
          SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS total_approved_count,
          SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS total_sale_count,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS total_order_count,
          SUM(CASE WHEN status = 'Returned' THEN 1 ELSE 0 END) AS total_order_return_count,
          SUM(CASE WHEN status = 'Returned' THEN COALESCE(net_amount, 0) + COALESCE(shipping_amount, 0) ELSE 0 END) AS total_order_return_amount,
          SUM(CASE WHEN status = 'Pending' THEN COALESCE(net_amount, 0) + COALESCE(shipping_amount, 0) ELSE 0 END) AS total_order_amount,
          SUM(CASE WHEN status = 'Completed' THEN COALESCE(net_amount, 0) + COALESCE(shipping_amount, 0) ELSE 0 END) AS total_sale_amount
      FROM orders
     
  `);

    return res.status(200).json({
      success: true,
      msg: "Get Dashboard Report",
      data: { ...user[0], ...results[0], orders },
    });
  }
);
