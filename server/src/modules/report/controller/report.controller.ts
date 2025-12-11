import { Response } from 'express';
import { Between } from 'typeorm';
import { getDBConnection } from '../../../config/db';
import { CustomRequest } from '../../../enums/custom-request-type';
import { asyncHandler } from '../../../middlewares/async.middleware';
import { logger } from '../../../middlewares/logger';
import { TypeEnum } from '../../auth/enums';
import { UserEntity } from '../../auth/model/user.entity';
import { OrderStatus } from '../../order/enums';
import { OrderEntity } from '../../order/model/order.entity';
import { ProductVariantEntity } from '../../products/product-variant/model/product-variant.entity';


// @desc Get Dashboard Stats (Revenue, Profit, Stock, etc.)
// @route GET /api/v1/reports/dashboard
// @access Private (Admin)
export const getDashboardStats = asyncHandler(async (req: CustomRequest, res: Response) => {
    logger.info(`Service: getDashboardStats ${req.method} ${req.url}`);

    const connection = await getDBConnection();
    const orderRepo = connection.getRepository(OrderEntity);
    const userRepo = connection.getRepository(UserEntity);
    const productVariantRepo = connection.getRepository(ProductVariantEntity);

    // 1. Total Revenue & Sales (Paid/Delivered Orders)
    const completedOrders = await orderRepo.find({
        where: [
            { status: OrderStatus.Delivered },
            { status: OrderStatus.Shipped }, // Assuming shipped is confirmed sale
            // Add other "Paid" statuses if necessary
        ],
        relations: ['orderItems', 'orderItems.productVariant']
    });

    const totalRevenue = completedOrders.reduce((acc: number, order: OrderEntity) => acc + (Number(order.grandTotal) || 0), 0);
    const totalSalesCount = completedOrders.length;

    // 2. Profit Calculation
    let totalCost = 0;
    
    // Iterate over all items in completed orders to calculate COGS (Cost of Goods Sold)
    for (const order of completedOrders) {
        if (order.orderItems) {
            for (const item of order.orderItems) {
                // If purchasePrice exists on variant, use it. Otherwise assume 0 or some heuristic.
                // Note: ideally cost should be snapshotted at time of order, but using current variant cost as proxy if not available on order item
                 const cost = (Number(item.productVariant?.purchasePrice) || 0) * item.quantity;
                 totalCost += cost;
            }
        }
    }

    // Simple Profit = Revenue - Cost
    // Net Profit might need to deduct tax/shipping if those are external costs, but usually:
    // Gross Profit = (Sales Price - Cost Price)
    // Here we act as if Revenue is total sales.
    const totalProfit = totalRevenue - totalCost;

    // 3. Customer Count
    const totalCustomers = await userRepo.count({
        where: { role: TypeEnum.Customer }
    });

    // 4. Low Stock Alert (Variants < 5)
    // We can fetch this count directly
    const lowStockCount = await productVariantRepo
        .createQueryBuilder("variant")
        .where("variant.stockQty < :limit", { limit: 5 })
        .getCount();

    // 5. Recent Sales (Last 7 days revenue for chart)
    // Aggregate revenue by date
    // Note: This is a simple aggregation, might need more SQL magic for bigger data
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 7);
    
    const recentOrders = await orderRepo.find({
        where: [
            { status: OrderStatus.Delivered, createdAt: Between(dateLimit.toISOString(), new Date().toISOString()) }
        ],
        order: { createdAt: 'ASC' }
    });

    const salesChartData = recentOrders.reduce((acc: any, order: OrderEntity) => {
        const date = order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : 'Unknown';
        if (!acc[date]) acc[date] = 0;
        acc[date] += Number(order.grandTotal) || 0;
        return acc;
    }, {});

    const chartData = Object.keys(salesChartData).map(date => ({
        date,
        sales: salesChartData[date]
    }));


    return res.status(200).json({
        success: true,
        data: {
            totalRevenue,
            totalSales: totalSalesCount,
            totalProfit,
            totalCustomers,
            lowStockCount,
            chartData
        }
    });
});
