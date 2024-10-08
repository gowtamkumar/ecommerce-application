"use client";
import React, { useEffect, useRef, useState } from "react";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import {
  Input,
  Space,
  Table,
  Button,
  Popconfirm,
  Tag,
  Timeline,
  Divider,
} from "antd";
import {
  FormOutlined,
  PlusOutlined,
  UserAddOutlined,
  RestOutlined,
  CheckOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FilterDropdownProps } from "antd/es/table/interface";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGlobal,
  setAction,
  setLoading,
  setSearchedColumn,
  setSearchText,
} from "@/redux/features/global/globalSlice";
import Highlighter from "react-highlight-words";
import { ActionType } from "@/constants/constants";
import { deleteOrder, getOrders } from "@/lib/apis/orders";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import AddOrderTracking from "@/components/dashboard/order-tracking/AddOrderTracking";
import OrderStatusChange from "@/components/dashboard/order/OrderStatusUpdate";
import { getStatus } from "@/lib/share/getStatus";
import { FaAmazonPay } from "react-icons/fa";
import AddPayment from "@/components/dashboard/payment/AddPayment";
import AssignDeliveryMan from "@/components/dashboard/order/AssignDeliveryMan";
interface DataType {
  key: React.Key;
  name: string;
  phoneNo: string;
  trackingNo: string;
}

interface ExpandedDataType {
  key: React.Key;
  title: string;
  dataIndex: string;
  render?: undefined;
}

type DataIndex = keyof DataType;

