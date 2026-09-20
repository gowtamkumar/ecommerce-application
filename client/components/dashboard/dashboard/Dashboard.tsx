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
import { FiCalendar, FiRefreshCw, FiTrendingUp } from "react-icons/fi";
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
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 space-y-4">
        {/* ── Tier 1: Page Title, Live Storefront Indicator & Actions ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-global-primary/10 text-global-primary flex items-center justify-center text-xl shrink-0 shadow-2xs">
              <FiTrendingUp />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight leading-tight m-0 truncate">
                  Store Performance & Operations
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Store
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 flex-wrap">
                <FiCalendar className="text-global-primary shrink-0" />
                <span className="text-gray-400">Reporting window:</span>
                <span className="text-gray-800 font-bold whitespace-nowrap">
                  {dateRange[0].format("MMM D, YYYY")} — {dateRange[1].format("MMM D, YYYY")}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Link
              href="/"
              target="_blank"
              className="h-9.5 px-3.5 rounded-xl border border-gray-200 hover:border-global-primary hover:text-global-primary text-gray-700 font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer group"
              title="Open storefront in new tab"
            >
              <ShopOutlined className="text-sm text-gray-400 group-hover:text-global-primary transition-colors" />
              <span>Live Store</span>
              <ExportOutlined className="text-[10px] text-gray-400 group-hover:text-global-primary transition-colors ml-0.5" />
            </Link>

            <Button
              onClick={() => fetchReports(dateRange[0], dateRange[1], true)}
              disabled={loading || refreshing}
              className="h-9.5 px-3.5 rounded-xl border border-gray-200 hover:border-global-primary hover:text-global-primary text-gray-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <FiRefreshCw
                className={`text-sm ${refreshing ? "animate-spin text-global-primary" : ""}`}
              />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </Button>
          </div>
        </div>

        {/* ── Tier 2: Filter Toolbar (Period Presets & Custom Precision RangePicker) ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-0.5">
          {/* Quick Filter Presets */}
          <div className="flex items-center gap-1 bg-gray-50/90 p-1.5 rounded-xl border border-gray-100 overflow-x-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2 select-none shrink-0">
              Period:
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {[
                { label: "Today", value: "today" },
                { label: "7 Days", value: "7d" },
                { label: "This Month", value: "month" },
                { label: "This Year", value: "year" },
              ].map((p) => {
                const isActive = activePreset === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => applyPreset(p.value as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-global-primary text-white shadow-xs font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Precision Range Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap hidden sm:inline select-none">
              Custom Range:
            </span>
            <RangePicker
              value={dateRange}
              onChange={(values) => {
                if (values && values[0] && values[1]) {
                  setActivePreset("custom");
                  setDateRange([values[0], values[1]]);
                  fetchReports(values[0], values[1]);
                }
              }}
              className="h-9.5 rounded-xl border-gray-200 text-xs shadow-2xs hover:border-global-primary focus:border-global-primary w-full sm:w-auto"
            />
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
