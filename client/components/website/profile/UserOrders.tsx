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
  SyncOutlined,
  InfoCircleOutlined
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
  Steps,
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
  const { formatPrice } = useCurrency();

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
      <span className="flex items-center gap-2">
        {status === "Pending" && <ClockCircleOutlined />}
        {status === "Processing" && <SyncOutlined spin />}
        {status === "Shipped" && <ShoppingOutlined />}
        {status === "Delivered" && <CheckCircleOutlined />}
        {status === "Canceled" && <CloseCircleOutlined />}
        <span className="hidden sm:inline">{status}</span>
      </span>
    ),
  }));

  const renderStatusBadge = (status: string) => {
    const color = getStatus(status);
    return (
      <Tag color={color} className="uppercase font-bold px-2 py-0.5 rounded-md text-[10px] sm:text-xs">
        {status}
      </Tag>
    );
  };

  return (
    <div className="p-0 sm:p-2 bg-transparent sm:bg-gray-50/50 min-h-[600px] rounded-xl">
      <Tabs
        defaultActiveKey="Pending"
        activeKey={tabKey}
        items={items}
        onChange={onChange}
        className="custom-tabs mb-4 sm:mb-6"
        type="card"
      />

      {global.loading.loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} loading bordered={false} className="shadow-sm rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Empty
          description="No orders found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              bordered={false}
              className="shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden border border-gray-100"
              styles={{ body: { padding: 0 } }}
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4 border-b border-gray-50 pb-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <Text className="text-gray-400 text-xs sm:text-sm uppercase font-bold tracking-wider">Order ID:</Text>
                      <Text strong className="text-sm sm:text-lg font-black text-gray-900">
                        {order.trackingNo}
                      </Text>
                      <div className="flex gap-1.5 flex-wrap">
                        {renderStatusBadge(order.status)}
                        {order.returnedStatus && (
                          <Tag color="orange" className="uppercase font-bold px-2 py-0.5 rounded-md text-[10px]">
                            {order.returnedStatus}
                          </Tag>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] sm:text-xs font-medium">
                      <CalendarOutlined />
                      {dayjs(order.createdAt).format("MMM D, YYYY · h:mm A")}
                    </div>
                  </div>
                  
                  <div className="lg:text-right flex lg:flex-col justify-between items-end lg:items-end w-full lg:w-auto">
                    <Text type="secondary" className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                      {Number(order.totalReturned) > 0 ? "Net Total" : "Total Amount"}
                    </Text>
                    <div className="flex flex-col items-end">
                      <Text strong className={`text-xl sm:text-2xl font-black ${Number(order.totalReturned) > 0 ? "text-orange-600" : "text-blue-600"}`}>
                        {formatPrice(Number(order.grandTotal) - Number(order.totalReturned))}
                      </Text>
                      {Number(order.totalReturned) > 0 && (
                        <Text delete type="secondary" className="text-[10px] sm:text-xs">
                          {formatPrice(order.grandTotal)}
                        </Text>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  {/* Product Thumbnails - Enhanced for mobile */}
                  <div className="w-full flex-1 overflow-x-auto pb-2 no-scrollbar scrollbar-hide">
                    <div className="flex gap-2 sm:gap-3">
                      {order.orderItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border border-gray-100 rounded-xl overflow-hidden bg-gray-50 group"
                        >
                          <Image
                            src={getImageUrl(item.product?.thumbnailImage)}
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-tl-lg font-bold">
                            x{item.qty}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <Button
                      type="primary"
                      className="flex-1 sm:w-32 h-10 rounded-xl font-bold text-xs"
                      onClick={() => handleOpenDetails(order)}
                    >
                      Details
                    </Button>
                    {["Pending", "Processing"].includes(order.status) && (
                      <Button
                        danger
                        className="flex-1 sm:w-32 h-10 rounded-xl font-bold text-xs"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Order Details Modal - Fully Responsive */}
      <Modal
        title={
          <div className="flex items-center justify-between mr-8">
            <span className="text-base sm:text-xl font-black text-gray-900">Order Details</span>
            <div className="hidden sm:flex gap-2">
              {selectedOrder && renderStatusBadge(selectedOrder.status)}
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)} className="rounded-xl font-bold">
            Close
          </Button>,
          selectedOrder && ["Pending", "Processing"].includes(selectedOrder.status) && (
            <Button key="cancel" danger className="rounded-xl font-bold" onClick={() => {
              handleCancelOrder(selectedOrder.id);
              setIsModalOpen(false);
            }}>
              Cancel Order
            </Button>
          )
        ]}
        width={800}
        centered
        className="premium-modal"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Mobile Status Badge */}
            <div className="sm:hidden flex justify-center py-2 border-b border-gray-50">
               {renderStatusBadge(selectedOrder.status)}
            </div>

            {/* Info Grid - Improved for mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-gray-50/50 p-4 sm:p-6 rounded-2xl border border-gray-100">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Delivery Info</h4>
                <div className="space-y-2">
                   <div className="flex justify-between sm:block">
                     <span className="text-gray-500 text-xs sm:text-sm">Receiver:</span>
                     <span className="font-bold text-gray-900 text-xs sm:text-sm block ml-2 sm:ml-0">{selectedOrder.deliveryMan?.name || "Not Assigned"}</span>
                   </div>
                   <div className="flex justify-between sm:block">
                     <span className="text-gray-500 text-xs sm:text-sm">Address:</span>
                     <span className="font-medium text-gray-700 text-xs sm:text-sm block ml-2 sm:ml-0 leading-snug">{selectedOrder.shippingAddress?.address}</span>
                   </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Payment & ID</h4>
                <div className="space-y-2">
                   <div className="flex justify-between sm:block">
                     <span className="text-gray-500 text-xs sm:text-sm">Order ID:</span>
                     <Text copyable className="font-bold text-xs sm:text-sm block ml-2 sm:ml-0">{selectedOrder.trackingNo}</Text>
                   </div>
                   <div className="flex justify-between sm:block">
                     <span className="text-gray-500 text-xs sm:text-sm">Status:</span>
                     <Space className="block ml-2 sm:ml-0">
                       <Tag className="rounded-md m-0 text-[10px]">{selectedOrder.paymentMethod}</Tag>
                       <Tag color={selectedOrder.paymentStatus === 'Paid' ? 'success' : 'warning'} className="rounded-md m-0 text-[10px]">{selectedOrder.paymentStatus}</Tag>
                     </Space>
                   </div>
                </div>
              </div>
            </div>

            {/* Items Table - Using custom card layout for mobile */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Order Items</h4>
              
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-hidden border border-gray-100 rounded-2xl">
                <Table
                  dataSource={selectedOrder.orderItems}
                  pagination={false}
                  rowKey="id"
                  size="small"
                  columns={[
                    {
                      title: "Product",
                      render: (_, item) => (
                        <div className="flex items-center gap-3 py-2">
                           <div className="relative w-12 h-12 rounded-lg border border-gray-100 overflow-hidden bg-gray-50">
                              <Image src={getImageUrl(item.product?.thumbnailImage)} alt="p" fill className="object-cover" />
                           </div>
                           <div className="flex flex-col">
                              <span className="font-bold text-gray-900 text-xs line-clamp-1">{item.product?.name}</span>
                              <span className="text-[10px] text-gray-400 font-medium">Qty: {item.qty}</span>
                           </div>
                        </div>
                      )
                    },
                    {
                      title: "Net Price",
                      align: 'right',
                      render: (_, item) => <span className="font-bold text-xs">{formatPrice(Number(item.unitPrice) - Number(item.totalDiscountAmount) + Number(item.taxAmount))}</span>
                    }
                  ]}
                />
              </div>

              {/* Mobile Card List for items */}
              <div className="sm:hidden space-y-3">
                {selectedOrder.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-50">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                      <Image src={getImageUrl(item.product?.thumbnailImage)} alt="p" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-gray-900 text-xs line-clamp-1 mb-1">{item.product?.name}</h5>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-400">Qty: {item.qty}</span>
                        <span className="text-[10px] font-black text-blue-600">{formatPrice(Number(item.unitPrice) * item.qty)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Section */}
            <div className="bg-gray-900 text-white p-6 rounded-2xl space-y-3">
                <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(Number(selectedOrder.subTotal))}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                  <span>Shipping Charge</span>
                  <span>+{formatPrice(Number(selectedOrder.shippingCharge))}</span>
                </div>
                {Number(selectedOrder.totalItemsDiscount) > 0 && (
                  <div className="flex justify-between text-xs sm:text-sm text-green-400">
                    <span>Discount</span>
                    <span>-{formatPrice(Number(selectedOrder.totalItemsDiscount))}</span>
                  </div>
                )}
                <Divider className="border-gray-800 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base font-black">Grand Total</span>
                  <span className="text-lg sm:text-2xl font-black text-blue-400">{formatPrice(Number(selectedOrder.grandTotal) - Number(selectedOrder.totalReturned))}</span>
                </div>
            </div>

            {/* Timeline - Simplified for mobile */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Order Timeline</h4>
              <Timeline
                className="mt-2"
                items={(selectedOrder.orderTrackings || []).map((t: any) => ({
                  color: t.status === selectedOrder.status ? "#2563eb" : "#d1d5db",
                  children: (
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold ${t.status === selectedOrder.status ? 'text-gray-900' : 'text-gray-400'}`}>{t.status}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{dayjs(t.createdAt).format("MMM D, h:mm A")}</span>
                    </div>
                  )
                }))}
              />
            </div>
          </div>
        )}
      </Modal>

      <CancelOrder />
    </div>
  );
};

export default UserOrders;
