"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { Avatar, Table } from "antd";
import dayjs from "dayjs";

const DataTable = ({ orders }: any) => {
  const { formatPrice } = useCurrency();
  const columns = [
    {
      title: "Tracking No",
      dataIndex: "trackingNo",
      key: "trackingNo",
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (item: string) => (
        <div>{dayjs(item).format("DD-MM-YYYY h:mm A")}</div>
      ),
    },
    {
      title: `Customer`,
      dataIndex: `customer`,
      key: `customer`,
      render: (item: any) => (
        <>
          <Avatar src="user.png" />
          <span className="mx-2">{item?.name}</span>
        </>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },

    {
      title: "GrandTotal",
      key: "grandTotal",
      dataIndex: "grandTotal",
      render: (value: any) => (
        <>
          <span className="mx-2">{formatPrice(value)}</span>
        </>
      ),
    },
  ];



  const newOrders = orders?.map((item: any, idx: number) => ({
    ...item,
    customer: item.user,
    key: idx.toString(),
  }));

  return (
    <Table
      columns={columns}
      dataSource={newOrders}
      size="small"
      pagination={{ pageSize: 4 }}
    />
  );
};

export default DataTable;
