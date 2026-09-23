import { getDBConnection } from '@/config/db';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { OrderStatus } from '@/modules/sales/order/enums';
import { OrderEntity } from '@/modules/sales/order/model/order.entity';
import { topSellingProductQuery } from '@/sqlQuery';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

// @desc Get all ProductCategorys
// @route GET /api/v1/dashboard-report
// @access Public
export const getDashboardReport = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getDashbordReport ${req.method} ${req.url}`);

  const { status = OrderStatus.Pending, startDate, endDate }: any = req.query;
  const connection = await getDBConnection();

  const fromDate = startDate
    ? dayjs(startDate).toISOString()
    : dayjs().subtract(30, 'day').startOf('day').toISOString();
  const toDate = endDate ? dayjs(endDate).toISOString() : dayjs().endOf('day').toISOString();

  const orderRepository = connection.getRepository(OrderEntity);
  const qb = orderRepository.createQueryBuilder('order');
  qb.select([
    'order.trackingNo',
    'order.status',
    'order.createdAt',
    'order.paymentStatus',
    'order.grandTotal',
    'user.name',
  ]);
  qb.leftJoin('order.user', 'user');
  qb.where('order.createdAt BETWEEN :fromDate AND :toDate', { fromDate, toDate });
  if (status) {
    qb.andWhere('order.status = :status', { status });
  }
  qb.orderBy('order.trackingNo', 'DESC');

  const [
    orders,
    user,
    payments,
    results,
    top_selling_product,
    top_customers,
    product_alert_stock_report,
    loss_profit,
  ] = await Promise.all([
    qb.getMany(),

    // user info
    connection.query(
      `SELECT
          SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) AS total_active_user,
          SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) AS total_inactive_user,
          SUM(CASE WHEN status = 'Block' THEN 1 ELSE 0 END) AS total_block_user
      FROM users`,
    ),

    // payments summary
    connection.query(
      `SELECT
          SUM(CASE WHEN payment_method = 'SSLCOMMERZ' AND payment_type = 'Debit' THEN COALESCE(amount, 0) ELSE 0 END) AS ssl_debit_amount,
          SUM(CASE WHEN payment_method = 'Cash' AND payment_type = 'Debit' THEN COALESCE(amount, 0) ELSE 0 END) AS cash_debit_amount,
          SUM(CASE WHEN payment_method = 'SSLCOMMERZ' AND payment_type = 'Credit' THEN COALESCE(amount, 0) ELSE 0 END) AS ssl_credit_amount,
          SUM(CASE WHEN payment_method = 'Cash' AND payment_type = 'Credit' THEN COALESCE(amount, 0) ELSE 0 END) AS cash_credit_amount
        FROM payments
        WHERE created_at BETWEEN $1 AND $2`,
      [fromDate, toDate],
    ),

    // order sale, count etc.
    connection.query(
      `SELECT
          SUM(CASE WHEN status = 'Processing' THEN 1 ELSE 0 END) AS total_processing_order_count,
          SUM(CASE WHEN status = 'Shipped' THEN 1 ELSE 0 END) AS total_shipped_order_count,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS total_pending_order_count,
          SUM(CASE WHEN status = 'Canceled' THEN 1 ELSE 0 END) AS total_canceled_order_count,
          SUM(CASE WHEN status = 'Delivered'  THEN 1 ELSE 0 END) AS total_delivered_order_count,

          SUM(CASE WHEN status = 'Pending' THEN (COALESCE(total_qty,0)) ELSE 0 END) AS total_pending_product_count,
          SUM(CASE WHEN status = 'Canceled' THEN (COALESCE(total_qty,0)) ELSE 0 END) AS total_canceled_product_count,
          SUM(CASE WHEN status = 'Processing' THEN (COALESCE(total_qty,0)) ELSE 0 END) AS total_processing_product_count,
          SUM(CASE WHEN status = 'Shipped' THEN (COALESCE(total_qty,0)) ELSE 0 END) AS total_shipped_product_count,
          SUM( CASE WHEN status = 'Delivered' AND returned_status = 'Completed' THEN COALESCE(approved_qty, 0) WHEN status = 'Delivered' THEN COALESCE(total_qty, 0) ELSE 0 END ) AS total_delivered_product_count,

          SUM(CASE WHEN status = 'Pending' THEN (COALESCE(grand_total,0)) ELSE 0 END) AS total_pending_order_amount,
          SUM(CASE WHEN status = 'Canceled' THEN (COALESCE(grand_total,0)) ELSE 0 END) AS total_canceled_order_amount,
          SUM(CASE WHEN status = 'Processing' THEN (COALESCE(grand_total,0)) ELSE 0 END) AS total_processing_order_amount,
          SUM(CASE WHEN status = 'Shipped' THEN (COALESCE(grand_total,0)) ELSE 0 END) AS total_shipped_order_amount, 
          SUM( CASE WHEN status = 'Delivered' AND returned_status = 'Completed' THEN COALESCE(grand_total, 0) - COALESCE(total_returned, 0) WHEN status = 'Delivered' THEN COALESCE(grand_total, 0) ELSE 0 END ) AS total_delivered_order_amount,

          SUM(CASE WHEN returned_status = 'Requested' THEN 1 ELSE 0 END) AS total_return_requested_count,
          SUM(CASE WHEN returned_status = 'Processing' THEN 1 ELSE 0 END) AS total_return_processing_count,
          SUM(CASE WHEN returned_status = 'Approved' THEN 1 ELSE 0 END) AS total_return_approved_count,
          SUM(CASE WHEN returned_status = 'Rejected' THEN 1 ELSE 0 END) AS total_return_rejected_count,
          SUM(CASE WHEN returned_status = 'Completed' THEN 1 ELSE 0 END) AS total_return_completed_count,

          SUM(CASE WHEN returned_status = 'Requested' THEN (COALESCE(total_returned,0)) ELSE 0 END) AS total_return_requested_amount,
          SUM(CASE WHEN returned_status = 'Processing' THEN (COALESCE(total_returned,0)) ELSE 0 END) AS total_return_processing_amount,
          SUM(CASE WHEN returned_status = 'Approved' THEN (COALESCE(total_returned,0)) ELSE 0 END) AS total_return_approved_amount,
          SUM(CASE WHEN returned_status = 'Rejected' THEN (COALESCE(total_returned,0)) ELSE 0 END) AS total_return_rejected_amount,
          SUM(CASE WHEN returned_status = 'Completed' THEN (COALESCE(total_returned,0)) ELSE 0 END) AS total_return_completed_amount,

          SUM(CASE WHEN returned_status = 'Requested' THEN (COALESCE(requested_qty,0)) ELSE 0 END) AS total_return_requested_product_count,
          SUM(CASE WHEN returned_status = 'Processing' THEN (COALESCE(requested_qty,0)) ELSE 0 END) AS total_return_processing_product_count,
          SUM(CASE WHEN returned_status = 'Approved' THEN (COALESCE(requested_qty,0)) ELSE 0 END) AS total_return_approved_product_count,
          SUM(CASE WHEN returned_status = 'Rejected' THEN (COALESCE(requested_qty,0)) ELSE 0 END) AS total_return_rejected_product_count,
          SUM(CASE WHEN returned_status = 'Completed' THEN (COALESCE(approved_qty,0)) ELSE 0 END) AS total_return_completed_product_count
      FROM orders
      WHERE created_at BETWEEN $1 AND $2`,
      [fromDate, toDate],
    ),

    // top selling products
    connection.query(
      `WITH orderItems AS (
          SELECT 
            oi.product_id AS product_id,
            SUM(
                COALESCE(oi.sub_total, 0) * 
                ( CAST(COALESCE(oi.qty, 1) - COALESCE(oi.approved_qty, 0) AS NUMERIC) / NULLIF(CAST(COALESCE(oi.qty, 1) AS NUMERIC), 0) )
            ) AS total_sale_amount,
            SUM(COALESCE(oi.qty, 0) - COALESCE(oi.approved_qty, 0)) AS sale_qty
          FROM 
            order_items oi
          INNER JOIN 
            orders ON orders.id = oi.order_id
          WHERE 
            orders.status = 'Delivered'
            AND orders.created_at BETWEEN $1 AND $2
          GROUP BY 
            oi.product_id
        )
        SELECT
          oI.product_id,
          oI.total_sale_amount,
          oI.sale_qty,
          products.name,
          products.alert_qty
        FROM orderItems oI
        LEFT JOIN products ON products.id = oI.product_id
        ORDER BY oI.total_sale_amount DESC;`,
      [fromDate, toDate],
    ),

    // top customers
    connection.query(
      `WITH customerSales AS (
          SELECT 
              users.id AS customer_id,
              users.name AS customer_name,
              SUM(
                  COALESCE(oi.sub_total, 0) * 
                  ( CAST(COALESCE(oi.qty, 1) - COALESCE(oi.approved_qty, 0) AS NUMERIC) / NULLIF(CAST(COALESCE(oi.qty, 1) AS NUMERIC), 0) )
              ) AS total_sale_amount,
              SUM(COALESCE(oi.qty, 0) - COALESCE(oi.approved_qty, 0)) AS total_qty
          FROM 
              order_items oi
          INNER JOIN 
              orders ON orders.id = oi.order_id
          INNER JOIN 
              users ON users.id = orders.user_id
          WHERE 
              orders.status = 'Delivered'
              AND orders.created_at BETWEEN $1 AND $2
          GROUP BY 
              users.id, users.name
        )
        SELECT 
            cs.customer_id,
            cs.customer_name,
            cs.total_sale_amount,
            cs.total_qty
        FROM customerSales cs
        ORDER BY cs.total_sale_amount DESC;`,
      [fromDate, toDate],
    ),

    // product alert stock report
    connection.query(
      `WITH productVariants AS (
          SELECT 
              product_id,
              SUM(COALESCE(stock_qty, 0)) AS stock_qty
          FROM 
              product_variants 
          GROUP BY 
              product_id
        )
        SELECT 
            products.name AS name,
            products.alert_qty AS alert_qty,
            productVariants.stock_qty AS stock_qty
        FROM 
            productVariants
        LEFT JOIN 
            products ON products.id = productVariants.product_id
        WHERE products.alert_qty > productVariants.stock_qty
        ORDER BY 
            productVariants.stock_qty ASC;`,
    ),

    // loss & profit report
    connection.query(
      `WITH orderItems AS (
          SELECT 
              oi.product_id AS product_id,
              SUM(
                  COALESCE(oi.sub_total, 0) * 
                  ( CAST(COALESCE(oi.qty, 1) - COALESCE(oi.approved_qty, 0) AS NUMERIC) / NULLIF(CAST(COALESCE(oi.qty, 1) AS NUMERIC), 0) )
              ) AS total_sale_amount,
              SUM(
                  COALESCE(oi.purchase_price, 0) * 
                  ( COALESCE(oi.qty, 0) - COALESCE(oi.approved_qty, 0) )
              ) AS total_purchase_amount
          FROM 
              order_items oi
          INNER JOIN 
              orders ON orders.id = oi.order_id
          WHERE 
              orders.status = 'Delivered'
              AND orders.created_at BETWEEN $1 AND $2
          GROUP BY 
              oi.product_id
        )
        SELECT
          oI.product_id,
          oI.total_sale_amount,
          oI.total_purchase_amount,
          products.name
        FROM orderItems oI
        LEFT JOIN products ON products.id = oI.product_id;`,
      [fromDate, toDate],
    ),
  ]);

  return res.status(200).json({
    success: true,
    message: 'Get Dashboard Report',
    data: {
      ...user[0],
      ...results[0],
      orders,
      top_selling_product,
      top_customers,
      product_alert_stock_report,
      loss_profit,
      payments: payments[0],
      // user_activity,
    },
  });
});

export const getTopSellingProduct = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getTopSellingProduct ${req.method} ${req.url}`);

  const connection = await getDBConnection();

  const topSellingProducts = await connection.query(topSellingProductQuery);

  return res.status(200).json({
    success: true,
    message: 'Get Top selling Products',
    data: topSellingProducts,
  });
});
