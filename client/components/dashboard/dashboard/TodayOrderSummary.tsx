"use client";

import { useCurrency } from "@/context/CurrencyContext";

const TotalOrderSummaryDashboard = ({ dashboardReports }: any) => {
  const {
    total_delivered_product_count,
    total_shipped_product_count,
    total_processing_product_count,
    total_canceled_product_count,
    total_pending_product_count,

    total_delivered_order_amount,
    total_shipped_order_amount,
    total_on_shipping_order_amount,
    total_processing_order_amount,
    total_approved_order_amount,
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
              <span>{+total_pending_order_count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing</span>
              <span>{+total_processing_order_count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipped</span>
              <span>{+total_shipped_order_count || 0}</span>
            </div>

            <div className="flex justify-between">
              <span>Cancelled</span>
              <span>{+total_canceled_order_count || 0}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivered</span>
              <span>{+total_delivered_order_count || 0}</span>
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
              <span>{+total_pending_product_count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing</span>
              <span>{+total_processing_product_count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipped</span>
              <span>{+total_shipped_product_count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled</span>
              <span>{+total_canceled_product_count || 0}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivered</span>
              <span>{+total_delivered_product_count || 0}</span>
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
              <span>{formatPrice(total_pending_order_amount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing</span>
              <span>{formatPrice(total_processing_order_amount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipped</span>
              <span>{formatPrice(total_shipped_order_amount || 0)}</span>
            </div>

            <div className="flex justify-between">
              <span>Cancelled</span>
              <span>{formatPrice(total_canceled_order_amount || 0)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivered</span>
              <span>{formatPrice(total_delivered_order_amount || 0)}</span>
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
              <span>{formatPrice(payments?.cash_debit_amount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>SSLcommerz Order Amount</span>
              <span>{formatPrice(payments?.ssl_debit_amount || 0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Order Return Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Requested</span>
              <span>{total_return_requested_count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing</span>
              <span>{total_return_processing_count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Approved</span>
              <span>{total_return_approved_count || 0}</span>
            </div>

            <div className="flex justify-between">
              <span>Rejected</span>
              <span>{total_return_rejected_count || 0}</span>
            </div>

            <div className="flex justify-between">
              <span>Completed</span>
              <span>{total_return_completed_count || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Return Products Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Requested</span>
              <span>{total_return_requested_product_count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing</span>
              <span>{total_return_processing_product_count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Approved</span>
              <span>{total_return_approved_product_count || 0}</span>
            </div>

            <div className="flex justify-between">
              <span>Rejected</span>
              <span>{total_return_rejected_product_count || 0}</span>
            </div>

            <div className="flex justify-between">
              <span>Completed</span>
              <span>{total_return_completed_product_count || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Order Return Amount
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Requested</span>
              <span>{formatPrice(total_return_requested_amount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing</span>
              <span>{formatPrice(total_return_processing_amount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Approved</span>
              <span>{formatPrice(total_return_approved_amount || 0)}</span>
            </div>

            <div className="flex justify-between">
              <span>Rejected</span>
              <span>{formatPrice(total_return_rejected_amount || 0)}</span>
            </div>

            <div className="flex justify-between">
              <span>Completed</span>
              <span>{formatPrice(total_return_completed_amount || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalOrderSummaryDashboard;
