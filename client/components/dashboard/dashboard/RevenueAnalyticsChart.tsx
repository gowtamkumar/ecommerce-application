"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { Radio } from "antd";
import { useState } from "react";
import { FiCreditCard } from "react-icons/fi";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface RevenueAnalyticsChartProps {
  dashboardReports: any;
}

const CustomTooltip = ({ active, payload, label, data, formatPrice }: any) => {
  if (active && payload && payload.length) {
    const current = (data || []).find((d: any) => d.stage === label);
    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-gray-100 text-xs">
        <p className="font-extrabold text-gray-900 mb-1.5 flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: current?.color || "#3b82f6" }}
          />
          {label} Orders
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-6 text-gray-600">
            <span>Gross Value:</span>
            <span className="font-bold text-gray-900">
              {formatPrice(current?.revenue || 0)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 text-gray-600">
            <span>Total Orders:</span>
            <span className="font-bold text-gray-900">
              {current?.orders || 0} orders
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function RevenueAnalyticsChart({
  dashboardReports,
}: RevenueAnalyticsChartProps) {
  const { formatPrice } = useCurrency();
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");

  const {
    total_delivered_order_amount = 0,
    total_shipped_order_amount = 0,
    total_processing_order_amount = 0,
    total_pending_order_amount = 0,
    total_canceled_order_amount = 0,

    total_delivered_order_count = 0,
    total_shipped_order_count = 0,
    total_processing_order_count = 0,
    total_pending_order_count = 0,
    total_canceled_order_count = 0,

    payments = {},
  } = dashboardReports || {};

  const STAGE_COLORS = {
    Pending: "#f59e0b",
    Processing: "#3b82f6",
    Shipped: "#6366f1",
    Delivered: "var(--global-primary)",
    Canceled: "#f43f5e",
  };

  const data = [
    {
      stage: "Pending",
      revenue: Number(total_pending_order_amount) || 0,
      orders: Number(total_pending_order_count) || 0,
      color: STAGE_COLORS.Pending,
    },
    {
      stage: "Processing",
      revenue: Number(total_processing_order_amount) || 0,
      orders: Number(total_processing_order_count) || 0,
      color: STAGE_COLORS.Processing,
    },
    {
      stage: "Shipped",
      revenue: Number(total_shipped_order_amount) || 0,
      orders: Number(total_shipped_order_count) || 0,
      color: STAGE_COLORS.Shipped,
    },
    {
      stage: "Delivered",
      revenue: Number(total_delivered_order_amount) || 0,
      orders: Number(total_delivered_order_count) || 0,
      color: STAGE_COLORS.Delivered,
    },
    {
      stage: "Canceled",
      revenue: Number(total_canceled_order_amount) || 0,
      orders: Number(total_canceled_order_count) || 0,
      color: STAGE_COLORS.Canceled,
    },
  ];

  const totalGrossRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalOrdersCount = data.reduce((acc, curr) => acc + curr.orders, 0);

  // Payment method calculations
  const codAmount = Number(payments?.cash_debit_amount) || 0;
  const sslAmount = Number(payments?.ssl_debit_amount) || 0;
  const totalCollections = codAmount + sslAmount;
  const digitalPercent =
    totalCollections > 0 ? Math.round((sslAmount / totalCollections) * 100) : 0;
  const codPercent = totalCollections > 0 ? 100 - digitalPercent : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Interactive Fulfillment Distribution Chart (8 cols) */}
      <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                Fulfillment Distribution & Value
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Comparison of pipeline revenue vs volume across order fulfillment stages
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Radio.Group
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                size="small"
                buttonStyle="solid"
              >
                <Radio.Button value="revenue">Gross Value ($)</Radio.Button>
                <Radio.Button value="orders">Volume (Units)</Radio.Button>
              </Radio.Group>
            </div>
          </div>

          {/* Chart View */}
          <div className="h-72 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="stage"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) =>
                    metric === "revenue"
                      ? `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                      : `${v}`
                  }
                />
                <Tooltip
                  content={(props) => (
                    <CustomTooltip
                      {...props}
                      data={data}
                      formatPrice={formatPrice}
                    />
                  )}
                />
                <Bar
                  dataKey={metric}
                  name={metric === "revenue" ? "Gross Value" : "Units"}
                  radius={[8, 8, 0, 0]}
                >
                  {data.map((entry) => (
                    <Cell key={`cell-${entry.stage}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart Summary Footnote */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Pipeline Total:{" "}
            <strong className="text-gray-900">
              {formatPrice(totalGrossRevenue)}
            </strong>
          </span>
          <span>
            Total Volume:{" "}
            <strong className="text-gray-900">{totalOrdersCount} orders</strong>
          </span>
        </div>
      </div>

      {/* Right: Payment Gateways & Collections (4 cols) */}
      <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Payment Gateways
            </h2>
            <div className="w-8 h-8 rounded-lg bg-global-primary/15 text-global-primary flex items-center justify-center text-sm font-bold">
              <FiCreditCard />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-6">
            Settlement and collection breakdown across active payment methods
          </p>

          {/* Total Collections Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-global-primary to-global-hover text-white shadow-md shadow-global-primary/20 mb-5">
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider block">
              Total Realized Collections
            </span>
            <div className="text-xl sm:text-2xl font-black mt-1 truncate">
              {formatPrice(totalCollections)}
            </div>
            <div className="text-[11px] text-white/80 mt-1 flex items-center gap-1">
              <span>Debit settlements credited in period</span>
            </div>
          </div>

          {/* Payment Gateways Breakdown */}
          <div className="space-y-4">
            {/* SSLCommerz / Digital */}
            <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-bold text-gray-800">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  SSLCommerz (Online Gateway)
                </span>
                <span className="truncate">{formatPrice(sslAmount)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>Share of collections</span>
                <span className="font-bold text-blue-600">{digitalPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${digitalPercent}%` }}
                />
              </div>
            </div>

            {/* Cash on Delivery (COD) */}
            <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-bold text-gray-800">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-global-primary" />
                  Cash on Delivery (COD)
                </span>
                <span className="truncate">{formatPrice(codAmount)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>Share of collections</span>
                <span className="font-bold text-global-primary">{codPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className="bg-global-primary h-full rounded-full"
                  style={{ width: `${codPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
          Reconciliation matches connected payment accounts
        </div>
      </div>
    </div>
  );
}
