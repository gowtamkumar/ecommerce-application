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
  QuestionCircleOutlined, SearchOutlined
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
        <Tag color={value === "Home" ? "blue" : value === "Office" ? "purple" : "orange"}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
      render: (text) => <span className="font-semibold text-gray-900">{text}</span>,
    },
    {
      title: "Phone No",
      dataIndex: "phoneNo",
      key: "phoneNo",
      sorter: (a, b) => a.phoneNo.length - b.phoneNo.length,
      ...getColumnSearchProps("phoneNo"),
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps("email"),
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      ...getColumnSearchProps("division"),
      title: "Division",
      dataIndex: "division",
      key: "division",
      render: (value) => <span className="text-gray-700">{value?.name}</span>,
    },
    {
      ...getColumnSearchProps("district"),
      title: "District",
      dataIndex: "district",
      key: "district",
      render: (value) => <span className="text-gray-700">{value?.name}</span>,
    },
    {
      ...getColumnSearchProps("address"),
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => (
        <span className="text-gray-600 text-sm">
          {text?.length > 40 ? `${text.substring(0, 40)}...` : text}
        </span>
      ),
    },
    {
      ...getColumnSearchProps("user"),
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (value) => <span className="font-medium text-gray-700">{value?.name}</span>,
    },
    {
      title: "Status",
      key: "status",
      ...getColumnSearchProps("status"),
      sortDirections: ["descend", "ascend"],
      render: (value) => {
        return (
          <Tag
            color={value.status ? "green" : "red"}
            className="font-medium"
          >
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
              size="small"
              icon={<EditOutlined />}
              className="hover:!bg-green-50 hover:!text-green-600"
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
            placement="left"
            okText="Yes"
            okType="danger"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Tooltip title="Delete Address">
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
