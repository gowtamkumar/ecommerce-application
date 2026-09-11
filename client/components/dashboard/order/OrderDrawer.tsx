"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { orderStatusUpdateApi } from "@/lib/apis/orders";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import {
    CreditCardOutlined,
    EnvironmentOutlined,
    PrinterOutlined,
    UserOutlined
} from "@ant-design/icons";
import {
    Button,
    Divider,
    Drawer,
    Select,
    Tag,
    Timeline,
    Typography
} from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import OrderInvoiceModal from "./OrderInvoiceModal";

const { Text } = Typography;

interface OrderDrawerProps {
  open: boolean;
  onClose: () => void;
  order: any;
  onStatusUpdated?: () => void;
}

export default function OrderDrawer({
  open,
  onClose,
  order,
  onStatusUpdated,
}: OrderDrawerProps) {
  const { formatPrice } = useCurrency();
  const [updating, setUpdating] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  if (!order) return null;

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await orderStatusUpdateApi({ id: order.id, status: newStatus });
      if (res?.success) {
        successNotification({ message: `Order status updated to ${newStatus}` });
        if (onStatusUpdated) onStatusUpdated();
      } else {
        errorNotification({ message: res?.message || "Failed to update status" });
      }
    } catch (err: any) {
      errorNotification({ message: err?.message || "Error updating order status" });
    } finally {
      setUpdating(false);
    }
  };

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Processing", label: "Processing" },
    { value: "Shipped", label: "Shipped" },
    { value: "Delivered", label: "Delivered" },
    { value: "Canceled", label: "Canceled" },
  ];

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center justify-between mr-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-gray-900">
                  Order Details
                </span>
                <Tag color="blue" className="font-mono text-xs m-0">
                  {order.trackingNo}
                </Tag>
              </div>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Placed on {dayjs(order.createdAt).format("MMM D, YYYY · h:mm A")}
              </p>
            </div>
            <Button
              icon={<PrinterOutlined />}
              onClick={() => setInvoiceOpen(true)}
              className="rounded-xl font-bold text-xs border-gray-200 hover:border-blue-500 hover:text-blue-600"
            >
              Invoice
            </Button>
          </div>
        }
        placement="right"
        size={640}
        onClose={onClose}
        open={open}
        className="order-management-drawer"
      >
        <div className="space-y-6 pb-6 text-xs">
          {/* Quick Lifecycle Status Updater */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/40 p-4 rounded-2xl border border-blue-100/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="font-bold text-gray-700 uppercase tracking-wider text-[10px] block mb-0.5">
                Current Fulfillment Status
              </span>
              <span className="text-sm font-black text-blue-900">{order.status}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-gray-500 text-xs whitespace-nowrap">Change:</span>
              <Select
                value={order.status}
                onChange={handleStatusChange}
                loading={updating}
                options={statusOptions}
                className="w-36 rounded-xl font-bold"
              />
            </div>
          </div>

          {/* Customer & Delivery Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <UserOutlined className="text-blue-500" /> Customer Information
              </span>
              <div className="pt-1">
                <p className="font-extrabold text-sm text-gray-900">
                  {order.shippingAddress?.name || order.user?.name || "Anonymous Customer"}
                </p>
                <p className="text-gray-500">{order.user?.email || "No email"}</p>
                <p className="text-gray-500">{order.shippingAddress?.phoneNo || order.user?.phone || "No phone"}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <EnvironmentOutlined className="text-blue-500" /> Delivery Address
              </span>
              <div className="pt-1">
                <p className="font-bold text-gray-900 text-xs leading-relaxed">
                  {order.shippingAddress?.address || "Address unavailable"}
                </p>
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Type: {order.shippingAddress?.type || "Home"}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-base text-gray-600">
                <CreditCardOutlined />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-xs">Payment Method: {order.paymentMethod || "COD"}</p>
                <p className="text-[10px] text-gray-400 font-mono">TXN: {order.tranId || "N/A"}</p>
              </div>
            </div>
            <Tag color={order.paymentStatus === "Paid" ? "success" : "warning"} className="px-3 py-1 rounded-full font-bold uppercase text-[10px] m-0">
              {order.paymentStatus || "Unpaid"}
            </Tag>
          </div>

          {/* Ordered Line Items */}
          <div className="space-y-3">
            <span className="font-black text-gray-900 text-xs uppercase tracking-wider">
              Order Items ({order.orderItems?.length || 0})
            </span>

            <div className="space-y-2.5">
              {(order.orderItems || []).map((item: any, idx: number) => {
                const img = getImageUrl(item.product?.thumbnailImage);
                const price = Number(item.unitPrice || 0);
                const total = price * item.qty;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 shrink-0">
                        {img && <Image src={img} alt="item" fill className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-xs truncate">
                          {item.product?.name || "Product"}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Qty: <span className="font-bold text-gray-700">{item.qty}</span> × {formatPrice(price)}
                        </p>
                      </div>
                    </div>

                    <span className="font-black text-xs text-gray-900 shrink-0">
                      {formatPrice(total)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-gray-900 text-white p-5 rounded-2xl space-y-2.5">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal:</span>
              <span>{formatPrice(Number(order.subTotal || 0))}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping Charge:</span>
              <span>+{formatPrice(Number(order.shippingCharge || 0))}</span>
            </div>
            {Number(order.totalItemsDiscount) > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount:</span>
                <span>-{formatPrice(Number(order.totalItemsDiscount))}</span>
              </div>
            )}
            <Divider className="border-gray-800 my-2" />
            <div className="flex justify-between items-center text-sm font-black pt-1">
              <span>Net Grand Total:</span>
              <span className="text-blue-400 text-lg">
                {formatPrice(Number(order.grandTotal) - Number(order.totalReturned || 0))}
              </span>
            </div>
          </div>

          {/* Tracking Events Timeline */}
          {order.orderTrackings && order.orderTrackings.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="font-black text-gray-900 text-xs uppercase tracking-wider">
                Tracking History
              </span>
              <div className="bg-white p-4 rounded-2xl border border-gray-100">
                <Timeline
                  className="mt-2"
                  items={order.orderTrackings.map((t: any) => ({
                    color: t.status === order.status ? "#2563eb" : "#d1d5db",
                    children: (
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold ${t.status === order.status ? "text-gray-900" : "text-gray-400"}`}>
                          {t.status}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {dayjs(t.createdAt).format("MMM D, h:mm A")}
                        </span>
                      </div>
                    ),
                  }))}
                />
              </div>
            </div>
          )}
        </div>
      </Drawer>

      <OrderInvoiceModal
        open={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        order={order}
      />
    </>
  );
}

