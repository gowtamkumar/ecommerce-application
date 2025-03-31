import { Request, Response } from "express";
import { asyncHandler } from "../../../../middlewares/async.middleware";
import { getDBConnection } from "../../../../config/db";
import { OrderEntity } from "../../../order/model/order.entity";
import dayjs from "dayjs";
import { logger } from "../../../../middlewares/logger";

// @desc Get all ProductCategorys
// @route GET /api/v1/dashboard-report
// @access Public
export const getDashboardReport = asyncHandler(
  async (req: Request, res: Response) => {
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
    const qb = orderRepository.createQueryBuilder("order");
    qb.select(["order", "orderItems", "product", "payments", "user.name"]);
    qb.leftJoin("order.orderItems", "orderItems");
    qb.leftJoin("orderItems.product", "product");
    qb.leftJoin("order.user", "user");
    qb.leftJoin("order.payments", "payments");

    if (status) qb.where({ status });
    qb.andWhere(`order.createdAt BETWEEN '${fromDate}' AND '${toDate}'`);
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
    // SUM(CASE WHEN status = 'Completed' THEN (COALESCE(sub_total, 0) + COALESCE(shipping_charge, 0) + COALESCE(total_tax, 0) - COALESCE(total_discount, 0)) ELSE 0 END) AS total_sale_amount
    // SUM(CASE WHEN status = 'Pending' THEN (COALESCE(sub_total, 0) + COALESCE(shipping_charge, 0) + COALESCE(total_tax, 0) - COALESCE(total_discount, 0)) ELSE 0 END) AS total_order_amount,
    // SUM(CASE WHEN status = 'Returned' THEN (COALESCE(sub_total, 0) + COALESCE(shipping_charge, 0) + COALESCE(total_tax, 0) - COALESCE(total_discount, 0)) ELSE 0 END) AS total_sale_return_amount,
    // SUM(CASE WHEN status = 'Canceled' THEN (COALESCE(sub_total, 0) + COALESCE(shipping_charge, 0) + COALESCE(total_tax, 0) - COALESCE(total_discount, 0)) ELSE 0 END) AS total_canceled_amount,

    // order sale, count etc,
    const results = await connection.query(`
      SELECT
          SUM(CASE WHEN status = 'Processing' THEN 1 ELSE 0 END) AS total_processing_count,
          SUM(CASE WHEN status = 'Shipped' THEN 1 ELSE 0 END) AS total_shipped_count,
          SUM(CASE WHEN status = 'On Shipping' THEN 1 ELSE 0 END) AS total_on_shipping_count,
          SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS total_approved_count,
          SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS total_sale_count,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS total_order_count,
          SUM(CASE WHEN status = 'Canceled' THEN 1 ELSE 0 END) AS total_canceled_count,
          SUM(CASE WHEN status = 'Returned' THEN 1 ELSE 0 END) AS total_sale_return_count,
          SUM(CASE WHEN status = 'Returned' THEN  COALESCE(shipping_charge, 0) ELSE 0 END) AS total_sale_return_shipping_charge,
          SUM(CASE WHEN status = 'Canceled' THEN (COALESCE(grand_total,0)) ELSE 0 END) AS total_canceled_amount,
          SUM(CASE WHEN status = 'Returned' THEN (COALESCE(grand_total,0)) ELSE 0 END) AS total_sale_return_amount,
          SUM(CASE WHEN status = 'Pending' THEN (COALESCE(grand_total,0)) ELSE 0 END) AS total_order_amount,
          SUM(CASE WHEN status = 'Completed' THEN (COALESCE(grand_total,0)) ELSE 0 END) AS total_sale_amount
      FROM orders where created_at BETWEEN '${fromDate}' AND '${toDate}'
  `);

    const top_selling_product = await connection.query(
      `with orderItems as (
          SELECT 
            oi.product_id AS product_id,
            SUM(COALESCE(orders.grand_total, 0)) AS total_sale_amount,
            SUM(COALESCE(oi.qty, 0)) AS sale_qty
          FROM 
            order_items oi
          LEFT JOIN 
            orders ON orders.id = oi.order_id
          WHERE 
            orders.status = 'Completed'
          GROUP BY 
            oi.product_id
            order by total_sale_amount DESC
          )
      select
        oI.product_id,
        oI.total_sale_amount,
        oI.sale_qty,
        products.name,
        products.alert_qty
      from orderItems oI
      LEFT JOIN products ON products.id = oI.product_id;
    `
    );

    const top_customers = await connection.query(
      `
        WITH customerSales AS (
          SELECT 
              users.id AS customer_id,
              users.name AS customer_name,
              SUM(COALESCE(orders.grand_total, 0)) AS total_sale_amount,
              SUM(COALESCE(oi.qty, 0)) AS total_qty
          FROM 
              order_items oi
          LEFT JOIN 
              orders ON orders.id = oi.order_id
          LEFT JOIN 
              users ON users.id = orders.user_id
          WHERE 
              orders.status = 'Completed'
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
            SUM(COALESCE(orders.grand_total, 0)) AS total_sale_amount,
            SUM(COALESCE(oi.purchase_price, 0) * COALESCE(oi.qty, 0)) AS total_purchase_amount
        FROM 
            order_items oi
        LEFT JOIN 
            orders ON orders.id = oi.order_id
        WHERE created_at BETWEEN '${fromDate}' AND '${toDate}' AND orders.status = 'Completed'
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

    return res.status(200).json({
      success: true,
      message: "Get Dashboard Report",
      data: {
        ...user[0],
        ...results[0],
        orders,
        top_selling_product,
        top_customers,
        product_alert_stock_report,
        loss_profit,
        // user_activity,
      },
    });
  }
);

export const getTopSellingProduct = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: getTopSellingProduct ${req.method} ${req.url}`);

    const connection = await getDBConnection();

    const top_selling_product = await connection.query(
      `
       WITH orderItems AS (
    SELECT
        oi.product_id AS product_id,
        SUM(COALESCE(oi.sub_total, 0)) AS total_amount
    FROM order_items oi
    LEFT JOIN orders ON orders.id = oi.order_id
    WHERE orders.status = 'Completed'
    GROUP BY oi.product_id
),
productTable AS (
    SELECT 
        p.*, 
        pv.unit_price, 
        pv.purchase_price, 
        pv.stock_qty,
        pv.size_id,
        pv.id AS product_variant_id
    FROM products p
    JOIN LATERAL (
        SELECT 
            pv.unit_price, 
            pv.purchase_price, 
            pv.stock_qty,
            pv.size_id,
            pv.id
        FROM product_variants pv
        WHERE pv.product_id = p.id
        ORDER BY pv.default DESC, pv.id
        LIMIT 1
    ) pv ON true
),
reviewsTable AS (
    SELECT 
        product_id,
        COUNT(*) AS reviews_count,
        COALESCE(AVG(CAST(rating AS FLOAT)), 0) AS average_rating
    FROM reviews
    GROUP BY product_id
),
validDiscount AS (
    SELECT 
        dis.id AS discount_id,
        dis.discount_strategy,
        dis.value AS discount_value,
        dis.scope,
        dis.promotion_type,
        dis.start_date,
        dis.end_date,
        dis.priority,
        ROW_NUMBER() OVER (PARTITION BY dis.scope ORDER BY dis.priority DESC, dis.value DESC) AS rank
    FROM discounts dis
    WHERE 
        dis.status = 'Active'
        AND (dis.start_date <= NOW() AND dis.end_date >= NOW())
),
selectedDiscount AS (
    SELECT DISTINCT ON (p.id) 
        p.id AS product_id, 
        dis.discount_id,
        dis.discount_strategy,
        dis.discount_value,
        dis.scope,
        dis.promotion_type
    FROM products p
    LEFT JOIN validDiscount dis ON (
        (dis.scope = 'Products' AND EXISTS (
            SELECT 1 FROM applicable_products ap WHERE ap.product_id = p.id AND ap.discount_id = dis.discount_id
        )) OR
        (dis.scope = 'Category' AND EXISTS (
            SELECT 1 FROM product_categories pc 
            WHERE pc.product_id = p.id 
            AND pc.category_id IN 
                (SELECT category_id FROM applicable_categories WHERE discount_id = dis.discount_id)
        )) OR
        (dis.scope = 'Brand' AND EXISTS (
            SELECT 1 FROM applicable_brands ab WHERE ab.brand_id = p.brand_id AND ab.discount_id = dis.discount_id
        )) OR
        (dis.scope = 'Global') OR
        (dis.scope = 'Product' AND p.discount_id = dis.discount_id) 
    )   
    ORDER BY p.id, dis.priority DESC, dis.discount_value DESC
)
SELECT 
    p.id AS "id",
    p.name,
    p.slug,
    p.thumbnail_image AS "thumbnailImage",
    p.hover_image AS "hoverImage",
    p.variant,
    oi.total_amount AS "totalAmount",
    sd.discount_id AS "discountId",
    sd.discount_strategy AS "discountStrategy",
    sd.discount_value AS "discountValue",
    sd.scope,
    sd.promotion_type AS "promotionType",
    p.featured,
    p.unit_price AS "unitPrice",
    p.purchase_price AS "purchasePrice",
    p.product_variant_id AS "productVariantId",
    rt.reviews_count AS "reviewsCount",
    rt.average_rating AS "avgRating",
    -- ✅ Calculate tax amount based on the discounted price
    ROUND(
        ((CASE 
            WHEN sd.discount_strategy = 'Percentage' THEN 
                p.unit_price - (p.unit_price * sd.discount_value / 100)
            WHEN sd.discount_strategy = 'Fixed' THEN 
                p.unit_price - sd.discount_value
            ELSE 
                p.unit_price
        END) * COALESCE(taxs.value, 0) / 100), 
    2) AS "taxAmount",
    -- ✅ Calculate Discounted Price
    ROUND(
        CASE 
            WHEN sd.discount_strategy = 'Percentage' THEN 
                p.unit_price - (p.unit_price * sd.discount_value / 100)
            WHEN sd.discount_strategy = 'Fixed' THEN 
                p.unit_price - sd.discount_value
            ELSE 
                p.unit_price  -- No discount applied
        END, 
        2
    ) AS "discountedPrice",
    -- ✅ Product Variants Aggregation
    json_agg(
        json_build_object(
            'price', p.unit_price,
            'purchasePrice', p.purchase_price,
            'stockQty', p.stock_qty,
            'size_id', p.size_id,
            'size', json_build_object('name', sizes.name)
        )
    ) FILTER (WHERE p.product_variant_id IS NOT NULL) AS "productVariants",
    -- ✅ Tax object
    json_build_object(
        'name', taxs.name,
        'value', taxs.value
    ) AS "tax",
    -- ✅ Reviews Aggregation
    json_agg(
        json_build_object(
            'id', r.id,
            'rating', r.rating,
            'comment', r.comment
        )
    ) FILTER (WHERE r.id IS NOT NULL) AS "reviews"
FROM 
    orderItems oi
LEFT JOIN 
    productTable p ON p.id = oi.product_id
LEFT JOIN 
    selectedDiscount sd ON sd.product_id = p.id
LEFT JOIN 
    reviewsTable rt ON rt.product_id = p.id
LEFT JOIN 
    sizes ON sizes.id = p.size_id
LEFT JOIN 
    taxs ON taxs.id = p.tax_id
LEFT JOIN 
    reviews r ON r.product_id = p.id
GROUP BY 
    oi.product_id, oi.total_amount, 
    p.id, p.name, p.slug, p.thumbnail_image, p.hover_image, p.variant, 
    p.featured, p.product_variant_id, p.unit_price, p.purchase_price,
    sd.discount_id, sd.discount_strategy, sd.discount_value, sd.scope, sd.promotion_type,
    rt.reviews_count, rt.average_rating, taxs.name, taxs.value
ORDER BY 
    oi.total_amount DESC 
LIMIT 20;

    `
    );

    return res.status(200).json({
      success: true,
      message: "Get Top selling Products",
      data: top_selling_product,
    });
  }
);