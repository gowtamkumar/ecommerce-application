"use client";
import React, { useState } from "react";
import { Button, Card, Table } from "antd";

const StockAlert = ({ productAlertStockReport }: any) => {
  const [tableParams, setTableParams] = useState({
    current: 1,
    pageSize: 5,
  });

  const columns = [
    {
      title: "Product",
      render: (item: any) => <span className="ms-2">{item?.name}</span>,
    },
    {
      title: "Current Stock",
      key: "stock_qty",
      dataIndex: "stock_qty",
    },
    {
      title: "Alert Qty",
      dataIndex: "alert_qty",
      key: "alert_qty",
    },
  ];

  const onChange = (pageNumber: any) => {
    setTableParams({ ...tableParams, current: pageNumber });
  };

  return (
    <Card
      title="Product Alert & Stock Report"
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
          pageSize: 5,
          onChange,
        }}
        columns={columns}
        size="small"
        scroll={{ x: true }}
        dataSource={productAlertStockReport}
      />
    </Card>
  );
};

export default StockAlert;
