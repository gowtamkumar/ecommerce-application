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
  UndoOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
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
  Typography
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
        setTimeout(() => {
          setOrder(result.data);
          setLoading(false);
        }, 800);
      } else {
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
        <div className="flex flex-col gap-1 min-w-[200px]">
          <Text strong className="text-sm">{v.name}</Text>
          {record.requestedQty > 0 && (
            <Tag color="orange" className="w-fit text-[10px]">Return Requested: {record.requestedQty}</Tag>
          )}
          {record.approvedQty > 0 && (
            <Tag color="blue" className="w-fit text-[10px]">Return Approved: {record.approvedQty}</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Price",
      align: "right" as const,
      render: (_: any, record: any) => <span className="text-xs">{formatPrice(+record.unitPrice + +record.taxAmount)}</span>,
    },
    {
      title: "Qty",
      dataIndex: "qty",
      align: "center" as const,
      render: (val: any) => <span className="text-xs">{val}</span>
    },
    {
      title: "Total",
      align: "right" as const,
      render: (_: any, record: any) => <Text strong className="text-xs">{formatPrice(record.subTotal)}</Text>,
    },
  ];

  const getStatusIndex = () => {
    if (!order.status) return 0;
    const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
    if (order.status === "Returned") return 4;
    const idx = statuses.indexOf(order.status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 pb-12">
      {/* Search Section */}
      <div className="text-center mb-8 sm:mb-12 pt-4 sm:pt-8">
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">
          Track Your Order
        </h1>
        <p className="text-gray-500 text-xs sm:text-base mb-6 sm:mb-8 max-w-lg mx-auto px-4">
          Verify status, manage returns, and view delivery updates.
        </p>

        <Card
          bordered={false}
          className="max-w-2xl mx-auto shadow-sm rounded-3xl bg-white border border-gray-100"
        >
          <Form
            form={form}
            onFinish={handleOrderTracking}
            layout="vertical"
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <Form.Item
                name="trackingNo"
                className="flex-grow mb-0"
                rules={[{ required: true, message: "Enter tracking number" }]}
              >
                <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  placeholder="Order ID (e.g. ORD-2023...)"
                  size="large"
                  className="rounded-xl h-12"
                />
              </Form.Item>
              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loading}
                  icon={<TruckOutlined />}
                  className="w-full sm:w-auto rounded-xl font-bold h-12 px-8"
                >
                  Track Now
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Card>
      </div>

      {loading ? (
        <Card loading bordered={false} className="shadow-sm rounded-3xl" />
      ) : order.trackingNo ? (
        <div className="animate-in fade-in duration-500 space-y-6 sm:space-y-8">

          {/* Order Status & Summary Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card bordered={false} className="lg:col-span-2 shadow-sm rounded-3xl overflow-hidden border border-gray-100">
              <div className="bg-gray-50 -m-6 mb-6 p-4 px-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="font-black text-gray-900 text-sm sm:text-base">Status: <span className="text-blue-600">{order.status}</span></div>
                <div className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">Updated: {dayjs(order.updatedAt).format('MMM D, h:mm A')}</div>
              </div>

              <div className="py-4 overflow-x-auto no-scrollbar scrollbar-hide">
                <div className="min-w-[400px]">
                  <Steps
                    current={getStatusIndex()}
                    size="small"
                    items={[
                      { title: "Placed", icon: <FileTextOutlined /> },
                      { title: "Process", icon: <SyncOutlined spin={order.status === "Processing"} /> },
                      { title: "Shipped", icon: <TruckOutlined /> },
                      { title: "Done", icon: <CheckCircleOutlined /> },
                    ]}
                    status={order.status === "Canceled" ? "error" : "process"}
                  />
                </div>
              </div>

              {/* Return Status Banner */}
              {(order.returnedStatus || order.refundStatus) && (
                <div className="mt-8 bg-orange-50/50 rounded-2xl p-4 sm:p-6 border border-orange-100">
                  <h4 className="font-black text-orange-900 flex items-center gap-2 mb-4 text-xs uppercase tracking-widest">
                    <UndoOutlined /> Return & Refund Status
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-xl border border-orange-100">
                      <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Return</div>
                      <div className="font-bold text-orange-700 text-sm">{order.returnedStatus || 'None'}</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-orange-100">
                      <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Refund</div>
                      <div className="font-bold text-orange-700 text-sm">{order.refundStatus || 'None'}</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-orange-100">
                      <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Refunded</div>
                      <div className="font-bold text-green-600 text-sm">{formatPrice(order.totalRefuned || 0)}</div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card bordered={false} className="shadow-lg rounded-3xl bg-gray-900 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full opacity-20 blur-3xl -mr-16 -mt-16"></div>
               <div className="relative z-10 h-full flex flex-col justify-between py-2">
                <div>
                  <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Grand Total</div>
                  <div className="text-3xl font-black mb-4 text-blue-400">{formatPrice(order.grandTotal)}</div>

                  <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Payment</div>
                  <Tag color={order.paymentStatus === "Paid" ? "success" : "warning"} className="border-none px-4 py-1 rounded-lg font-black text-[10px]">
                    {order.paymentStatus || "Unpaid"}
                  </Tag>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800">
                  <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Order Date</div>
                  <div className="font-bold text-sm">{dayjs(order.createdAt).format("MMM D, YYYY")}</div>
                </div>
              </div>
            </Card>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card
                title={<span className="font-black text-gray-900 text-sm uppercase tracking-widest">Order Items</span>}
                bordered={false}
                className="shadow-sm rounded-3xl border border-gray-100 h-full"
              >
                {/* Desktop Table View */}
                <div className="hidden sm:block">
                  <Table
                    columns={columns}
                    dataSource={order.orderItems}
                    pagination={false}
                    scroll={{ x: true }}
                    rowKey="id"
                    size="small"
                  />
                </div>

                {/* Mobile Item List */}
                <div className="sm:hidden space-y-4">
                  {order.orderItems.map((item: any, idx: number) => (
                    <div key={idx} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <Text strong className="text-xs flex-1 pr-2">{item.product?.name}</Text>
                        <Text strong className="text-xs text-blue-600">{formatPrice(item.subTotal)}</Text>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                         <span>Qty: {item.qty}</span>
                         <span>{formatPrice(item.unitPrice)} / unit</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
                    <EnvironmentOutlined className="text-blue-600" /> Delivery
                  </h4>
                  <div className="text-gray-600 text-sm space-y-2">
                    <p className="font-black text-gray-900 text-sm">{order.shippingAddress?.name} <Tag className="ml-2 rounded-md">{order.shippingAddress?.type}</Tag></p>
                    <p className="italic text-xs">{order.shippingAddress?.address}</p>
                    <p className="font-bold text-xs">{order.shippingAddress?.phoneNo}</p>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <div className="space-y-6">
                <Card
                  title={<span className="font-black text-gray-900 text-sm uppercase tracking-widest">Payment Summary</span>}
                  bordered={false}
                  className="shadow-sm rounded-3xl border border-gray-100"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subTotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                      <span>Shipping</span>
                      <span>+{formatPrice(order.shippingCharge)}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                      <span>Tax</span>
                      <span>+{formatPrice(order.totalTax || 0)}</span>
                    </div>
                    {+order.totalItemsDiscount > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm text-green-600 font-medium">
                        <span>Discount</span>
                        <span>-{formatPrice(order.totalItemsDiscount)}</span>
                      </div>
                    )}
                    
                    <Divider className="my-4" />

                    <div className="flex justify-between font-black text-base sm:text-lg text-gray-900">
                      <span>Grand Total</span>
                      <span className="text-blue-600">{formatPrice(order.grandTotal)}</span>
                    </div>

                    <div className="flex justify-between text-xs sm:text-sm text-gray-400 font-bold">
                      <span>Paid</span>
                      <span>{formatPrice(order.paid || 0)}</span>
                    </div>

                    {order.due > 0 && (
                      <div className="flex justify-between text-orange-600 font-black text-sm pt-2">
                        <span>Balance Due</span>
                        <span>{formatPrice(order.due)}</span>
                      </div>
                    )}

                    {order.due > 0 && order.paymentStatus !== "Paid" && order.status !== "Canceled" && order.paymentMethod !== paymentMethods[0].value && (
                      <div className="mt-6 space-y-3">
                        <Select
                          size="large"
                          className="w-full"
                          placeholder="Payment Method"
                          onChange={setpayMethod}
                          options={paymentMethods.filter(m => m.value !== paymentMethods[0].value)}
                        />
                        <Button
                          type="primary"
                          block
                          size="large"
                          icon={<BankOutlined />}
                          onClick={handleOnlinePayment}
                          className="h-12 rounded-xl font-black bg-blue-600"
                        >
                          Pay {formatPrice(order.due)}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>

                <Card
                  title={<span className="font-black text-gray-900 text-sm uppercase tracking-widest">History</span>}
                  bordered={false}
                  className="shadow-sm rounded-3xl border border-gray-100"
                  styles={{ body: { maxHeight: '350px', overflowY: 'auto' } }}
                >
                  <Timeline
                    className="mt-2 ml-2"
                    items={(order.orderTrackings || []).map((track: any) => ({
                      color: track.status === order.status ? "#2563eb" : "#e5e7eb",
                      children: (
                        <div className="pb-4">
                          <div className={`text-xs font-black ${track.status === order.status ? 'text-gray-900' : 'text-gray-400'}`}>
                            {track.status}
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium">
                            {dayjs(track.createdAt).format("MMM D, h:mm A")}
                          </div>
                        </div>
                      )
                    }))}
                  />
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        tracker.trackingNo && !loading && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-gray-500 text-xs sm:text-sm">
                No order found: <span className="font-black text-gray-900">{tracker.trackingNo}</span>
              </span>
            }
            className="mt-12 bg-white p-12 rounded-3xl border border-gray-100 max-w-lg mx-auto shadow-sm"
          />
        )
      )}
      <ReturnRequestAllOrder />
      <ReturnRequestOrderItem />
    </div>
  );
}
