"use client";
import { Avatar, Table, Tag } from "antd";
import dayjs from "dayjs";
import React from "react";

const StockDataTable = ({ type, orderData }: any) => {
  console.log("🚀 ~ orderData:", orderData);
  // Query
  const productQuery = [] as any;

  const getProduct = (value: any) => {
    const product =
      (productQuery.data || []).find((item: any) => item.id === value) || {};
    return product;
  };

  const getParties = (type: any) => {
    switch (type) {
      case "Order":
        return "Customer";
      case "Sale":
        return "Customer";
      default:
        break;
    }
  };

  const columns = [
    {
      title: "tracking No",
      dataIndex: "trackingNo",
      key: "trackingNo",
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (item: string) => (
        <div>{dayjs(item).format("DD-MM-YYYY h:mm A")}</div>
      ),
    },
    {
      title: `${getParties(type)}`,
      dataIndex: `${getParties(type)}`,
      key: `${getParties(type)}`,
      render: (item: any) => (
        <span>
          <Avatar src="user.png" />
          <span className="mx-2">{item?.name}</span>
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (item: string) => (
        <Tag
          color={
            item === "Received"
              ? "green"
              : item === "Ordered"
              ? "blue"
              : "green"
          }
        >
          {item}
        </Tag>
      ),
    },
    {
      title: "Paid Amount",
      dataIndex: "totalPaid",
      key: "totalPaid",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (item: string) => (
        <Tag
          color={
            item === "Paid" ? "green" : item === "Unpaid" ? "red" : "yellow"
          }
        >
          {item}
        </Tag>
      ),
    },
  ];

  const orderItemColumns = [
    {
      title: "Name",
      dataIndex: "productId",
      key: "productId",
      render: (item: string) => (
        <span>
          {/* <Avatar
            shape="square"
            src={`${config.apiBaseUrl}/uploads/${
              getProduct(item)?.photo || "no-image.png"
            } `}
          /> */}
          <span className="ms-2">{getProduct(item)?.name}</span>
        </span>
      ),
    },
    { title: "Quantity", dataIndex: "qty", key: "qty" },
    { title: "Unit Price", dataIndex: "price", key: "price" },
    { title: "Sub Total", dataIndex: "subTotal", key: "subTotal" },
  ];

  const data = [] as any;
  const newData = (orderData || []).map((item: any) =>
    data.push({
      key: item.id,
      id: item.id,
      trackingNo: item.tracking_no,
      orderDate: item.created_at,
      // supplier: item.supplier,
      // supplierId: item.supplierId,
      // customer: item.customer,
      paymentMethod: item.payment_method,
      totalPaid: 500,
      totalAmount: item.net_amount,
      paymentStatus: item.payment_status,
      status: item.status,
      orderItems: item.orderItems,
      responsive: ["sm", "md"],
    })
  );

  return (
    <div className="table-responsive w-100">
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: ({ orderItems }) => {
            return (
              <Table
                columns={orderItemColumns}
                dataSource={orderItems}
                size="small"
                pagination={false}
              />
            );
          },
        }}
        dataSource={data}
        size="small"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default StockDataTable;
