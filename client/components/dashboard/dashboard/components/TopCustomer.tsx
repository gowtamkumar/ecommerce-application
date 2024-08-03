"use client";
import React from "react";
import { Avatar, Card, Table } from "antd";

const TopCustomer = ({ top_customers }: any) => {
  console.log("🚀 ~ top_customers:", top_customers);
  const theme = "light-bg";
  const text = "text-dark";

  const columns = [
    {
      title: "Customer",
      dataIndex: "name",
      key: "name",
      // render: (item: any) => (
      //   <div className="flex items-center">
      //     {/* <Avatar /> */}
      //     <div>
      //       <div className="mx-2">{item.name}</div>
      //       <small className="mx-2">{item.phone}</small>
      //     </div>
      //   </div>
      // ),
    },
    {
      title: "Total Paid Amount",
      dataIndex: "total_paid_amount",
      key: "total_paid_amount",
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
        dataSource={top_customers}
      />
    </Card>
  );
};

export default TopCustomer;
