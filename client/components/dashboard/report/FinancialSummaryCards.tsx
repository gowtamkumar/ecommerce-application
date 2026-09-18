"use client";
import { useCurrency } from "@/context/CurrencyContext";
import {
    FiArrowDownRight,
    FiArrowUpRight,
    FiCheckCircle,
    FiDollarSign,
    FiPieChart,
    FiRotateCcw,
    FiShoppingBag,
    FiTrendingUp,
} from "react-icons/fi";

interface FinancialSummaryCardsProps {
  dashboardReports: any;
  saleAmount: number;
  purchaseAmount: number;
}

export default function FinancialSummaryCards({
  dashboardReports,
  purchaseAmount,
}: FinancialSummaryCardsProps) {
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

    total_return_completed_amount = 0,
    total_return_completed_count = 0,
    total_return_requested_count = 0,
  } = dashboardReports || {};

  const deliveredRevenue = Number(total_delivered_order_amount) || 0;
  const deliveredCount = Number(total_delivered_order_count) || 0;

  const totalGrossRevenue =
    Number(total_pending_order_amount) +
    Number(total_processing_order_amount) +
    Number(total_shipped_order_amount) +
    deliveredRevenue;

  const totalOrdersCount =
    Number(total_pending_order_count) +
    Number(total_processing_order_count) +
    Number(total_shipped_order_count) +
    deliveredCount +
    Number(total_canceled_order_count);

  const cogs = Number(purchaseAmount) || 0;
  const netProfit = deliveredRevenue - cogs;
  const isProfitable = netProfit >= 0;
  const profitMarginPercent =
    deliveredRevenue > 0 ? Math.round((netProfit / deliveredRevenue) * 100) : 0;

  const aov = deliveredCount > 0 ? deliveredRevenue / deliveredCount : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* 1. Net Realized Revenue */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-global-primary/40 shadow-sm transition-all duration-200 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Net Revenue
          </span>
          <div className="w-8 h-8 rounded-lg bg-global-primary text-white flex items-center justify-center text-sm shadow-sm">
            <FiDollarSign />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            {formatPrice(deliveredRevenue)}
          </h3>
          <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1 font-medium">
            <FiCheckCircle className="text-global-primary" />
            <span>Delivered & Settled</span>
          </p>
        </div>
      </div>

      {/* 2. Cost of Goods Sold (COGS) */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-global-primary/40 shadow-sm transition-all duration-200 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Merchandise COGS
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm">
            <FiPieChart />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            {formatPrice(cogs)}
          </h3>
          <p className="text-[11px] text-gray-500 mt-1 font-medium">
            Acquisition & Stock Cost
          </p>
        </div>
      </div>

      {/* 3. Operating Profit */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-global-primary/40 shadow-sm transition-all duration-200 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Gross Profit
          </span>
          <div
            className={`w-8 h-8 rounded-lg ${
              isProfitable
                ? "bg-global-primary/15 text-global-primary font-bold"
                : "bg-rose-100 text-rose-700 font-bold"
            } flex items-center justify-center text-sm`}
          >
            <FiTrendingUp />
          </div>
        </div>
        <div className="mt-3">
          <h3
            className={`text-xl font-black tracking-tight ${
              isProfitable ? "text-gray-900" : "text-rose-600"
            }`}
          >
            {formatPrice(netProfit)}
          </h3>
          <p
            className={`text-[11px] mt-1 font-bold flex items-center gap-1 ${
              isProfitable ? "text-global-primary" : "text-rose-600"
            }`}
          >
            {isProfitable ? <FiArrowUpRight /> : <FiArrowDownRight />}
            <span>{profitMarginPercent}% Operating Margin</span>
          </p>
        </div>
      </div>

      {/* 4. Average Order Value (AOV) */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-global-primary/40 shadow-sm transition-all duration-200 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Average Order (AOV)
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
            <FiShoppingBag />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            {formatPrice(aov)}
          </h3>
          <p className="text-[11px] text-gray-500 mt-1 font-medium">
            Per fulfilled basket
          </p>
        </div>
      </div>

      {/* 5. Gross Pipeline Value */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-global-primary/40 shadow-sm transition-all duration-200 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Pipeline Demand
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
            <FiShoppingBag />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            {formatPrice(totalGrossRevenue)}
          </h3>
          <p className="text-[11px] text-gray-500 mt-1 font-medium">
            {totalOrdersCount} total orders logged
          </p>
        </div>
      </div>

      {/* 6. Returns & Claims Impact */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-global-primary/40 shadow-sm transition-all duration-200 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Returns / Refunds
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-sm">
            <FiRotateCcw />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            {formatPrice(total_return_completed_amount)}
          </h3>
          <p className="text-[11px] text-rose-600 mt-1 font-semibold">
            {total_return_completed_count} refunded ({total_return_requested_count} open)
          </p>
        </div>
      </div>
    </div>
  );
}

