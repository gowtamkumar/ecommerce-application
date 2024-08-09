import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { OrderEntity } from "../../order/model/order.entity";
import dayjs from "dayjs";
import { UserActivityEntity } from "../../auth/model/user-activity.entity";
import { UserEntity } from "../../auth/model/user.entity";

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
    qb.select(["order", "orderItems", "product", "payments", "user.name"]);
    qb.leftJoin("order.orderItems", "orderItems");
    qb.leftJoin("orderItems.product", "product");
    qb.leftJoin("order.user", "user");
    qb.leftJoin("order.payments", "payments");

    if (status) qb.where({ status });
    qb.andWhere(`order.orderDate BETWEEN '${fromDate}' AND '${toDate}'`);
    qb.orderBy("order.trackingNo", "DESC");
    const orders = await qb.getMany();
    // user info
    const user = await connection.query(
      `SELECT
          SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) AS total_active_user,
          SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) AS total_inactive_user,
          SUM(CASE WHEN status = 'Block' THEN 1 ELSE 0 END) AS total_block_user
      FROM users`
    );
    // order sale, count etc,
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
      FROM orders where order_date BETWEEN '${fromDate}' AND '${toDate}'
  `);

    const top_selling_product = await connection.query(
      `with orderItems as (
          SELECT 
            oi.product_id AS product_id,
            SUM(((COALESCE(oi.price, 0) + COALESCE(oi.tax, 0)) * COALESCE(oi.qty, 0)) - COALESCE(oi.discount_amount, 0) * COALESCE(oi.qty, 0)) AS total_amount
          FROM 
            order_items oi
          LEFT JOIN 
            orders ON orders.id = oi.order_id
          WHERE 
            orders.status = 'Completed'
          GROUP BY 
            oi.product_id
            order by total_amount DESC
          )
      select
        oI.product_id,
        oI.total_amount,
        products.name,
        products.alert_qty
      from orderItems oI
      LEFT JOIN products ON products.id = oI.product_id
    `
    );

    const top_customers = await connection.query(
      `
      with customerPayments as (
        select 
          user_id,
          SUM(COALESCE(amount, 0)) AS total_paid_amount
        from payments group by user_id 
      )
      select 
        users.name,
        total_paid_amount
        from customerPayments as cp
      LEFT JOIN  users ON users.id = cp.user_id
      order by total_paid_amount DESC
    `
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
    `
    );

    const loss_profit = await connection.query(
      `
      with orderItems as (
      SELECT 
            oi.product_id AS product_id,
            SUM(((COALESCE(oi.price, 0) + COALESCE(oi.tax, 0)) * COALESCE(oi.qty, 0)) - COALESCE(oi.discount_amount, 0) * COALESCE(oi.qty, 0)) AS total_sale_amount,
            SUM(COALESCE(oi.purchase_price, 0) * COALESCE(oi.qty, 0)) AS total_purchase_amount
        FROM 
            order_items oi
        LEFT JOIN 
            orders ON orders.id = oi.order_id
        WHERE order_date BETWEEN '${fromDate}' AND '${toDate}' AND orders.status = 'Completed'
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
    `
    );

    const userActivityRepository = connection.getRepository(UserEntity);
    const user_activity = await userActivityRepository
      .createQueryBuilder("user")
      .leftJoin("user.userActivities", "userActivities")
      .where("userActivities.timestamp >= :timestamp", {
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      })
      .getMany();

    return res.status(200).json({
      success: true,
      msg: "Get Dashboard Report",
      data: {
        ...user[0],
        ...results[0],
        orders,
        top_selling_product,
        top_customers,
        product_alert_stock_report,
        loss_profit,
        user_activity,
      },
    });
  }
);
