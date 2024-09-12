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
import NewReview from "../product/review-rating/NewReview";

export default function OrderTracker({ orders }: any) {
  const [order, setOrder] = useState({} as any);
  const [tracker, setTracker] = useState({} as { trackingNo: string });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

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
      render: (v: any) => <span>{v.color?.name}</span>,
    },
    {
      title: "Size",
      render: (v: any) => <span>{v.size?.name}</span>,
    },
    // {
    //   title: "Purchase Price",
    //   dataIndex: "purchasePrice",
    //   key: "purchasePrice",
    // },
    // { title: "Price", dataIndex: "price", key: "price" },

    // { title: "Discount", dataIndex: "discountA", key: "discountA" },
    // {
    //   title: "Tax",
    //   key: "tax",
    //   dataIndex: "tax",
    // },

    {
      title: "Price",
      render: (v: { price: number; tax: number; discountA: number }) => (
        <span>{(+v.price + +v.tax - +v.discountA).toFixed(2)}</span>
      ),
    },
    { title: "Qty", dataIndex: "qty", key: "qty" },
    {
      title: "Item Amount",
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
      <Form
        // {...layout}
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
              <h1 className="font-bold">
                Order Tracking No:{order.trackingNo}
              </h1>
              <Divider dashed />
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
            // disabled={!product.enableReview}
            onClick={() =>
              
              dispatch(
                setProductRating({
                  type: ActionType.CREATE,
                  productRating: true,
                  payload: { productId: order.id },
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
              <h1 className="font-semibold">Order Items</h1>
              <Table
                columns={childColumns}
                size="small"
                scroll={{ x: "auto" }}
                dataSource={order.orderItems}
                pagination={false}
                bordered
              />
            </div>
            <div className="grid grid-cols-6 mt-5">
              <div className="col-span-4"></div>
              <div className="grid gap-y-3 col-span-2">
                <div className="flex justify-between">
                  <h1>Total Items:</h1>
                  <h1 className="font-semibold">
                    {order.orderItems.length} Product(s)
                  </h1>
                </div>

                <div className="flex justify-between">
                  <h1>Sub Total:</h1>
                  <h1 className="font-semibold">
                    ${(+order.netAmount).toFixed(2)}
                  </h1>
                </div>

                <div className="flex justify-between">
                  <h1>Shipping:</h1>
                  <h1 className="font-semibold">
                    + ${(+order.shippingAmount || 0).toFixed(2)}
                  </h1>
                </div>

                <div className="flex justify-between border-t-2">
                  <h1>Payable Amount:</h1>
                  <h1 className="font-semibold">
                    ${" "}
                    {(
                      +order.orderTotalAmount + +order.shippingAmount || 0
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
