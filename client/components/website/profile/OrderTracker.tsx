"use client";
import React, { useState } from "react";
import {
  Button,
  Divider,
  Empty,
  Form,
  Input,
  Rate,
  Space,
  Table,
  Timeline,
} from "antd";
import dayjs from "dayjs";
import { CiLocationOn } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { setProductRating } from "@/redux/features/global/globalSlice";
import { ActionType } from "@/constants/constants";
import dynamic from "next/dynamic";

const NewReview = dynamic(() => import("../product/review-rating/NewReview"), {
  ssr: false,
});

export default function OrderTracker({ orders }: any) {
  const [order, setOrder] = useState({} as any);
  const [tracker, setTracker] = useState({} as { trackingNo: string });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  async function handleOrderTracking() {
    // const result = await getOrderTracking({ trackingNo: tracker.trackingNo });
    setLoading(true);
    const getOrderTracker = (orders || []).find(
      (item: { trackingNo: string }) => item.trackingNo === tracker.trackingNo
    );
    setTimeout(() => {
      setOrder(getOrderTracker || {});
      setLoading(false);
    }, 2000);
  }

  // if (!wishlists?.length) {
  //   <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  //   return;
  // }

  const childColumns: any = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (v: { name: string }) => <span>{v.name}</span>,
    },
    {
      title: "Color",
      render: (v: any) => <span>Need to Get in product variant</span>,
    },
    {
      title: "Size",
      render: (v: any) => <span>Need to Get in product variant</span>,
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
      <Form
        form={form}
        onFinish={handleOrderTracking}
        scrollToFirstError={true}
      >
        <label htmlFor="trackingNo">Tracking No</label>
        <Space.Compact block size="small">
          <Form.Item name="name" label="Name">
            <Input
              id="trackingNo"
              size="middle"
              placeholder="Input Your tracking No"
              onChange={({ target }) => {
                setTracker({ trackingNo: target.value });
                setOrder({});
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              size="middle"
              disabled={!tracker.trackingNo}
              type="primary"
              loading={loading}
              htmlType="submit"
            >
              Query
            </Button>
          </Form.Item>
        </Space.Compact>
      </Form>
      {order.trackingNo ? (
        <>
          <div className="grid grid-cols-3">
            <div className="col-span-1 p-2">
              <h1 className="font-bold">Order No:{order.trackingNo}</h1>
            </div>
            <div className="col-span-1 p-2 flex gap-2">
              <div>
                <CiLocationOn className="size-8" />
              </div>
              <div>
                <h1 className="font-bold">Delivery Address</h1>
                <p> {order?.shippingAddress?.type}:</p>
                <p>{order?.shippingAddress?.address}</p>

                <p>Phone No: {order?.shippingAddress?.phoneNo}</p>
              </div>
            </div>
            <div className="col-span-1 p-2 flex gap-2">
              <div className="basis-1/3">
                <p>Rate this product</p>
                <Rate defaultValue={2.5} disabled />
                <br />
                <Button
                  type="primary"
                  size="small"
                  onClick={() =>
                    dispatch(
                      setProductRating({
                        type: ActionType.CREATE,
                        productRating: true,
                        payload: { orderItems: order.orderItems },
                      })
                    )
                  }
                >
                  Write a Review
                </Button>
                <NewReview />
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="p-4 bg-white">
              <h2 className="font-semibold">Order Items</h2>
              <Table
                columns={childColumns}
                size="small"
                scroll={{ x: "auto" }}
                dataSource={order.orderItems}
                pagination={false}
                bordered
              />
            </div>
            <div className="grid grid-cols-8 mt-5">
              <div className="col-span-4">
                <h2 className="font-semibold">Order Trackings</h2>
                <Timeline
                  items={(order?.orderTrackings || []).map(
                    (timeline: any, idx: number) => ({
                      children: (
                        <div key={idx}>
                          <div> {timeline.status}</div>
                          <div>
                            {" "}
                            {dayjs(timeline.createdAt).format(
                              "MMMM D, YYYY h:mm A"
                            )}
                          </div>
                          <div> {timeline.location}</div>
                        </div>
                      ),
                    })
                  )}
                />
              </div>
              <div className="grid gap-y-3 col-span-4">
                <div className="flex justify-between">
                  <h1>Net Amount:</h1>
                  <h1 className="font-semibold">
                    ${(+order.netAmount).toFixed(2)}
                  </h1>
                </div>

                <div className="flex justify-between">
                  <h1>Discount Amount:</h1>
                  <h1 className="font-semibold">
                    ${(+order.discountAmount).toFixed(2)}
                  </h1>
                </div>

                <div className="flex justify-between">
                  <h1>Tax Amount:</h1>
                  <h1 className="font-semibold">${order.orderTax}</h1>
                </div>

                <div className="flex justify-between">
                  <h1>Shipping:</h1>
                  <h1 className="font-semibold">
                    + ${(+order.shippingAmount || 0).toFixed(2)}
                  </h1>
                </div>
                {/* <div className="flex justify-between">
                <h1>Total Order Tax</h1>
                <h1 className="font-semibold">
                  + ${(+order.orderTax || 0).toFixed(2)}
                </h1>
              </div>

              <div className="flex justify-between">
                <h1>Discount:</h1>
                <h1 className="font-semibold">
                  - ${(+order.discountAmountmount || 0).toFixed(2)}
                </h1>
              </div> */}

                <div className="flex justify-between border-t-2">
                  <h1>Total Amount:</h1>
                  <h1 className="font-semibold">
                    ${" "}
                    {(
                      +order.netAmount +
                      +order.shippingAmount +
                      +order.orderTax -
                      +order.discountAmount
                    ).toFixed(2)}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  );
}
