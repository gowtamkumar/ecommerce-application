"use client";
import { ActionType, paymentMethods } from "@/constants/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { getOrderQuery } from "@/lib/apis/orders";
import { onlinePayment } from "@/lib/apis/payment";
import { errorNotification } from "@/lib/utils/notification";
import {
  setAction,
  setProductRating,
} from "@/redux/features/global/globalSlice";
import {
  BankOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  SearchOutlined,
  SyncOutlined,
  TruckOutlined,
  UndoOutlined,
  DollarOutlined,
  InfoCircleOutlined
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
  Badge,
  Alert
} from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useDispatch } from "react-redux";
import ReturnRequestAllOrder from "./ReturnRequestAllOrder";
import ReturnRequestOrderItem from "./ReturnRequestOrderItem";

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

  const handleOnlinePayment = async () => {
    const tranId = order.tranId
    const result = await onlinePayment({
      tranId,
      grandTotal: order.due > 0 ? order.due : +order.grandTotal,
      paymentMethod: payMethod,
    })

    if (result?.success) {
      window.location.href = result.url;
    } else {
      errorNotification(result?.message);
    }
  }

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (v: { name: string }, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{v.name}</Text>
          {/* Show item level return status if any */}
          {record.requestedQty > 0 && (
            <Tag color="orange" className="mt-1">
              Return Requested: {record.requestedQty}
            </Tag>
          )}
          {record.approvedQty > 0 && (
            <Tag color="blue" className="mt-1">
              Return Approved: {record.approvedQty}
            </Tag>
          )}
        </Space>
      ),
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
      title: "Discount",
      dataIndex: "totalDiscountAmount",
      key: "totalDiscountAmount",
      render: (val: any) => val > 0 ? <Text type="success">-{formatPrice(+val)}</Text> : "-",
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
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => {
        // Only show return button if order is delivered AND product is returnable AND not fully returned yet
        const canReturn = order.status === "Delivered" && 
                          record.product.isReturnable && 
                          (record.qty - (record.requestedQty || 0)) > 0;
        
        return canReturn ? (
          <Button
            size="small"
            icon={<UndoOutlined />}
            onClick={() => {
              dispatch(
                setAction({
                  type: ActionType.UPDATE,
                  returnOrderItem: true,
                  payload: {
                    orderId: order.id,
                    orderItemId: record.id,
                    qty: record.qty, // Pass max qty, user can adjust in modal
                  },
                })
              );
            }}
          >
            Return
          </Button>
        ) : null;
      }
    },
  ];

  // Calculate generic status index
  const getStatusIndex = () => {
    if (!order.status) return 0;
    const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
    // If returned, we might want to show that separately or as a final state if full return
    if (order.status === "Returned") return 4; 
    const idx = statuses.indexOf(order.status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      {/* Search Section */}
      <div className="text-center mb-12 pt-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-4">
          Track Your Order
        </h1>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
          Enter your order tracking number below to verify status, manage returns, and view delivery updates.
        </p>

        <Card 
          bordered={false} 
          className="max-w-2xl mx-auto shadow-lg bg-white/50 backdrop-blur-sm border border-white/50"
          styles={{ body: { padding: '2rem' } }}
        >
          <Form
            form={form}
            onFinish={handleOrderTracking}
            layout="vertical"
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row gap-4">
               <Form.Item
                name="trackingNo"
                className="flex-grow mb-0"
                rules={[{ required: true, message: "Please enter tracking number" }]}
              >
                <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  placeholder="Order ID (e.g. ORD-2023-1234)"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>
              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loading}
                  icon={<TruckOutlined />}
                  className="w-full sm:w-auto rounded-lg bg-indigo-600 hover:bg-indigo-700 h-10"
                >
                  Track Order
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Card>
      </div>

      {loading ? (
        <Card loading bordered={false} className="shadow-sm rounded-xl" />
      ) : order.trackingNo ? (
        <div className="animate-fade-in space-y-8">
          
          {/* Order Status & Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Status Steps */}
            <Card bordered={false} className="md:col-span-2 shadow-sm rounded-xl overflow-hidden">
              <div className="bg-gray-50 -m-6 mb-6 p-4 border-b border-gray-100 flex justify-between items-center">
                 <div className="font-semibold text-gray-700">Order Status: <span className="text-indigo-600">{order.status}</span></div>
                 <div className="text-sm text-gray-500">Last Updated: {dayjs(order.updatedAt).format('MMM D, h:mm A')}</div>
              </div>
              
              <div className="py-2 px-2">
                <Steps
                  current={getStatusIndex()}
                  items={[
                    { title: "Placed", icon: <FileTextOutlined /> },
                    { title: "Processing", icon: <SyncOutlined spin={order.status === "Processing"} /> },
                    { title: "Shipped", icon: <TruckOutlined /> },
                    { title: "Delivered", icon: <CheckCircleOutlined /> },
                  ]}
                  status={order.status === "Canceled" ? "error" : "process"}
                />
              </div>

               {/* Return Status Banner if applicable */}
              {(order.returnedStatus || order.refundStatus) && (
                 <div className="mt-8 bg-orange-50 rounded-lg p-4 border border-orange-100">
                    <h4 className="font-semibold text-orange-900 flex items-center gap-2 mb-3">
                      <UndoOutlined /> Return & Refund Status
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       <div className="bg-white p-3 rounded border border-orange-100">
                          <div className="text-xs text-gray-500">Return Status</div>
                          <div className="font-medium text-orange-700">{order.returnedStatus || 'None'}</div>
                       </div>
                       <div className="bg-white p-3 rounded border border-orange-100">
                          <div className="text-xs text-gray-500">Refund Status</div>
                          <div className="font-medium text-orange-700">{order.refundStatus || 'None'}</div>
                       </div>
                        <div className="bg-white p-3 rounded border border-orange-100">
                          <div className="text-xs text-gray-500">Total Refunded</div>
                          <div className="font-medium text-green-600">{formatPrice(order.totalRefuned || 0)}</div>
                       </div>
                    </div>
                 </div>
              )}
            </Card>

            {/* Quick Actions / Key Info */}
            <Card bordered={false} className="shadow-sm rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
                <div className="h-full flex flex-col justify-between">
                   <div>
                      <div className="text-indigo-200 text-sm mb-1">Total Amount</div>
                      <div className="text-3xl font-bold mb-4">{formatPrice(order.grandTotal)}</div>
                      
                      <div className="text-indigo-200 text-sm mb-1">Payment Status</div>
                      <Tag color={order.paymentStatus === "Paid" ? "success" : "warning"} className="border-none px-3 py-1">
                        {order.paymentStatus || "Unpaid"}
                      </Tag>
                   </div>

                   <div className="mt-6 pt-6 border-t border-indigo-500/30">
                      <div className="text-indigo-200 text-xs mb-2">Order Date</div>
                      <div className="font-medium">{dayjs(order.createdAt).format("MMMM D, YYYY")}</div>
                   </div>
                </div>
            </Card>
          </div>

          <Row gutter={[24, 24]}>
            {/* Left: Info */}
            <Col xs={24} lg={16}>
              <Card
                title={<span className="font-bold text-gray-800">Order Items</span>}
                bordered={false}
                className="shadow-sm rounded-xl h-full"
              >
                <Table
                  columns={columns}
                  dataSource={order.orderItems}
                  pagination={false}
                  // size="small"
                  scroll={{ x: true }}
                  rowKey="id"
                />
              
                {/* Delivery Address Box */}
                <div className="mt-8 grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100"> 
                   <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <EnvironmentOutlined className="text-indigo-500"/> Delivery Address
                      </h4>
                      <div className="text-gray-600 text-sm space-y-1">
                        <p className="font-medium text-gray-900">{order.shippingAddress?.name} ({order.shippingAddress?.type})</p>
                        <p>{order.shippingAddress?.address}</p>
                        <p>{order.shippingAddress?.phoneNo}</p>
                      </div>
                   </div>
                </div>
              </Card>
            </Col>

            {/* Right: Timeline & Payment */}
            <Col xs={24} lg={8}>
              <div className="space-y-6">
                <Card
                  title={<span className="font-bold text-gray-800">Payment Summary</span>}
                  bordered={false}
                  className="shadow-sm rounded-xl"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subTotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>+{formatPrice(order.shippingCharge)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>+{formatPrice(order.totalTax)}</span>
                    </div>
                    {+order.totalItemsDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Item Discount</span>
                        <span>-{formatPrice(order.totalItemsDiscount)}</span>
                      </div>
                    )}
                    {+order.couponDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount</span>
                        <span>-{formatPrice(order.couponDiscount)}</span>
                      </div>
                    )}
                    
                    <Divider className="my-3" />
                    
                    <div className="flex justify-between font-bold text-lg text-gray-900">
                      <span>Grand Total</span>
                      <span>{formatPrice(order.grandTotal)}</span>
                    </div>
                    
                    {order.due > 0 && (
                       <div className="flex justify-between text-orange-600 font-medium text-sm">
                        <span>Due Amount</span>
                        <span>{formatPrice(order.due)}</span>
                      </div>
                    )}

                    {/* Return Calculation */}
                    {(order.totalReturned > 0 || order.totalRefuned > 0) && (
                      <>
                        <Divider className="my-3" />
                        <div className="bg-red-50 p-3 rounded-lg space-y-2">
                           {order.totalReturned > 0 && (
                            <div className="flex justify-between text-gray-600 text-sm">
                              <span>Total Returned Value</span>
                              <span>{formatPrice(order.totalReturned)}</span>
                            </div>
                           )}
                            {order.totalRefuned > 0 && (
                             <div className="flex justify-between text-green-600 font-bold">
                                <span>Refunded Amount</span>
                                <span>{formatPrice(order.totalRefuned)}</span>
                              </div>
                            )}
                        </div>
                      </>
                    )}

                    {order.due > 0 &&
                      order.paymentStatus !== "Paid" &&
                      order.status !== "Canceled" &&
                      order.paymentMethod !== paymentMethods[0].value && (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <Select
                            size="large"
                            className="w-full mb-3"
                            placeholder="Select Payment Method"
                            onChange={setpayMethod}
                          >
                            {paymentMethods
                              .filter((m) => m.value !== paymentMethods[0].value)
                              .map((m: any) => (
                                <Select.Option key={m.value} value={m.value}>
                                  {m.label}
                                </Select.Option>
                              ))}
                          </Select>
                          <Button
                            type="primary"
                            block
                            size="large"
                            icon={<BankOutlined />}
                            onClick={handleOnlinePayment}
                            className="bg-green-600 hover:bg-green-700 h-10"
                          >
                            Pay {formatPrice(order.due)} Now
                          </Button>
                        </div>
                      )}
                  </div>
                </Card>

                <Card
                  title={<span className="font-bold text-gray-800">Timeline</span>}
                  bordered={false}
                  className="shadow-sm rounded-xl"
                  styles={{ body: { maxHeight: '400px', overflowY: 'auto' } }}
                >
                  <div className="relative border-l-2 border-indigo-100 ml-3 space-y-6 pb-2">
                    {(order.orderTrackings || []).map(
                      (track: any, idx: number) => (
                        <div key={idx} className="ml-6 relative group">
                          <div className="absolute -left-[31px] bg-white h-3 w-3 rounded-full border-2 border-indigo-500 group-hover:scale-125 transition-transform"></div>
                          <div className="text-sm font-semibold text-gray-900">
                            {track.status}
                          </div>
                          <div className="text-xs text-gray-500">
                            {dayjs(track.createdAt).format("MMM D, h:mm A")}
                          </div>
                          {track.location && (
                            <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <EnvironmentOutlined /> {track.location}
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </Card>

                {/* Actions */}
                {order.status === "Delivered" && (
                    <Card
                      bordered={false}
                      className="shadow-sm rounded-xl"
                    >
                       <Space direction="vertical" className="w-full">
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

                            <Button
                              block
                              danger
                              icon={<UndoOutlined />}
                              onClick={() =>
                                dispatch(
                                  setAction({
                                    type: ActionType.UPDATE,
                                    returnAllOrder: true,
                                    payload: { orderId: order.id },
                                  })
                                )
                              }
                            >
                              Return Full Order
                            </Button>
                            <NewReview />
                       </Space>
                    </Card>
                )}
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        tracker.trackingNo &&
        !loading && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-gray-500">
                No order found with tracking number <span className="font-mono font-bold text-gray-700">{tracker.trackingNo}</span>
              </span>
            }
            className="mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto"
          />
        )
      )}
      <ReturnRequestAllOrder />
      <ReturnRequestOrderItem />
    </div>
  );
}
