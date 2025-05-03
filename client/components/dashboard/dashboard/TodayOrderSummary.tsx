"use client";
import React from "react";

const TotalOrderSummaryDashboard = ({ dashboardReports }: any) => {
  const {
    total_order_amount,
    total_sale_amount,
    total_sale_return_amount,
    total_active_user,
    top_selling_product,
    top_customers,
    product_alert_stock_report,
    loss_profit,
    user_activity,
    total_sale_return_shipping_amount,
    total_canceled_amount,
    total_order_count,
    total_canceled_count,
    total_approved_count,
    total_shipped_count,
    total_on_shipping_count,
    total_processing_count,
    payments,
  }: any = dashboardReports || {};

  return (
    <>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Order Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Orders</span>
              <span>{total_order_count}</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled Orders:</span>
              <span>{total_canceled_count}</span>
            </div>
            <div className="flex justify-between">
              <span>Approved Orders:</span>
              <span>{total_approved_count}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Orders:</span>
              <span>{total_processing_count}</span>
            </div>
            <div className="flex justify-between">
              <span>On Shipping Orders:</span>
              <span>{total_on_shipping_count}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipped Orders:</span>
              <span>{total_shipped_count}</span>
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
              <span>Total Products:</span>
              <span>222</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled Products:</span>
              <span>11</span>
            </div>
            <div className="flex justify-between">
              <span>Actual Products:</span>
              <span>10:</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Amount Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span>{total_order_amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled Amount:</span>
              <span>{total_canceled_amount}</span>
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
              <span>COD Order Amount::</span>
              <span>{payments?.cash_debit_amount}</span>
            </div>
            <div className="flex justify-between">
              <span>SSL Order Amount:</span>
              <span>{payments?.ssl_debit_amount}</span>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="grid md:grid-cols-4 gap-4 my-2">
        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            TOTAL Sale Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Sale</span>
              <span>4000</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled Sale:</span>
              <span>4000</span>
            </div>
            <div className="flex justify-between">
              <span>Total Sale</span>
              <span>4000:</span>
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
              <span>Total Products:</span>
              <span>222</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled Products:</span>
              <span>11</span>
            </div>
            <div className="flex justify-between">
              <span>Actual Products:</span>
              <span>10:</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Amount Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span>4000</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled Amount:</span>
              <span>4000</span>
            </div>
            <div className="flex justify-between">
              <span>Actual Amount:</span>
              <span>4000:</span>
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
              <span>COD Order Amount::</span>
              <span>90000</span>
            </div>
            <div className="flex justify-between">
              <span>SSL Order Amount:</span>
              <span>10000</span>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default TotalOrderSummaryDashboard;
