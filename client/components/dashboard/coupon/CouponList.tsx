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
  BarcodeOutlined,
  CalendarOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  EyeOutlined,
  PercentageOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  TeamOutlined
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
  const { formatPrice } = useCurrency();

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
      title: "Coupon Code",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.length - b.code.length,
      ...getColumnSearchProps("code"),
      render: (text) => (
        <div className="flex items-center gap-2">
          <BarcodeOutlined className="text-gray-400" />
          <span className="font-mono px-2 py-1 bg-gray-100 rounded border border-gray-200 text-purple-700 font-bold uppercase tracking-wider text-xs">
            {text}
          </span>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => a.type.length - b.type.length,
      ...getColumnSearchProps("type"),
      render: (value) => (
        <Tag color={value === "Order" ? "blue" : "cyan"} className="rounded-full px-3 font-medium border-none py-0.5">
          {value}
        </Tag>
      ),
    },
    {
      title: "Disc. Type",
      dataIndex: "discountType",
      key: "discountType",
      sorter: (a, b) => a.discountType.length - b.discountType.length,
      ...getColumnSearchProps("discountType"),
      render: (value) => (
        <Tag
          icon={value === "Percentage" ? <PercentageOutlined /> : <DollarOutlined />}
          color={value === "Percentage" ? "orange" : "green"}
          className="rounded-full px-3 font-medium border-none py-0.5"
        >
          {value}
        </Tag>
      ),
    },
    {
      title: "Discount Value",
      key: "value_display",
      render: (_, record: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 text-lg">
            {record.discountType === "Percentage" ? `${record.value}%` : formatPrice(record.value)}
          </span>
          <span className="text-[10px] text-gray-400 uppercase font-medium">Off total</span>
        </div>
      ),
    },
    {
      title: "Validity Period",
      key: "validity",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CalendarOutlined className="text-gray-400" />
            <span className="font-medium">From:</span>
            <span>{record.startDate && dayjs(record.startDate).format("MMM DD, YYYY")}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CalendarOutlined className="text-red-400" />
            <span className="font-medium">To:</span>
            <span className="text-red-600 font-medium">{record.expiryDate && dayjs(record.expiryDate).format("MMM DD, YYYY")}</span>
          </div>
        </div>
      ),
    },
    {
      ...getColumnSearchProps("usageLimit"),
      title: "Usage",
      key: "usage",
      render: (value) => (
        <div className="flex items-center gap-2">
          <TeamOutlined className="text-gray-400" />
          <span className="text-gray-700 font-medium">{value.usageLimit}</span>
          <span className="text-xs text-gray-400">Limit</span>
        </div>
      ),
    },
    {
      title: "Status",
      key: "active",
      ...getColumnSearchProps("active"),
      sortDirections: ["descend", "ascend"],
      render: (record) => {
        return (
          <Tag
            color={record.active ? "success" : "error"}
            className="rounded-full px-3 font-medium border-none py-0.5"
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${record.active ? 'bg-green-500' : 'bg-red-500'}`} />
            {record.active ? "Active" : "Inactive"}
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
              size="middle"
              type="text"
              icon={<EyeOutlined className="text-blue-500" />}
              className="hover:!bg-blue-50"
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
              size="middle"
              type="text"
              icon={<EditOutlined className="text-green-500" />}
              className="hover:!bg-green-50"
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
            placement="bottomRight"
            okText="Yes"
            okType="danger"
            cancelText="No"
            icon={<QuestionCircleOutlined className="text-red-500" />}
          >
            <Tooltip title="Delete Coupon">
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
      dataSource={coupons}
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

export default CouponList;
