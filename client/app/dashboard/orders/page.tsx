"use client";
import React, { useEffect, useRef, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Badge, Dropdown, Input, Space, Table, Button, Popconfirm } from "antd";
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
    const columns: TableColumnsType<ExpandedDataType> = [
      { title: "Date", dataIndex: "date", key: "date" },
      { title: "Name", dataIndex: "name", key: "name" },
      {
        title: "Status",
        key: "state",
        render: () => <Badge status="success" text="Finished" />,
      },
      { title: "Upgrade Status", dataIndex: "upgradeNum", key: "upgradeNum" },
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
        columns={columns}
        size="small"
        scroll={{ x: "auto" }}
        dataSource={value.orderItems}
        pagination={false}
      />
    );
  };

  const columns: TableColumnsType<DataType> = [
    {
      ...getColumnSearchProps("name"),
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    { title: "Platform", dataIndex: "platform", key: "platform" },
    { title: "Version", dataIndex: "version", key: "version" },
    { title: "Upgraded", dataIndex: "upgradeNum", key: "upgradeNum" },
    { title: "Creator", dataIndex: "creator", key: "creator" },
    { title: "Date", dataIndex: "createdAt", key: "createdAt" },
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

  // const data: DataType[] = [];

  // for (let i = 0; i < 3; ++i) {
  //   data.push({
  //     key: i.toString(),
  //     name: "Screen",
  //     platform: "iOS",
  //     version: "10.3.4.5654",
  //     upgradeNum: 500,
  //     creator: "Jack",
  //     createdAt: "2014-12-24 23:12:00",
  //   });
  // }

  return (
    <>
      <Table
        scroll={{ x: "auto" }}
        dataSource={orders}
        columns={columns}
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
        loading={global.loading.loading}
        pagination={{ pageSize: 10 }}
        bordered
        size="small"
      />
    </>
  );
};

export default App;
