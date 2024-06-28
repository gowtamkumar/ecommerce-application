"use client";
import React, { useEffect, useRef, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import {
  Badge,
  Dropdown,
  Input,
  Space,
  Table,
  Button,
  Popconfirm,
  Tag,
} from "antd";
import {
  FormOutlined,
  RestOutlined,
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
interface DataType {
  key: React.Key;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number;
  creator: string;
  createdAt: string;
}

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
  upgradeNum: string;
}

const items = [
  { key: "1", label: "Action 1" },
  { key: "2", label: "Action 2" },
];

type DataIndex = keyof DataType;

const App: React.FC = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [global.action]);

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
      global.searchedColumn === dataIndex ? (
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
    const childColumns: TableColumnsType<ExpandedDataType> = [
      {
        title: "Product",
        dataIndex: "product",
        key: "product",
        render: (v) => <span>{v.name}</span>,
      },
      { title: "Price", dataIndex: "price", key: "price" },
      { title: "Qty", dataIndex: "qty", key: "qty" },
      { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount" },
      {
        title: "Action",
        key: "operation",
        render: () => (
          <div className="gap-2">
            <Button
              size="small"
              icon={<FormOutlined />}
              title="Edit"
              className="me-1"
              onClick={
                () => {
                  console.log("ddddd");
                }
                // dispatch(
                //   setAction({
                //     type: ActionType.UPDATE,
                //     payload: value,
                //   })
                // )
              }
            />
            <Popconfirm
              title={
                <span>
                  Are you sure{" "}
                  <span className="text-danger fw-bold">delete</span> this
                  Discount?
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
      <Table
        columns={childColumns}
        size="small"
        scroll={{ x: "auto" }}
        dataSource={value.orderItems}
        pagination={false}
        bordered
      />
    );
  };

  const columns: TableColumnsType<DataType> = [
    {
      // ...getColumnSearchProps("trackingNo"),
      title: "Tracking No",
      dataIndex: "trackingNo",
      key: "trackingNo",
      // sorter: (a, b) => a.trackingNo.length - b.trackingNo.length,
      render: (value) => <span className="bg-green-200">{value}</span>,
    },

    { title: "Phone No", dataIndex: "phoneNo", key: "phoneNo" },
    {
      title: "Delivery Address",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
    },

    {
      title: "Customer",
      dataIndex: "user",
      key: "user",
      render: (customer) => <span>{customer.name}</span>,
    },
    // { title: "Delivered Man", dataIndex: "delivery", key: "user.name" },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date && dayjs(date).format("DD-MM-YYYY"),
    },

    {
      title: "Total Amount",
      dataIndex: "orderTotalAmount",
      key: "orderTotalAmount",
      render: (value) => <span className="bg-green-200">{value}</span>,
    },
    {
      title: "Discount",
      dataIndex: "discountAmount",
      key: "discountAmount",
      render: (value) => <span className="bg-green-200">{value}</span>,
    },

    {
      title: "Shiping Amount",
      dataIndex: "shipingAmount",
      key: "shipingAmount",
      render: (value) => <span className="bg-green-200">{value}</span>,
    },
    {
      title: "P. Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
    {
      title: "Status",
      key: "status",
      render: (orderStatus) => <Tag>{orderStatus.status}</Tag>,
    },
    {
      title: "Action",
      key: "operation",
      render: (value) => (
        <div className="gap-2">
          <Button
            size="small"
            icon={<FormOutlined />}
            title="Edit"
            className="me-1"
            onClick={() =>
              dispatch(
                setAction({
                  type: ActionType.UPDATE,
                  payload: value,
                })
              )
            }
          />
          <Popconfirm
            title={
              <span>
                Are you sure <span className="text-danger fw-bold">delete</span>{" "}
                this Discount?
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
    <>
      <Table
        scroll={{ x: 1200 }}
        dataSource={orders}
        columns={columns}
        expandable={{ expandedRowRender }}
        loading={global.loading.loading}
        pagination={{ pageSize: 10 }}
        bordered
        size="large"
      />
    </>
  );
};

export default App;
