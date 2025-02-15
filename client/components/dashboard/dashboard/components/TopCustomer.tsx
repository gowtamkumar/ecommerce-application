"use client";
import React from "react";
import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";

// Define the interface for the customer data
interface Customer {
  name: string;
  total_paid_amount: string;
}
// Define the interface for the component props
interface TopCustomerProps {
  topCustomers: Customer[];
}

const TopCustomer: React.FC<TopCustomerProps> = ({ topCustomers }) => {
  const theme = "light-bg";
  const text = "text-dark";

  // Define columns with proper typing
  const columns: ColumnsType<Customer> = [
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name"
    },
    {
      title: "Total Sale Amount",
      dataIndex: "total_sale_amount",
      key: "total_sale_amount",
    },
    {
      title: "Total Qty",
      dataIndex: "total_qty",
      key: "total_qty",
    },
  ];

  return (
    <Card
      className={`${theme} border-0`}
      title={<span className={text}>Top Customer</span>}
      size="small"
    >
      <Table
        size="small"
        pagination={{
          pageSize: 5,
        }}
        columns={columns}
        dataSource={topCustomers}
        rowKey="name" // Ensure to provide a unique row key
      />
    </Card>
  );
};

export default TopCustomer;
