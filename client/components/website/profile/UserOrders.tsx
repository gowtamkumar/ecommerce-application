"use client";
import React, { useCallback, useEffect, useState } from "react";
import type { TableColumnsType, TableColumnType, TabsProps } from "antd";
import {
  Input,
  Space,
  Table,
  Button,
  Tag,
  Timeline,
  Divider,
  Tabs,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
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
import dayjs from "dayjs";
import { getStatus } from "@/lib/utils/getStatus";
import { ActionType } from "@/constants/constants";
import CancelOrder from "./CancelOrder";
import { getUserOrders } from "@/lib/apis/orders";
import { errorNotification } from "@/lib/utils/notification";
import ReturnRequestOrderItem from "./ReturnRequestOrderItem";

interface DataType {
  key: React.Key;
  name: string;
  trackingNo: string;
}

type DataIndex = keyof DataType;

const UserOrders = () => {
  const [tabKey, setTabKey] = useState("Pending");
  const [orders, setOrders] = useState([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const fetchData = useCallback(
    async (status: string) => {
      dispatch(setLoading({ loading: true }));
      try {
        const res = await getUserOrders(status);
        if (!res.success) {
          console.log("Error fetching orders");
          errorNotification({ message: res.message });
          return;
        }
        const newOrders = res.data?.map((items: any, idx: number) => ({
          ...items,
          key: idx.toString(),
        }));

        setOrders(newOrders);
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
          placeholder={`Search {dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setSelectedKeys(e.target.value ? [e.target.value] : []);
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
        setTimeout(() => searchInput, 100);
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
      { dabitTotal: 0, creditTotal: 0 } // Initial accumulator values
    );

    const paidAmount = dabitTotal - creditTotal;

    const childColumns: any = [
      {
        title: "Product",
        dataIndex: "product",
        key: "product",
        render: (v: { name: string }) => <span>{v.name}</span>,
      },
      {
        title: "Material",
        dataIndex: "material",
        key: "material",
      },
      {
        title: "Color",
        dataIndex: "productVariant",
        render: (v: any) => {
          return <span>{v?.color?.name}</span>;
        },
      },
      {
        title: "Size",
        dataIndex: "productVariant",
        render: (v: any) => {
          return <span>{v?.size?.name}</span>;
        },
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
            <div className="col-span-5">dasdf</div>
            <div className="col-span-3">
              <div className="flex justify-between">
                <h1>Total Qty:</h1>
                <h1 className="font-semibold">{value.totalQty}</h1>
              </div>

              <div className="flex justify-between">
                <h1>Net Amount:</h1>
                <h1 className="font-semibold">
                  {(
                    +value.subTotal +
                    +value.totalItemsDiscount +
                    +value.couponDiscount
                  ).toFixed(2)}
                </h1>
              </div>

              {+value.totalItemsDiscount > 0 && (
                <div className="flex justify-between">
                  <h1>Discount Amount:</h1>
                  <h1 className="font-semibold">{value.totalItemsDiscount}</h1>
                </div>
              )}

              {+value.couponDiscount > 0 && (
                <div className="flex justify-between">
                  <h1>Coupon Discount:</h1>
                  <h1 className="font-semibold">{value.couponDiscount}</h1>
                </div>
              )}

              {paidAmount > 0 && (
                <div className="flex justify-between">
                  <h1>Paid Amount:</h1>
                  <h1 className="font-semibold">{paidAmount}</h1>
                </div>
              )}

              {+value.shippingCharge > 0 && (
                <div className="flex justify-between">
                  <h1>Shipping:</h1>
                  <h1 className="font-semibold">+{value.shippingCharge}</h1>
                </div>
              )}

              <div className="flex justify-between border-t-2">
                <h1>Grand Total:</h1>
                <h1 className="font-semibold">
                  {(+value.grandTotal - paidAmount).toFixed(2)}
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
      title: "Tracking No",
      dataIndex: "trackingNo",
      key: "trackingNo",
      render: (value) => <span className="bg-green-200">{value}</span>,
      ...getColumnSearchProps("trackingNo"),
    },
    { title: "Phone No", dataIndex: "phoneNo", key: "phoneNo" },
    {
      title: "Shipping Address",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      render: (value) => <span>{value?.address}</span>,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    // {
    //   title: "Delivered Man",
    //   dataIndex: "deliveryMan",
    //   key: "deliveryMan",
    //   render: (deliveryMan) => <span>{deliveryMan?.name}</span>,
    // },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date && dayjs(date).format("DD-MM-YYYY h:mm A"),
    },
    {
      title: "Payment",
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
      key: "action",
      render: (value) => {
        if (["Pending", "Approved", "Processing"].includes(value.status))
          return (
            <Button
              size="small"
              title="Cancel Order"
              className="me-1"
              onClick={() => {
                dispatch(
                  setAction({
                    type: ActionType.UPDATE,
                    cancelOrder: true,
                    payload: { id: value.id, status: "Canceled" },
                  })
                );
              }}
              disabled={value.status === "Completed"}
            >
              Cancel Order
            </Button>
          );

        // if (["Completed"].includes(value.status))
        //   return (
        //     <Button
        //       size="small"
        //       title="Return Request Order"
        //       className="me-1"
        //       disabled={value.status === "Requested"}
        //       onClick={() => {
        //         dispatch(
        //           setAction({
        //             type: ActionType.UPDATE,
        //             returnAllOrder: true,
        //             payload: { orderId: value.id },
        //           })
        //         );
        //       }}
        //     >
        //      All Order Return
        //     </Button>
        //   );
      },
    },
  ];
  const items: TabsProps["items"] = [
    {
      key: "Pending",
      label: "Pending",
    },
    {
      key: "Approved",
      label: "Approved",
    },
    {
      key: "Processing",
      label: "Processing",
    },
    {
      key: "On Shipping",
      label: "On Shipping",
    },
    {
      key: "Shipped",
      label: "Shipped",
    },
    {
      key: "Canceled",
      label: "Canceled",
    },
    {
      key: "Completed",
      label: "Completed",
    },
  ];

  return (
    <div className="p-3">
      <Tabs
        defaultActiveKey="1"
        activeKey={tabKey}
        items={items}
        onChange={onChange}
      />
      <Table
        scroll={{ x: "auto" }}
        dataSource={orders.map((items: any, idx: number) => ({
          ...items,
          key: idx.toString(),
        }))}
        columns={columns}
        expandable={{ expandedRowRender }}
        loading={global.loading.loading}
        pagination={{ pageSize: 10 }}
        bordered
        size="large"
      />
      <CancelOrder />
      {/* <ReturnRequestAllOrder /> */}
    </div>
  );
};

export default UserOrders;
