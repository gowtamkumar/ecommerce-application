"use client";

import { useCurrency } from "@/context/CurrencyContext";
import {
  FaBoxOpen,
  FaClipboardList,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaShoppingCart,
  FaUndo
} from "react-icons/fa";

// Helper to render a stat row
const StatRow = ({ label, value, colorClass = "text-gray-600" }: any) => (
  <div className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors">
    <span className="text-gray-500 text-sm font-medium">{label}</span>
    <span className={`font-bold ${colorClass}`}>{value}</span>
  </div>
);

// Helper for the Card Container
const SummaryCard = ({ title, icon: Icon, children, color }: any) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden group">
    <div className={`p-4 flex items-center justify-between border-b border-gray-50 ${color} bg-opacity-5`}>
      <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
        <Icon className={`text-lg ${color.replace("bg-", "text-")}`} />
        {title}
      </h3>
      <span
        className={`p-2 rounded-full ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}
      >
        <Icon className={`${color.replace("bg-", "text-")} text-xl`} />
      </span>
    </div>
    <div className="p-4 space-y-1">{children}</div>
  </div>
);

const TodayOrderSummaryDashboard = ({ dashboardReports }: any) => {
  const {
    total_delivered_product_count,
    total_shipped_product_count,
    total_processing_product_count,
    total_canceled_product_count,
    total_pending_product_count,

    total_delivered_order_amount,
    total_shipped_order_amount,
    // total_on_shipping_order_amount,
    total_processing_order_amount,
    // total_approved_order_amount,
    total_canceled_order_amount,
    total_pending_order_amount,

    total_pending_order_count,
    total_canceled_order_count,
    total_shipped_order_count,
    total_delivered_order_count,
    total_processing_order_count,
    payments,

    // total return summary
    total_return_requested_count,
    total_return_processing_count,
    total_return_approved_count,
    total_return_rejected_count,
    total_return_completed_count,
    // return amount
    total_return_rejected_amount,
    total_return_completed_amount,
    total_return_approved_amount,
    total_return_processing_amount,
    total_return_requested_amount,

    // return product summary
    total_return_completed_product_count,
    total_return_rejected_product_count,
    total_return_approved_product_count,
    total_return_processing_product_count,
    total_return_requested_product_count,
  }: any = dashboardReports || {};

  const { formatPrice } = useCurrency();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* 1. Order Summary */}
      <SummaryCard title="Order Summary" icon={FaClipboardList} color="bg-blue-500">
        <StatRow label="Pending" value={total_pending_order_count || 0} colorClass="text-orange-500" />
        <StatRow label="Processing" value={total_processing_order_count || 0} colorClass="text-blue-500" />
        <StatRow label="Shipped" value={total_shipped_order_count || 0} colorClass="text-indigo-500" />
        <StatRow label="Delivered" value={total_delivered_order_count || 0} colorClass="text-green-600" />
        <StatRow label="Cancelled" value={total_canceled_order_count || 0} colorClass="text-red-500" />
      </SummaryCard>

      {/* 2. Product Summary */}
      <SummaryCard title="Products Summary" icon={FaBoxOpen} color="bg-indigo-500">
        <StatRow label="Pending" value={total_pending_product_count || 0} />
        <StatRow label="Processing" value={total_processing_product_count || 0} />
        <StatRow label="Shipped" value={total_shipped_product_count || 0} />
        <StatRow label="Delivered" value={total_delivered_product_count || 0} />
        <StatRow label="Cancelled" value={total_canceled_product_count || 0} />
      </SummaryCard>

      {/* 3. Order Amount */}
      <SummaryCard title="Order Amount" icon={FaMoneyBillWave} color="bg-green-500">
        <StatRow label="Pending" value={formatPrice(total_pending_order_amount || 0)} />
        <StatRow label="Processing" value={formatPrice(total_processing_order_amount || 0)} />
        <StatRow label="Shipped" value={formatPrice(total_shipped_order_amount || 0)} />
        <StatRow label="Delivered" value={formatPrice(total_delivered_order_amount || 0)} colorClass="text-green-600" />
        <StatRow label="Cancelled" value={formatPrice(total_canceled_order_amount || 0)} colorClass="text-red-500" />
      </SummaryCard>

      {/* 4. Payment Summary */}
      <SummaryCard title="Payment Summary" icon={FaExchangeAlt} color="bg-purple-500">
        <StatRow label="COD Amount" value={formatPrice(payments?.cash_debit_amount || 0)} />
        <StatRow label="SSLCommerz Amount" value={formatPrice(payments?.ssl_debit_amount || 0)} />
        <div className="pt-2 mt-2 border-t border-gray-100">
          <div className="text-xs text-gray-400 text-center">Total Collections Today</div>
          <div className="text-xl font-bold text-center text-gray-800 mt-1">
            {formatPrice((payments?.cash_debit_amount || 0) + (payments?.ssl_debit_amount || 0))}
          </div>
        </div>
      </SummaryCard>

      {/* 5. Return Summary */}
      <SummaryCard title="Returns Summary" icon={FaUndo} color="bg-orange-500">
        <StatRow label="Requested" value={total_return_requested_count || 0} colorClass="text-orange-500" />
        <StatRow label="Processing" value={total_return_processing_count || 0} />
        <StatRow label="Approved" value={total_return_approved_count || 0} colorClass="text-green-600" />
        <StatRow label="Rejected" value={total_return_rejected_count || 0} colorClass="text-red-500" />
        <StatRow label="Completed" value={total_return_completed_count || 0} colorClass="text-green-700" />
      </SummaryCard>

      {/* 6. Return Products */}
      <SummaryCard title="Returned Products" icon={FaShoppingCart} color="bg-pink-500">
        <StatRow label="Requested" value={total_return_requested_product_count || 0} />
        <StatRow label="Processing" value={total_return_processing_product_count || 0} />
        <StatRow label="Approved" value={total_return_approved_product_count || 0} />
        <StatRow label="Rejected" value={total_return_rejected_product_count || 0} />
        <StatRow label="Completed" value={total_return_completed_product_count || 0} />
      </SummaryCard>

      {/* 7. Return Amount */}
      <SummaryCard title="Return Amount" icon={FaMoneyBillWave} color="bg-red-500">
        <StatRow label="Requested" value={formatPrice(total_return_requested_amount || 0)} />
        <StatRow label="Processing" value={formatPrice(total_return_processing_amount || 0)} />
        <StatRow label="Approved" value={formatPrice(total_return_approved_amount || 0)} />
        <StatRow label="Rejected" value={formatPrice(total_return_rejected_amount || 0)} />
        <StatRow label="Completed" value={formatPrice(total_return_completed_amount || 0)} colorClass="text-red-600" />
      </SummaryCard>
    </div>
  );
};

export default TodayOrderSummaryDashboard;

