"use client";
import { ActionType } from "@/constants/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { getUserOrders } from "@/lib/apis/orders";
import { getStatus } from "@/lib/utils/getStatus";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { errorNotification } from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ShoppingOutlined,
  SyncOutlined
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Modal,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Timeline,
  Typography,
} from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CancelOrder from "./CancelOrder";

const { Text, Title } = Typography;

interface DataType {
  id: string;
  trackingNo: string;
  status: string;
  createdAt: string;
  grandTotal: number;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress?: {
    address: string;
  };
  deliveryMan?: {
    name: string;
  };
  orderTrackings?: any[];
  orderItems: any[];
  subTotal: number;
  totalItemsDiscount: number;
  couponDiscount: number;
  shippingCharge: number;
  payments: any[];
  totalQty: number;
  totalReturned: number;
  returnedStatus: string;
}

const UserOrders = () => {
  const [tabKey, setTabKey] = useState("Pending");
  const [orders, setOrders] = useState<DataType[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DataType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const { formatPrice } = useCurrency()

  const fetchData = useCallback(
    async (status: string) => {
      dispatch(setLoading({ loading: true }));
      try {
        const res = await getUserOrders(status === "All" ? "" : status);
        if (!res.success) {
          errorNotification({ message: res.message });
          return;
        }
        setOrders(res.data || []);
      } catch (error: any) {
        errorNotification({ message: error?.message });
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchData(tabKey);
  }, [fetchData, tabKey]);

  const onChange = (key: string) => {
    setTabKey(key);
  };

  const handleOpenDetails = (order: DataType) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCancelOrder = (orderId: string) => {
    dispatch(
      setAction({
        type: ActionType.UPDATE,
        cancelOrder: true,
        payload: { id: orderId, status: "Canceled" },
      })
    );
  };

  const items: TabsProps["items"] = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Canceled",
  ].map((status) => ({
    key: status,
    label: (
      <span>
        {status === "Pending" && <ClockCircleOutlined className="mr-2" />}
        {status === "Processing" && <SyncOutlined spin className="mr-2" />}
        {status === "Shipped" && <ShoppingOutlined className="mr-2" />}
        {status === "Delivered" && <CheckCircleOutlined className="mr-2" />}
        {status === "Canceled" && <CloseCircleOutlined className="mr-2" />}
        {status}
      </span>
    ),
  }));

  // Helper to render status badge
  const renderStatusBadge = (status: string) => {
    const color = getStatus(status);
    return (
      <Tag color={color} className="uppercase font-bold px-2 py-0.5 rounded-md">
        {status}
      </Tag>
    );
  };

  console.log("orders", orders);


  return (
    <div className="p-2 md:p-4 bg-gray-50/50 min-h-[600px] rounded-xl">
      <Tabs
        defaultActiveKey="Pending"
        activeKey={tabKey}
        items={items}
        onChange={onChange}
        className="custom-tabs mb-6 "
        type="card"
      />

      {global.loading.loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} loading variant="borderless" className="shadow-sm" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Empty
          description="No orders found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="bg-white p-10 rounded-xl shadow-sm"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              variant="borderless"
              className="shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              style={{ padding: 0 }}
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 border-b border-gray-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <Text className="text-gray-500">Order ID:</Text>
                      <Text strong copyable className="text-lg">
                        {order.trackingNo}
                      </Text>
                      {renderStatusBadge(order.status)}
                      {order.returnedStatus && (
                        <Tag color="orange" className="uppercase font-bold px-2 py-0.5 rounded-md">
                          {order.returnedStatus}
                        </Tag>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <CalendarOutlined />
                      {dayjs(order.createdAt).format("MMMM D, YYYY h:mm A")}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Text type="secondary" className="block text-xs">
                        {Number(order.totalReturned) > 0 ? "Net Amount" : "Total Amount"}
                      </Text>
                      <Text strong className={`text-xl md:text-2xl ${Number(order.totalReturned) > 0 ? "text-orange-600" : "text-global-primary"}`}>
                        {formatPrice(Number(order.grandTotal) - Number(order.totalReturned))}
                      </Text>
                      {Number(order.totalReturned) > 0 && (
                        <div className="text-[10px] text-gray-400 line-through">
                          {formatPrice(order.grandTotal)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Product Thumbnails */}
                  <div className="flex-1 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex gap-3">
                      {order.orderItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="relative w-24 h-24 flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 group"
                        >
                          <Image
                            src={getImageUrl(item.product?.thumbnailImage)}
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute bottom-0 right-0 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-tl-md">
                            x{item.qty}{Number(item.approvedQty) > 0 && ` (-${item.approvedQty})`}
                          </div>
                          {Number(item.approvedQty) > 0 && (
                            <div className="absolute top-0 right-0 bg-orange-500 text-white text-[8px] px-1 font-bold">
                              RETURNED
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col justify-end gap-3 mt-4 lg:mt-0 min-w-[150px]">
                    <Button
                      type="primary"
                      onClick={() => handleOpenDetails(order)}
                    >
                      View Details
                    </Button>
                    {["Pending", "Processing"].includes(order.status) && (
                      <Button
                        danger
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between mr-8">
            <span className="text-xl font-bold">Order Details</span>
            <Space>
              {selectedOrder && renderStatusBadge(selectedOrder.status)}
              {selectedOrder?.returnedStatus && (
                <Tag color="orange" className="uppercase font-bold px-2 py-0.5 rounded-md">
                  {selectedOrder.returnedStatus}
                </Tag>
              )}
            </Space>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>,
          selectedOrder && ["Pending", "Processing"].includes(selectedOrder.status) && (
            <Button key="cancel" danger onClick={() => {
              handleCancelOrder(selectedOrder.id);
              setIsModalOpen(false);
            }}>
              Cancel Order
            </Button>
          )
        ]}
        width={900}
        centered
      >
        {selectedOrder && (
          <div className="mt-4">
            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-gray-50 p-4 rounded-lg">
              <div>
                <Descriptions title="Delivery Info" column={1} size="small">
                  <Descriptions.Item label={<span className="text-gray-500">Receiver</span>}>
                    <span className="font-semibold">{selectedOrder.deliveryMan?.name || "Not Assigned"}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label={<span className="text-gray-500">Address</span>}>
                    {selectedOrder.shippingAddress?.address}
                  </Descriptions.Item>
                  <Descriptions.Item label={<span className="text-gray-500">Phone</span>}>
                    {/* Assuming phone is available or reusing mock */}
                    N/A
                  </Descriptions.Item>
                </Descriptions>
              </div>
              <div>
                <Descriptions title="Order Info" column={1} size="small">
                  <Descriptions.Item label={<span className="text-gray-500">Order ID</span>}>
                    <Text copyable>{selectedOrder.trackingNo}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={<span className="text-gray-500">Payment</span>}>
                    <Space>
                      <Tag>{selectedOrder.paymentMethod}</Tag>
                      <Tag color={selectedOrder.paymentStatus === 'Paid' ? 'success' : 'warning'}>{selectedOrder.paymentStatus}</Tag>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label={<span className="text-gray-500">Date</span>}>
                    {dayjs(selectedOrder.createdAt).format("MMM D, YYYY h:mm A")}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>

            {/* Items Table */}
            <Table
              dataSource={selectedOrder.orderItems}
              pagination={false}
              rowKey="id"
              scroll={{ x: 600 }}
              className="mb-8 border rounded-lg overflow-hidden"
              columns={[
                {
                  title: "Product",
                  dataIndex: "product",
                  key: "product",
                  width: 250,
                  render: (_, item: any) => (
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded border flex-shrink-0 bg-gray-100">
                        <Image
                          src={getImageUrl(item.product?.thumbnailImage)}
                          alt="Product"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm line-clamp-2">{item.product?.name}</span>
                        <span className="text-xs text-gray-400">{item.productVariant?.size?.name}, {item.productVariant?.color?.name}</span>
                      </div>
                    </div>
                  )
                },
                {
                  title: "Unit Price",
                  align: 'right',
                  render: (_, item: any) => <span>{formatPrice(Number(item.unitPrice) - Number(item.totalDiscountAmount) + Number(item.taxAmount))}</span>
                },
                {
                  title: "Qty",
                  align: "center",
                  render: (_, item: any) => (
                    <div className="flex flex-col items-center">
                      <span>{item.qty}</span>
                      {Number(item.approvedQty) > 0 && (
                        <span className="text-orange-500 text-[10px]">-{item.approvedQty} ret</span>
                      )}
                    </div>
                  )
                },
                {
                  title: "Net Total",
                  align: "right",
                  render: (_, item: any) => {
                    const netQty = Number(item.qty) - Number(item.approvedQty || 0);
                    const netTotal = (Number(item.subTotal) / Number(item.qty)) * netQty;
                    return <span className="font-medium">{formatPrice(netTotal)}</span>;
                  }
                }
              ]}
            />

            {/* Summary & Timeline */}
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Title level={5}>Order Timeline</Title>
                <div className="mt-4 pl-2">
                  <Timeline
                    items={(selectedOrder.orderTrackings || []).map((t: any) => ({
                      color: t.status === selectedOrder.status ? "var(--global-primary)" : "gray",
                      children: (
                        <>
                          <Text strong>{t.status}</Text>
                          <br />
                          <Text type="secondary" className="text-xs">{dayjs(t.createdAt).format("MMM D, h:mm A")}</Text>
                        </>
                      )
                    }))}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="bg-global-primary/5 p-6 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <Text type="secondary">Subtotal</Text>
                    <Text>{formatPrice(Number(selectedOrder.subTotal))}</Text>
                  </div>
                  <div className="flex justify-between mb-2">
                    <Text type="secondary">Tax / VAT</Text>
                    <Text>Included</Text>
                  </div>
                  <div className="flex justify-between mb-2">
                    <Text type="secondary">Shipping</Text>
                    <Text>+{formatPrice(Number(selectedOrder.shippingCharge))}</Text>
                  </div>
                  {Number(selectedOrder.totalItemsDiscount) > 0 && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <Text type="success">Discount</Text>
                      <Text type="success">-{formatPrice(Number(selectedOrder.totalItemsDiscount))}</Text>
                    </div>
                  )}
                  {Number(selectedOrder.totalReturned) > 0 && (
                    <div className="flex justify-between mb-2 text-orange-600 font-semibold">
                      <Text type="warning">Returned Amount</Text>
                      <Text type="warning">-{formatPrice(Number(selectedOrder.totalReturned))}</Text>
                    </div>
                  )}
                  <Divider className="my-3" />
                  <div className="flex justify-between items-center">
                    <Text strong className="text-lg">Net Grand Total</Text>
                    <Text strong className="text-xl text-global-primary">{formatPrice(Number(selectedOrder.grandTotal) - Number(selectedOrder.totalReturned))}</Text>
                  </div>
                  {(selectedOrder.payments?.reduce((acc: number, p: any) => p.paymentType === 'Debit' ? acc + Number(p.amount) : acc - Number(p.amount), 0) || 0) < (Number(selectedOrder.grandTotal) - Number(selectedOrder.totalReturned)) && (
                    <div className="mt-2 text-right">
                      <Tag color="warning">Balance Due</Tag>
                    </div>
                  )}
                </div>
              </Col>
            </Row>


          </div>
        )}
      </Modal>

      <CancelOrder />
    </div>
  );
};

export default UserOrders;
