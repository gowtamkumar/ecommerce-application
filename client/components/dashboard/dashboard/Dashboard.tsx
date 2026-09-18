"use client";
import { getDashboardReports } from "@/lib/apis/reports";
import { getSettings } from "@/lib/apis/setting";
import { errorNotification } from "@/lib/utils/notification";
import { setSetting } from "@/redux/features/global/globalSlice";
import { Button, DatePicker, Spin } from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { useDispatch } from "react-redux";
import DataTable from "./tables/DataTable";

// Dynamic imports for optimized rendering
const ExecutiveKpiCards = dynamic(
  () => import("./components/ExecutiveKpiCards")
);
const FulfillmentPipeline = dynamic(
  () => import("./components/FulfillmentPipeline")
);
const RevenueAnalyticsChart = dynamic(
  () => import("./RevenueAnalyticsChart"),
  { ssr: false }
);
const TopSellingProduct = dynamic(
  () => import("./components/TopSallingProduct")
);
const StockAlert = dynamic(() => import("./components/StockAlert"));
const TopCustomer = dynamic(() => import("./components/TopCustomer"));
const LossProfit = dynamic(() => import("./LossProfit"));

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [dashboardReports, setDashboardReports] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<"today" | "7d" | "month" | "year" | "custom">("month");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const dispatch = useDispatch();

  const {
    top_selling_product = [],
    top_customers = [],
    product_alert_stock_report = [],
    loss_profit = [],
    orders = [],
  }: any = dashboardReports || {};

  const fetchReports = useCallback(
    async (start: dayjs.Dayjs, end: dayjs.Dayjs, isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const results = await getDashboardReports({
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        });

        const setting = await getSettings();
        if (setting?.data) {
          dispatch(setSetting(setting.data));
        }

        if (!results.success) {
          errorNotification({ message: results.message });
          return;
        }

        setDashboardReports(results.data || {});
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        errorNotification({
          message: err?.message || "Failed to load dashboard data.",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchReports(dateRange[0], dateRange[1]);
  }, [fetchReports, dateRange]);

  // Handle Quick Presets
  const applyPreset = (preset: "today" | "7d" | "month" | "year") => {
    setActivePreset(preset);
    let start = dayjs().startOf("day");
    let end = dayjs().endOf("day");

    if (preset === "today") {
      start = dayjs().startOf("day");
      end = dayjs().endOf("day");
    } else if (preset === "7d") {
      start = dayjs().subtract(7, "day").startOf("day");
      end = dayjs().endOf("day");
    } else if (preset === "month") {
      start = dayjs().startOf("month");
      end = dayjs().endOf("month");
    } else if (preset === "year") {
      start = dayjs().startOf("year");
      end = dayjs().endOf("year");
    }

    setDateRange([start, end]);
    fetchReports(start, end);
  };

  // Profit & Loss calculations from report data
  const { saleAmount, purchaseAmount } = (loss_profit || []).reduce(
    (
      pre: { saleAmount: number; purchaseAmount: number },
      curr: { total_sale_amount: number; total_purchase_amount: number }
    ) => ({
      saleAmount: +pre.saleAmount + +(curr.total_sale_amount || 0),
      purchaseAmount: +pre.purchaseAmount + +(curr.total_purchase_amount || 0),
    }),
    { saleAmount: 0, purchaseAmount: 0 }
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ========================================================================= */}
      {/* 1. Header with Executive Title, Presets, and Date Controls */}
      {/* ========================================================================= */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Store Performance & Operations
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-global-primary/10 text-global-primary border border-global-primary/30">
              Live Store
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time analytics for{" "}
            <strong>
              {dateRange[0].format("MMM D, YYYY")} – {dateRange[1].format("MMM D, YYYY")}
            </strong>
          </p>
        </div>

        {/* Action Controls: Presets + DatePicker + Refresh */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          {/* Quick Filter Presets */}
          <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => applyPreset("today")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activePreset === "today"
                  ? "bg-global-primary text-white shadow-sm font-bold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => applyPreset("7d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activePreset === "7d"
                  ? "bg-global-primary text-white shadow-sm font-bold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => applyPreset("month")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activePreset === "month"
                  ? "bg-global-primary text-white shadow-sm font-bold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => applyPreset("year")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activePreset === "year"
                  ? "bg-global-primary text-white shadow-sm font-bold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              This Year
            </button>
          </div>

          {/* Precision Range Picker */}
          <RangePicker
            value={dateRange}
            onChange={(values) => {
              if (values && values[0] && values[1]) {
                setActivePreset("custom");
                setDateRange([values[0], values[1]]);
                fetchReports(values[0], values[1]);
              }
            }}
            className="rounded-xl border-gray-200 text-xs shadow-sm hover:border-global-primary focus:border-global-primary"
          />

          {/* Instant Refresh Button */}
          <Button
            onClick={() => fetchReports(dateRange[0], dateRange[1], true)}
            disabled={loading || refreshing}
            className="h-9 px-3 rounded-xl border border-gray-200 hover:border-global-primary hover:text-global-primary text-gray-700 flex items-center justify-center cursor-pointer"
          >
            <FiRefreshCw
              className={`text-xs mr-1.5 ${refreshing ? "animate-spin text-global-primary" : ""}`}
            />
            <span className="text-xs font-semibold">Refresh</span>
          </Button>
        </div>
      </div>

      {loading && !refreshing ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
          <Spin size="large" />
          <span className="text-xs font-medium text-gray-500">
            Gathering store intelligence...
          </span>
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* 2. Top Executive Metric Cards (Revenue, Orders, Profit, Users) */}
          {/* ========================================================================= */}
          <ExecutiveKpiCards
            dashboardReports={dashboardReports}
            saleAmount={saleAmount}
            purchaseAmount={purchaseAmount}
          />

          {/* ========================================================================= */}
          {/* 3. Visual Fulfillment & Operations Pipeline */}
          {/* ========================================================================= */}
          <FulfillmentPipeline dashboardReports={dashboardReports} />

          {/* ========================================================================= */}
          {/* 4. Revenue Distribution & Payment Gateway Health */}
          {/* ========================================================================= */}
          <RevenueAnalyticsChart dashboardReports={dashboardReports} />

          {/* ========================================================================= */}
          {/* 5. Recent Store Orders */}
          {/* ========================================================================= */}
          <DataTable orders={orders} />

          {/* ========================================================================= */}
          {/* 6. Product & Inventory Intelligence Grid */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-6">
              <TopSellingProduct topSellingProduct={top_selling_product} />
            </div>
            <div className="xl:col-span-6">
              <StockAlert productAlertStockReport={product_alert_stock_report} />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 7. Customer Intelligence & Financial Health Grid */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-6">
              <TopCustomer topCustomers={top_customers} />
            </div>
            <div className="xl:col-span-6">
              <LossProfit
                value={{
                  saleAmount,
                  purchaseAmount,
                  total_sale_return_shipping_amount: 0,
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
