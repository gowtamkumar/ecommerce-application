import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { getDBConnection } from '../../../../config/db';
import { asyncHandler } from '../../../../middlewares/async.middleware';
import { logger } from '../../../../middlewares/logger';
import { topSellingProductQuery } from '../../../../sqlQuery';
import { OrderEntity } from '../../../order/model/order.entity';

// @desc Get all ProductCategorys
// @route GET /api/v1/dashboard-report
// @access Public
export const getDashboardReport = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getDashbordReport ${req.method} ${req.url}`);
  // logger.error(`Error: something `); //this is error log
  // logger.log({
  //   level: 'info',
  //   message: 'Hello distributed log files!'
  // })

  const { status, startDate, endDate }: any = req.query;
  const connection = await getDBConnection();

  const fromDate = dayjs(startDate).toISOString();
  const toDate = dayjs(endDate).toISOString();

  const orderRepository = connection.getRepository(OrderEntity);
  const qb = orderRepository.createQueryBuilder('order');
  qb.select(['order', 'orderItems', 'product', 'payments', 'user.name']);
  qb.leftJoin('order.orderItems', 'orderItems');
  qb.leftJoin('orderItems.product', 'product');
  qb.leftJoin('order.user', 'user');
  qb.leftJoin('order.payments', 'payments');

  if (status) qb.where({ status });
  qb.andWhere(`order.createdAt BETWEEN '${fromDate}' AND '${toDate}'`);
  qb.orderBy('order.trackingNo', 'DESC');
  const orders = await qb.getMany();
  // user info
  const user = await connection.query(
    `SELECT
          SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) AS total_active_user,
          SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) AS total_inactive_user,
          SUM(CASE WHEN status = 'Block' THEN 1 ELSE 0 END) AS total_block_user
      FROM users`,
  );

  const payments = await connection.query(
    `SELECT
        SUM(CASE WHEN payment_method = 'SSLCOMMERZ' AND payment_type = 'Debit' THEN COALESCE(amount, 0) ELSE 0 END) AS ssl_debit_amount,
        SUM(CASE WHEN payment_method = 'Cash' AND payment_type = 'Debit' THEN COALESCE(amount, 0) ELSE 0 END) AS cash_debit_amount,
        SUM(CASE WHEN payment_method = 'SSLCOMMERZ' AND payment_type = 'Credit' THEN COALESCE(amount, 0) ELSE 0 END) AS ssl_credit_amount,
        SUM(CASE WHEN payment_method = 'Cash' AND payment_type = 'Credit' THEN COALESCE(amount, 0) ELSE 0 END) AS cash_credit_amount
      FROM payments
      WHERE created_at BETWEEN '${fromDate}' AND '${toDate}'`,
  );

  // order sale, count etc,
  const results = await connection.query(`
      SELECT
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


      FROM orders where created_at BETWEEN '${fromDate}' AND '${toDate}'
  `);

  const top_selling_product = await connection.query(
    `with orderItems as (
          SELECT 
            oi.product_id AS product_id,
            SUM(
                COALESCE(oi.sub_total, 0) * 
                ( CAST(COALESCE(oi.qty, 1) - COALESCE(oi.approved_qty, 0) AS NUMERIC) / NULLIF(CAST(COALESCE(oi.qty, 1) AS NUMERIC), 0) )
            ) AS total_sale_amount,
            SUM(COALESCE(oi.qty, 0) - COALESCE(oi.approved_qty, 0)) AS sale_qty
          FROM 
            order_items oi
          LEFT JOIN 
            orders ON orders.id = oi.order_id
          WHERE 
            orders.status = 'Delivered'
            AND orders.created_at BETWEEN '${fromDate}' AND '${toDate}'
          GROUP BY 
            oi.product_id
          )
      select
        oI.product_id,
        oI.total_sale_amount,
        oI.sale_qty,
        products.name,
        products.alert_qty
      from orderItems oI
      LEFT JOIN products ON products.id = oI.product_id
      order by oI.total_sale_amount DESC;
    `,
  );

  const top_customers = await connection.query(
    `
        WITH customerSales AS (
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
          LEFT JOIN 
              orders ON orders.id = oi.order_id
          LEFT JOIN 
              users ON users.id = orders.user_id
          WHERE 
              orders.status = 'Delivered'
              AND orders.created_at BETWEEN '${fromDate}' AND '${toDate}'
          GROUP BY 
              users.id, users.name
        )
        SELECT 
            cs.customer_id,
            cs.customer_name,
            cs.total_sale_amount,
            cs.total_qty
        FROM customerSales cs
        ORDER BY cs.total_sale_amount DESC;
    `,
  );

  const product_alert_stock_report = await connection.query(
    `
     WITH productVariants AS (
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
          productVariants.stock_qty ASC
    `,
  );

  const loss_profit = await connection.query(
    `
      with orderItems as (
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
        LEFT JOIN 
            orders ON orders.id = oi.order_id
        WHERE orders.created_at BETWEEN '${fromDate}' AND '${toDate}' AND orders.status = 'Delivered'
        GROUP BY 
            oi.product_id
      )
            
      select
        oI.product_id,
        oI.total_sale_amount,
        oI.total_purchase_amount,
        products.name
      from orderItems oI
      LEFT JOIN products ON products.id = oI.product_id 
    `,
  );

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