const Page: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const searchInput = useRef<InputRef>(null);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      dispatch(setLoading({ loading: true }));
      const res = await getOrders();
      const newOrders = res.data.map((items: any, idx: number) => ({
        ...items,
        key: idx.toString(),
      }));      
      setOrders(newOrders);
      dispatch(setLoading({ loading: false }));
    })();
  }, [dispatch, global.action]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(setLoading({ delete: true }));
      await deleteOrder(id);
      setTimeout(async () => {
        dispatch(setLoading({ delete: false }));
        toast.success("Discount deleted successfully");
        dispatch(setAction({}));
      }, 500);
    } catch (error: any) {
      console.log("v", error);

      toast.error(error);
    }
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
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
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
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              dispatch(setSearchText((selectedKeys as string[])[0]));
              dispatch(setSearchedColumn(dataIndex));
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
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
      {
        title: "Purchase Price",
        dataIndex: "purchasePrice",
        key: "purchasePrice",
      },
      { title: "Price", dataIndex: "price", key: "price" },

      { title: "Discount", dataIndex: "discountA", key: "discountA" },
      {
        title: "Tax",
        key: "tax",
        dataIndex: "tax",
      },

      {
        title: "Sale Price",
        render: (v: { price: number; tax: number; discountA: number }) => (
          <span>{(+v.price + +v.tax - +v.discountA).toFixed(2)}</span>
        ),
      },
      { title: "Qty", dataIndex: "qty", key: "qty" },
      {
        title: "Total item Amount",
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
      <div className="grid grid-cols-4 p-2">
        <div className="col-span-1 p-2">
          <h1>
            <span className="font-bold">Order No: </span>
            <code>{value.trackingNo}</code>
          </h1>
          <h1>
            <span className="font-bold">Delivery Man: </span>
            <code>{value?.deliveryMan?.name}</code>
          </h1>
          <h1>
            <span className="font-bold">Shipping Address: </span>
            <code> {value.shippingAddress?.address}</code>
          </h1>
          <Divider dashed />
          <Timeline
            items={(value?.orderTrackings || []).map(
              (timeline: any, idx: number) => ({
                // dot: <ClockCircleOutlined className="timeline-clock-icon" />,
                // color: "red",
                children: (
                  <div key={idx}>
                    <div> {timeline.status}</div>
                    <div>
                      {" "}
                      {dayjs(timeline.createdAt).format("MMMM D, YYYY h:mm A")}
                    </div>
                    <div> {timeline.location}</div>
                  </div>
                ),
              })
            )}
          />
        </div>
        <div className="col-span-3">
          <div className="p-4 bg-white">
            <h1 className="font-semibold">Order Items</h1>
            <Table
              columns={childColumns}
              size="small"
              scroll={{ x: "auto" }}
              dataSource={value.orderItems}
              pagination={false}
              bordered
            />
          </div>
          <div className="grid grid-cols-8 mt-5">
            <div className="col-span-4">dasdf</div>
            <div className="grid gap-y-3 col-span-4">
              <div className="flex justify-between">
                <h1>
                  Net Amount: (+tax {value.orderTax}, - Discount{" "}
                  {value.discountAmount})
                </h1>
                <h1 className="font-semibold">
                  ${(+value.netAmount).toFixed(2)}
                </h1>
              </div>

              <div className="flex justify-between">
                <h1>Shipping:</h1>
                <h1 className="font-semibold">
                  + ${(+value.shippingAmount || 0).toFixed(2)}
                </h1>
              </div>
              {/* <div className="flex justify-between">
                <h1>Total Order Tax</h1>
                <h1 className="font-semibold">
                  + ${(+value.orderTax || 0).toFixed(2)}
                </h1>
              </div>

              <div className="flex justify-between">
                <h1>Discount:</h1>
                <h1 className="font-semibold">
                  - ${(+value.discountAmount || 0).toFixed(2)}
                </h1>
              </div> */}

              <div className="flex justify-between border-t-2">
                <h1>Total Amount:</h1>
                <h1 className="font-semibold">
                  ${" "}
                  {(
                    +value.orderTotalAmount + +value.shippingAmount || 0
                  ).toFixed(2)}
                </h1>
              </div>
            </div>
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
      render: (value) => <span className="bg-green-200">{value}</span>,
    },

    {
      title: "Phone No",
      dataIndex: "phoneNo",
      key: "phoneNo",
      render: (value) => <span>{value?.phoneNo}</span>,
    },

    {
      title: "Customer",
      dataIndex: "user",
      key: "user",
      render: (customer) => <span>{customer?.name}</span>,
    },
    // {
    //   title: "Shipping Address",
    //   dataIndex: "shippingAddress",
    //   key: "shippingAddress",
    //   render: (value) => <span>{value.address}</span>,
    // },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      // render: (value) => <span>{value.address}</span>,
    },
    {
      title: "Delivered Man",
      dataIndex: "deliveryMan",
      key: "deliveryMan",
      render: (deliveryMan) => <span>{deliveryMan?.name}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date && dayjs(date).format("DD-MM-YYYY h:mm A"),
    },
    {
      title: "P. Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
    {
      title: "Status",
      key: "status",
      render: (orderStatus) => (
        <Tag color={getStatus(orderStatus.status)}>{orderStatus.status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "operation",
      render: (value) => (
        <div className="flex gap-2 justify-end">
          <Button
            size="small"
            icon={<FaAmazonPay />}
            title="Payment"
            className="me-1"
            onClick={() => {
              const amount = +value.orderTotalAmount + +value.shippingAmount;
              dispatch(
                setAction({
                  payment: true,
                  type: ActionType.CREATE,
                  payload: {
                    orderId: value.id,
                    amount,
                    paymentType: "Debit",
                    paymentMethod: value.paymentMethod,
                    userId: value.userId,
                  },
                })
              );
            }}
          />

          <Button
            size="small"
            icon={<PlusOutlined />}
            title="Add Order Tracking"
            className="me-1"
            onClick={() =>
              dispatch(
                setAction({
                  type: ActionType.CREATE,
                  addOrderTracking: true,
                  payload: { orderId: value.id },
                })
              )
            }
          />

          <Button
            size="small"
            icon={<UserAddOutlined />}
            title="Assign Delivery man"
            className="me-1"
            onClick={() =>
              dispatch(
                setAction({
                  assign: true,
                  payload: { id: value.id },
                })
              )
            }
          />
          {/* <Button
            size="small"
            icon={<CheckOutlined />}
            title="Renew Order"
            className="me-1"
            disabled={value.status !== "Returned"}
          /> */}
          <Button
            size="small"
            icon={<CheckOutlined />}
            title="Order Status Change"
            className="me-1"
            onClick={() =>
              dispatch(
                setAction({
                  type: ActionType.UPDATE,
                  orderStatusUpdate: true,
                  payload: { id: value.id },
                })
              )
            }
            disabled={
              value.status === "Completed" || value.status === "Returned"
            }
          />
          <Popconfirm
            title={
              <span>
                Are you sure <span className="text-danger fw-bold">delete</span>{" "}
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
            <Button
              size="small"
              danger
              loading={global.loading?.delete}
              icon={<RestOutlined />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-3">
      <Table
        scroll={{ x: "auto" }}
        dataSource={orders}
        columns={columns}
        expandable={{ expandedRowRender }}
        loading={global.loading.loading}
        pagination={{ pageSize: 10 }}
        bordered
        size="large"
      />
      {global.action.orderStatusUpdate && <OrderStatusChange />}
      {global.action.addOrderTracking && <AddOrderTracking />}
      {global.action.payment && <AddPayment />}
      {global.action.assign && <AssignDeliveryMan />}
    </div>
  );
};

export default Page;
