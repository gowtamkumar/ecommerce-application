"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { FiPieChart, FiTrendingDown, FiTrendingUp } from "react-icons/fi";

interface LossProfitProps {
  value: {
    saleAmount: number;
    purchaseAmount: number;
    total_sale_return_shipping_amount: number;
  };
}

export default function LossProfit({ value }: LossProfitProps) {
  const { saleAmount = 0, purchaseAmount = 0, total_sale_return_shipping_amount = 0 } =
    value || {};

  const { formatPrice } = useCurrency();

  const totalCost = Number(purchaseAmount) + Number(total_sale_return_shipping_amount || 0);
  const netEarnings = Number(saleAmount) - totalCost;
  const isProfitable = netEarnings >= 0;
  const marginPercent =
    Number(saleAmount) > 0 ? Math.round((netEarnings / Number(saleAmount)) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 hover:border-global-primary/30 shadow-sm flex flex-col justify-between h-full transition-colors">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FiPieChart className="text-global-primary text-base" />
              <span>Profit & Loss Analysis</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Net operating margin from realized sales vs merchandise costs
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full border ${
              isProfitable
                ? "bg-global-primary/10 text-global-primary border-global-primary/30"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {isProfitable ? <FiTrendingUp /> : <FiTrendingDown />}
            <span>{marginPercent}% Margin</span>
          </span>
        </div>

        {/* Net Profit Big Value */}
        <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 mb-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
            Net Realized Profit
          </span>
          <div
            className={`text-2xl font-black mt-1 ${
              isProfitable ? "text-global-primary" : "text-rose-600"
            }`}
          >
            {formatPrice(netEarnings)}
          </div>
        </div>

        {/* Cost vs Revenue Rows */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-gray-50 text-gray-600">
            <span>Total Sales Revenue</span>
            <strong className="text-gray-900">{formatPrice(saleAmount)}</strong>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-gray-50 text-gray-600">
            <span>Purchase & Product Cost</span>
            <strong className="text-gray-900">{formatPrice(purchaseAmount)}</strong>
          </div>
          {Number(total_sale_return_shipping_amount) > 0 && (
            <div className="flex items-center justify-between py-1.5 border-b border-gray-50 text-gray-600">
              <span>Return Shipping Overhead</span>
              <strong className="text-rose-600">
                {formatPrice(total_sale_return_shipping_amount)}
              </strong>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 text-center">
        Computed based on completed sales against inventory costs
      </div>
    </div>
  );
}
