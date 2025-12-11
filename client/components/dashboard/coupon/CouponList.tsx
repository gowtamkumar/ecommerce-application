"use client";
import { ActionType } from "@/constants/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { deleteCoupon, getCoupons } from "@/lib/apis/admin/coupon";
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
  EyeOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";

interface DataType {
  key: string;
  type: string;
  code: string;
  discountType: string;
  value: string;
  startDate: string;
  expiryDate: string;
  minOrderAmount: string;
  maxUser: string;
  mincartValue: string;
  maxDiscountValue: string;
  usageLimit: string;
  usagePerUser: string;
  active: boolean;
}

type DataIndex = keyof DataType;

const CouponList: React.FC = () => {
  const [coupons, setCoupons] = useState([] as any);
  const searchInput = React.useRef<InputRef>(null);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const route = useRouter();
  const {formatPrice} = useCurrency();

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getCoupons();
      setCoupons(res.data);
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData, global.action]);

  const handleDelete = async (id: string) => {
    dispatch(setLoading({ save: true }));
    try {
      await deleteCoupon(id);
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
          value={selectedKeys[0]}
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
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput, 100);
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

  const columns: TableColumnsType<DataType> = [
    {
      title: "Coupon Code",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.length - b.code.length,
      ...getColumnSearchProps("code"),
      render: (text) => <span className="font-mono font-semibold text-gray-900 uppercase">{text}</span>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => a.type.length - b.type.length,
      ...getColumnSearchProps("type"),
      render: (value) => (
        <Tag color={value === "Order" ? "purple" : "blue"}>{value}</Tag>
      ),
    },
    {
      title: "Disc. Type",
      dataIndex: "discountType",
      key: "discountType",
      sorter: (a, b) => a.discountType.length - b.discountType.length,
      ...getColumnSearchProps("discountType"),
      render: (value) => (
        <Tag color={value === "Percentage" ? "blue" : "green"}>
          {value === "Percentage" ? "Percentage" : "Fixed"}
        </Tag>
      ),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      sorter: (a, b) => a.value.length - b.value.length,
      ...getColumnSearchProps("value"),
      render: (value, record) => (
        <span className="font-medium text-gray-700">
          {record.discountType === "Percentage" ? `${value}%` : formatPrice(value)}
        </span>
      ),
    },
    {
      ...getColumnSearchProps("startDate"),
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a, b) => a.startDate.length - b.startDate.length,
      render: (value) => (
        <span className="text-gray-600">
          {value && dayjs(value).format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      ...getColumnSearchProps("expiryDate"),
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      sorter: (a, b) => a.expiryDate.length - b.expiryDate.length,
      render: (value) => (
        <span className="text-gray-600">
          {value && dayjs(value).format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      ...getColumnSearchProps("usageLimit"),
      title: "Usage Limit",
      dataIndex: "usageLimit",
      key: "usageLimit",
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      title: "Status",
      key: "active",
      ...getColumnSearchProps("active"),
      sortDirections: ["descend", "ascend"],
      render: (value) => {
        return (
          <Tag
            color={value.active ? "green" : "red"}
            className="font-medium"
          >
            {value.active ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 150,
      render: (value) => (
        <div className="flex gap-2 justify-end">
          <Tooltip title="View Details">
            <Button
              size="small"
              icon={<EyeOutlined />}
              className="hover:!bg-blue-50 hover:!text-blue-600"
              onClick={() =>
                dispatch(
                  setAction({
                    coupon: true,
                    type: ActionType.VIEW,
                    payload: value,
                  })
                )
              }
            />
          </Tooltip>

          <Tooltip title="Edit Coupon">
            <Button
              size="small"
              icon={<EditOutlined />}
              className="hover:!bg-green-50 hover:!text-green-600"
              onClick={() => route.push(`/dashboard/coupons/${value.id}`)}
            />
          </Tooltip>

          <Popconfirm
            title={
              <span>
                Are you sure <span className="font-bold text-red-600">delete</span>{" "}
                this Coupon?
              </span>
            }
            onConfirm={() => handleDelete(value.id)}
            placement="left"
            okText="Yes"
            okType="danger"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Tooltip title="Delete Coupon">
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
      dataSource={coupons}
      pagination={{
        pageSize: 10,
        position: ["bottomRight"],
        showSizeChanger: true,
      }}
      size="middle"
      className="modern-table"
      rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
    />
  );
};

export default CouponList;
