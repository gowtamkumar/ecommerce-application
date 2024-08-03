"use client";
import React, { useState } from "react";
import { Avatar, Button, Card, Table } from "antd";

const StockAlert = ({ topSellingProduct }: any) => {
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
      title: "Total Sale",
      dataIndex: "total_amount",
      key: "total_amount",
    },
    // {
    //   title: "Current Stock",
    //   key: "current_stock",
    //   dataIndex: "current_stock",
    // },
    {
      title: "Quantity Alert",
      dataIndex: "alert_qty",
      key: "alert_qty",
    },
  ];

  const onChange = (pageNumber: any) => {
    setTableParams({ ...tableParams, current: pageNumber });
  };

  return (
    <Card
      title="Top Selling Product"
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
        dataSource={topSellingProduct}
      />
    </Card>
  );
};

export default StockAlert;
