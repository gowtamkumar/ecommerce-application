"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { Avatar, Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import React from "react";
import { FiArrowRight, FiUserCheck } from "react-icons/fi";

interface CustomerItem {
  customer_id?: string;
  customer_name: string;
  total_sale_amount: number;
  total_qty: number;
}

interface TopCustomerProps {
  topCustomers: CustomerItem[];
}

const TopCustomer: React.FC<TopCustomerProps> = ({ topCustomers }) => {
  const { formatPrice } = useCurrency();

  const columns: ColumnsType<CustomerItem> = [
    {
      title: "Rank",
      key: "rank",
      width: 65,
      render: (_: any, __: any, index: number) => {
        let badgeClass = "bg-gray-100 text-gray-700";
        if (index === 0) badgeClass = "bg-global-primary/20 text-global-primary border border-global-primary/40 font-black";
        if (index === 1) badgeClass = "bg-slate-200 text-slate-800 border border-slate-300 font-bold";
        if (index === 2) badgeClass = "bg-orange-100 text-orange-800 border border-orange-300 font-bold";

        return (
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${badgeClass}`}
          >
            {index + 1}
          </span>
        );
      },
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (name: string) => {
        const displayName = name || "Valued Shopper";
        const initial = displayName.charAt(0).toUpperCase();
        return (
          <div className="flex items-center gap-2.5">
            <Avatar
              size="small"
              className="bg-global-primary/15 text-global-primary font-bold text-xs"
            >
              {initial}
            </Avatar>
            <div>
              <span className="text-xs font-bold text-gray-900 block">
                {displayName}
              </span>
              <span className="text-[10px] text-gray-400">VIP Buyer</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Items Bought",
      dataIndex: "total_qty",
      key: "total_qty",
      align: "center",
      render: (qty: number) => (
        <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
          {qty || 0} pcs
        </span>
      ),
    },
    {
      title: "Total Spent",
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
            <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FiUserCheck className="text-global-primary text-base" />
              <span>Top VIP Customers</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Highest contributing customers by lifetime volume
            </p>
          </div>

          <Link href="/dashboard/customers">
            <Button
              size="small"
              className="text-xs font-semibold rounded-lg flex items-center gap-1 border-gray-200 hover:border-global-primary hover:text-global-primary"
            >
              <span>All Customers</span>
              <FiArrowRight className="text-xs" />
            </Button>
          </Link>
        </div>

        <Table
          size="small"
          pagination={{
            pageSize: 5,
            size: "small",
          }}
          columns={columns}
          dataSource={topCustomers || []}
          rowKey={(record, idx) =>
            record.customer_id || record.customer_name || (idx ?? 0).toString()
          }
          className="overflow-x-auto"
        />
      </div>
    </div>
  );
};

export default TopCustomer;
