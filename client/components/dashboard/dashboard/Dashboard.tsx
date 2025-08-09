/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { getDashboardReports } from "@/lib/apis/reports";
import { getSettings } from "@/lib/apis/setting";
import { errorNotification } from "@/lib/utils/notification";
import { setSetting } from "@/redux/features/global/globalSlice";
import { DatePicker, Spin } from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
const LossProfit = dynamic(() => import("./LossProfit"));
const StockReport = dynamic(() => import("./components/StockReport"));
const TopCustomer = dynamic(() => import("./components/TopCustomer"));
const StockAlert = dynamic(() => import("./components/StockAlert"));
const TotalOrderSummaryDashboard = dynamic(() => import("./TodayOrderSummary"));
const TopSellingProduct = dynamic(
  () => import("./components/TopSallingProduct")
);

const Dashboard = () => {
  const [dashboardReports, setDashboardReports] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const {
    top_selling_product,
    top_customers,
    product_alert_stock_report,
    loss_profit,
  }: any = dashboardReports || {};
  const { RangePicker } = DatePicker;

  const firstDateOfMonth = dayjs().startOf("month");
  const lastDateOfMonth = dayjs().endOf("month");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const results = await getDashboardReports({
        startDate: firstDateOfMonth.toISOString(),
        endDate: lastDateOfMonth.toISOString(),
      });

      console.log("results", results);


      const setting = await getSettings();
      dispatch(setSetting(setting.data));

      if (!results.success) {
        errorNotification({ message: results.message });
        setLoading(false);
        return;
      }

      setDashboardReports(results.data);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      errorNotification({ message: err?.message || "An error occurred" });
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData(); // Call the function to fetch data
  }, [fetchData]); // Empty dependency array ensures this only runs once on mount

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
      <div className="py-2">
        <TotalOrderSummaryDashboard dashboardReports={dashboardReports} />
      </div>

      <StockReport recentHistory={dashboardReports} />

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-3 mb-3">
          <LossProfit
            value={{
              saleAmount,
              purchaseAmount,
              total_sale_return_shipping_amount: 0,
            }}
          />
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
