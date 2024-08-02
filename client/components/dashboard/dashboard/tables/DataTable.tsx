"use client";
import { Avatar, Table, Tag } from "antd";
import dayjs from "dayjs";
import React from "react";

const DataTable = ({ orderData }: any) => {
  const columns = [
    {
      title: "Tracking No",
      dataIndex: "trackingNo",
      key: "trackingNo",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
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
      title: "Paid Amount",
      dataIndex: "totalPaid",
      key: "totalPaid",
      render: (v: number) => <span>{v.toFixed(2)}</span>,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (v: number) => <span>{v.toFixed(2)}</span>,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      // render: (item: string) => (
      //   <Tag
      //     color={
      //       item === "Paid" ? "green" : item === "Unpaid" ? "red" : "yellow"
      //     }
      //   >
      //     {item}
      //   </Tag>
      // ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      // render: (item: string) => (
      //   <Tag
      //     color={
      //       item === "Received"
      //         ? "green"
      //         : item === "Ordered"
      //           ? "blue"
      //           : "green"
      //     }
      //   >
      //     {item}
      //   </Tag>
      // ),
    },
  ];

  const expandedRowRender = (value: any) => {
    const childColumns: any = [
      {
        title: "Product",
        dataIndex: "product",
        key: "product",
        render: (v: { name: string }) => <span>{v.name}</span>,
      },
      {
        title: "Purchase Price",
        dataIndex: "purchasePrice",
        key: "purchasePrice",
      },
      { title: "Price", dataIndex: "price", key: "price" },
      { title: "Discount", dataIndex: "discountA", key: "discountA" },
      {
        title: "Tax",
        key: "tax",
        dataIndex: "tax",
      },
      {
        title: "Sale Price",
        render: (v: { price: number; tax: number; discountA: number }) => (
          <span>{(+v.price + +v.tax - +v.discountA).toFixed(2)}</span>
        ),
      },
      { title: "Qty", dataIndex: "qty", key: "qty" },
      {
        title: "Total item Amount",
        render: (v: {
          price: number;
          tax: number;
          discountA: number;
          qty: number;
        }) => (
          <span>{((+v.price + +v.tax - +v.discountA) * v.qty).toFixed(2)}</span>
        ),
      },
    ];

    return (
      <>
        <div className="p-4 bg-white">
          <h1 className="font-semibold">Order Items</h1>
          <Table
            columns={childColumns}
            size="small"
            scroll={{ x: "auto" }}
            dataSource={value.orderItems}
            pagination={false}
            bordered
          />
        </div>
        <div className="grid grid-cols-3 mt-5">
          <div className="col-span-2">dasdf</div>
          <div className="grid gap-y-3 col-span-1">
            <div className="flex justify-between">
              <h1>
                Net Amount: (+tax {value.orderTax}, - Discount{" "}
                {value.discountAmount})
              </h1>
              <h1 className="font-semibold">
                ${(+value.orderTotalAmount).toFixed(2)}
              </h1>
            </div>

            <div className="flex justify-between">
              <h1>Shipping:</h1>
              <h1 className="font-semibold">
                + ${(+value.shippingAmount || 0).toFixed(2)}
              </h1>
            </div>

            <div className="flex justify-between border-t-2">
              <h1>Total Amount:</h1>
              <h1 className="font-semibold">
                $ {(+value.totalAmount || 0).toFixed(2)}
              </h1>
            </div>
          </div>
        </div>
      </>
    );
  };

  const data = [] as any;
  const newData = (orderData || []).forEach((item: any) =>
    data.push({
      key: item.id,
      id: item.id,
      trackingNo: item.trackingNo,
      orderDate: item.orderDate,
      // supplier: item.supplier,
      orderTax: item.orderTax,
      discountAmount: item.discountAmount,
      customer: item.user,
      shippingAmount: item.shippingAmount,
      paymentMethod: item.paymentMethod,
      totalPaid: 500,
      totalAmount: (+item.orderTotalAmount || 0) + (+item.shippingAmount || 0),
      orderTotalAmount: item.orderTotalAmount,
      paymentStatus: item.paymentStatus,
      status: item.status,
      orderItems: item.orderItems,
      responsive: ["sm", "md"],
    })
  );

  return (
    <div className="w-100">
      <Table
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={data}
        size="small"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default DataTable;
