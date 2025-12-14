"use client";
import { ActionType, paymentMethods } from "@/constants/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { getOrderQuery } from "@/lib/apis/orders";
import { savePayment } from "@/lib/apis/payment";
import { errorNotification } from "@/lib/utils/notification";
import { setProductRating } from "@/redux/features/global/globalSlice";
import {
  BankOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  SearchOutlined,
  SyncOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Form,
  Input,
  Row,
  Select,
  Space,
  Steps,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useDispatch } from "react-redux";

const NewReview = dynamic(() => import("../product/review-rating/NewReview"), {
  ssr: false,
});

const { Title, Text } = Typography;

export default function OrderTracker() {
  const [order, setOrder] = useState({} as any);
  const [payMethod, setpayMethod] = useState("");
  const [tracker, setTracker] = useState({} as { trackingNo: string });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { formatPrice } = useCurrency();

  async function handleOrderTracking(values: any) {
    if (!values.trackingNo) return;
    setLoading(true);
    setTracker({ trackingNo: values.trackingNo });

    try {
      const result = await getOrderQuery({ trackingNo: values.trackingNo });
      if (result.success) {
        // Simulate a brief delay for UI smoothness or real fetch
        setTimeout(() => {
          setOrder(result.data);
          setLoading(false);
        }, 800);
      } else {
        // Handle not found or error
        setOrder({});
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function handleOnlinePayment() {

    console.log("payMethod", payMethod);

    setLoading(true);
    const result = (await savePayment({
      orderId: order.id,
      amount: order.due > 0 ? order.due : order.grandTotal,
      paymentMethod: paymentMethods[0].value,
    })) as any;
    if (result?.success) {
      window.location.href = result.data?.paymentUrl;
    } else {
      errorNotification(result?.message);
    }
    setLoading(false);
  }

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (v: { name: string }) => <Text strong>{v.name}</Text>,
    },
    {
      title: "Variant",
      key: "variant",
      render: (_: any, record: any) => (
        <div className="text-xs text-gray-500">
          {record?.productVariant?.color && (
            <div>Color: {record.productVariant.color.name}</div>
          )}
          {record?.productVariant?.size && (
            <div>Size: {record.productVariant.size.name}</div>
          )}
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (val: any, record: any) => formatPrice(+val + +record.taxAmount),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      align: "center" as const,
    },
    {
      title: "Total",
      dataIndex: "subTotal",
      key: "subTotal",
      align: "right" as const,
      render: (val: any) => <Text strong>{formatPrice(val)}</Text>,
    },
  ];

  // Helper to map statuses to steps (simplified)
  const getStepStatus = (status: string) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Processing":
        return 1;
      case "Shipped":
        return 2;
      case "Delivered":
        return 3;
      case "Canceled":
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = order?.orderTrackings
    ? order.orderTrackings.length - 1
    : 0; // Using tracking length as proxy, simplified

  return (
    <div className="max-w-5xl mx-auto">
      {/* Search Section */}
      <div className="text-center mb-10">
        <Title level={3}>Track Your Order</Title>
        <Text type="secondary" className="mb-6 block">
          Enter your order tracking number to see current status.
        </Text>

        <Form
          form={form}
          onFinish={handleOrderTracking}
          layout="inline"
          className="justify-center"
        >
          <Form.Item
            name="trackingNo"
            rules={[
              { required: true, message: "Please enter tracking number" },
            ]}
          >
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="e.g. ORD-2023-1234"
              size="large"
              style={{ minWidth: 300 }}
              allowClear
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              icon={<TruckOutlined />}
            >
              Track Order
            </Button>
          </Form.Item>
        </Form>
      </div>

      {loading ? (
        <Card loading variant="borderless" />
      ) : order.trackingNo ? (
        <div className="animate-fade-in space-y-6">
          {/* Status Steps */}
          <Card variant="borderless" className="shadow-sm">
            <div className="py-4">
              {/* Simplified Status Map - In real app, map exact statuses from enum */}
              <Steps
                current={order.orderTrackings?.length || 0}
                items={[
                  { title: "Order Placed", icon: <FileTextOutlined /> },
                  {
                    title: "Processing",
                    icon: (
                      <SyncOutlined spin={order.orderStatus === "Processing"} />
                    ),
                  },
                  { title: "Shipped", icon: <TruckOutlined /> },
                  { title: "Delivered", icon: <CheckCircleOutlined /> },
                ]}
                status={order.orderStatus === "Canceled" ? "error" : "process"}
              />
            </div>
          </Card>

          <Row gutter={[24, 24]}>
            {/* Left: Info */}
            <Col xs={24} md={16}>
              <Card
                title="Order Details"
                variant="borderless"
                className="shadow-sm h-full"
              >
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Order ID">
                    {order.trackingNo}
                  </Descriptions.Item>
                  <Descriptions.Item label="Order Date">
                    {dayjs(order.createdAt).format("MMMM D, YYYY h:mm A")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Status">
                    <Tag
                      color={
                        order.paymentStatus === "Paid" ? "green" : "orange"
                      }
                    >
                      {order.paymentStatus || "Unpaid"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Delivery Address">
                    <Space align="start">
                      <EnvironmentOutlined className="mt-1 text-gray-400" />
                      <div>
                        <div className="font-medium">
                          {order.shippingAddress?.name} (
                          {order.shippingAddress?.type})
                        </div>
                        <div className="text-gray-500">
                          {order.shippingAddress?.address}
                        </div>
                        <div className="text-gray-500">
                          {order.shippingAddress?.phoneNo}
                        </div>
                      </div>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>

                <div className="mt-6">
                  <Title level={5}>Items</Title>
                  <Table
                    columns={columns}
                    dataSource={order.orderItems}
                    pagination={false}
                    size="small"
                    rowKey="id"
                  />
                </div>
              </Card>
            </Col>

            {/* Right: Timeline & Reviews */}
            <Col xs={24} md={8}>
              <Card
                title="Order History"
                variant="borderless"
                className="shadow-sm mb-6"
              >
                {/* Using a custom timeline mapping */}
                <div className="relative border-l border-gray-200 ml-3 space-y-6 pb-2">
                  {(order.orderTrackings || []).map(
                    (track: any, idx: number) => (
                      <div key={idx} className="ml-6 relative">
                        <div className="absolute -left-[31px] bg-blue-500 h-2.5 w-2.5 rounded-full border-2 border-white ring-2 ring-gray-100"></div>
                        <div className="text-sm font-semibold">
                          {track.status}
                        </div>
                        <div className="text-xs text-gray-500">
                          {dayjs(track.createdAt).format("MMM D, h:mm A")}
                        </div>
                        {track.location && (
                          <div className="text-xs text-gray-400 mt-1">
                            <EnvironmentOutlined /> {track.location}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </Card>

              <Card
                title="Payment Summary"
                variant="borderless"
                className="shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subTotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>+{formatPrice(order.shippingCharge)}</span>
                  </div>
                  {+order.totalItemsDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(order.totalItemsDiscount)}</span>
                    </div>
                  )}
                  <Divider className="my-3" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(order.due || order.grandTotal)}</span>
                  </div>
                  {order.due > 0 &&
                    order.paymentStatus !== "Paid" &&
                    order.status !== "Canceled" &&
                    order.paymentMethod !== paymentMethods[0].value && (
                      <div className="w-full">
                        <Select
                          size="large"
                          className="w-full"
                          onChange={(value) => {
                            setpayMethod(value);
                          }}
                        >
                          {paymentMethods.map((method: any) => (
                            <Select.Option
                              key={method.value}
                              value={method.value}
                            >
                              {method.label}
                            </Select.Option>
                          ))}
                        </Select>
                        {/* </Form.Item> */}
                        <Button
                          type="primary"
                          block
                          icon={<BankOutlined />}
                          onClick={handleOnlinePayment}
                          className="mt-4 bg-green-600 hover:bg-green-700"
                        >
                          Note: Pay {formatPrice(order.due)} Now
                        </Button>
                      </div>
                    )}
                </div>
              </Card>

              {/* Action Area */}
              {order.orderStatus === "Delivered" && (
                <div className="mt-6 text-center">
                  <Button
                    block
                    type="default"
                    icon={<CheckCircleOutlined />}
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
              )}
            </Col>
          </Row>
        </div>
      ) : (
        tracker.trackingNo &&
        !loading && (
          <Empty
            description="No order found with this tracking number."
            className="mt-10"
          />
        )
      )}
    </div>
  );
}
