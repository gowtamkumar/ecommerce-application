"use client";

import { ActionType } from "@/constants/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { getUserOrders } from "@/lib/apis/orders";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { errorNotification } from "@/lib/utils/notification";
import {
    selectGlobal,
    setAction,
    setLoading,
} from "@/redux/features/global/globalSlice";
import {
    Button,
    Divider,
    Modal,
    Skeleton,
    Table,
    Timeline,
    Tooltip,
} from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
    FiAlertCircle,
    FiCalendar,
    FiCheck,
    FiCheckCircle,
    FiClock,
    FiCopy,
    FiCreditCard,
    FiEye,
    FiMapPin,
    FiPackage,
    FiRefreshCw,
    FiShoppingBag,
    FiTruck,
    FiUser,
    FiXCircle,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import CancelOrder from "./CancelOrder";

interface OrderItemType {
  id: string;
  qty: number;
  unitPrice: number;
  taxAmount?: number;
  totalDiscountAmount?: number;
  product?: {
    name: string;
    thumbnailImage: string;
    slug?: string;
  };
}

interface DataType {
  id: string;
  trackingNo: string;
  status: string;
  createdAt: string;
  grandTotal: number;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress?: {
    address: string;
  };
  deliveryMan?: {
    name: string;
  };
  orderTrackings?: any[];
  orderItems: OrderItemType[];
  subTotal: number;
  totalItemsDiscount: number;
  couponDiscount: number;
  shippingCharge: number;
  payments: any[];
  totalQty: number;
  totalReturned: number;
  returnedStatus: string;
}

