"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { Card, Radio, Typography } from "antd";
import { useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const { Text } = Typography;

interface RevenueAnalyticsChartProps {
  dashboardReports: any;
}

export default function RevenueAnalyticsChart({
  dashboardReports,
}: RevenueAnalyticsChartProps) {
  const { formatPrice } = useCurrency();
  const [chartView, setChartView] = useState<"area" | "bar">("area");

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
  } = dashboardReports || {};

  // Construct chart data based on fulfillment stages
  const data = [
    {
      stage: "Pending",
      revenue: Number(total_pending_order_amount) || 0,
      orders: Number(total_pending_order_count) || 0,
    },
    {
      stage: "Processing",
      revenue: Number(total_processing_order_amount) || 0,
      orders: Number(total_processing_order_count) || 0,
    },
    {
      stage: "Shipped",
      revenue: Number(total_shipped_order_amount) || 0,
      orders: Number(total_shipped_order_count) || 0,
    },
    {
      stage: "Delivered",
      revenue: Number(total_delivered_order_amount) || 0,
      orders: Number(total_delivered_order_count) || 0,
    },
    {
      stage: "Canceled",
      revenue: Number(total_canceled_order_amount) || 0,
      orders: Number(total_canceled_order_count) || 0,
    },
  ];

  const totalGrossRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalOrdersCount = data.reduce((acc, curr) => acc + curr.orders, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-gray-100 text-xs">
          <p className="font-extrabold text-gray-900 mb-1">{label} Stage</p>
          <div className="space-y-1">
            <p className="text-blue-600 font-bold flex items-center justify-between gap-4">
              <span>Revenue:</span>
              <span>{formatPrice(payload[0]?.value || 0)}</span>
            </p>
            {payload[1] && (
              <p className="text-purple-600 font-bold flex items-center justify-between gap-4">
                <span>Orders:</span>
                <span>{payload[1]?.value} units</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      variant="borderless"
      className="shadow-sm rounded-2xl border border-gray-100 p-2 sm:p-4 bg-white"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight">
            Revenue & Order Pipeline
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Real-time breakdown of volume and gross transaction value by stage
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-4 mr-2">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Pipeline Total</span>
              <span className="text-sm font-black text-blue-600">{formatPrice(totalGrossRevenue)}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Orders</span>
              <span className="text-sm font-black text-purple-600">{totalOrdersCount}</span>
            </div>
          </div>

          <Radio.Group
            value={chartView}
            onChange={(e) => setChartView(e.target.value)}
            size="small"
            buttonStyle="solid"
          >
            <Radio.Button value="area">Area</Radio.Button>
            <Radio.Button value="bar">Bar</Radio.Button>
          </Radio.Group>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartView === "area" ? (
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="stage" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOrders)"
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="stage" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Bar dataKey="revenue" name="Revenue" fill="#2563eb" radius={[8, 8, 0, 0]} />
              <Bar dataKey="orders" name="Order Volume" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

