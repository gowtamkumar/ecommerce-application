"use client";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useState } from "react";
import { FiAlertTriangle, FiArrowRight, FiCheck } from "react-icons/fi";

interface StockAlertItem {
  id?: string;
  name: string;
  stock_qty: number;
  alert_qty: number;
}

interface StockAlertProps {
  productAlertStockReport: StockAlertItem[];
}

const StockAlert = ({ productAlertStockReport }: StockAlertProps) => {
  const [tableParams, setTableParams] = useState({
    current: 1,
    pageSize: 5,
  });

  const columns: ColumnsType<StockAlertItem> = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: StockAlertItem) => {
        const isOutOfStock = Number(record.stock_qty) <= 0;
        return (
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isOutOfStock ? "bg-rose-500 animate-ping" : "bg-amber-500"
              }`}
            />
            <span className="text-xs font-bold text-gray-900 line-clamp-1">
              {name || "Unnamed Product"}
            </span>
          </div>
        );
      },
    },
    {
      title: "Current Stock",
      dataIndex: "stock_qty",
      key: "stock_qty",
      align: "center",
      render: (qty: number) => {
        const isOut = Number(qty) <= 0;
        return (
          <span
            className={`text-xs font-black px-2.5 py-1 rounded-md border ${
              isOut
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {qty || 0}
          </span>
        );
      },
    },
    {
      title: "Threshold",
      dataIndex: "alert_qty",
      key: "alert_qty",
      align: "center",
      render: (alert: number) => (
        <span className="text-xs text-gray-500 font-medium">
          Min {alert || 0}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      align: "right",
      render: (_: any, record: StockAlertItem) => {
        const isOut = Number(record.stock_qty) <= 0;
        return isOut ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <FiAlertTriangle className="text-xs" /> Out of Stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <FiAlertTriangle className="text-xs" /> Low Stock
          </span>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 hover:border-global-primary/30 shadow-sm flex flex-col justify-between h-full transition-colors">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span>Critical Stock Alerts</span>
              {productAlertStockReport?.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
                  {productAlertStockReport.length} Alerting
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Items depleted or operating below minimum alert levels
            </p>
          </div>

          <Link href="/dashboard/stock-adjust">
            <Button
              size="small"
              className="text-xs font-semibold rounded-lg flex items-center gap-1 border-gray-200 hover:border-global-primary hover:text-global-primary"
            >
              <span>Restock</span>
              <FiArrowRight className="text-xs" />
            </Button>
          </Link>
        </div>

        {productAlertStockReport?.length === 0 ? (
          <div className="py-10 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
              <FiCheck />
            </div>
            <span className="font-semibold text-gray-600">Inventory levels healthy</span>
            <span>No products currently below alert threshold</span>
          </div>
        ) : (
          <Table
            pagination={{
              current: tableParams.current,
              pageSize: 5,
              size: "small",
              onChange: (page) => setTableParams({ ...tableParams, current: page }),
            }}
            columns={columns}
            size="small"
            scroll={{ x: 450 }}
            rowKey={(record, idx) => record.id || record.name || (idx ?? 0).toString()}
            dataSource={productAlertStockReport || []}
            className="overflow-x-auto"
          />
        )}
      </div>
    </div>
  );
};

export default StockAlert;
