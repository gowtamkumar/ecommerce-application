"use client";
import { ActionType } from "@/constants/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { deleteOrder, getOrders } from "@/lib/apis/orders";
import { getStatus } from "@/lib/utils/getStatus";
import {
  selectGlobal,
  setAction,
  setLoading,
  setSearchedColumn,
  setSearchText,
} from "@/redux/features/global/globalSlice";
import {
  CheckOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { TableColumnsType, TableColumnType, TabsProps } from "antd";
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Divider,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Timeline,
  Tooltip,
  Typography
} from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { FaAmazonPay } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const OrderStatusChange = dynamic(
  () => import("@/components/dashboard/order/OrderStatusUpdate"),
  { ssr: false }
);

const AssignDeliveryMan = dynamic(
  () => import("@/components/dashboard/order/AssignDeliveryMan"),
  { ssr: false }
);

interface DataType {
  key: React.Key;
  name: string;
  phoneNo: string;
  trackingNo: string;
}

type DataIndex = keyof DataType;

const Order = () => {
  const [tabKey, setTabKey] = useState("Pending");
  const [orders, setOrders] = useState([]);
  const [searchInput, setSearchInput] = useState(null) as any;
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const route = useRouter();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    (async () => {
      dispatch(setLoading({ loading: true }));
      const res = await getOrders({ status: tabKey });
      const newOrders = res.data.map((items: any, idx: number) => ({
        ...items,
        key: idx.toString(),
      }));
      setOrders(newOrders);
      dispatch(setLoading({ loading: false }));
    })();
  }, [dispatch, tabKey, global.action]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(setLoading({ delete: true }));
      await deleteOrder(id);
      setTimeout(async () => {
        dispatch(setLoading({ delete: false }));
        toast.success("Order deleted successfully");
        dispatch(setAction({}));
      }, 500);
    } catch (error: any) {
      console.log("v", error);
      toast.error(error);
    }
  };

  const onChange = (key: string) => {
    setTabKey(key);
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    dispatch(setSearchText(selectedKeys[0]));
    dispatch(setSearchedColumn(dataIndex));
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    dispatch(setSearchText(""));
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            setSearchInput(e.target.value);
          }}
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      global?.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[global.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const expandedRowRender = (value: any) => {
    const { dabitTotal, creditTotal } = value.payments.reduce(
      (acc: any, element: any) => {
        if (element.paymentType === "Credit")
          acc.creditTotal += +element.amount;
        if (element.paymentType === "Debit") acc.dabitTotal += +element.amount;
        return acc;
      },
      { dabitTotal: 0, creditTotal: 0 }
    );

    const paidAmount = dabitTotal - creditTotal;

    const childColumns: any = [
      {
        title: "Product",
        dataIndex: "product",
        key: "product",
        render: (v: { name: string }) => <span className="font-medium">{v.name}</span>,
      },
      {
        title: "Color",
        dataIndex: "productVariant",
        render: (v: any) => {
          return v?.color?.name ? (
            <Tag color="blue">{v.color.name}</Tag>
          ) : (
            <span className="text-gray-400">-</span>
          );
        },
      },
      {
        title: "Size",
        dataIndex: "productVariant",
        render: (v: any) => {
          return v?.size?.name ? (
            <Tag>{v.size.name}</Tag>
          ) : (
            <span className="text-gray-400">-</span>
          );
        },
      },
      {
        title: "Material",
        dataIndex: "material",
        key: "material",
        render: (text: string) => text || <span className="text-gray-400">-</span>,
      },
      {
        title: "Purchase Price",
        dataIndex: "purchasePrice",
        key: "purchasePrice",
        render: (value: number) => <span className="text-gray-600">{formatPrice(value)}</span>,
      },
      {
        title: "Unit Price",
        dataIndex: "unitPrice",
        key: "unitPrice",
        render: (value: number) => <span className="font-medium">{formatPrice(value)}</span>,
      },
      {
        title: "Tax",
        key: "taxAmount",
        dataIndex: "taxAmount",
        render: (value: number) => <span className="text-gray-600">{formatPrice(value)}</span>,
      },
      {
        title: "Discount",
        dataIndex: "totalDiscountAmount",
        key: "totalDiscountAmount",
        render: (value: number) =>
          value > 0 ? (
            <span className="text-red-600">-{formatPrice(value)}</span>
          ) : (
            <span className="text-gray-400">-</span>
          ),
      },
      {
        title: "Sale Price",
        key: "salePrice",
        render: (v: any) => {
          return (
            <span className="font-semibold text-green-600">
              {formatPrice(+v.unitPrice - +v.totalDiscountAmount + +v.taxAmount)}
            </span>
          );
        },
      },
      {
        title: "Qty",
        dataIndex: "qty",
        key: "qty",
        render: (text: number) => <span className="font-medium">×{text}</span>,
      },
      {
        title: "Ret. Qty",
        dataIndex: "approvedQty",
        key: "approvedQty",
        render: (text: number) => text > 0 ? <span className="text-orange-600">-{text}</span> : <span className="text-gray-400">0</span>,
      },
      {
        title: "Net Qty",
        key: "netQty",
        render: (v: any) => <span className="font-bold">{(v.qty || 0) - (v.approvedQty || 0)}</span>,
      },
      {
        title: "Sub Total",
        key: "subTotal",
        dataIndex: "subTotal",
        render: (value: number, record: any) => {
          const netQty = (record.qty || 1) - (record.approvedQty || 0);
          const effectiveSubTotal = (Number(value) / (record.qty || 1)) * netQty;
          return <span className="font-bold">{formatPrice(effectiveSubTotal)}</span>;
        },
      },
    ];

    return (
      <div className="p-2 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Details Card */}
            <Card className="shadow-sm" variant="borderless">
              <div className="space-y-3">
                {value.status === "Canceled" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <Text strong className="text-red-700">Cancellation Reason: </Text>
                    <Text className="text-red-600">{value.cancelResson}</Text>
                  </div>
                )}

                <Descriptions column={1} size="small">
                  <Descriptions.Item label={<Text strong>Order No</Text>}>
                    <Text strong copyable className="text-lg">
                      {value.trackingNo}
                    </Text>
                  </Descriptions.Item>
                  {value.tranId && (
                    <Descriptions.Item label={<Text strong>Transaction ID</Text>}>
                      <Text copyable className="text-lg">
                        {value.tranId}
                      </Text>
                    </Descriptions.Item>
                  )}
                  {value.returnedStatus && (
                    <Descriptions.Item label={<Text strong>Return Status</Text>}>
                      <Tag color="orange">{value.returnedStatus}</Tag>
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label={<Text strong><EnvironmentOutlined /> Shipping Address</Text>}>
                    <Text>{value.shippingAddress?.address}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={<Text strong><UserOutlined /> Delivery Man</Text>}>
                    <Text>{value?.deliveryMan?.name || "Not assigned"}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </Card>

            {/* Order Items Card */}
            <Card title={<Title level={5} className="!mb-0">Order Items</Title>} className="shadow-sm" variant="borderless">
              <Table
                columns={childColumns}
                size="small"
                scroll={{ x: "max-content" }}
                dataSource={value.orderItems}
                pagination={false}
                className="border border-gray-100 rounded-lg overflow-hidden"
              />
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Order Timeline Card */}
            <Card title={<Title level={5} className="!mb-0">Order History</Title>} className="shadow-sm" variant="borderless">
              <Timeline
                items={(value?.orderTrackings || []).map(
                  (timeline: any, idx: number) => ({
                    dot: <ClockCircleOutlined className="text-blue-500" />,
                    color: "blue",
                    children: (
                      <div key={idx} className="pb-2">
                        <Text strong className="block">{timeline.status}</Text>
                        <Text type="secondary" className="text-xs block">
                          {dayjs(timeline.createdAt).format("MMMM D, YYYY h:mm A")}
                        </Text>
                        {timeline.location && (
                          <Text type="secondary" className="text-xs block">
                            <EnvironmentOutlined /> {timeline.location}
                          </Text>
                        )}
                      </div>
                    ),
                  })
                )}
              />
            </Card>

            {/* Payment Summary Card */}
            <Card title={<Title level={5} className="!mb-0">Payment Summary</Title>} className="shadow-sm" variant="borderless">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Text type="secondary">Total Qty</Text>
                  <Text strong>{value.totalQty}</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text type="secondary">Net Amount</Text>
                  <Text strong>{formatPrice(+value.subTotal)}</Text>
                </div>

                {+value.totalItemsDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <Text type="secondary">Product Discount</Text>
                    <Text className="text-red-600">-{formatPrice(value.totalItemsDiscount)}</Text>
                  </div>
                )}

                {+value.couponDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <Text type="secondary">Coupon Discount</Text>
                    <Text className="text-red-600">-{formatPrice(value.couponDiscount)}</Text>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <Text type="secondary">Tax Amount</Text>
                  <Text>{formatPrice(value.totalTax)}</Text>
                </div>

                {+value.totalReturned > 0 && (
                  <div className="flex justify-between items-center">
                    <Text type="secondary" className="text-orange-600 font-bold">Returned Amount</Text>
                    <Text className="text-orange-600 font-bold">-{formatPrice(value.totalReturned)}</Text>
                  </div>
                )}

                {paidAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <Text type="secondary">Paid Amount</Text>
                    <Text className="text-green-600">{formatPrice(paidAmount)}</Text>
                  </div>
                )}

                {+value.shippingCharge > 0 && (
                  <div className="flex justify-between items-center">
                    <Text type="secondary">Shipping</Text>
                    <Text>{formatPrice(value.shippingCharge)}</Text>
                  </div>
                )}

                <Divider className="!my-3" />

                <div className="flex justify-between items-center bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-lg">
                  <Text strong className="text-lg">Balance Due</Text>
                  <Text strong className="text-lg text-green-600">
                    {formatPrice(+value.grandTotal - +value.totalReturned - paidAmount)}
                  </Text>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    );
  };

  const columns: TableColumnsType<DataType> = [
    {
      ...getColumnSearchProps("trackingNo"),
      title: "Tracking No",
      dataIndex: "trackingNo",
      key: "trackingNo",
      render: (value) => (
        <Text strong copyable className="text-lg">
          {value}
        </Text>

      ),
    },

    {
      title: "Phone No",
      dataIndex: "phoneNo",
      key: "phoneNo",
      render: (value) => <span className="text-gray-600">{value?.phoneNo}</span>,
    },

    {
      title: "Customer",
      dataIndex: "user",
      key: "user",
      render: (customer) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-gray-400" />
          <span className="font-medium">{customer?.name}</span>
        </div>
      ),
    },

    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (value) => <Tag color="blue">{value}</Tag>,
    },

    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span className="text-gray-600">
          {date && dayjs(date).format("DD-MM-YYYY h:mm A")}
        </span>
      ),
    },
    {
      title: "P. Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={status === "Paid" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (orderStatus) => (
        <Tag color={getStatus(orderStatus.status)} className="font-medium">
          {orderStatus.status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 200,
      render: (value) => (
        <div className="flex gap-2 justify-end">
          <Tooltip title="Payment">
            <Button
              size="small"
              icon={<FaAmazonPay />}
              className="hover:!bg-blue-50 hover:!text-blue-600"
              onClick={() => {
                route.push(`/dashboard/payments/new?trackingNo=${value.trackingNo}`);
              }}
            />
          </Tooltip>

          <Tooltip title="Assign Delivery Man">
            <Button
              size="small"
              icon={<UserAddOutlined />}
              className="hover:!bg-purple-50 hover:!text-purple-600"
              onClick={() =>
                dispatch(
                  setAction({
                    assign: true,
                    payload: { id: value.id },
                  })
                )
              }
            />
          </Tooltip>

          <Tooltip title="Update Status">
            <Button
              size="small"
              icon={<CheckOutlined />}
              className="hover:!bg-green-50 hover:!text-green-600"
              onClick={() =>
                dispatch(
                  setAction({
                    type: ActionType.UPDATE,
                    orderStatusUpdate: true,
                    payload: value,
                  })
                )
              }
              disabled={
                value.status === "Delivered"
              }
            />
          </Tooltip>

          <Popconfirm
            title={
              <span>
                Are you sure <span className="font-bold text-red-600">delete</span>{" "}
                this Order?
              </span>
            }
            onConfirm={() => handleDelete(value.id)}
            placement="left"
            okText="Yes"
            okType="danger"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Tooltip title="Delete Order">
              <Button
                size="small"
                danger
                loading={global.loading?.delete}
                icon={<DeleteOutlined />}
                className="hover:!bg-red-50"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "Pending",
      label: (
        <span className="flex items-center gap-2">
          Pending
          <Badge count={tabKey === "Pending" ? orders.length : 0} showZero={false} />
        </span>
      ),
    },
    {
      key: "Processing",
      label: (
        <span className="flex items-center gap-2">
          Processing
          <Badge count={tabKey === "Processing" ? orders.length : 0} showZero={false} />
        </span>
      ),
    },
    {
      key: "Shipped",
      label: (
        <span className="flex items-center gap-2">
          Shipped
          <Badge count={tabKey === "Shipped" ? orders.length : 0} showZero={false} />
        </span>
      ),
    },
    {
      key: "Canceled",
      label: (
        <span className="flex items-center gap-2">
          Canceled
          <Badge count={tabKey === "Canceled" ? orders.length : 0} showZero={false} />
        </span>
      ),
    },

    {
      key: "Delivered",
      label: (
        <span className="flex items-center gap-2">
          Delivered
          <Badge count={tabKey === "Delivered" ? orders.length : 0} showZero={false} />
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <Title level={2} className="!mb-1">
          Orders Management
        </Title>
        <Text type="secondary">
          Manage and track all customer orders across different statuses
        </Text>
      </div>

      {/* Tabs & Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <Title level={5} className="!mb-0">Order List</Title>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Filter by Status:</span>
            <Select
              defaultValue="Pending"
              value={tabKey}
              onChange={onChange}
              style={{ width: 200 }}
              options={items.map((item: any) => ({
                label: item.label,
                value: item.key,
              }))}
            />
          </div>
        </div>
        <Table
          scroll={{ x: "auto" }}
          dataSource={orders}
          columns={columns}
          expandable={{ expandedRowRender }}
          loading={global.loading.loading}
          pagination={{
            pageSize: 10,
            position: ["bottomRight"],
            showSizeChanger: true,
          }}
          size="middle"
          className="modern-table"
          rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
        />
      </Card>

      {global.action.orderStatusUpdate && <OrderStatusChange />}
      {global.action.assign && <AssignDeliveryMan />}
    </div>
  );
};

export default Order;
