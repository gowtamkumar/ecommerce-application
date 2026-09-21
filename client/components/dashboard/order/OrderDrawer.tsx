"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { orderStatusUpdateApi } from "@/lib/apis/orders";
import { getStatus } from "@/lib/utils/getStatus";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import {
    CarOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    CreditCardOutlined,
    EnvironmentOutlined,
    MailOutlined,
    PhoneOutlined,
    PrinterOutlined,
    UndoOutlined,
    UserOutlined
} from "@ant-design/icons";
import {
    Button,
    Divider,
    Drawer,
    Select,
    Table,
    Tag,
    Timeline,
    Typography
} from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import OrderInvoiceModal from "./OrderInvoiceModal";

const { Title, Text } = Typography;

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
  const [currentOrder, setCurrentOrder] = useState<any>(order);

  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  if (!currentOrder) return null;

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await orderStatusUpdateApi({
        id: currentOrder.id,
        status: newStatus,
      });
      if (res?.success) {
        successNotification({
          message: `Order status updated to ${newStatus}`,
        });
        setCurrentOrder((prev: any) => ({ ...prev, status: newStatus }));
        if (onStatusUpdated) onStatusUpdated();
      } else {
        errorNotification({
          message: res?.message || "Failed to update status",
        });
      }
    } catch (err: any) {
      errorNotification({
        message: err?.message || "Error updating order status",
      });
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

  // Calculate payments summary
  const paymentsList = currentOrder.payments || [];
  const { debitTotal, creditTotal } = paymentsList.reduce(
    (acc: { debitTotal: number; creditTotal: number }, p: any) => {
      const amt = Number(p.amount) || 0;
      if (p.paymentType === "Debit") acc.debitTotal += amt;
      if (p.paymentType === "Credit") acc.creditTotal += amt;
      return acc;
    },
    { debitTotal: 0, creditTotal: 0 }
  );
  const paidAmount = debitTotal - creditTotal;
  const netGrandTotal =
    Number(currentOrder.grandTotal || 0) -
    Number(currentOrder.totalReturned || 0);
  const balanceDue = Math.max(0, netGrandTotal - paidAmount);

  // Items table columns
  const itemColumns: any = [
    {
      title: "Product",
      key: "product",
      render: (_: any, record: any) => {
        const imgUrl = getImageUrl(record.product?.thumbnailImage);
        return (
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="relative w-12 h-12 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 shrink-0">
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={record.product?.name || "Product"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No img
                </div>
              )}
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-gray-900 block text-xs truncate">
                {record.product?.name || "Unnamed Product"}
              </span>
              {(record.productVariant?.sku || record.product?.sku) && (
                <span className="text-[10px] text-gray-400 font-mono block">
                  SKU: {record.productVariant?.sku || record.product?.sku}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Variant",
      key: "variant",
      render: (_: any, record: any) => {
        const variant = record.productVariant;
        if (!variant && !record.material) {
          return <span className="text-gray-400 text-xs">-</span>;
        }
        return (
          <div className="space-y-1">
            {variant?.color?.name && (
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-gray-200 inline-block"
                  style={{ backgroundColor: variant.color.color || "#ccc" }}
                />
                <span className="text-[11px] text-gray-700">
                  {variant.color.name}
                </span>
              </div>
            )}
            {variant?.size?.name && (
              <Tag className="text-[10px] px-1 py-0 m-0">
                {variant.size.name}
              </Tag>
            )}
            {(variant?.material || record.material) && (
              <span className="text-[10px] text-gray-500 block">
                {variant?.material || record.material}
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: "Cost",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
      render: (val: any) => (
        <span className="text-gray-500 text-xs">
          {val ? formatPrice(Number(val)) : "-"}
        </span>
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (val: any) => (
        <span className="text-gray-700 text-xs font-medium">
          {formatPrice(Number(val || 0))}
        </span>
      ),
    },
    {
      title: "Tax",
      dataIndex: "taxAmount",
      key: "taxAmount",
      render: (val: any) => (
        <span className="text-gray-500 text-xs">
          {Number(val) > 0 ? formatPrice(Number(val)) : "-"}
        </span>
      ),
    },
    {
      title: "Discount",
      dataIndex: "totalDiscountAmount",
      key: "totalDiscountAmount",
      render: (val: any) => (
        <span className="text-xs">
          {Number(val) > 0 ? (
            <span className="text-red-500 font-medium">
              -{formatPrice(Number(val))}
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </span>
      ),
    },
    {
      title: "Sale Price",
      key: "salePrice",
      render: (_: any, record: any) => {
        const netUnitPrice =
          Number(record.unitPrice || 0) -
          Number(record.totalDiscountAmount || 0) +
          Number(record.taxAmount || 0);
        return (
          <span className="font-semibold text-xs text-green-600">
            {formatPrice(netUnitPrice)}
          </span>
        );
      },
    },
    {
      title: "Qty",
      key: "qty",
      render: (_: any, record: any) => (
        <div className="text-xs">
          <span className="font-semibold">×{record.qty}</span>
          {Number(record.approvedQty) > 0 && (
            <span className="text-orange-600 block text-[10px]">
              Ret: -{record.approvedQty}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Net Qty",
      key: "netQty",
      render: (_: any, record: any) => {
        const net = (record.qty || 0) - (record.approvedQty || 0);
        return <span className="font-bold text-xs">{net}</span>;
      },
    },
    {
      title: "Sub Total",
      key: "subTotal",
      render: (_: any, record: any) => {
        const netQty = (record.qty || 1) - (record.approvedQty || 0);
        const effectiveSubTotal =
          (Number(record.subTotal || 0) / (record.qty || 1)) * netQty;
        return (
          <span className="font-bold text-xs text-gray-900">
            {formatPrice(effectiveSubTotal)}
          </span>
        );
      },
    },
  ];

  // Payment transactions columns
  const paymentColumns: any = [
    {
      title: "Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (val: any, record: any) => (
        <span className="text-xs text-gray-600">
          {val || record.createdAt
            ? dayjs(val || record.createdAt).format("DD-MM-YYYY h:mm A")
            : "-"}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (val: string) => (
        <Tag color={val === "Debit" ? "green" : "red"} className="text-[10px] font-bold uppercase">
          {val || "Debit"}
        </Tag>
      ),
    },
    {
      title: "Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (val: string) => (
        <span className="text-xs font-medium text-gray-700">{val || "COD"}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (val: any) => (
        <span className="text-xs font-bold text-gray-900">
          {formatPrice(Number(val || 0))}
        </span>
      ),
    },
    {
      title: "Transaction ID",
      key: "tranId",
      render: (_: any, record: any) => (
        <span className="text-[11px] font-mono text-gray-500">
          {record.tranId || record.bankTranId || "-"}
        </span>
      ),
    },
  ];

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center justify-between mr-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-gray-900">
                  Order Details
                </span>
                <Tag color="blue" className="font-mono text-xs font-bold m-0">
                  {currentOrder.trackingNo}
                </Tag>
              </div>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Placed on{" "}
                {dayjs(currentOrder.createdAt).format("MMMM D, YYYY · h:mm A")}
              </p>
            </div>
            <Button
              icon={<PrinterOutlined />}
              onClick={() => setInvoiceOpen(true)}
              className="rounded-xl font-bold text-xs border-gray-200 hover:border-blue-500 hover:text-blue-600"
            >
              Print Invoice
            </Button>
          </div>
        }
        placement="right"
        width={820}
        onClose={onClose}
        open={open}
        className="order-management-drawer"
      >
        <div className="space-y-6 pb-6 text-xs">
          {/* Status & Quick Action Bar */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 p-4 rounded-2xl border border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  Order Status
                </span>
                <Tag
                  color={getStatus(currentOrder.status)}
                  className="px-3 py-0.5 rounded-full text-xs font-bold uppercase m-0"
                >
                  {currentOrder.status}
                </Tag>
              </div>

              <Divider type="vertical" className="h-8 border-gray-200 hidden sm:block" />

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  Payment Status
                </span>
                <Tag
                  color={currentOrder.paymentStatus === "Paid" ? "green" : "orange"}
                  className="px-3 py-0.5 rounded-full text-xs font-bold uppercase m-0"
                >
                  {currentOrder.paymentStatus || "Unpaid"}
                </Tag>
              </div>

              {currentOrder.returnedStatus && (
                <>
                  <Divider type="vertical" className="h-8 border-gray-200 hidden sm:block" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                      Return Status
                    </span>
                    <Tag color="volcano" className="px-3 py-0.5 rounded-full text-xs font-bold uppercase m-0">
                      {currentOrder.returnedStatus}
                    </Tag>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-gray-600 text-xs whitespace-nowrap font-medium">
                Update Status:
              </span>
              <Select
                value={currentOrder.status}
                onChange={handleStatusChange}
                loading={updating}
                options={statusOptions}
                className="w-36 rounded-xl font-bold"
              />
            </div>
          </div>

          {/* Cancellation Notice Card */}
          {currentOrder.status === "Canceled" && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <CloseCircleOutlined className="text-red-500 text-lg mt-0.5" />
              <div>
                <span className="font-bold text-red-800 text-xs block">
                  Order Canceled
                </span>
                <p className="text-red-700 text-xs mt-0.5">
                  Reason:{" "}
                  <span className="font-medium">
                    {currentOrder.cancelResson || "No reason specified"}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Return & Refund Notice Card */}
          {(currentOrder.returnedStatus ||
            Number(currentOrder.totalReturned) > 0 ||
            currentOrder.refundStatus) && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <UndoOutlined className="text-amber-600 text-lg mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-900 text-xs block">
                  Return & Refund Information
                </span>
                <div className="flex flex-wrap gap-4 text-xs text-amber-800">
                  {currentOrder.returnedStatus && (
                    <span>
                      Return Status: <strong>{currentOrder.returnedStatus}</strong>
                    </span>
                  )}
                  {Number(currentOrder.totalReturned) > 0 && (
                    <span>
                      Returned Amount:{" "}
                      <strong>{formatPrice(Number(currentOrder.totalReturned))}</strong>
                    </span>
                  )}
                  {currentOrder.refundStatus && (
                    <span>
                      Refund Status: <strong>{currentOrder.refundStatus}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Customer & Delivery Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer Information */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <UserOutlined className="text-blue-500" /> Customer
              </span>
              <div className="pt-0.5 space-y-1">
                <p className="font-bold text-sm text-gray-900">
                  {currentOrder.shippingAddress?.name ||
                    currentOrder.user?.name ||
                    "Anonymous Customer"}
                </p>
                <p className="text-gray-500 flex items-center gap-1.5 truncate">
                  <MailOutlined className="text-gray-400 shrink-0" />
                  <span className="truncate">
                    {currentOrder.user?.email || "No email"}
                  </span>
                </p>
                <p className="text-gray-500 flex items-center gap-1.5">
                  <PhoneOutlined className="text-gray-400 shrink-0" />
                  <span>
                    {currentOrder.shippingAddress?.phoneNo ||
                      currentOrder.user?.phone ||
                      "No phone"}
                  </span>
                </p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <EnvironmentOutlined className="text-emerald-500" /> Delivery Address
              </span>
              <div className="pt-0.5 space-y-1">
                <p className="font-semibold text-gray-900 text-xs leading-relaxed">
                  {currentOrder.shippingAddress?.address || "Address unavailable"}
                </p>
                <p className="text-gray-500 text-[11px]">
                  {[
                    currentOrder.shippingAddress?.city,
                    currentOrder.shippingAddress?.state,
                    currentOrder.shippingAddress?.postalCode,
                    currentOrder.shippingAddress?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <Tag className="text-[10px] font-bold uppercase rounded-md m-0">
                  Type: {currentOrder.shippingAddress?.type || "Home"}
                </Tag>
              </div>
            </div>

            {/* Delivery Courier / Personnel */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <CarOutlined className="text-indigo-500" /> Delivery Personnel
              </span>
              <div className="pt-0.5 space-y-1">
                <p className="font-bold text-sm text-gray-900">
                  {currentOrder.deliveryMan?.name || "Not assigned"}
                </p>
                {currentOrder.deliveryMan?.phone ? (
                  <p className="text-gray-500 flex items-center gap-1.5">
                    <PhoneOutlined className="text-gray-400" />
                    <span>{currentOrder.deliveryMan.phone}</span>
                  </p>
                ) : (
                  <p className="text-gray-400 italic text-[11px]">No contact assigned</p>
                )}
                {currentOrder.deliveryMan?.email && (
                  <p className="text-gray-500 flex items-center gap-1.5 truncate">
                    <MailOutlined className="text-gray-400 shrink-0" />
                    <span className="truncate">{currentOrder.deliveryMan.email}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Information Banner */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base shrink-0">
                <CreditCardOutlined />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-xs">
                  Payment Method:{" "}
                  <span className="text-blue-600">
                    {currentOrder.paymentMethod || "COD"}
                  </span>
                </p>
                <p className="text-[11px] text-gray-400 font-mono">
                  TXN ID:{" "}
                  {currentOrder.tranId ? (
                    <Text copyable className="text-gray-600 text-[11px] font-mono">
                      {currentOrder.tranId}
                    </Text>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tag
                color={currentOrder.paymentStatus === "Paid" ? "green" : "orange"}
                className="px-3 py-1 rounded-full font-bold uppercase text-[10px] m-0"
              >
                {currentOrder.paymentStatus || "Unpaid"}
              </Tag>
            </div>
          </div>

          {/* Payment Transactions History (if multiple/existing) */}
          {paymentsList.length > 0 && (
            <div className="space-y-2">
              <span className="font-black text-gray-900 text-xs uppercase tracking-wider block">
                Payment Transactions ({paymentsList.length})
              </span>
              <Table
                columns={paymentColumns}
                dataSource={paymentsList}
                rowKey={(record: any, idx?: number) => record.id || idx || 0}
                pagination={false}
                size="small"
                className="border border-gray-100 rounded-xl overflow-hidden shadow-sm"
              />
            </div>
          )}

          {/* Ordered Line Items */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-black text-gray-900 text-xs uppercase tracking-wider">
                Order Items ({currentOrder.orderItems?.length || 0})
              </span>
              <span className="text-gray-400 text-[11px]">
                Total Quantity: <strong>{currentOrder.totalQty || currentOrder.orderItems?.reduce((a: number, b: any) => a + (b.qty || 0), 0)}</strong>
              </span>
            </div>

            <Table
              columns={itemColumns}
              dataSource={currentOrder.orderItems || []}
              rowKey={(record: any, idx?: number) => record.id || idx || 0}
              pagination={false}
              size="small"
              scroll={{ x: "max-content" }}
              className="border border-gray-100 rounded-xl overflow-hidden shadow-sm"
            />
          </div>

          {/* Financial Breakdown & Summary */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-gray-300 pb-2 border-b border-gray-800">
              <span className="font-bold uppercase tracking-wider text-xs">
                Financial Breakdown
              </span>
              <span className="text-xs text-gray-400">
                Total Units: <strong>{currentOrder.totalQty || 0}</strong>
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Items Subtotal:</span>
                <span className="text-gray-200">
                  {formatPrice(Number(currentOrder.subTotal || 0))}
                </span>
              </div>

              {Number(currentOrder.totalItemsDiscount) > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Product Discount:</span>
                  <span>
                    -{formatPrice(Number(currentOrder.totalItemsDiscount))}
                  </span>
                </div>
              )}

              {Number(currentOrder.couponDiscount) > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount:</span>
                  <span>
                    -{formatPrice(Number(currentOrder.couponDiscount))}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-gray-400">
                <span>Total Tax:</span>
                <span className="text-gray-200">
                  +{formatPrice(Number(currentOrder.totalTax || 0))}
                </span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Shipping Charge:</span>
                <span className="text-gray-200">
                  +{formatPrice(Number(currentOrder.shippingCharge || 0))}
                </span>
              </div>

              {Number(currentOrder.totalReturned) > 0 && (
                <div className="flex justify-between text-amber-400 font-semibold">
                  <span>Returned Deductions:</span>
                  <span>
                    -{formatPrice(Number(currentOrder.totalReturned))}
                  </span>
                </div>
              )}

              <Divider className="border-gray-800 my-2" />

              <div className="flex justify-between items-center text-sm font-black pt-0.5">
                <span>Net Grand Total:</span>
                <span className="text-blue-400 text-base">
                  {formatPrice(netGrandTotal)}
                </span>
              </div>

              {paidAmount > 0 && (
                <div className="flex justify-between text-emerald-400 text-xs font-semibold">
                  <span>Paid Amount:</span>
                  <span>{formatPrice(paidAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                <span className="font-bold text-xs uppercase tracking-wider text-gray-300">
                  Balance Due:
                </span>
                <span
                  className={`text-base font-black ${
                    balanceDue === 0 ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {formatPrice(balanceDue)}
                </span>
              </div>
            </div>
          </div>

          {/* Tracking History Timeline */}
          {currentOrder.orderTrackings &&
            currentOrder.orderTrackings.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="font-black text-gray-900 text-xs uppercase tracking-wider block">
                  Tracking History
                </span>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <Timeline
                    className="mt-2"
                    items={currentOrder.orderTrackings.map((t: any) => ({
                      color:
                        t.status === currentOrder.status ? "#2563eb" : "#d1d5db",
                      dot: (
                        <ClockCircleOutlined
                          className={
                            t.status === currentOrder.status
                              ? "text-blue-600"
                              : "text-gray-400"
                          }
                        />
                      ),
                      children: (
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-1">
                          <div>
                            <span
                              className={`text-xs font-bold ${
                                t.status === currentOrder.status
                                  ? "text-blue-600"
                                  : "text-gray-800"
                              }`}
                            >
                              {t.status}
                            </span>
                            {t.location && (
                              <span className="text-[11px] text-gray-500 block">
                                <EnvironmentOutlined className="mr-1" />
                                {t.location}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium">
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
      </Drawer>

      <OrderInvoiceModal
        open={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        order={currentOrder}
      />
    </>
  );
}
