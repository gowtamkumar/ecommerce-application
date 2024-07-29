"use client";
import React, { useState } from "react";
import { Avatar, Button, Card, Table } from "antd";

const StockAlert = ({ stockReports }) => {
  const [tableParams, setTableParams] = useState({
    current: 1,
    pageSize: 5,
  });
  // query
  const productQuery = [];

  const getProduct = (value) => {
    const product =
      (productQuery.data || []).find((item) => item.id === value) || {};
    return product;
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "productId",
      key: "productId",
      render: (item) => (
        <span>
          <Avatar
            shape="square"
            // src={`${config.apiBaseUrl}/uploads/${
            //   getProduct(item)?.photo || "no-image.png"
            // } `}
            src="user.png"
          />
          <span className="ms-2">{getProduct(item)?.name}</span>
        </span>
      ),
    },
    {
      title: "Total Sale",
      dataIndex: "total_sale",
      key: "total_sale",
      render: (text) => <>{text}</>,
    },
    {
      title: "Current Stock",
      key: "current_stock",
      dataIndex: "current_stock",
    },
    {
      title: "Quantity Alert",
      dataIndex: "quantity_alert",
      key: "quantity_alert",
    },
  ];

  const data = [];
  // (item) => item.qtyAlert && productsInStock[item.id] < item.qtyAlert,
  const newData = (stockReports || [])
    .filter((item) => item.qty_alert && item.stock_qty < item.qty_alert)
    .map((item) =>
      data.push({
        key: item.product_id,
        product: item.product_id,
        productId: item.product_id,
        total_sale: item.total_sale || "0",
        quantity_alert: item.qty_alert || "0",
        current_stock: item.stock_qty || "0",
      })
    );

  const onChange = (pageNumber) => {
    setTableParams({ ...tableParams, current: pageNumber });
  };

  return (
    <Card
      title="Top Selling product"
      size="small"
      extra={
        <Button
          size="small"
          // onClick={() => navigate("/stock-report/stock-alert")}
        >
          View All {">>"}
        </Button>
      }
    >
      <Table
        pagination={{
          current: tableParams.current,
          pageSize: 6,
          onChange,
        }}
        columns={columns}
        size="small"
        scroll={{ x: true }}
        dataSource={data}
      />
    </Card>
  );
};

export default StockAlert;
