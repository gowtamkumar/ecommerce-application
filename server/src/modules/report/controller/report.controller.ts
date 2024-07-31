import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { DataSource } from "typeorm";
import { ProductEntity } from "../../product/model/product.entity";
import { getDBConnection } from "../../../config/db";
import { OrderEntity } from "../../order/model/order.entity";

// @desc Get all ProductCategorys
// @route GET /api/v1/dashboard-report
// @access Public
export const getDashboardReport = asyncHandler(
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();

    const sales = await connection.query(
      `select * from orders where status = 'Completed'`
    );
    const orders = await connection.query(
      `select * from orders where status = 'Pending'`
    );

    const saleReturn = await connection.query(
      `select * from orders where status = 'Returned'`
    );

    const results = await connection.query(`
      SELECT
          SUM(CASE WHEN status = 'Processing' THEN 1 ELSE 0 END) AS total_processing_count,
          SUM(CASE WHEN status = 'Shipped' THEN 1 ELSE 0 END) AS total_shipped_count,
          SUM(CASE WHEN status = 'On Shipping' THEN 1 ELSE 0 END) AS total_on_shipping_count,
          SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS total_approved_count,
          SUM(CASE WHEN status = 'Returned' THEN COALESCE(net_amount, 0) + COALESCE(shipping_amount, 0) ELSE 0 END) AS total_sale_return,
          SUM(CASE WHEN status = 'Pending' THEN COALESCE(net_amount, 0) + COALESCE(shipping_amount, 0) ELSE 0 END) AS total_order,
          SUM(CASE WHEN status = 'Completed' THEN COALESCE(net_amount, 0) + COALESCE(shipping_amount, 0) ELSE 0 END) AS total_sale
      FROM orders
     
  `);

    console.log("🚀 ~ get report:", results);

    return res.status(200).json({
      success: true,
      msg: "Get all product",
      data: { ...results[0], sales, orders, sales_return: saleReturn },
    });
  }
);
