"use client";
import { paymentMethods } from "@/constants/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { getOrderQuery } from "@/lib/apis/orders";
import { saveDashboardPayment } from "@/lib/apis/payment";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import {
  BankOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  PhoneOutlined,
  SearchOutlined,
  UserOutlined
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
  Table,
  Tag,
  Timeline,
  Typography
} from "antd";
import dayjs from "dayjs";
import { Metadata } from "next";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;

export const metadata: Metadata = {
  title: 'Payment',
  description: 'This is a Payment.',
};


export default function OrderTracker() {
  const [order, setOrder] = useState({} as any);
  const [tracker, setTracker] = useState({} as { trackingNo: string });
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const { formatPrice } = useCurrency();

  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const queryTrackingNo = searchParams.get("trackingNo");

  useEffect(() => {
    if (queryTrackingNo) {
      setTracker({ trackingNo: queryTrackingNo });
      form.setFieldsValue({ name: queryTrackingNo });
      handleOrderTracking(queryTrackingNo);
    }
  }, [queryTrackingNo]);

  async function handleOrderTracking(searchTrackingNo?: string) {
    const trackingNoToSearch = searchTrackingNo || tracker.trackingNo;
    if (!trackingNoToSearch) return;

    dispatch(setLoading({ tracking: true }));
    const result = await getOrderQuery({ trackingNo: trackingNoToSearch });
    if (!result.success) {
      dispatch(setLoading({ tracking: false }));
      errorNotification({ message: result.message });
      setOrder({}); // Clear order if not found
      return;
    }

    setTimeout(() => {
      setOrder(result.data);
      dispatch(setLoading({ tracking: false }));
    }, 800);
  }

  async function handlePayment(value: any) {
    dispatch(setLoading({ payment: true }));
    const newPayment = {
      orderId: order.id,
      paymentDate: dayjs(),
      paymentType: "Debit",
      paymentMethod: value.paymentMethod || "Cash",
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
      // Refresh order data
      // Refresh order data
      handleOrderTracking(order.trackingNo);
      form.setFieldsValue({ amount: "", paymentMethod: "Cash" });
    }, 1000);
  }

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (v: { name: string }, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{v.name}</Text>
          <Space size="small" className="text-xs text-gray-500">
            {record?.productVariant?.color && <Tag className="text-xs mr-0">Color: {record.productVariant.color.name}</Tag>}
            {record?.productVariant?.size && <Tag className="text-xs">Size: {record.productVariant.size.name}</Tag>}
          </Space>
        </Space>
      ),
    },
    {
      title: "Unit Price",
      key: "unitPrice",
      render: (v: any) => (
        <Text>{formatPrice(+v.unitPrice + +v.taxAmount)}</Text>
      ),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      align: "center" as const,
    },
    {
      title: "Total",
      key: "subTotal",
      dataIndex: "subTotal",
      align: "right" as const,
      render: (val: any) => <Text strong>{formatPrice(val)}</Text>,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "green";
      case "Unpaid": return "orange";
      case "Delivered": return "green";
      case "Canceled": return "red";
      case "Processing": return "blue";
      default: return "default";
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6">
      <div className="mb-8">
        <Title level={2}>Receive Payment</Title>
        <Text type="secondary">Search for an order and process manual payments.</Text>
      </div>

      {/* Search Card */}
      <Card variant="borderless" className="shadow-sm mb-6 rounded-xl">
        <Space.Compact block size="large">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Enter Order Tracking Number"
            value={tracker.trackingNo}
            onChange={(e) => setTracker({ trackingNo: e.target.value })}
            onPressEnter={() => handleOrderTracking()}
            allowClear
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            loading={global.loading.tracking}
            onClick={() => handleOrderTracking()}
          >
            Find Order
          </Button>
        </Space.Compact>
      </Card>

      {order.trackingNo ? (
        <Form form={form} onFinish={handlePayment} layout="vertical">
          <div className="animate-fade-in">
            <Row gutter={[24, 24]}>
              {/* Left Column: Order Info & Items */}
              <Col xs={24} lg={16}>
                <Space direction="vertical" size="large" className="w-full">

                  {/* Order & Customer Info */}
                  <Card variant="borderless" className="shadow-sm rounded-xl">
                    <Row gutter={[24, 24]}>
                      <Col xs={24} md={12}>
                        <Title level={5} className="mb-4"><FileTextOutlined /> Order Information</Title>
                        <Descriptions column={1} size="small" bordered>
                          <Descriptions.Item label="Order ID">
                            <Text copyable strong>{order.trackingNo}</Text>
                          </Descriptions.Item>
                          <Descriptions.Item label="Order Date">
                            <Space><CalendarOutlined /> {dayjs(order.createdAt).format("MMM D, YYYY h:mm A")}</Space>
                          </Descriptions.Item>
                          <Descriptions.Item label="Status">
                            <Tag color={getStatusColor(order.status)}>{order.status}</Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label="Payment">
                            <Tag color={getStatusColor(order.paymentStatus)}>{order.paymentStatus || "Unpaid"}</Tag>
                          </Descriptions.Item>
                        </Descriptions>
                      </Col>
                      <Col xs={24} md={12}>
                        <Title level={5} className="mb-4"><UserOutlined /> Customer Details</Title>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="font-semibold text-lg mb-1">{order.user?.name || "Guest User"}</div>
                          <div className="text-gray-500 flex items-center gap-2 mb-1"><PhoneOutlined /> {order.address?.phone || order.phoneNo || "N/A"}</div>
                          <div className="text-gray-500">{order.user?.email}</div>

                          <Divider className="my-3" />

                          <div className="font-medium mb-1"><EnvironmentOutlined /> Delivery Address</div>
                          <div className="text-gray-600">
                            {order.shippingAddress?.address}
                          </div>
                          {order.shippingAddress?.area && <div className="text-gray-500 text-sm mt-1">{order.shippingAddress.area}, {order.shippingAddress.city}</div>}
                        </div>
                      </Col>
                    </Row>
                  </Card>

                  {/* Order Items */}
                  <Card title={<span className="font-semibold">Order Items</span>} variant="borderless" className="shadow-sm rounded-xl">
                    <Table
                      columns={columns}
                      dataSource={order.orderItems}
                      pagination={false}
                      size="small"
                      rowKey="id"
                      className="border border-gray-100 rounded-lg overflow-hidden"
                    />
                  </Card>

                  {/* Timeline */}
                  <Card title={<span className="font-semibold">Order Status History</span>} variant="borderless" className="shadow-sm rounded-xl">
                    <div className="pt-2">
                      <Timeline
                        mode="left"
                        items={(order.orderTrackings || []).map((track: any) => ({
                          color: track.status === "Delivered" ? "green" : "blue",
                          children: (
                            <div className="pb-2">
                              <Text strong>{track.status}</Text>
                              <div className="text-xs text-gray-500 mt-0.5">{dayjs(track.createdAt).format("MMM D, YYYY h:mm A")}</div>
                              {track.location && <div className="text-xs text-gray-400"><EnvironmentOutlined /> {track.location}</div>}
                            </div>
                          ),
                        }))}
                      />
                    </div>
                  </Card>
                </Space>
              </Col>

              {/* Right Column: Payment */}
              <Col xs={24} lg={8}>
                <div className="sticky top-6">
                  <Card title={<span className="font-semibold"><DollarCircleOutlined /> Payment Summary</span>} variant="borderless" className="shadow-sm rounded-xl mb-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Text type="secondary">Subtotal</Text>
                        <Text>{formatPrice(order.subTotal)}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Shipping</Text>
                        <Text>+{formatPrice(order.shippingCharge)}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Tax</Text>
                        <Text>+{formatPrice(order.totalTax)}</Text>
                      </div>
                      {(order.totalItemsDiscount > 0 || order.couponDiscount > 0) && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-{formatPrice(+order.totalItemsDiscount + +order.couponDiscount)}</span>
                        </div>
                      )}

                      <Divider className="my-3" />

                      <div className="flex justify-between items-center">
                        <Text strong className="text-lg">Grand Total</Text>
                        <Text strong className="text-lg">{formatPrice(order.grandTotal)}</Text>
                      </div>

                      <div className="bg-green-50 p-3 rounded-lg flex justify-between items-center border border-green-100">
                        <Text className="text-green-700">Paid Amount</Text>
                        <Text strong className="text-green-700">{formatPrice(order.paid)}</Text>
                      </div>

                      <div className="bg-red-50 p-3 rounded-lg flex justify-between items-center border border-red-100">
                        <Text className="text-red-700">Due Amount</Text>
                        <Text strong className="text-red-700">{formatPrice(order.due)}</Text>
                      </div>
                    </div>
                  </Card>

                  <Card title={<span className="font-semibold">Receive Payment</span>} variant="borderless" className="shadow-sm rounded-xl border-t-4 border-t-blue-500">
                    <div className="space-y-4">
                      <Form.Item
                        label="Payment Method"
                        name="paymentMethod"
                        initialValue="Cash"
                        rules={[{ required: true, message: "Please select payment method" }]}
                      >
                        <Select size="large">
                          {
                            paymentMethods.map((method: any) => (
                              <Select.Option key={method.value} value={method.value}>
                                {method.label}
                              </Select.Option>
                            ))
                          }
                        </Select>
                      </Form.Item>

                      <Form.Item
                        label="Amount to Receive"
                        name="amount"
                        rules={[
                          { required: true, message: "Please enter amount" },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value) {
                                return Promise.resolve();
                              }
                              if (+value <= 0) {
                                return Promise.reject(new Error("Amount must be greater than 0"));
                              }
                              if (+value > order.due) {
                                return Promise.reject(new Error(`Amount cannot exceed ${order.due}`));
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                        className="mb-2"
                      >
                        <Input
                          prefix={global.currency?.symbol}
                          placeholder="0.00"
                          size="large"
                          type="number"
                          className="w-full"
                        />
                      </Form.Item>

                      <Space className="w-full justify-between mb-4">
                        <Button size="small" onClick={() => form.setFieldsValue({ amount: order.due })}>
                          Set Due Amount
                        </Button>
                        <Button size="small" onClick={() => form.setFieldsValue({ amount: order.grandTotal })}>
                          Set Full Amount
                        </Button>
                      </Space>

                      <Button
                        type="primary"
                        size="large"
                        block
                        htmlType="submit"
                        loading={global.loading.payment}
                        icon={<BankOutlined />}
                        className="bg-blue-600"
                        disabled={order.due <= 0}
                      >
                        Confirm Payment
                      </Button>
                    </div>
                  </Card>
                </div>
              </Col>
            </Row>
          </div>
        </Form>
      ) : (
        <div className="py-20 text-center bg-white rounded-xl shadow-sm">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<Text type="secondary">Enter a tracking number above to view order details.</Text>}
          />
        </div>
      )}
    </div>
  );
}
