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

interface FulfillmentPipelineProps {
  dashboardReports: any;
}

export default function FulfillmentPipeline({
  dashboardReports,
}: FulfillmentPipelineProps) {
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

    total_pending_product_count = 0,
    total_processing_product_count = 0,
    total_shipped_product_count = 0,
    total_delivered_product_count = 0,
    total_canceled_product_count = 0,

    // Returns data
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

  const stages = [
    {
      name: "Pending",
      subtitle: "Awaiting Confirmation",
      count: Number(total_pending_order_count),
      amount: Number(total_pending_order_amount),
      items: Number(total_pending_product_count),
      percent: getPercent(total_pending_order_count),
      icon: FiClock,
      color: "text-amber-600",
      bgColor: "bg-amber-500",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      href: "/dashboard/orders",
      urgent: Number(total_pending_order_count) > 0,
    },
    {
      name: "Processing",
      subtitle: "Packaging & Prep",
      count: Number(total_processing_order_count),
      amount: Number(total_processing_order_amount),
      items: Number(total_processing_product_count),
      percent: getPercent(total_processing_order_count),
      icon: FiPackage,
      color: "text-blue-600",
      bgColor: "bg-blue-500",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      href: "/dashboard/orders",
      urgent: false,
    },
    {
      name: "Shipped",
      subtitle: "In Transit with Courier",
      count: Number(total_shipped_order_count),
      amount: Number(total_shipped_order_amount),
      items: Number(total_shipped_product_count),
      percent: getPercent(total_shipped_order_count),
      icon: FiTruck,
      color: "text-indigo-600",
      bgColor: "bg-indigo-500",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      href: "/dashboard/orders",
      urgent: false,
    },
    {
      name: "Delivered",
      subtitle: "Completed & Received",
      count: Number(total_delivered_order_count),
      amount: Number(total_delivered_order_amount),
      items: Number(total_delivered_product_count),
      percent: getPercent(total_delivered_order_count),
      icon: FiCheckCircle,
      color: "text-global-primary",
      bgColor: "bg-global-primary",
      badgeColor: "bg-global-primary/10 text-global-primary border-global-primary/30",
      href: "/dashboard/orders",
      urgent: false,
    },
    {
      name: "Canceled",
      subtitle: "Voided or Aborted",
      count: Number(total_canceled_order_count),
      amount: Number(total_canceled_order_amount),
      items: Number(total_canceled_product_count),
      percent: getPercent(total_canceled_order_count),
      icon: FiXCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-500",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      href: "/dashboard/orders",
      urgent: false,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Fulfillment & Operations Pipeline
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time status of orders moving from placement to customer delivery
          </p>
        </div>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center text-xs font-semibold text-global-primary hover:text-global-hover transition-colors group"
        >
          <span>Manage Orders</span>
          <FiArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Pipeline Stage Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <Link
              key={stage.name}
              href={stage.href}
              className="p-4 rounded-xl border border-gray-100 hover:border-global-primary/40 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${stage.badgeColor}`}
                  >
                    <Icon className="text-xs" />
                    <span>{stage.name}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400">
                    {stage.percent}%
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-gray-900">
                      {stage.count}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      orders ({stage.items} items)
                    </span>
                  </div>
                  <div className="text-xs font-bold text-gray-700 mt-1">
                    {formatPrice(stage.amount)}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-2 border-t border-gray-100">
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stage.bgColor}`}
                    style={{ width: `${Math.max(stage.percent, 3)}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Reverse Logistics & Returns Health Bar */}
      <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-global-primary/15 text-global-primary flex items-center justify-center font-bold">
            <FiRotateCcw />
          </div>
          <div>
            <span className="font-bold text-gray-800">
              Reverse Logistics & Returns Monitor:
            </span>{" "}
            <span className="text-gray-500">
              {Number(total_return_requested_count) +
                Number(total_return_processing_count) +
                Number(total_return_approved_count) +
                Number(total_return_completed_count)}{" "}
              total claims logged
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-medium border border-amber-200">
            Requested: <strong>&nbsp;{total_return_requested_count}</strong>
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-medium border border-blue-200">
            Processing: <strong>&nbsp;{total_return_processing_count}</strong>
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-global-primary/10 text-global-primary font-bold border border-global-primary/25">
            Completed: <strong>&nbsp;{total_return_completed_count}</strong>
          </span>
          <span className="font-semibold text-gray-700">
            Refunded:{" "}
            <strong className="text-rose-600">
              {formatPrice(total_return_completed_amount)}
            </strong>
          </span>
          <Link
            href="/dashboard/return"
            className="text-global-primary hover:text-global-hover hover:underline font-bold ml-1"
          >
            Review Returns →
          </Link>
        </div>
      </div>
    </div>
  );
}
