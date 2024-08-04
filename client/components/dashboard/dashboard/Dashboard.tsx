"use client";
import React, { useEffect, useState } from "react";
import { Card, DatePicker, Statistic } from "antd";
import {
  SendOutlined,
  ShoppingOutlined,
  RollbackOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getDashboardReports } from "@/lib/apis/reports";
import WidgetStats from "./components/WidgetStats";
import StockReport from "./components/StockReport";
import TopCustomer from "./components/TopCustomer";
import StockAlert from "./components/StockAlert";
import TopSellingProduct from "./components/TopSallingProduct";

const Dashboard = () => {
  const [dashboardReports, setDashboardReports] = useState({});
  const [datePic, setDatePic] = useState({});
  const {
    summary,
    stockRecords,
    topCustomers,
    stockReports,
    total_approved_count,
    total_on_shipping_count,
    total_order_amount,
    total_processing_count,
    total_sale_amount,
    total_order_return_amount,
    total_shipped_count,
    orders,
    total_active_user,
    top_selling_product,
    top_customers,
    product_alert_stock_report
  }: any = dashboardReports || {};
  console.log("🚀 ~ dashboardReports:", dashboardReports);
  const { RangePicker } = DatePicker;
  // 
  const firstDateOfMonth = dayjs().startOf("month");
  const lastDateOfMonth = dayjs().endOf("month");

  useEffect(() => {
    (async () => {
      try {
        const results = await getDashboardReports({
          // status: "Pending",
          startDate: firstDateOfMonth.toISOString(),
          endDate: lastDateOfMonth.toISOString(),
        });
        setDatePic({
          startDate: firstDateOfMonth.toISOString(),
          endDate: lastDateOfMonth.toISOString(),
        });
        setDashboardReports(results.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <div className="container">
      <div className="grid pb-3">
        <div className="col-span-4">
          <RangePicker
            style={{ background: "#fff" }}
            defaultValue={[firstDateOfMonth, lastDateOfMonth]}
            onChange={async (value) => {
              const newDate = { status: "Pending" } as any;
              if (value) newDate.startDate = dayjs(value[0]).toISOString();
              if (value) newDate.endDate = dayjs(value[1]).toISOString();

              if (newDate.startDate && newDate.endDate) {
                setDatePic(newDate);
              }
              const results = await getDashboardReports(newDate);
              setDashboardReports(results.data);
            }}
            className="mx-2 w-100"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <WidgetStats
          title="TOTAL SALE"
          value={total_sale_amount || "0.00"}
          // percentage={-2.65}
          // subtitle="since last week"
          icon={<ShoppingOutlined />}
          color="primary"
        />

        <WidgetStats
          title="TOTAL ORDER"
          value={total_order_amount || "0.00"}
          // percentage={3.65}
          // title="since last week"
          icon={<LineChartOutlined />}
          color="primary"
        />

        <WidgetStats
          title="ORDER RETURN"
          value={total_order_return_amount || "0.00"}
          // percentage={-2.65}
          // subtitle="since last week"
          icon={<RollbackOutlined />}
          color="primary"
        />

        <WidgetStats
          title="TOTAL VISITOR"
          value={summary?.PaymentOut.totalAmount || "0.00"}
          // percentage={-2.65}
          // subtitle="since last week"
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
              1. Revenue
              <Statistic value={+6000 || "0"} />
            </div>
            <div>
              2. Profit
              <Statistic value={+8000 || "0"} />
            </div>
          </Card>
        </div>
        <div className="col-span-4 mb-3">
          <TopCustomer top_customers={top_customers} />
        </div>
        <div className="col-span-5 mb-3">
          <TopSellingProduct topSellingProduct={top_selling_product} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-6 mb-3">
          <Card title="Other" size="small">
            <div>
              Total Active user
              <Statistic value={total_active_user || "0"} />
            </div>
          </Card>
        </div>
        <div className="col-span-6 mb-3">
          <StockAlert productAlertStockReport={product_alert_stock_report} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
