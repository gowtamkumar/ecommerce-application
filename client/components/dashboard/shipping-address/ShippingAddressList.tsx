"use client";
import { ActionType } from "@/constants/constants";
import {
  deleteShippingAddress,
  getShippingAddress,
} from "@/lib/apis/shipping-address";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setLoading,
  setSearchedColumn,
  setSearchText,
} from "@/redux/features/global/globalSlice";
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined, SearchOutlined,
  HomeOutlined,
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined
} from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import React, { useCallback, useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";

interface DataType {
  key: string;
  type: string;
  name: string;
  phoneNo: string;
  email: string;
  division: any;
  user: any;
  district: any;
  upazila: any;
  union: any;
  address: string;
  status: boolean;
}

type DataIndex = keyof DataType;

const ShippingAddressList: React.FC = () => {
  const [addresses, setAddresses] = useState([] as any);
  const searchInput = React.useRef<InputRef>(null);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getShippingAddress();
      setAddresses(res.data);
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    dispatch(setLoading({ save: true }));
    try {
      await deleteShippingAddress(id);
      successNotification({ message: "Successfully deleted" });
      fetchData();
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ save: false }));
      dispatch(setAction({}));
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
          value={selectedKeys[0] as string}
          onChange={(e) => {
            if (searchInput.current) {
              searchInput.current.input?.focus();
            }
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
          setTimeout(() => searchInput, 100);
        }
      },
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

  const columns: TableColumnsType<DataType> = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => a.type.length - b.type.length,
      ...getColumnSearchProps("type"),
      render: (value) => (
        <Tag 
          icon={value === "Home" ? <HomeOutlined /> : <GlobalOutlined />} 
          color={value === "Home" ? "blue" : value === "Office" ? "purple" : "orange"}
          className="rounded-full px-3 font-medium border-none py-0.5"
        >
          {value}
        </Tag>
      ),
    },
    {
      title: "Contact Details",
      key: "contact",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <UserOutlined className="text-gray-400 text-xs" />
            <span className="font-semibold text-gray-900">{record.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneOutlined className="text-gray-400 text-xs" />
            <span className="text-gray-500 text-xs">{record.phoneNo}</span>
          </div>
          {record.email && (
            <div className="flex items-center gap-2">
              <MailOutlined className="text-gray-400 text-xs" />
              <span className="text-gray-500 text-xs">{record.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      ...getColumnSearchProps("division"),
      title: "Location",
      key: "location",
      render: (_, record) => (
        <div className="text-xs text-gray-600">
          <div className="font-medium text-gray-800">{record.division?.name}</div>
          <div>{record.district?.name}</div>
        </div>
      ),
    },
    {
      ...getColumnSearchProps("address"),
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => (
        <Tooltip title={text}>
          <span className="text-gray-600 text-sm max-w-[200px] block truncate">
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      ...getColumnSearchProps("user"),
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold uppercase">
            {value?.name?.substring(0, 2) || "U"}
          </div>
          <span className="font-medium text-gray-700">{value?.name}</span>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      ...getColumnSearchProps("status"),
      sortDirections: ["descend", "ascend"],
      render: (value) => {
        return (
          <Tag
            color={value.status ? "success" : "error"}
            className="rounded-full px-3 font-medium border-none py-0.5"
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${value.status ? 'bg-green-500' : 'bg-red-500'}`} />
            {value.status ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (value) => (
        <div className="flex gap-2 justify-end">
          <Tooltip title="Edit Address">
            <Button
              size="middle"
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              className="hover:!bg-blue-50"
              onClick={() =>
                dispatch(
                  setAction({
                    type: ActionType.UPDATE,
                    payload: value,
                    shippingAddress: true,
                  })
                )
              }
            />
          </Tooltip>

          <Popconfirm
            title={
              <span>
                Are you sure <span className="font-bold text-red-600">delete</span>{" "}
                this Address?
              </span>
            }
            onConfirm={() => handleDelete(value.id)}
            placement="bottomRight"
            okText="Yes"
            okType="danger"
            cancelText="No"
            icon={<QuestionCircleOutlined className="text-red-500" />}
          >
            <Tooltip title="Delete Address">
              <Button
                size="middle"
                type="text"
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

  return (
    <Table
      scroll={{ x: "auto" }}
      loading={global.loading.loading}
      columns={columns}
      rowKey="id"
      dataSource={addresses}
      pagination={{
        pageSize: 10,

        showSizeChanger: true,
      }}
      size="middle"
      className="modern-table"
      rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
    />
  );
};

export default ShippingAddressList;
