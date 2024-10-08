"use client";
import React, { useEffect, useState } from "react";
import { Card, DatePicker, Spin, Statistic } from "antd";
import {
  SendOutlined,
  ShoppingOutlined,
  RollbackOutlined,
  LineChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getDashboardReports } from "@/lib/apis/reports";
import WidgetStats from "./components/WidgetStats";
import StockReport from "./components/StockReport";
import TopCustomer from "./components/TopCustomer";
import StockAlert from "./components/StockAlert";
import TopSellingProduct from "./components/TopSallingProduct";
import CountUp from "react-countup";

const Dashboard = () => {
  const [dashboardReports, setDashboardReports] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const {
    total_order_amount,
    total_sale_amount,
    total_sale_return_amount,
    total_active_user,
    top_selling_product,
    top_customers,
    product_alert_stock_report,
    loss_profit,
    user_activity,
    total_sale_return_shipping_amount,
    total_canceled_amount,
  }: any = dashboardReports || {};
  const { RangePicker } = DatePicker;

  const firstDateOfMonth = dayjs().startOf("month");
  const lastDateOfMonth = dayjs().endOf("month");

  console.log("🚀 ~ dashboardReports:", dashboardReports);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const results = await getDashboardReports({
          startDate: firstDateOfMonth.toISOString(),
          endDate: lastDateOfMonth.toISOString(),
        });
        setDashboardReports(results.data);
      } catch (err) {
        setLoading(false);
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const { saleAmount, purchaseAmount } = (loss_profit || []).reduce(
    (
      pre: { saleAmount: number; purchaseAmount: number },
      curr: { total_sale_amount: number; total_purchase_amount: number }
    ) => {
      return {
        saleAmount: +pre.saleAmount + +curr.total_sale_amount,
        purchaseAmount: +pre.purchaseAmount + +curr.total_purchase_amount,
      };
    },
    {
      saleAmount: 0,
      purchaseAmount: 0,
    }
  );

  if (loading) {
    return <Spin />;
  }

  const formatter = (value: any) => <CountUp end={value} separator="," />;
  return (
    <div className="container">
      <div className="grid pb-3">
        <div className="col-span-4">
          <RangePicker
            style={{ background: "#fff" }}
            defaultValue={[firstDateOfMonth, lastDateOfMonth]}
            onChange={async (value) => {
              const newDate = {} as { startDate: string; endDate: string };
              if (value) newDate.startDate = dayjs(value[0]).toISOString();
              if (value) newDate.endDate = dayjs(value[1]).toISOString();
              const results = await getDashboardReports(newDate);
              setDashboardReports(results.data);
            }}
            className="mx-2 w-100"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <WidgetStats
          title="TOTAL SALE"
          value={total_sale_amount || "0.00"}
          icon={<ShoppingOutlined />}
          color="primary"
        />

        <WidgetStats
          title="TOTAL ORDER"
          value={total_order_amount || "0.00"}
          icon={<LineChartOutlined />}
          color="primary"
        />

        <WidgetStats
          title="ORDER RETURN"
          value={total_sale_return_amount || "0.00"}
          icon={<RollbackOutlined />}
          color="primary"
        />

        <WidgetStats
          title="TOTAL ORDER CANCELED AMOUNT"
          value={total_canceled_amount || "0.00"}
          icon={<SendOutlined />}
          color="primary"
        />
      </div>
      <div className="py-4">
        <StockReport recentHistory={dashboardReports} />
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-3 mb-3">
          <Card title="Ernings" size="small">
            <div>
              <h4> Profit & Loss ৳</h4>
              <Statistic
                value={(
                  +saleAmount -
                  (+purchaseAmount + +total_sale_return_shipping_amount)
                ).toFixed(2)}
                // formatter={formatter}
                prefix={
                  saleAmount >= purchaseAmount ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )
                }
                valueStyle={{
                  color:
                    saleAmount >=
                    purchaseAmount + +total_sale_return_shipping_amount
                      ? "green"
                      : "red",
                }}
              />
            </div>
          </Card>
        </div>
        <div className="col-span-4 mb-3">
          <TopCustomer topCustomers={top_customers} />
        </div>
        <div className="col-span-5 mb-3">
          <TopSellingProduct topSellingProduct={top_selling_product} />
        </div>
      </div>
      <StockAlert productAlertStockReport={product_alert_stock_report} />
    </div>
  );
};

export default Dashboard;
