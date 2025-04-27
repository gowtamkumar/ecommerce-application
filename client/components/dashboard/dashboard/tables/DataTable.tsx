"use client";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Avatar, Divider, Table, Tag, Timeline } from "antd";
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
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
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
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },

    {
      title: "Paid Amount",
      dataIndex: "totalPaid",
      key: "totalPaid",
      render: (v: number) => <span>{v}</span>,
    },
    {
      title: "GrandTotal",
      key: "grandTotal",
      dataIndex: "grandTotal",
    },
    // {
    //   title: "Payment Method",
    //   dataIndex: "paymentMethod",
    //   key: "paymentMethod",
    // },
  ];

  const expandedRowRender = (value: any) => {
    const { dabitTotal, creditTotal } = value.payments.reduce(
      (acc: any, element: any) => {
        if (element.paymentType === "Credit")
          acc.creditTotal += +element.amount;
        if (element.paymentType === "Debit") acc.dabitTotal += +element.amount;
        return acc;
      },
      { dabitTotal: 0, creditTotal: 0 } // Initial accumulator values
    );

    const paidAmount = dabitTotal - creditTotal;

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
      { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice" },
      {
        title: "Tax Amount",
        key: "taxAmount",
        dataIndex: "taxAmount",
      },
      {
        title: "Discount Amount",
        dataIndex: "totalDiscountAmount",
        key: "totalDiscountAmount",
      },
      {
        title: "Sale Price",
        key: "salePrice",
        render: (v: any) => {
          return (
            <span>
              {(+v.unitPrice - +v.totalDiscountAmount + +v.taxAmount).toFixed(
                2
              )}
            </span>
          );
        },
      },

      { title: "Qty", dataIndex: "qty", key: "qty" },
      {
        title: "Sub Total",
        key: "subTotal",
        dataIndex: "subTotal",
      },
    ];

    return (
      <div className="grid grid-cols-4 p-2">
        <div className="col-span-4">
          {value.status === "Canceled" && (
            <h2 className="bg-red-500">
              <span className="font-bold">Order Resson: </span>
              <code>{value.cancelResson}</code>
            </h2>
          )}
          <h1>
            <span className="font-bold">Order No: </span>
            <code>{value.trackingNo}</code>
          </h1>
          {value.tranId && (
            <h1>
              <span className="font-bold">Transaction ID: </span>
              <code>{value.tranId}</code>
            </h1>
          )}
          <h1>
            <span className="font-bold">Shipping Address: </span>
            <code> {value.shippingAddress?.address}</code>
          </h1>
          <h1>
            <span className="font-bold">Delivery Man: </span>
            <code>{value?.deliveryMan?.name}</code>
          </h1>
          <Divider dashed />
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
          <div className="grid grid-cols-8 mt-5">
            <div className="col-span-5 p-2"> </div>

            <div className="col-span-3">
              <div className="flex justify-between">
                <h1>Total Qty:</h1>
                <h1 className="font-semibold">{value.totalQty}</h1>
              </div>

              <div className="flex justify-between">
                <h1>Net Amount:</h1>
                <h1 className="font-semibold">
                  {(+value.subTotal).toFixed(2)}
                </h1>
              </div>

              {+value.totalItemsDiscount > 0 && (
                <div className="flex justify-between">
                  <h1>Discount Amount:</h1>
                  <h1 className="font-semibold">{value.totalItemsDiscount}</h1>
                </div>
              )}

              {+value.couponDiscount > 0 && (
                <div className="flex justify-between">
                  <h1>Coupon Discount:</h1>
                  <h1 className="font-semibold">{value.couponDiscount}</h1>
                </div>
              )}

              <div className="flex justify-between">
                <h1>Tax Amount:</h1>
                <h1 className="font-semibold">{value.totalTax}</h1>
              </div>

              {paidAmount > 0 && (
                <div className="flex justify-between">
                  <h1>Paid Amount:</h1>
                  <h1 className="font-semibold">{paidAmount}</h1>
                </div>
              )}

              {+value.shippingCharge > 0 && (
                <div className="flex justify-between">
                  <h1>Shipping:</h1>
                  <h1 className="font-semibold">+{value.shippingCharge}</h1>
                </div>
              )}

              <div className="flex justify-between border-t-2">
                <h1>Grand Total:</h1>
                <h1 className="font-semibold">
                  {(+value.grandTotal - paidAmount).toFixed(2)}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const newOrders = orderData.map((item: any, idx: number) => ({
    ...item,
    customer: item.user,
    key: idx.toString(),
  }));

  return (
    <Table
      columns={columns}
      expandable={{ expandedRowRender }}
      dataSource={newOrders}
      size="small"
      pagination={{ pageSize: 4 }}
    />
  );
};

export default DataTable;
