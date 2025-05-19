"use client";
import React from "react";
const TotalOrderSummaryDashboard = ({ dashboardReports }: any) => {
  const {
    total_completed_product_count,
    total_shipped_product_count,
    total_on_shipping_product_count,
    total_processing_product_count,
    total_approved_product_count,
    total_canceled_product_count,
    total_pending_product_count,

    total_completed_order_amount,
    total_shipped_order_amount,
    total_on_shipping_order_amount,
    total_processing_order_amount,
    total_approved_order_amount,
    total_canceled_order_amount,
    total_pending_order_amount,

    total_pending_order_count,
    total_canceled_order_count,
    total_approved_order_count,
    total_shipped_order_count,
    total_on_shipping_order_count,
    total_processing_order_count,
    total_completed_order_count,
    payments,
  }: any = dashboardReports || {};

  return (
    <>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h3 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Order Summary
            <span>🛒</span>
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Pending</span>
              <span>{+total_pending_order_count}</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled</span>
              <span>{+total_canceled_order_count}</span>
            </div>
            <div className="flex justify-between">
              <span>Approved</span>
              <span>{+total_approved_order_count}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing</span>
              <span>{+total_processing_order_count}</span>
            </div>
            <div className="flex justify-between">
              <span>On Shipping</span>
              <span>{+total_on_shipping_order_count}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipped</span>
              <span>{+total_shipped_order_count}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed</span>
              <span>{+total_completed_order_count}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Products Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Pending</span>
              <span>{+total_pending_product_count}</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled</span>
              <span>{+total_canceled_product_count}</span>
            </div>
            <div className="flex justify-between">
              <span>Approved</span>
              <span>{+total_approved_product_count}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing</span>
              <span>{+total_processing_product_count}</span>
            </div>
            <div className="flex justify-between">
              <span>On Shipping</span>
              <span>{+total_on_shipping_product_count}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipped</span>
              <span>{+total_shipped_product_count}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed</span>
              <span>{+total_completed_product_count}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Order Amount
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Pending</span>
              <span>{total_pending_order_amount || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled</span>
              <span>{total_canceled_order_amount || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span>Approved</span>
              <span>{total_approved_order_amount || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing</span>
              <span>{total_processing_order_amount || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span>On Shipping</span>
              <span>{total_on_shipping_order_amount || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipped</span>
              <span>{total_shipped_order_amount || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed</span>
              <span>{total_completed_order_amount || "0.00"}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Payment Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>COD Order Amount</span>
              <span>{payments?.cash_debit_amount || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span>SSL Order Amount</span>
              <span>{payments?.ssl_debit_amount || "0.00"}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalOrderSummaryDashboard;
