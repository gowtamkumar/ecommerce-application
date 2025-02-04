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
      title: "Paid Amount",
      dataIndex: "totalPaid",
      key: "totalPaid",
      render: (v: number) => <span>{v}</span>,
    },
    {
      title: "Total Amount",
      key: "totalAmount",
      render: (value: any) => (
        <h1 className="font-semibold">
          ${" "}
          {(
            +value.subTotal +
            +value.shippingCharge +
            +value.totalTax -
            +value.discountAmount
          ).toFixed(2)}
        </h1>
      ),
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
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
      { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice" },

      {
        title: "Discount Amount",
        dataIndex: "discountAmount",
        key: "discountAmount",
      },
      {
        title: "Tax Amount",
        key: "taxAmount",
        dataIndex: "taxAmount",
        // render: (v: {
        //   taxAmount: number;
        //   qty: number;
        // }) => <span>{(+v.taxAmount * +v.qty).toFixed(2)}</span>,
      },

      { title: "Qty", dataIndex: "qty", key: "qty" },
      {
        title: "Total item Amount",
        render: (v: { unitPrice: number; qty: number }) => (
          <span>{(+v.unitPrice * +v.qty).toFixed(2)}</span>
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
        <div className="grid grid-cols-8 mt-5">
          <div className="col-span-4">dasdf</div>
          <div className="grid gap-y-3 col-span-4">
            <div className="flex justify-between">
              <h1>Net Amount:</h1>
              <h1 className="font-semibold">
                ${(+value.subTotal).toFixed(2)}
              </h1>
            </div>

            <div className="flex justify-between">
              <h1>Discount Amount:</h1>
              <h1 className="font-semibold">
                ${(+value.discountAmount).toFixed(2)}
              </h1>
            </div>

            <div className="flex justify-between">
              <h1>Tax Amount:</h1>
              <h1 className="font-semibold">${value.totalTax}</h1>
            </div>

            <div className="flex justify-between">
              <h1>Shipping:</h1>
              <h1 className="font-semibold">
                + ${(+value.shippingCharge || 0).toFixed(2)}
              </h1>
            </div>
            {/* <div className="flex justify-between">
                <h1>Total Order Tax</h1>
                <h1 className="font-semibold">
                  + ${(+value.totalTax || 0).toFixed(2)}
                </h1>
              </div>

              <div className="flex justify-between">
                <h1>Discount:</h1>
                <h1 className="font-semibold">
                  - ${(+value.discountAmountmount || 0).toFixed(2)}
                </h1>
              </div> */}

            <div className="flex justify-between border-t-2">
              <h1>Total Amount:</h1>
              <h1 className="font-semibold">
                ${" "}
                {(
                  +value.subTotal +
                  +value.shippingCharge +
                  +value.totalTax -
                  +value.discountAmount
                ).toFixed(2)}
              </h1>
            </div>
          </div>
        </div>
        {/* <div className="grid grid-cols-3 mt-5">
          <div className="col-span-2">dasdf</div>
          <div className="grid gap-y-3 col-span-1">
            <div className="flex justify-between">
              <h1>
                Net Amount: (+tax {value.totalTax}, - Discount{" "}
                {value.discountAmount})
              </h1>
              <h1 className="font-semibold">
                ${(+value.subTotal).toFixed(2)}
              </h1>
            </div>

            <div className="flex justify-between">
              <h1>Shipping:</h1>
              <h1 className="font-semibold">
                + ${(+value.shippingCharge || 0).toFixed(2)}
              </h1>
            </div>

            <div className="flex justify-between border-t-2">
              <h1>Total Amount:</h1>
              <h1 className="font-semibold">
                $ {(+value.totalAmount || 0).toFixed(2)}
              </h1>
            </div>
          </div>
        </div> */}
      </>
    );
  };


  const newOrders = orderData.map((item: any, idx: number) => ({
    ...item,
    customer: item.user,
    key: idx.toString(),
  }));

  return (
    <div className="w-100">
      <Table
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={newOrders}
        size="small"
        pagination={{ pageSize: 4 }}
      />
    </div>
  );
};

export default DataTable;
