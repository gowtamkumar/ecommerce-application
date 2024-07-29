"use client";
import { Avatar, Table, Tag } from "antd";
import dayjs from "dayjs";
import React from "react";

const StockDataTable = ({ type, orderData }) => {
  // Query
  const productQuery = [];

  const getProduct = (value) => {
    const product =
      (productQuery.data || []).find((item) => item.id === value) || {};
    return product;
  };

  const getParties = (type) => {
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
      title: "Invoice No",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (item) => <div>{dayjs(item).format("DD-MM-YYYY h:mm A")}</div>,
    },
    {
      title: `${getParties(type)}`,
      dataIndex: `${getParties(type).toLowerCase()}`,
      key: `${getParties(type).toLowerCase()}`,
      render: (item) => (
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
      render: (item) => (
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
      render: (item) => (
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
      render: (item) => (
        <span>
          <Avatar
            shape="square"
            src={`${config.apiBaseUrl}/uploads/${
              getProduct(item)?.photo || "no-image.png"
            } `}
          />
          <span className="ms-2">{getProduct(item)?.name}</span>
        </span>
      ),
    },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Unit Price", dataIndex: "price", key: "price" },
    { title: "Sub Total", dataIndex: "subTotal", key: "subTotal" },
  ];

  const data = [];
  const newData = (orderData || []).map((item) =>
    data.push({
      key: item.id,
      id: item.id,
      code: item.code,
      orderDate: item.orderDate,
      supplier: item.supplier,
      supplierId: item.supplierId,
      customer: item.customer,
      customerId: item.customerId,
      totalPaid: item.state.totalPaid,
      totalAmount: item.state.totalAmount,
      paymentStatus: item.state.paymentStatus,
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
