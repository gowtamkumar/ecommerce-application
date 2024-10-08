"use client";
import React, { useEffect, useRef, useState } from "react";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Input, Space, Table, Button, Tag, Timeline, Divider } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterDropdownProps } from "antd/es/table/interface";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGlobal,
  setLoading,
  setSearchedColumn,
  setSearchText,
} from "@/redux/features/global/globalSlice";
import Highlighter from "react-highlight-words";
import { getUserOrders } from "@/lib/apis/orders";
import dayjs from "dayjs";
import { getStatus } from "@/lib/share/getStatus";

interface DataType {
  key: React.Key;
  name: string;
  trackingNo: string;
}

type DataIndex = keyof DataType;

const UserOrders = ({ orders }: any) => {
  // const [orders, setOrders] = useState([]);
  const searchInput = useRef<InputRef>(null);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   (async () => {
  //     dispatch(setLoading({ loading: true }));
  //     const res = await getUserOrders();
  //     const newOrders = res.data?.map((items: any, idx: number) => ({
  //       ...items,
  //       key: idx.toString(),
  //     }));
  //     setOrders(newOrders);
  //     dispatch(setLoading({ loading: false }));
  //   })();
  // }, [dispatch, global.action]);

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
        title: "Price",
        key: "price",
        render: (v: { price: number; tax: number; discountA: number }) => (
          <span>{(+v.price + +v.tax - +v.discountA).toFixed(2)}</span>
        ),
      },

      { title: "Qty", dataIndex: "qty", key: "qty" },
      {
        title: "Total item Amount",
        key: "total_item_amount",
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
          <h1 className="font-bold">Order No:{value.trackingNo}</h1>
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
          <div className="grid grid-cols-3 mt-5">
            <div className="col-span-2">dasdf</div>
            <div className="grid gap-y-3 col-span-1">
              <div className="flex justify-between">
                <h1>Net Amount: </h1>
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

    { title: "Phone No", dataIndex: "phoneNo", key: "phoneNo" },

    {
      title: "Shipping Address",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      render: (value) => <span>{value?.address}</span>,
    },
    // {
    //   title: "Payment Method",
    //   dataIndex: "paymentMethod",
    //   key: "paymentMethod",
    //   // render: (value) => <span>{value.address}</span>,
    // },
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
    </div>
  );
};

export default UserOrders;
