"use client";
import EnterpriseTable, { renderStatusTag } from "@/components/dashboard/shared/EnterpriseTable";
import { useCurrency } from "@/context/CurrencyContext";
import { Avatar, Typography } from "antd";
import dayjs from "dayjs";
import Link from "next/link";

const { Text } = Typography;

const DataTable = ({ orders }: any) => {
  const { formatPrice } = useCurrency();

  const columns = [
    {
      title: "Order ID",
      dataIndex: "trackingNo",
      key: "trackingNo",
      render: (val: string) => (
        <Link href={`/dashboard/orders`} className="font-mono font-bold text-xs text-blue-600 hover:underline">
          {val}
        </Link>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (item: string) => (
        <span className="text-xs text-gray-500 font-medium">
          {dayjs(item).format("MMM D, YYYY · h:mm A")}
        </span>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (item: any) => {
        const name = item?.name || "Guest";
        return (
          <div className="flex items-center gap-2">
            <Avatar className="bg-blue-100 text-blue-600 font-bold text-xs" size="small">
              {name.charAt(0)}
            </Avatar>
            <span className="text-xs font-semibold text-gray-800">{name}</span>
          </div>
        );
      },
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: string) => renderStatusTag(status || "Unpaid"),
    },
    {
      title: "Order Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => renderStatusTag(status || "Pending"),
    },
    {
      title: "Total Amount",
      key: "grandTotal",
      dataIndex: "grandTotal",
      align: "right" as const,
      render: (value: any) => (
        <Text strong className="text-xs font-black text-gray-900">
          {formatPrice(value)}
        </Text>
      ),
    },
  ];

  const newOrders = (orders || []).map((item: any, idx: number) => ({
    ...item,
    customer: item.user,
    key: item.id || idx.toString(),
  }));

  return (
    <EnterpriseTable
      title="Recent Store Orders"
      subtitle="Overview of recent purchase activities across your store"
      columns={columns}
      dataSource={newOrders}
      pagination={{ pageSize: 5 }}
      exportFileName="recent-orders"
      searchPlaceholder="Filter orders..."
    />
  );
};

export default DataTable;
