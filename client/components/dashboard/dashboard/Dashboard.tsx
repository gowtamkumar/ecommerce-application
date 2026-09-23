"use client";
import { getDashboardReports } from "@/lib/apis/reports";
import { getSettings } from "@/lib/apis/setting";
import { errorNotification } from "@/lib/utils/notification";
import { setSetting } from "@/redux/features/global/globalSlice";
import { ExportOutlined, ShopOutlined } from "@ant-design/icons";
import { Button, DatePicker, Spin } from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FiRefreshCw, FiTrendingUp } from "react-icons/fi";
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
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* ========================================================================= */}
      {/* 1. Header with Minimal Layout: Title, Presets, and Date Controls */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-3 sm:p-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          {/* Left: Title & Live Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center text-base shrink-0">
              <FiTrendingUp />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight m-0">
                  Dashboard
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-[11px] text-gray-500 m-0 font-medium">
                {dateRange[0].format("MMM D, YYYY")} – {dateRange[1].format("MMM D, YYYY")}
              </p>
            </div>
          </div>

          {/* Right: Date Presets, RangePicker & Actions */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Segmented Filter Presets */}
            <div className="inline-flex items-center bg-gray-100/90 p-0.5 rounded-lg border border-gray-200/60">
              {[
                { label: "Today", value: "today" },
                { label: "7D", value: "7d" },
                { label: "Month", value: "month" },
                { label: "Year", value: "year" },
              ].map((p) => {
                const isActive = activePreset === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => applyPreset(p.value as any)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      isActive
                        ? "bg-white text-gray-900 shadow-2xs"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Range Picker */}
            <RangePicker
              value={dateRange}
              onChange={(values) => {
                if (values && values[0] && values[1]) {
                  setActivePreset("custom");
                  setDateRange([values[0], values[1]]);
                  fetchReports(values[0], values[1]);
                }
              }}
              className="!h-8 rounded-lg border-gray-200 text-xs shadow-2xs hover:border-global-primary focus:border-global-primary w-full sm:w-auto"
            />

            <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
              {/* Refresh Button */}
              <Button
                onClick={() => fetchReports(dateRange[0], dateRange[1], true)}
                disabled={loading || refreshing}
                className="!h-8 px-2.5 rounded-lg border-gray-200 hover:border-global-primary hover:text-global-primary text-gray-600 font-medium text-xs inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Refresh metrics"
              >
                <FiRefreshCw
                  className={`text-xs ${refreshing ? "animate-spin text-global-primary" : ""}`}
                />
                <span className="hidden sm:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
              </Button>

              {/* Live Storefront Link */}
              <Link
                href="/"
                target="_blank"
                className="h-8 px-2.5 rounded-lg border border-gray-200 hover:border-global-primary hover:text-global-primary text-gray-600 font-medium text-xs inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer bg-white"
                title="View live storefront"
              >
                <ShopOutlined className="text-xs text-gray-400" />
                <span className="hidden sm:inline">Live Store</span>
                <ExportOutlined className="text-[10px] text-gray-400" />
              </Link>
            </div>
          </div>
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
