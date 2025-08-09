"use client";
import { getOrderQuery } from "@/lib/apis/orders";
import { saveDashboardPayment } from "@/lib/apis/payment";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import {
  Button,
  Empty,
  Form,
  Input,
  Space,
  Table,
  Timeline
} from "antd";
import dayjs from "dayjs";
import { Metadata } from "next";
import { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";

export const metadata: Metadata = {
  title: 'Payment',
  description: 'This is a Payment.',
};


export default function OrderTracker() {
  const [order, setOrder] = useState({} as any);
  const [tracker, setTracker] = useState({} as { trackingNo: string });
  // const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  const [form] = Form.useForm();

  async function handleOrderTracking() {
    dispatch(setLoading({ tracking: true }));
    const result = await getOrderQuery(tracker);
    if (!result.success) {
      dispatch(setLoading({ tracking: false }));
      return;
    }

    setTimeout(() => {
      setOrder(result.data);
      dispatch(setLoading({ tracking: false }));
    }, 2000);
  }

  async function handlePayment(value: any) {
    dispatch(setLoading({ payment: true }));
    const newPayment = {
      orderId: order.id,
      paymentDate: dayjs(),
      paymentType: "Debit",
      paymentMethod: "Cash",
      userId: order.userId,
      amount: +value.amount,
      due: +order.due,
    };

    const result = await saveDashboardPayment(newPayment);
    if (!result.success) {
      dispatch(setLoading({ payment: false }));
      errorNotification({ message: result.message });
      return;
    }

    setTimeout(() => {
      dispatch(setLoading({ payment: false }));
      successNotification({ message: result.message });
      setOrder({});
      form.resetFields();
    }, 2000);
  }

  const childColumns: any = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (v: { name: string }) => <span>{v.name}</span>,
    },
    {
      title: "Unit Price",
      key: "unitPrice",
      render: (v: any) => {
        return <span>{(+v.unitPrice + +v.taxAmount).toFixed(2)}</span>;
      },
    },

    {
      title: "Discount Amount",
      dataIndex: "totalDiscountAmount",
      key: "totalDiscountAmount",
    },

    { title: "Qty", dataIndex: "qty", key: "qty" },
    {
      title: "Sub Total",
      key: "subTotal",
      dataIndex: "subTotal",
    },
  ];

  return (
    <div className="p-5">
      <Form form={form} onFinish={handlePayment} scrollToFirstError={true}>
        <Space.Compact block size="small">
          <Form.Item name="name" label="Invoice No">
            <Input
              id="trackingNo"
              size="middle"
              allowClear
              placeholder="Tracking No"
              onChange={({ target }) => {
                setTracker({ trackingNo: target.value });
                setOrder({});
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              size="middle"
              disabled={!tracker?.trackingNo}
              type="primary"
              loading={global.loading.tracking}
              onClick={handleOrderTracking}
            >
              Find
            </Button>
          </Form.Item>
        </Space.Compact>

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
                <div className="col-span-6">
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
                <div className="grid gap-y-3 col-span-2">
                  <div>
                    <div className="flex justify-between">
                      <h1>Total Qty:</h1>
                      <h1 className="font-semibold">{order.totalQty}</h1>
                    </div>

                    <div className="flex justify-between">
                      <h1>Net Amount:</h1>
                      <h1 className="font-semibold">
                        {(
                          +order.subTotal +
                          +order.totalItemsDiscount +
                          +order.couponDiscount
                        ).toFixed(2)}
                      </h1>
                    </div>

                    {+order.totalItemsDiscount > 0 && (
                      <div className="flex justify-between">
                        <h1>Discount Amount:</h1>
                        <h1 className="font-semibold">
                          {order.totalItemsDiscount}
                        </h1>
                      </div>
                    )}

                    {+order.couponDiscount > 0 && (
                      <div className="flex justify-between">
                        <h1>Coupon Discount:</h1>
                        <h1 className="font-semibold">
                          {order.couponDiscount}
                        </h1>
                      </div>
                    )}

                    {+order.shippingCharge > 0 && (
                      <div className="flex justify-between">
                        <h1>Shipping:</h1>
                        <h1 className="font-semibold">
                          +{order.shippingCharge}
                        </h1>
                      </div>
                    )}

                    {order.paid > 0 && (
                      <div className="flex justify-between">
                        <h1>Paid Amount:</h1>
                        <h1 className="font-semibold">{order.paid}</h1>
                      </div>
                    )}

                    <div className="flex justify-between border-t-2">
                      <h1>Grand Total:</h1>
                      <h1 className="font-semibold">{order.due} </h1>
                    </div>
                  </div>

                  <div>
                    <Space.Compact block>
                      <Form.Item name="amount" label="Pay">
                        <Input id="pay" size="middle" placeholder="Amount" />
                      </Form.Item>

                      <Button
                        size="middle"
                        type="primary"
                        onClick={() => {
                          form.setFieldsValue({ amount: order.due });
                        }}
                      >
                        Full Pay
                      </Button>
                    </Space.Compact>
                  </div>
                  <div className="text-end mt-0">
                    <Form.Item>
                      <Button
                        size="middle"
                        type="primary"
                        loading={global.loading.payment}
                        htmlType="submit"
                      >
                        Pay
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Form>
    </div>
  );
}
