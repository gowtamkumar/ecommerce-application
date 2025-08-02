/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ActionType } from "@/constants/constants";
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
  FormOutlined,
  QuestionCircleOutlined,
  RestOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Space, Table, Tag } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { AiOutlineEye } from "react-icons/ai";
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
  const [address, setAddress] = useState([] as any);
  const searchInput = React.useRef<InputRef>(null);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const route = useRouter();

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getCoupons();
      setAddress(res.data);
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
      // width: "15%",
      // responsive: ['sm'],
      sorter: (a, b) => a.type.length - b.type.length,
      ...getColumnSearchProps("type"),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.length - b.code.length,
      ...getColumnSearchProps("code"),
    },

    {
      title: "Discount Type",
      dataIndex: "discountType",
      key: "discountType",
      sorter: (a, b) => a.discountType.length - b.discountType.length,
      ...getColumnSearchProps("discountType"),
    },

    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      sorter: (a, b) => a.value.length - b.value.length,
      ...getColumnSearchProps("value"),
    },

    {
      ...getColumnSearchProps("startDate"),
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a, b) => a.startDate.length - b.startDate.length,
      render: (value) => (
        <p>{value && dayjs(value).format("DD-MM-YYYY h:mm A")}</p>
      ),
    },
    {
      ...getColumnSearchProps("expiryDate"),
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      sorter: (a, b) => a.expiryDate.length - b.expiryDate.length,
      render: (value) => (
        <p>{value && dayjs(value).format("DD-MM-YYYY h:mm A")}</p>
      ),
    },

    {
      ...getColumnSearchProps("minOrderAmount"),
      title: "Min Order Amount",
      dataIndex: "minOrderAmount",
      key: "minOrderAmount",
      sorter: (a, b) => a.minOrderAmount.length - b.minOrderAmount.length,
    },

    {
      ...getColumnSearchProps("maxUser"),
      title: "Max User",
      dataIndex: "maxUser",
      key: "maxUser",
      // sorter: (a, b) => a.maxUser - b.maxUser,
      // render: (value) => <span>{value.name}</span>,
    },
    {
      ...getColumnSearchProps("mincartValue"),
      title: "Min Cart Value",
      dataIndex: "mincartValue",
      key: "mincartValue",
    },
    {
      ...getColumnSearchProps("maxDiscountValue"),
      title: "Max Discount Value",
      dataIndex: "maxDiscountValue",
      key: "maxDiscountValue",
      // sorter: (a, b) => a.maxUser - b.maxUser,
      // render: (value) => <span>{value.name}</span>,
    },
    {
      ...getColumnSearchProps("usageLimit"),
      title: "Usage Limit",
      dataIndex: "usageLimit",
      key: "usageLimit",
      // sorter: (a, b) => a.maxUser - b.maxUser,
      // render: (value) => <span>{value.name}</span>,
    },
    {
      ...getColumnSearchProps("usagePerUser"),
      title: "Usage Per User",
      dataIndex: "usagePerUser",
      key: "usagePerUser",
      // sorter: (a, b) => a.maxUser - b.maxUser,
      // render: (value) => <span>{value.name}</span>,
    },
    {
      title: "Status",
      key: "active",
      ...getColumnSearchProps("active"),
      sortDirections: ["descend", "ascend"],
      render: (value) => {
        return (
          <Tag color={value.active ? "green" : "red"}>
            {value.active ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      sortDirections: ["descend", "ascend"],
      render: (value) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="small"
            icon={<AiOutlineEye />}
            title="View"
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
          <Button
            size="small"
            icon={<FormOutlined />}
            title="Edit"
            onClick={() => route.push(`/dashboard/coupons/${value.id}`)}
          />
          <Popconfirm
            title={
              <span>
                Are you sure <span className="text-danger fw-bold">delete</span>{" "}
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
      scroll={{ x: "auto" }}
      loading={global.loading.loading}
      columns={columns}
      dataSource={address}
      pagination={{ pageSize: 10 }}
      bordered
      size="small"
    />
  );
};

export default CouponList;
