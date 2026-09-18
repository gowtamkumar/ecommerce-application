"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useState } from "react";
import { FiArrowRight, FiPackage } from "react-icons/fi";

interface TopProductItem {
  product_id: string;
  name: string;
  total_sale_amount: number;
  sale_qty: number;
  alert_qty?: number;
}

interface TopSellingProductProps {
  topSellingProduct: TopProductItem[];
}

const TopSellingProduct = ({ topSellingProduct }: TopSellingProductProps) => {
  const { formatPrice } = useCurrency();
  const [tableParams, setTableParams] = useState({
    current: 1,
    pageSize: 5,
  });

  const columns: ColumnsType<TopProductItem> = [
    {
      title: "Rank",
      key: "rank",
      width: 70,
      render: (_: any, __: any, index: number) => {
        const actualIndex = (tableParams.current - 1) * tableParams.pageSize + index + 1;
        let badgeClass = "bg-gray-100 text-gray-700";
        if (actualIndex === 1) badgeClass = "bg-global-primary/20 text-global-primary border border-global-primary/40 font-black";
        if (actualIndex === 2) badgeClass = "bg-slate-200 text-slate-800 border border-slate-300 font-bold";
        if (actualIndex === 3) badgeClass = "bg-orange-100 text-orange-800 border border-orange-300 font-bold";

        return (
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${badgeClass}`}
          >
            {actualIndex}
          </span>
        );
      },
    },
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center text-xs shrink-0">
            <FiPackage />
          </div>
          <span className="text-xs font-bold text-gray-900 line-clamp-1">
            {name || "Unnamed Product"}
          </span>
        </div>
      ),
    },
    {
      title: "Sold",
      dataIndex: "sale_qty",
      key: "sale_qty",
      align: "center",
      render: (qty: number) => (
        <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
          {qty || 0} units
        </span>
      ),
    },
    {
      title: "Revenue",
      dataIndex: "total_sale_amount",
      key: "total_sale_amount",
      align: "right",
      render: (amount: any) => (
        <span className="text-xs font-black text-gray-900">
          {formatPrice(amount || 0)}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-global-primary/30 shadow-sm flex flex-col justify-between h-full transition-colors">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              Top Selling Products
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Ranked by revenue contribution in period
            </p>
          </div>

          <Link href="/dashboard/product">
            <Button
              size="small"
              className="text-xs font-semibold rounded-lg flex items-center gap-1 border-gray-200 hover:border-global-primary hover:text-global-primary"
            >
              <span>All Products</span>
              <FiArrowRight className="text-xs" />
            </Button>
          </Link>
        </div>

        <Table
          pagination={{
            current: tableParams.current,
            pageSize: 5,
            size: "small",
            onChange: (page) => setTableParams({ ...tableParams, current: page }),
          }}
          columns={columns}
          size="small"
          rowKey={(record, idx) => record.product_id || (idx ?? 0).toString()}
          dataSource={topSellingProduct || []}
          className="overflow-x-auto"
        />
      </div>
    </div>
  );
};

export default TopSellingProduct;
