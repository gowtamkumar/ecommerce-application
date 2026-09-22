"use client";
import { useCurrency } from "@/context/CurrencyContext";
import {
    FiArrowDownRight,
    FiArrowUpRight,
    FiDollarSign,
    FiShoppingBag,
    FiTrendingUp,
    FiUsers,
} from "react-icons/fi";

interface ExecutiveKpiCardsProps {
  dashboardReports: any;
  saleAmount: number;
  purchaseAmount: number;
}

export default function ExecutiveKpiCards({
  dashboardReports,
  saleAmount,
  purchaseAmount,
}: ExecutiveKpiCardsProps) {
  const { formatPrice } = useCurrency();

  const {
    total_delivered_order_amount = 0,
    total_shipped_order_amount = 0,
    total_processing_order_amount = 0,
    total_pending_order_amount = 0,

    total_delivered_order_count = 0,
    total_shipped_order_count = 0,
    total_processing_order_count = 0,
    total_pending_order_count = 0,
    total_canceled_order_count = 0,

    total_active_user = 0,
    total_inactive_user = 0,
    total_block_user = 0,
  } = dashboardReports || {};

  // Financial & Order calculations
  const totalGrossRevenue =
    Number(total_pending_order_amount) +
    Number(total_processing_order_amount) +
    Number(total_shipped_order_amount) +
    Number(total_delivered_order_amount);

  const totalOrdersCount =
    Number(total_pending_order_count) +
    Number(total_processing_order_count) +
    Number(total_shipped_order_count) +
    Number(total_delivered_order_count) +
    Number(total_canceled_order_count);

  const fulfillmentRate =
    totalOrdersCount > 0
      ? Math.round((Number(total_delivered_order_count) / totalOrdersCount) * 100)
      : 0;

  const netProfit = Number(saleAmount || 0) - Number(purchaseAmount || 0);
  const isProfitable = netProfit >= 0;
  const marginPercent =
    Number(saleAmount || 0) > 0
      ? Math.round((netProfit / Number(saleAmount)) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Total Net Realized Revenue (Anchor Hero Card with Theme Primary Accent) */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-global-primary/40 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-global-primary/10 rounded-bl-full -z-0 group-hover:scale-110 transition-transform duration-500" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Net Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-global-primary text-white flex items-center justify-center text-lg shadow-md shadow-global-primary/25">
              <FiDollarSign />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight truncate">
              {formatPrice(total_delivered_order_amount)}
            </h3>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-[11px] sm:text-xs">
              <span className="text-global-primary font-bold flex items-center gap-1">
                <FiArrowUpRight className="text-sm shrink-0" /> Delivered & Paid
              </span>
              <span className="text-gray-400 font-medium">
                Gross: {formatPrice(totalGrossRevenue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Total Orders & Action Items */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-global-primary/30 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform duration-500" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center text-lg shadow-sm">
              <FiShoppingBag />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight truncate">
              {totalOrdersCount}
            </h3>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-[11px] sm:text-xs">
              <span className="text-gray-700 font-semibold">
                {fulfillmentRate}% Fulfilled
              </span>
              {Number(total_pending_order_count) > 0 ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-global-primary/15 text-global-primary border border-global-primary/25 animate-pulse">
                  {total_pending_order_count} Action Needed
                </span>
              ) : (
                <span className="text-gray-400 font-medium">All caught up</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Net Profit / Margin */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-global-primary/30 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div
          className={`absolute top-0 right-0 w-24 h-24 ${
            isProfitable ? "bg-global-primary/5" : "bg-rose-50"
          } rounded-bl-full -z-0 group-hover:scale-110 transition-transform duration-500`}
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Net Profit
            </span>
            <div
              className={`w-10 h-10 rounded-xl ${
                isProfitable
                  ? "bg-global-primary/15 text-global-primary"
                  : "bg-rose-100/70 text-rose-700"
              } flex items-center justify-center text-lg shadow-sm font-bold`}
            >
              <FiTrendingUp />
            </div>
          </div>
          <div className="mt-3">
            <h3
              className={`text-xl sm:text-2xl font-black tracking-tight truncate ${
                isProfitable ? "text-gray-900" : "text-rose-600"
              }`}
            >
              {formatPrice(netProfit)}
            </h3>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-[11px] sm:text-xs">
              <span
                className={`font-semibold flex items-center gap-1 ${
                  isProfitable ? "text-global-primary font-bold" : "text-rose-600"
                }`}
              >
                {isProfitable ? (
                  <FiArrowUpRight className="text-sm shrink-0" />
                ) : (
                  <FiArrowDownRight className="text-sm shrink-0" />
                )}
                {marginPercent}% Margin
              </span>
              <span className="text-gray-400 font-medium">
                Cost: {formatPrice(purchaseAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Customer Base */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-global-primary/30 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform duration-500" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Active Customers
            </span>
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center text-lg shadow-sm">
              <FiUsers />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight truncate">
              {total_active_user || 0}
            </h3>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-[11px] sm:text-xs">
              <span className="text-gray-700 font-semibold">
                Verified Users
              </span>
              <span className="text-gray-400 font-medium truncate">
                {total_inactive_user} inactive · {total_block_user} blocked
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
