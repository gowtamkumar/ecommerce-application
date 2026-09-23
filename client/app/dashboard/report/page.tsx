"use client";
import FinancialSummaryCards from "@/components/dashboard/report/FinancialSummaryCards";
import FulfillmentAuditCard from "@/components/dashboard/report/FulfillmentAuditCard";
import PaymentSettlementCard from "@/components/dashboard/report/PaymentSettlementCard";
import ReportHeader, { ReportPreset } from "@/components/dashboard/report/ReportHeader";
import { getDashboardReports } from "@/lib/apis/reports";
import { getSettings } from "@/lib/apis/setting";
import { errorNotification } from "@/lib/utils/notification";
import { setSetting } from "@/redux/features/global/globalSlice";
import { Spin } from "antd";
import dayjs, { Dayjs } from "dayjs";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { FiDollarSign, FiPackage, FiTruck, FiUsers } from "react-icons/fi";
import { useDispatch } from "react-redux";

// Dynamic imports for chart and heavy tables
const SalesReportChart = dynamic(
  () => import("@/components/dashboard/report/SalesReportChart"),
  { ssr: false }
);
const ProductProfitabilityTable = dynamic(
  () => import("@/components/dashboard/report/ProductProfitabilityTable")
);
const CustomerContributionTable = dynamic(
  () => import("@/components/dashboard/report/CustomerContributionTable")
);
const StockAlert = dynamic(
  () => import("@/components/dashboard/dashboard/components/StockAlert")
);

type ActiveTab = "overview" | "products" | "customers" | "inventory";

export default function ReportPage() {
  const [dashboardReports, setDashboardReports] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [activePreset, setActivePreset] = useState<ReportPreset>("month");
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
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
    payments = {},
  } = dashboardReports || {};

  const fetchReports = useCallback(
    async (start: Dayjs, end: Dayjs, isRefresh = false) => {
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
          errorNotification({
            message: results.message || "Failed to fetch report data",
          });
          return;
        }

        setDashboardReports(results.data || {});
      } catch (err: any) {
        console.error("Report fetch error:", err);
        errorNotification({
          message: err?.message || "Failed to load reports.",
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

  const handlePresetChange = (preset: ReportPreset) => {
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
    } else if (preset === "quarter") {
      const currentMonth = dayjs().month();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      start = dayjs().month(quarterStartMonth).startOf("month");
      end = dayjs().endOf("month");
    } else if (preset === "year") {
      start = dayjs().startOf("year");
      end = dayjs().endOf("year");
    }

    setDateRange([start, end]);
  };

  const handleRangeChange = (values: [Dayjs, Dayjs]) => {
    setActivePreset("custom");
    setDateRange(values);
  };

  // Financial calculations
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

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Financials & Sales", icon: <FiDollarSign /> },
    { id: "products", label: "Product Unit Economics", icon: <FiPackage /> },
    { id: "customers", label: "Customer Value & VIPs", icon: <FiUsers /> },
    { id: "inventory", label: "Inventory & Alerts", icon: <FiTruck /> },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 print:p-0">
      {/* 1. Header with Controls */}
      <div className="print:hidden">
        <ReportHeader
          activePreset={activePreset}
          dateRange={dateRange}
          onPresetChange={handlePresetChange}
          onRangeChange={handleRangeChange}
          onRefresh={() => fetchReports(dateRange[0], dateRange[1], true)}
          loading={loading}
          refreshing={refreshing}
        />
      </div>

      {loading && !refreshing ? (
        <div className="min-h-100 flex flex-col items-center justify-center gap-3">
          <Spin size="large" />
          <span className="text-xs font-medium text-gray-500">
            Synthesizing accounting and business intelligence...
          </span>
        </div>
      ) : (
        <>
          {/* 2. Executive 6-Card Financial Summary */}
          <FinancialSummaryCards
            dashboardReports={dashboardReports}
            saleAmount={saleAmount}
            purchaseAmount={purchaseAmount}
          />

          {/* 3. Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200/80 pb-3 overflow-x-auto print:hidden">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-global-primary text-white shadow-sm"
                      : "bg-white text-gray-600 hover:text-gray-900 border border-gray-100 hover:border-global-primary/30"
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 4. Tab Views */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Sales Revenue Velocity Timeline Chart */}
              <SalesReportChart orders={orders} />

              {/* Payment Settlement & Fulfillment Audit Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                  <PaymentSettlementCard payments={payments} />
                </div>
                <div className="lg:col-span-6">
                  <FulfillmentAuditCard dashboardReports={dashboardReports} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <ProductProfitabilityTable
              lossProfit={loss_profit}
              topSellingProducts={top_selling_product}
            />
          )}

          {activeTab === "customers" && (
            <CustomerContributionTable topCustomers={top_customers} />
          )}

          {activeTab === "inventory" && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <StockAlert productAlertStockReport={product_alert_stock_report} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
