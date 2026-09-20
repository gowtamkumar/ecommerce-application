"use client";

import { ActionType, paymentMethods } from "@/constants/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { getOrderQuery } from "@/lib/apis/orders";
import { onlinePayment } from "@/lib/apis/payment";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { errorNotification } from "@/lib/utils/notification";
import { setAction } from "@/redux/features/global/globalSlice";
import {
    Divider,
    Form,
    Input,
    Select,
    Skeleton,
    Table,
    Timeline,
    Tooltip,
} from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
    FiAlertCircle,
    FiArrowRight,
    FiCalendar,
    FiCheck,
    FiClock,
    FiCopy,
    FiCreditCard,
    FiDollarSign,
    FiFileText,
    FiMapPin,
    FiPackage,
    FiPhone,
    FiRefreshCw,
    FiRotateCcw,
    FiSearch,
    FiTruck,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import ReturnRequestAllOrder from "./ReturnRequestAllOrder";
import ReturnRequestOrderItem from "./ReturnRequestOrderItem";

interface OrderTrackingType {
  id?: string;
  status: string;
  createdAt: string;
}

interface OrderItemType {
  id: string;
  qty: number;
  unitPrice: number;
  taxAmount?: number;
  subTotal: number;
  requestedQty?: number;
  approvedQty?: number;
  product?: {
    name: string;
    thumbnailImage?: string;
    slug?: string;
  };
}

const ORDER_STAGES = [
  { key: "Pending", label: "Placed", icon: FiFileText },
  { key: "Processing", label: "Processing", icon: FiRefreshCw },
  { key: "Shipped", label: "Shipped", icon: FiTruck },
  { key: "Delivered", label: "Delivered", icon: FiCheck },
];

const getStageIndex = (status: string) => {
  const map: Record<string, number> = {
    Pending: 0,
    Processing: 1,
    Shipped: 2,
    Delivered: 3,
  };
  return map[status] ?? 0;
};

