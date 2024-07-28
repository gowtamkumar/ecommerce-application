"use client";
import React from "react";
import { Avatar, Card, Table } from "antd";

const TopCustomer = ({ topCustomers }) => {
  const theme = "light-bg";
  const text = "text-dark";

  const columns = [
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (item) => (
        <div className="flex items-center">
          <Avatar width={30} prefix={item.name} src="user.png" />
          <div>
            <div className="mx-2">{item.name}</div>
            <small className="mx-2">{item.phone}</small>
          </div>
        </div>
      ),
    },
    {
      title: "Total Paid Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (item) => (
        <>
          <div>৳ {item.amount}</div>
          {/* <span>Total Sales : {item.sale}</span> */}
        </>
      ),
    },
  ];

  const data = (topCustomers || []).map((item) => ({
    key: item.id,
    customer: {
      name: item.name,
      photo: item.photo,
      phone: item.phone,
    },
    total_amount: { amount: item.amount, sale: item.sale_items },
  }));

  return (
    <Card
      className={`${theme} border-0`}
      title={<span className={text}>Top Customer</span>}
      size="small"
    >
      <Table
        className="bg-slate-600"
        size="small"
        pagination={false}
        columns={columns}
        dataSource={data}
      />
    </Card>
  );
};

export default TopCustomer;