const ORDER_STAGES = [
  { key: "Pending", label: "Placed" },
  { key: "Processing", label: "Processing" },
  { key: "Shipped", label: "Shipped" },
  { key: "Delivered", label: "Delivered" },
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

const TAB_OPTIONS = [
  { key: "All", label: "All Orders", icon: FiPackage },
  { key: "Pending", label: "Pending", icon: FiClock },
  { key: "Processing", label: "Processing", icon: FiRefreshCw },
  { key: "Shipped", label: "Shipped", icon: FiTruck },
  { key: "Delivered", label: "Delivered", icon: FiCheckCircle },
  { key: "Canceled", label: "Canceled", icon: FiXCircle },
];

export default function UserOrders() {
  const router = useRouter();
  const [tabKey, setTabKey] = useState("All");
  const [orders, setOrders] = useState<DataType[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DataType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const { formatPrice } = useCurrency();

  const fetchData = useCallback(
    async (status: string) => {
      dispatch(setLoading({ loading: true }));
      try {
        const res = await getUserOrders(status === "All" ? "" : status);
        if (!res.success) {
          errorNotification({ message: res.message });
          return;
        }
        setOrders(res.data || []);
      } catch (error: any) {
        errorNotification({ message: error?.message });
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchData(tabKey);
  }, [fetchData, tabKey]);

  const handleCopyTracking = (e: React.MouseEvent, trackingNo: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(trackingNo);
    setCopiedId(trackingNo);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenDetails = (order: DataType) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCancelOrder = (orderId: string) => {
    dispatch(
      setAction({
        type: ActionType.UPDATE,
        cancelOrder: true,
        payload: { id: orderId, status: "Canceled" },
      })
    );
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Delivered
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            Processing
          </span>
        );
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Shipped
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case "Canceled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Canceled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Status Pill Filter Bar ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {TAB_OPTIONS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tabKey === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setTabKey(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/80"
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isActive ? "text-global-primary" : "text-gray-400"
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Order List / Loading / Empty State ── */}
      {global.loading.loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4 shadow-sm"
            >
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-global-primary flex items-center justify-center mb-4">
            <FiShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-gray-900 mb-1">
            No Orders Found
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mb-6">
            {tabKey === "All"
              ? "You haven't placed any orders yet. Explore our store and discover items you'll love!"
              : `You have no ${tabKey.toLowerCase()} orders at the moment.`}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-global-primary text-white text-xs font-bold rounded-xl shadow-sm shadow-amber-200/60 hover:opacity-95 transition-opacity"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const netTotal =
              Number(order.grandTotal) - Number(order.totalReturned || 0);
            const totalUnits =
              order.totalQty ||
              order.orderItems?.reduce((acc, i) => acc + (i.qty || 1), 0) ||
              0;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden shadow-sm"
              >
                {/* ── Order Header ── */}
                <div className="p-4 sm:p-6 pb-4 border-b border-gray-100 bg-gray-50/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                          Order
                        </span>
                        <span className="text-sm sm:text-base font-black text-gray-900 tracking-tight">
                          #{order.trackingNo}
                        </span>

                        <Tooltip
                          title={
                            copiedId === order.trackingNo
                              ? "Copied!"
                              : "Copy tracking number"
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

                        {order.returnedStatus && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                            {order.returnedStatus}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                        <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          Placed on{" "}
                          {dayjs(order.createdAt).format("MMM D, YYYY · h:mm A")}
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                        {Number(order.totalReturned) > 0
                          ? "Net Amount"
                          : "Order Total"}
                      </p>
                      <div className="flex sm:flex-col items-baseline sm:items-end gap-2 sm:gap-0">
                        <span className="text-lg sm:text-xl font-black text-gray-900">
                          {formatPrice(netTotal)}
                        </span>
                        {Number(order.totalReturned) > 0 && (
                          <span className="text-[11px] text-gray-400 line-through">
                            {formatPrice(order.grandTotal)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Progress Stepper / Canceled Banner ── */}
                <div className="px-4 sm:px-6 pt-4 pb-2">
                  {order.status !== "Canceled" ? (
                    <div className="bg-gray-50/80 rounded-xl p-3 sm:px-6 sm:py-4 border border-gray-100">
                      <div className="relative flex items-center justify-between">
                        {/* Connecting track line */}
                        <div className="absolute left-4 right-4 sm:left-6 sm:right-6 top-3 -translate-y-1/2 h-1 bg-gray-200 z-0">
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

                        {/* Stage Nodes */}
                        {ORDER_STAGES.map((stage, idx) => {
                          const currentIdx = getStageIndex(order.status);
                          const isPassed = currentIdx >= idx;
                          const isCurrent = currentIdx === idx;

                          return (
                            <div
                              key={stage.key}
                              className="flex flex-col items-center relative z-10"
                            >
                              <div
                                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black transition-all ${
                                  isCurrent
                                    ? "bg-global-primary text-white ring-4 ring-amber-100 shadow-sm scale-110"
                                    : isPassed
                                    ? "bg-global-primary text-white"
                                    : "bg-white border-2 border-gray-300 text-gray-400"
                                }`}
                              >
                                {isPassed ? (
                                  <FiCheck className="w-3 h-3 text-white" />
                                ) : (
                                  idx + 1
                                )}
                              </div>
                              <span
                                className={`text-[10px] sm:text-[11px] mt-1.5 font-bold tracking-tight whitespace-nowrap ${
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
                    <div className="bg-rose-50/70 rounded-xl px-4 py-3 border border-rose-100 flex items-center justify-between text-xs text-rose-700">
                      <span className="flex items-center gap-2 font-bold">
                        <FiAlertCircle className="w-4 h-4 text-rose-500" />
                        This order was canceled
                      </span>
                      <span className="text-[11px] text-rose-500 font-medium">
                        Cancellation processed
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Product Thumbnails & Action Bar ── */}
                <div className="p-4 sm:p-6 pt-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Thumbnails preview strip */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
                      {order.orderItems?.map((item, idx) => (
                        <Tooltip
                          key={idx}
                          title={`${item.product?.name || "Product"} · Qty: ${
                            item.qty
                          }`}
                        >
                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group">
                            <Image
                              src={getImageUrl(item.product?.thumbnailImage)}
                              alt={item.product?.name || "Product"}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <span className="absolute bottom-0 right-0 bg-gray-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-tl-lg">
                              x{item.qty}
                            </span>
                          </div>
                        </Tooltip>
                      ))}
                    </div>

                    <div className="hidden lg:block border-l border-gray-100 pl-4">
                      <p className="text-xs font-bold text-gray-800">
                        {order.orderItems?.length}{" "}
                        {order.orderItems?.length === 1 ? "Item" : "Items"}
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        {totalUnits} {totalUnits === 1 ? "unit" : "units"} total
                      </p>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() =>
                        router.push(
                          `/profile?tab=track_order&trackingNo=${order.trackingNo}`
                        )
                      }
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 h-10 rounded-xl text-xs font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
                    >
                      <FiTruck className="w-3.5 h-3.5 text-gray-500" />
                      <span>Track</span>
                    </button>

                    <button
                      onClick={() => handleOpenDetails(order)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 h-10 rounded-xl text-xs font-bold bg-gray-900 text-white hover:bg-gray-800 shadow-sm transition-colors cursor-pointer"
                    >
                      <FiEye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    {["Pending", "Processing"].includes(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 h-10 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-colors cursor-pointer"
                      >
                        <FiXCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Order Details Modal ── */}
      <Modal
        title={
          <div className="flex items-center justify-between mr-8 pb-3 border-b border-gray-100">
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                Order #{selectedOrder?.trackingNo}
              </h3>
              <p className="text-[11px] text-gray-400 font-normal">
                {selectedOrder &&
                  dayjs(selectedOrder.createdAt).format("MMMM D, YYYY · h:mm A")}
              </p>
            </div>
            {selectedOrder && renderStatusBadge(selectedOrder.status)}
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setIsModalOpen(false)}
            className="h-10 px-6 rounded-xl font-bold text-xs border-gray-200 hover:bg-gray-50"
          >
            Close
          </Button>,
          selectedOrder &&
            ["Pending", "Processing"].includes(selectedOrder.status) && (
              <Button
                key="cancel"
                danger
                className="h-10 px-6 rounded-xl font-bold text-xs bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                onClick={() => {
                  handleCancelOrder(selectedOrder.id);
                  setIsModalOpen(false);
                }}
              >
                Cancel Order
              </Button>
            ),
        ]}
        width={760}
        centered
        className="premium-modal"
      >
        {selectedOrder && (
          <div className="space-y-6 pt-3">
            {/* 2-Column Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Shipping card */}
              <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <FiMapPin className="w-3.5 h-3.5 text-global-primary" />
                  <span>Shipping Details</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <FiUser className="w-3 h-3 text-gray-400" />
                    <span>Courier / Delivery:</span>
                    <span className="font-bold text-gray-900 ml-auto">
                      {selectedOrder.deliveryMan?.name || "Standard Delivery"}
                    </span>
                  </div>
                  <div className="pt-1 text-gray-700 leading-relaxed">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                      Delivery Address
                    </span>
                    {selectedOrder.shippingAddress?.address || "No address provided"}
                  </div>
                </div>
              </div>

              {/* Payment card */}
              <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <FiCreditCard className="w-3.5 h-3.5 text-global-primary" />
                  <span>Payment & Invoice</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Payment Method:</span>
                    <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded-md border border-gray-200 text-[11px]">
                      {selectedOrder.paymentMethod || "Online"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Payment Status:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                        selectedOrder.paymentStatus === "Paid"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {selectedOrder.paymentStatus || "Unpaid"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-gray-200/60">
                    <span className="text-gray-500">Order ID:</span>
                    <span className="font-mono text-gray-700 font-bold text-[11px]">
                      {selectedOrder.trackingNo}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                Items In This Order ({selectedOrder.orderItems?.length})
              </h4>
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <Table
                  dataSource={selectedOrder.orderItems}
                  pagination={false}
                  rowKey="id"
                  size="small"
                  columns={[
                    {
                      title: "Product",
                      render: (_, item: OrderItemType) => (
                        <div className="flex items-center gap-3 py-1.5">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                            <Image
                              src={getImageUrl(item.product?.thumbnailImage)}
                              alt={item.product?.name || "Product"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-xs line-clamp-1">
                              {item.product?.name}
                            </p>
                            <p className="text-[11px] text-gray-400 font-medium">
                              Qty: {item.qty} × {formatPrice(item.unitPrice)}
                            </p>
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Total",
                      align: "right",
                      render: (_, item: OrderItemType) => {
                        const itemTotal =
                          (Number(item.unitPrice) -
                            Number(item.totalDiscountAmount || 0) +
                            Number(item.taxAmount || 0)) *
                          (item.qty || 1);
                        return (
                          <span className="font-bold text-xs text-gray-900">
                            {formatPrice(itemTotal)}
                          </span>
                        );
                      },
                    },
                  ]}
                />
              </div>
            </div>

            {/* Financial Summary Breakdown */}
            <div className="bg-gray-900 text-white p-5 rounded-2xl space-y-2.5">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-white">
                  {formatPrice(Number(selectedOrder.subTotal))}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Shipping Fee</span>
                <span className="font-semibold text-white">
                  +{formatPrice(Number(selectedOrder.shippingCharge))}
                </span>
              </div>
              {Number(selectedOrder.totalItemsDiscount) > 0 && (
                <div className="flex justify-between text-xs text-emerald-400">
                  <span>Item Discounts</span>
                  <span>
                    -{formatPrice(Number(selectedOrder.totalItemsDiscount))}
                  </span>
                </div>
              )}
              {Number(selectedOrder.couponDiscount) > 0 && (
                <div className="flex justify-between text-xs text-emerald-400">
                  <span>Coupon Discount</span>
                  <span>
                    -{formatPrice(Number(selectedOrder.couponDiscount))}
                  </span>
                </div>
              )}
              <Divider className="border-gray-800 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-black tracking-tight">
                  Grand Total
                </span>
                <span className="text-xl font-black text-global-primary">
                  {formatPrice(
                    Number(selectedOrder.grandTotal) -
                      Number(selectedOrder.totalReturned || 0)
                  )}
                </span>
              </div>
            </div>

            {/* Order Tracking Timeline */}
            {(selectedOrder.orderTrackings?.length || 0) > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Activity Timeline
                </h4>
                <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  <Timeline
                    className="mb-0"
                    items={(selectedOrder.orderTrackings || []).map((t: any) => ({
                      color:
                        t.status === selectedOrder.status
                          ? "#f7aa0e"
                          : "#d1d5db",
                      children: (
                        <div className="flex justify-between items-center text-xs">
                          <span
                            className={`font-bold ${
                              t.status === selectedOrder.status
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            {t.status}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {dayjs(t.createdAt).format("MMM D, YYYY · h:mm A")}
                          </span>
                        </div>
                      ),
                    }))}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <CancelOrder />
    </div>
  );
}