export default function OrderTracker() {
  const searchParams = useSearchParams();
  const urlTrackingNo = searchParams.get("trackingNo");

  const [order, setOrder] = useState<any>({});
  const [payMethod, setPayMethod] = useState("");
  const [tracker, setTracker] = useState<{ trackingNo: string }>({
    trackingNo: "",
  });
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { formatPrice } = useCurrency();

  const handleOrderTracking = useCallback(
    async (values: { trackingNo: string }) => {
      if (!values?.trackingNo?.trim()) return;
      const trackingNumber = values.trackingNo.trim();

      setLoading(true);
      setTracker({ trackingNo: trackingNumber });

      try {
        const result = await getOrderQuery({ trackingNo: trackingNumber });
        if (result?.success && result?.data) {
          setOrder(result.data);
        } else {
          setOrder({});
        }
      } catch (error) {
        console.error("Tracking lookup error:", error);
        setOrder({});
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (urlTrackingNo) {
      form.setFieldsValue({ trackingNo: urlTrackingNo });
      handleOrderTracking({ trackingNo: urlTrackingNo });
    }
  }, [urlTrackingNo, form, handleOrderTracking]);

  const handleCopyTracking = (e: React.MouseEvent, trackingNo: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(trackingNo);
    setCopiedId(trackingNo);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOnlinePayment = async () => {
    if (!payMethod) {
      errorNotification({ message: "Please select a payment method" });
      return;
    }
    const tranId = order.tranId;
    const result = await onlinePayment({
      tranId,
      grandTotal: order.due > 0 ? order.due : +order.grandTotal,
      paymentMethod: payMethod,
    });

    if (result?.success && result?.url) {
      window.location.href = result.url;
    } else {
      errorNotification({
        message: result?.message || "Payment initiation failed",
      });
    }
  };

  const handleReturnAll = () => {
    dispatch(
      setAction({
        type: ActionType.UPDATE,
        returnAllOrder: true,
        payload: { id: order.id },
      })
    );
  };

  const handleReturnItem = (item: OrderItemType) => {
    dispatch(
      setAction({
        type: ActionType.UPDATE,
        returnOrderItem: true,
        payload: { ...item, orderId: order.id },
      })
    );
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Delivered
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            Processing
          </span>
        );
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Shipped
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Placed
          </span>
        );
      case "Canceled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Canceled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  const columns = [
    {
      title: "Product",
      key: "product",
      render: (_: any, record: OrderItemType) => (
        <div className="flex items-center gap-3 py-2">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
            <Image
              src={getImageUrl(record.product?.thumbnailImage)}
              alt={record.product?.name || "Product"}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1">
              {record.product?.name}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-gray-400">
                Qty: {record.qty}
              </span>
              {(record.requestedQty ?? 0) > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  Return Requested: {record.requestedQty}
                </span>
              )}
              {(record.approvedQty ?? 0) > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Return Approved: {record.approvedQty}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Unit Price",
      align: "right" as const,
      render: (_: any, record: OrderItemType) => (
        <span className="text-xs text-gray-600 font-medium">
          {formatPrice(+record.unitPrice + +(record.taxAmount || 0))}
        </span>
      ),
    },
    {
      title: "Total",
      align: "right" as const,
      render: (_: any, record: OrderItemType) => (
        <span className="font-bold text-xs sm:text-sm text-gray-900">
          {formatPrice(record.subTotal)}
        </span>
      ),
    },
    {
      title: "Action",
      align: "center" as const,
      render: (_: any, record: OrderItemType) =>
        order.status === "Delivered" ? (
          <button
            onClick={() => handleReturnItem(record)}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
          >
            <FiRotateCcw className="w-3 h-3" />
            <span>Return</span>
          </button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Search Header Card ── */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <div className="max-w-xl mx-auto text-center space-y-2 mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Track Package & Order Status
          </h3>
          <p className="text-xs sm:text-sm text-gray-400">
            Enter your tracking number below to view real-time delivery
            milestones, returns, and invoice details.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <Form
            form={form}
            onFinish={handleOrderTracking}
            layout="vertical"
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Form.Item
                name="trackingNo"
                className="flex-1 mb-0"
                rules={[{ required: true, message: "Enter tracking number" }]}
              >
                <Input
                  prefix={<FiSearch className="text-gray-400 mr-1" />}
                  placeholder="Order ID (e.g. ORD-1725...)"
                  className="rounded-xl h-12 text-xs sm:text-sm border-gray-200 focus:border-global-primary"
                />
              </Form.Item>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 h-12 bg-global-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm shadow-amber-200/60 hover:opacity-95 transition-opacity cursor-pointer shrink-0"
              >
                <FiTruck className="w-4 h-4" />
                <span>{loading ? "Locating..." : "Track Order"}</span>
              </button>
            </div>
          </Form>

          <p className="text-center text-[11px] text-gray-400 mt-3">
            Looking for past orders? Check your{" "}
            <Link
              href="/profile?tab=orders"
              className="text-global-primary font-bold hover:underline"
            >
              Order History
            </Link>{" "}
            and click &ldquo;Track&rdquo;.
          </p>
        </div>
      </div>

      {/* ── Loading Skeleton ── */}
      {loading ? (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton.Button active shape="round" className="w-40" />
            <Skeleton.Button active shape="round" className="w-24" />
          </div>
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : order?.trackingNo ? (
        /* ── Tracked Order Details ── */
        <div className="space-y-6 animate-in fade-in duration-400">
          {/* Top Row: Progress & Grand Total Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress Stepper Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                {/* Tracking ID Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 mb-6">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                      Tracking
                    </span>
                    <span className="font-mono font-bold text-sm sm:text-base text-gray-900">
                      #{order.trackingNo}
                    </span>

                    <Tooltip
                      title={
                        copiedId === order.trackingNo ? "Copied!" : "Copy Order ID"
                      }
                    >
                      <button
                        onClick={(e) => handleCopyTracking(e, order.trackingNo)}
                        className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                        aria-label="Copy Tracking Number"
                      >
                        {copiedId === order.trackingNo ? (
                          <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <FiCopy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </Tooltip>

                    {renderStatusBadge(order.status)}
                  </div>

                  <div className="text-[11px] text-gray-400 font-medium">
                    Updated: {dayjs(order.updatedAt).format("MMM D, YYYY · h:mm A")}
                  </div>
                </div>

                {/* Visual Progress Stepper */}
                {order.status !== "Canceled" ? (
                  <div className="bg-gray-50/80 rounded-xl p-4 sm:p-6 border border-gray-100 my-2">
                    <div className="relative flex items-center justify-between">
                      {/* Line */}
                      <div className="absolute left-6 right-6 top-3 -translate-y-1/2 h-1 bg-gray-200 z-0">
                        <div
                          className="h-full bg-global-primary transition-all duration-500 rounded-full"
                          style={{
                            width:
                              order.status === "Delivered"
                                ? "100%"
                                : order.status === "Shipped"
                                ? "66%"
                                : order.status === "Processing"
                                ? "33%"
                                : "0%",
                          }}
                        />
                      </div>

                      {/* Steps */}
                      {ORDER_STAGES.map((stage, idx) => {
                        const currentIdx = getStageIndex(order.status);
                        const isPassed = currentIdx >= idx;
                        const isCurrent = currentIdx === idx;
                        const StageIcon = stage.icon;

                        return (
                          <div
                            key={stage.key}
                            className="flex flex-col items-center relative z-10"
                          >
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                isCurrent
                                  ? "bg-global-primary text-white ring-4 ring-amber-100 shadow-sm scale-110"
                                  : isPassed
                                  ? "bg-global-primary text-white"
                                  : "bg-white border-2 border-gray-300 text-gray-400"
                              }`}
                            >
                              {isPassed ? (
                                <FiCheck className="w-3.5 h-3.5 text-white" />
                              ) : (
                                <StageIcon className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <span
                              className={`text-[10px] sm:text-[11px] mt-2 font-bold tracking-tight whitespace-nowrap ${
                                isCurrent
                                  ? "text-gray-900 font-extrabold"
                                  : isPassed
                                  ? "text-gray-700"
                                  : "text-gray-400"
                              }`}
                            >
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-rose-50/80 rounded-xl p-4 border border-rose-100 flex items-center justify-between text-xs text-rose-700">
                    <span className="flex items-center gap-2 font-bold">
                      <FiAlertCircle className="w-4 h-4 text-rose-500" />
                      This order has been canceled
                    </span>
                    <span className="text-[11px] text-rose-500 font-medium">
                      Cancellation confirmed
                    </span>
                  </div>
                )}
              </div>

              {/* Return / Refund Status Banner */}
              {(order.returnedStatus || order.refundStatus) && (
                <div className="mt-6 bg-amber-50/60 rounded-xl p-4 border border-amber-200/80">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200/60">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <FiRotateCcw className="w-3.5 h-3.5 text-amber-700" />
                      Return & Refund Status
                    </span>
                    {order.status === "Delivered" && (
                      <button
                        onClick={handleReturnAll}
                        className="text-[11px] font-bold text-amber-800 hover:underline cursor-pointer"
                      >
                        Request Return
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white p-2.5 rounded-lg border border-amber-100">
                      <p className="text-[10px] font-bold uppercase text-gray-400">
                        Return
                      </p>
                      <p className="text-xs font-bold text-amber-900">
                        {order.returnedStatus || "None"}
                      </p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-amber-100">
                      <p className="text-[10px] font-bold uppercase text-gray-400">
                        Refund
                      </p>
                      <p className="text-xs font-bold text-amber-900">
                        {order.refundStatus || "None"}
                      </p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-amber-100">
                      <p className="text-[10px] font-bold uppercase text-gray-400">
                        Refunded Amount
                      </p>
                      <p className="text-xs font-bold text-emerald-700">
                        {formatPrice(order.totalRefuned || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Grand Total Summary Card */}
            <div className="bg-gray-900 rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div>
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block mb-1">
                    Order Total
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-global-primary tracking-tight">
                    {formatPrice(order.grandTotal)}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Payment Method:</span>
                    <span className="font-semibold text-white">
                      {order.paymentMethod || "Online"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Payment Status:</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.paymentStatus === "Paid"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {order.paymentStatus || "Unpaid"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-4 border-t border-gray-800 mt-6 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>Placed on</span>
                </span>
                <span className="font-semibold text-white">
                  {dayjs(order.createdAt).format("MMM D, YYYY")}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Ordered Items, Delivery & Payment Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items & Delivery (Left 2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items Table Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    Ordered Items ({order.orderItems?.length})
                  </h4>
                  {order.status === "Delivered" && (
                    <button
                      onClick={handleReturnAll}
                      className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FiRotateCcw className="w-3 h-3" />
                      <span>Return Entire Order</span>
                    </button>
                  )}
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <Table
                    columns={columns}
                    dataSource={order.orderItems}
                    pagination={false}
                    rowKey="id"
                    size="small"
                  />
                </div>
              </div>

              {/* Delivery Destination Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold uppercase tracking-wider text-gray-900">
                  <FiMapPin className="w-4 h-4 text-global-primary" />
                  <span>Delivery Destination</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1 text-xs">
                    <p className="text-gray-400 font-bold uppercase text-[10px]">
                      Recipient
                    </p>
                    <p className="font-bold text-gray-900 text-sm">
                      {order.shippingAddress?.name || "Customer"}
                    </p>
                    {order.shippingAddress?.phoneNo && (
                      <p className="text-gray-600 flex items-center gap-1.5 pt-1">
                        <FiPhone className="w-3 h-3 text-gray-400" />
                        {order.shippingAddress.phoneNo}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-gray-400 font-bold uppercase text-[10px]">
                      Street Address
                    </p>
                    <p className="text-gray-700 leading-relaxed font-medium">
                      {order.shippingAddress?.address || "No address specified"}
                    </p>
                    {order.shippingAddress?.type && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-semibold">
                        {order.shippingAddress.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary & Timeline (Right Col) */}
            <div className="space-y-6">
              {/* Payment Summary Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold uppercase tracking-wider text-gray-900">
                  <FiCreditCard className="w-4 h-4 text-global-primary" />
                  <span>Payment Breakdown</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(order.subTotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-500">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-gray-900">
                      +{formatPrice(order.shippingCharge)}
                    </span>
                  </div>

                  {+order.totalTax > 0 && (
                    <div className="flex justify-between text-gray-500">
                      <span>Tax</span>
                      <span className="font-semibold text-gray-900">
                        +{formatPrice(order.totalTax)}
                      </span>
                    </div>
                  )}

                  {+order.totalItemsDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span className="font-semibold">
                        -{formatPrice(order.totalItemsDiscount)}
                      </span>
                    </div>
                  )}

                  <Divider className="my-2 border-gray-100" />

                  <div className="flex justify-between items-center text-sm font-black text-gray-900">
                    <span>Grand Total</span>
                    <span className="text-base text-gray-900 font-black">
                      {formatPrice(order.grandTotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400 font-medium">
                    <span>Amount Paid</span>
                    <span>{formatPrice(order.paid || 0)}</span>
                  </div>

                  {order.due > 0 && (
                    <div className="flex justify-between text-amber-700 font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-200 mt-2">
                      <span>Balance Due</span>
                      <span>{formatPrice(order.due)}</span>
                    </div>
                  )}

                  {/* Online Payment for Due balance */}
                  {order.due > 0 &&
                    order.paymentStatus !== "Paid" &&
                    order.status !== "Canceled" &&
                    order.paymentMethod !== paymentMethods[0]?.value && (
                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-2.5">
                        <p className="text-[11px] font-bold text-gray-700">
                          Complete Pending Payment
                        </p>
                        <Select
                          size="large"
                          className="w-full rounded-xl"
                          placeholder="Select Payment Gateway"
                          onChange={setPayMethod}
                          options={paymentMethods.filter(
                            (m) => m.value !== paymentMethods[0]?.value
                          )}
                        />
                        <button
                          onClick={handleOnlinePayment}
                          className="w-full inline-flex items-center justify-center gap-2 h-11 bg-global-primary text-white text-xs font-bold rounded-xl shadow-sm shadow-amber-200/60 hover:opacity-95 transition-opacity cursor-pointer"
                        >
                          <FiDollarSign className="w-4 h-4" />
                          <span>Pay {formatPrice(order.due)}</span>
                        </button>
                      </div>
                    )}
                </div>
              </div>

              {/* Activity Timeline Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-sm font-bold uppercase tracking-wider text-gray-900">
                  <FiClock className="w-4 h-4 text-global-primary" />
                  <span>Activity History</span>
                </div>

                <div className="pt-1">
                  {(order.orderTrackings?.length || 0) > 0 ? (
                    <Timeline
                      className="mb-0"
                      items={(order.orderTrackings || []).map(
                        (track: OrderTrackingType) => {
                          const isCurrent = track.status === order.status;
                          return {
                            color: isCurrent ? "#f7aa0e" : "#d1d5db",
                            children: (
                              <div className="pb-3 text-xs">
                                <p
                                  className={`font-bold ${
                                    isCurrent ? "text-gray-900" : "text-gray-500"
                                  }`}
                                >
                                  {track.status}
                                </p>
                                <p className="text-[10px] text-gray-400 font-medium">
                                  {dayjs(track.createdAt).format(
                                    "MMM D, YYYY · h:mm A"
                                  )}
                                </p>
                              </div>
                            ),
                          };
                        }
                      )}
                    />
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      No status updates recorded yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Empty State: When Tracker is searched but not found ── */
        tracker.trackingNo &&
        !loading && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-global-primary flex items-center justify-center mb-4">
              <FiPackage className="w-8 h-8" />
            </div>
            <h4 className="text-base font-black text-gray-900 mb-1">
              Order Not Found
            </h4>
            <p className="text-xs text-gray-400 mb-6">
              We couldn&apos;t locate an order with tracking number &ldquo;
              <span className="font-mono font-bold text-gray-800">
                {tracker.trackingNo}
              </span>
              &rdquo;. Please verify the order number from your confirmation email.
            </p>
            <Link
              href="/profile?tab=orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-global-primary text-white text-xs font-bold rounded-xl shadow-sm shadow-amber-200/60 hover:opacity-95 transition-opacity"
            >
              <span>View Your Orders</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )
      )}

      {/* Return Request Modals */}
      <ReturnRequestAllOrder />
      <ReturnRequestOrderItem />
    </div>
  );
}
