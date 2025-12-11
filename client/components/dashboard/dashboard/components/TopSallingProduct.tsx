"use client";
import React, { useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { Button, Card, Table } from "antd";

const TopSellingProduct = ({ topSellingProduct }: any) => {
    const { formatPrice } = useCurrency();
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
      title: "Total Sale Amount",
      dataIndex: "total_sale_amount",
      key: "total_sale_amount",
      width: 150,
      render: (v: any) => {
        return <span>{formatPrice(v)}</span>;
      },
    },
    {
      title: "Total Qty",
      dataIndex: "sale_qty",
      key: "sale_qty",
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
          pageSize: 5,
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

export default TopSellingProduct;
