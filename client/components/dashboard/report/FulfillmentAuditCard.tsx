"use client";
import { useCurrency } from "@/context/CurrencyContext";
import Link from "next/link";
import {
    FiArrowRight,
    FiCheckCircle,
    FiClock,
    FiPackage,
    FiRotateCcw,
    FiTruck,
    FiXCircle,
} from "react-icons/fi";

interface FulfillmentAuditCardProps {
  dashboardReports: any;
}

export default function FulfillmentAuditCard({
  dashboardReports,
}: FulfillmentAuditCardProps) {
  const { formatPrice } = useCurrency();

  const {
    total_pending_order_count = 0,
    total_processing_order_count = 0,
    total_shipped_order_count = 0,
    total_delivered_order_count = 0,
    total_canceled_order_count = 0,

    total_pending_order_amount = 0,
    total_processing_order_amount = 0,
    total_shipped_order_amount = 0,
    total_delivered_order_amount = 0,
    total_canceled_order_amount = 0,

    total_return_requested_count = 0,
    total_return_processing_count = 0,
    total_return_approved_count = 0,
    total_return_completed_count = 0,
    total_return_completed_amount = 0,
  } = dashboardReports || {};

  const totalOrders =
    Number(total_pending_order_count) +
    Number(total_processing_order_count) +
    Number(total_shipped_order_count) +
    Number(total_delivered_order_count) +
    Number(total_canceled_order_count);

  const getPercent = (count: number) =>
    totalOrders > 0 ? Math.round((Number(count) / totalOrders) * 100) : 0;

  const fulfillmentRate = getPercent(total_delivered_order_count);
  const cancellationRate = getPercent(total_canceled_order_count);

  const stages = [
    {
      name: "Pending",
      count: Number(total_pending_order_count),
      amount: Number(total_pending_order_amount),
      percent: getPercent(total_pending_order_count),
      icon: FiClock,
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      barColor: "bg-amber-500",
    },
    {
      name: "Processing",
      count: Number(total_processing_order_count),
      amount: Number(total_processing_order_amount),
      percent: getPercent(total_processing_order_count),
      icon: FiPackage,
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
      barColor: "bg-blue-500",
    },
    {
      name: "In Transit",
      count: Number(total_shipped_order_count),
      amount: Number(total_shipped_order_amount),
      percent: getPercent(total_shipped_order_count),
      icon: FiTruck,
      badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
      barColor: "bg-indigo-500",
    },
    {
      name: "Delivered",
      count: Number(total_delivered_order_count),
      amount: Number(total_delivered_order_amount),
      percent: fulfillmentRate,
      icon: FiCheckCircle,
      badgeColor: "bg-global-primary/10 text-global-primary border-global-primary/30",
      barColor: "bg-global-primary",
    },
    {
      name: "Canceled",
      count: Number(total_canceled_order_count),
      amount: Number(total_canceled_order_amount),
      percent: cancellationRate,
      icon: FiXCircle,
      badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
      barColor: "bg-rose-500",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FiTruck className="text-global-primary" />
              <span>Fulfillment & Delivery Health</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Efficiency across fulfillment lifecycle and reverse claims
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-global-primary/10 text-global-primary border border-global-primary/25">
              {fulfillmentRate}% Fulfilled
            </span>
          </div>
        </div>

        {/* Horizontal Stacked Lifecycle Breakdown */}
        <div className="space-y-3 mt-4">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.name}
                className="p-3 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-white hover:border-global-primary/30 transition-all text-xs"
              >
                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${stage.badgeColor}`}
                    >
                      <Icon className="text-xs" />
                      <span>{stage.name}</span>
                    </span>
                    <span className="text-gray-900 font-bold">{stage.count} orders</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 font-bold">
                      {formatPrice(stage.amount)}
                    </span>
                    <span className="text-gray-400 font-semibold w-8 text-right">
                      {stage.percent}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={`${stage.barColor} h-full rounded-full`}
                    style={{ width: `${Math.max(stage.percent, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Reverse Logistics / Return Claims Summary */}
        <div className="mt-5 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between text-xs font-bold text-gray-800 mb-2">
            <span className="flex items-center gap-1.5">
              <FiRotateCcw className="text-global-primary" />
              <span>Reverse Logistics Audit</span>
            </span>
            <Link
              href="/dashboard/return"
              className="text-global-primary hover:text-global-hover flex items-center gap-0.5 text-xs font-semibold"
            >
              <span>Manage Returns</span>
              <FiArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-white p-2 rounded-lg border border-gray-100">
              <span className="text-[10px] text-gray-400 block font-medium uppercase">
                Requested
              </span>
              <strong className="text-amber-700 text-sm">
                {total_return_requested_count}
              </strong>
            </div>
            <div className="bg-white p-2 rounded-lg border border-gray-100">
              <span className="text-[10px] text-gray-400 block font-medium uppercase">
                Processing
              </span>
              <strong className="text-blue-700 text-sm">
                {total_return_processing_count}
              </strong>
            </div>
            <div className="bg-white p-2 rounded-lg border border-gray-100">
              <span className="text-[10px] text-gray-400 block font-medium uppercase">
                Approved
              </span>
              <strong className="text-indigo-700 text-sm">
                {total_return_approved_count}
              </strong>
            </div>
            <div className="bg-white p-2 rounded-lg border border-gray-100">
              <span className="text-[10px] text-gray-400 block font-medium uppercase">
                Refunded
              </span>
              <strong className="text-global-primary text-sm">
                {total_return_completed_count}
              </strong>
            </div>
          </div>

          <div className="mt-2.5 text-right text-[11px] text-gray-500">
            Total refunded value:{" "}
            <strong className="text-rose-600 font-bold">
              {formatPrice(total_return_completed_amount)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

