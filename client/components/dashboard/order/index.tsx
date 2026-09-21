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
    DeleteOutlined,
    EyeOutlined,
    PrinterOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
    UserOutlined
} from "@ant-design/icons";
import type { TableColumnsType, TableColumnType, TabsProps } from "antd";
import {
    Badge,
    Button,
    Card,
    Input,
    Pagination,
    Popconfirm,
    Space,
    Table,
    Tabs,
    Tag,
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
import OrderDrawer from "./OrderDrawer";
import OrderInvoiceModal from "./OrderInvoiceModal";

const { Title, Text } = Typography;

const OrderStatusChange = dynamic(
  () => import("@/components/dashboard/order/OrderStatusUpdate"),
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
  const [tabKey, setTabKey] = useState("All");
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchInput, setSearchInput] = useState(null) as any;
  const [selectedOrderForDrawer, setSelectedOrderForDrawer] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const route = useRouter();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    (async () => {
      dispatch(setLoading({ loading: true }));
      try {
        const res = await getOrders({
          status: tabKey === "All" ? undefined : tabKey,
          page: currentPage,
          limit: pageSize,
        });
        if (res?.data) {
          const newOrders = (res.data || []).map((items: any, idx: number) => ({
            ...items,
            key: items.id || idx.toString(),
          }));
          setOrders(newOrders);
          setTotalOrders(res.total !== undefined ? res.total : newOrders.length);
        } else {
          setOrders([]);
          setTotalOrders(0);
        }
      } catch (error) {
        console.error("Failed to load orders", error);
        setOrders([]);
        setTotalOrders(0);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    })();
  }, [dispatch, tabKey, currentPage, pageSize, global.action]);

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
    setCurrentPage(1);
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
          value={selectedKeys[0] as string}
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
    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
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
        <div className="flex gap-1.5 justify-end">
          <Tooltip title="View Order Details">
            <Button
              size="small"
              icon={<EyeOutlined />}
              className="hover:bg-blue-50 hover:text-blue-600"
              onClick={() => {
                setSelectedOrderForDrawer(value);
                setDrawerOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Print Invoice">
            <Button
              size="small"
              icon={<PrinterOutlined />}
              className="hover:bg-gray-100 hover:text-gray-900"
              onClick={() => {
                setSelectedOrderForInvoice(value);
                setInvoiceOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Payment">
            <Button
              size="small"
              icon={<FaAmazonPay />}
              className="hover:bg-blue-50 hover:text-blue-600"
              onClick={() => {
                route.push(`/dashboard/payments/new?trackingNo=${value.trackingNo}`);
              }}
            />
          </Tooltip>
          <Tooltip title="Update Status">
            <Button
              size="small"
              icon={<CheckOutlined />}
              className="hover:bg-green-50 hover:text-green-600"
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
                className="hover:bg-red-50"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "All",
      label: (
        <span className="flex items-center gap-2">
          All Orders
          <Badge count={tabKey === "All" ? totalOrders : 0} showZero={false} />
        </span>
      ),
    },
    {
      key: "Pending",
      label: (
        <span className="flex items-center gap-2">
          Pending
          <Badge count={tabKey === "Pending" ? totalOrders : 0} showZero={false} />
        </span>
      ),
    },
    {
      key: "Processing",
      label: (
        <span className="flex items-center gap-2">
          Processing
          <Badge count={tabKey === "Processing" ? totalOrders : 0} showZero={false} />
        </span>
      ),
    },
    {
      key: "Shipped",
      label: (
        <span className="flex items-center gap-2">
          Shipped
          <Badge count={tabKey === "Shipped" ? totalOrders : 0} showZero={false} />
        </span>
      ),
    },
    {
      key: "Canceled",
      label: (
        <span className="flex items-center gap-2">
          Canceled
          <Badge count={tabKey === "Canceled" ? totalOrders : 0} showZero={false} />
        </span>
      ),
    },
    {
      key: "Delivered",
      label: (
        <span className="flex items-center gap-2">
          Delivered
          <Badge count={tabKey === "Delivered" ? totalOrders : 0} showZero={false} />
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <Title level={2} className="mb-1">
          Orders Management
        </Title>
        <Text type="secondary">
          Manage and track all customer orders across different statuses
        </Text>
      </div>

      {/* Tabs & Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-6 pt-4 border-b border-gray-100 bg-white">
          <div className="flex justify-between items-center mb-1">
            <Title level={5} className="mb-0">Order List</Title>
            <span className="text-xs text-gray-500 font-medium">
              Total Orders: <strong>{totalOrders}</strong>
            </span>
          </div>
          <Tabs
            activeKey={tabKey}
            onChange={onChange}
            items={items}
            className="order-status-tabs -mb-[1px]"
          />
        </div>

        <Table
          scroll={{ x: "auto" }}
          dataSource={orders}
          columns={columns}
          loading={global.loading.loading}
          rowKey="id"
          pagination={false}
          size="middle"
          className="modern-table"
          rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
          onRow={(record: any) => ({
            onClick: (e) => {
              const target = e.target as HTMLElement;
              if (
                target.closest("button") ||
                target.closest(".ant-popconfirm") ||
                target.closest(".ant-popover") ||
                target.closest(".ant-tooltip") ||
                target.closest(".ant-select")
              ) {
                return;
              }
              setSelectedOrderForDrawer(record);
              setDrawerOpen(true);
            },
          })}
        />

        {/* Dedicated Modern Pagination Bar */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-white">
          <span className="text-xs text-gray-500 font-medium">
            Showing{" "}
            <strong>
              {totalOrders === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              -
              {Math.min(currentPage * pageSize, totalOrders)}
            </strong>{" "}
            of <strong>{totalOrders}</strong> orders
          </span>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalOrders}
            showSizeChanger
            hideOnSinglePage={false}
            pageSizeOptions={["5", "10", "20", "50", "100"]}
            showQuickJumper
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            size="middle"
          />
        </div>
      </Card>

      {global.action.orderStatusUpdate && <OrderStatusChange />}

      <OrderDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        order={selectedOrderForDrawer}
        onStatusUpdated={() => {
          dispatch(setAction({}));
        }}
      />

      <OrderInvoiceModal
        open={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        order={selectedOrderForInvoice}
      />
    </div>
  );
};

export default Order;
