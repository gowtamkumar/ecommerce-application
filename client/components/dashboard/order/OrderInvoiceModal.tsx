"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { PrinterOutlined } from "@ant-design/icons";
import { Button, Divider, Modal, Tag } from "antd";
import dayjs from "dayjs";

interface OrderInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  order: any;
}

export default function OrderInvoiceModal({
  open,
  onClose,
  order,
}: OrderInvoiceModalProps) {
  const { formatPrice } = useCurrency();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = dayjs(order.createdAt).format("MMMM D, YYYY");
  const invoiceNo = `INV-${order.trackingNo || order.id?.slice(-6)}`;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose} className="rounded-xl font-bold">
          Close
        </Button>,
        <Button
          key="print"
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700"
        >
          Print Invoice
        </Button>,
      ]}
      width={780}
      centered
      className="invoice-modal"
    >
      <div id="printable-invoice" className="p-4 sm:p-6 bg-white text-gray-900">
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">INVOICE</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{invoiceNo}</p>
          </div>
          <div className="text-right">
            <h3 className="font-extrabold text-sm text-gray-900">Store Commerce Inc.</h3>
            <p className="text-xs text-gray-400">support@ecommerce.com</p>
            <p className="text-xs text-gray-400">Date: {invoiceDate}</p>
          </div>
        </div>

        {/* Customer & Order Details */}
        <div className="grid grid-cols-2 gap-6 mb-6 text-xs">
          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <span className="font-bold text-gray-400 uppercase tracking-wider block mb-2 text-[10px]">
              Billed To
            </span>
            <p className="font-extrabold text-sm text-gray-900 mb-1">
              {order.shippingAddress?.name || order.user?.name || "Customer"}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {order.shippingAddress?.address || "Address not provided"}
            </p>
            <p className="text-gray-600 mt-1">
              Phone: {order.shippingAddress?.phoneNo || order.user?.phone || "N/A"}
            </p>
          </div>

          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <span className="font-bold text-gray-400 uppercase tracking-wider block mb-2 text-[10px]">
              Order Summary
            </span>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-mono font-bold">{order.trackingNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-medium">{order.paymentMethod || "COD"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status:</span>
                <Tag color={order.paymentStatus === "Paid" ? "success" : "warning"} className="m-0 text-[10px] font-bold">
                  {order.paymentStatus || "Unpaid"}
                </Tag>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Order Status:</span>
                <span className="font-bold text-blue-600">{order.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Item Description</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(order.orderItems || []).map((item: any, idx: number) => {
                const unitPrice = Number(item.unitPrice || 0);
                const lineTotal = unitPrice * item.qty;
                return (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-gray-900">
                      {item.product?.name || "Product"}
                    </td>
                    <td className="p-3 text-center text-gray-600">{item.qty}</td>
                    <td className="p-3 text-right text-gray-600">{formatPrice(unitPrice)}</td>
                    <td className="p-3 text-right font-bold text-gray-900">{formatPrice(lineTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Calculation Totals */}
        <div className="flex justify-end">
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatPrice(Number(order.subTotal || 0))}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Charge:</span>
              <span className="font-semibold">+{formatPrice(Number(order.shippingCharge || 0))}</span>
            </div>
            {Number(order.totalItemsDiscount) > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount:</span>
                <span>-{formatPrice(Number(order.totalItemsDiscount))}</span>
              </div>
            )}
            <Divider className="my-2" />
            <div className="flex justify-between text-sm font-black text-gray-900 pt-1">
              <span>Grand Total:</span>
              <span className="text-blue-600 text-base">{formatPrice(Number(order.grandTotal || 0))}</span>
            </div>
          </div>
        </div>

        {/* Invoice Footer */}
        <div className="mt-10 pt-4 border-t border-gray-100 text-center text-[10px] text-gray-400">
          Thank you for your business! If you have any questions regarding this invoice, please contact support.
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
        }
      `}</style>
    </Modal>
  );
}

