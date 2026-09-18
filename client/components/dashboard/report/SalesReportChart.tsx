"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { Radio } from "antd";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface SalesReportChartProps {
  orders: any[];
}

const CustomChartTooltip: React.FC<any> = ({
  active,
  payload,
  label,
  formatPrice,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-gray-100 text-xs">
        <p className="font-extrabold text-gray-900 mb-1.5 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-global-primary" />
          {label}
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-6 text-gray-600">
            <span>Sales Revenue:</span>
            <span className="font-bold text-gray-900">
              {formatPrice(data?.revenue || 0)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 text-gray-600">
            <span>Orders Placed:</span>
            <span className="font-bold text-gray-900">
              {data?.ordersCount || 0} orders
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 text-gray-600">
            <span>Avg Value:</span>
            <span className="font-semibold text-gray-700">
              {formatPrice(
                data?.ordersCount > 0 ? data.revenue / data.ordersCount : 0
              )}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function SalesReportChart({ orders = [] }: SalesReportChartProps) {
  const { formatPrice } = useCurrency();
  const [metric, setMetric] = useState<"revenue" | "ordersCount">("revenue");

  // Aggregate orders by day
  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const map: Record<string, { date: string; revenue: number; ordersCount: number }> = {};

    // Sort orders chronologically
    const sorted = [...orders].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    sorted.forEach((order) => {
      const dateKey = dayjs(order.createdAt).format("YYYY-MM-DD");
      const label = dayjs(order.createdAt).format("MMM DD");
      if (!map[dateKey]) {
        map[dateKey] = {
          date: label,
          revenue: 0,
          ordersCount: 0,
        };
      }
      map[dateKey].revenue += Number(order.grandTotal) || 0;
      map[dateKey].ordersCount += 1;
    });

    return Object.values(map);
  }, [orders]);

  const totalPeriodRevenue = chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalPeriodOrders = chartData.reduce((acc, curr) => acc + curr.ordersCount, 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Sales Velocity & Revenue Timeline
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Daily trajectory of orders placed and transaction value in selected period
            </p>
          </div>

          <Radio.Group
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            size="small"
            buttonStyle="solid"
          >
            <Radio.Button value="revenue">Gross Revenue ($)</Radio.Button>
            <Radio.Button value="ordersCount">Volume (Orders)</Radio.Button>
          </Radio.Group>
        </div>

        {chartData.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center text-gray-400 text-xs gap-2">
            <span>No order records found for this period</span>
            <span className="text-gray-300">Try selecting a broader date range</span>
          </div>
        ) : (
          <div className="h-72 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="themePrimaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--global-primary)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--global-primary)"
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) =>
                    metric === "revenue"
                      ? `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`
                      : `${val}`
                  }
                />
                <Tooltip
                  content={(props) => (
                    <CustomChartTooltip {...props} formatPrice={formatPrice} />
                  )}
                />
                <Area
                  type="monotone"
                  dataKey={metric}
                  stroke="var(--global-primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#themePrimaryGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>
          Period Gross:{" "}
          <strong className="text-gray-900">
            {formatPrice(totalPeriodRevenue)}
          </strong>
        </span>
        <span>
          Recorded Volume:{" "}
          <strong className="text-gray-900">{totalPeriodOrders} orders</strong>
        </span>
      </div>
    </div>
  );
}
