"use client";
import { ActionType } from "@/constants/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { getRefunds } from "@/lib/apis/refund";
import { errorNotification } from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setLoading,
  setSearchedColumn,
  setSearchText,
} from "@/redux/features/global/globalSlice";
import { CheckCircleOutlined, InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table, Tag, Tooltip } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import RefundCompleteModal from "./RefundCompleteModal";

interface DataType {
  id: number;
  key: string;
  amount: number;
  status: string;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  user: { name: string };
  order: { trackingNo: string };
}

type DataIndex = keyof DataType;

const RefundList: React.FC = () => {
  const [refunds, setRefunds] = useState([] as any);
  const [searchInput, setSearchInput] = useState<string>("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const { formatPrice } = useCurrency();

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getRefunds();
      setRefunds(res.data);
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData, global.action]);

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
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] as string}
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
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      const val = record[dataIndex];
      return val ? val.toString().toLowerCase().includes((value as string).toLowerCase()) : false;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Completed":
        return "green";
      case "Failed":
        return "red";
      default:
        return "default";
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Order Info",
      key: "order",
      width: 180,
      render: (record) => (
        <div className="text-sm">
          <div className="font-semibold text-blue-600">#{record.order?.trackingNo || "N/A"}</div>
          <div className="text-gray-500 text-xs">ID: {record.orderId}</div>
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: ["user", "name"],
      key: "userName",
      width: 180,
      render: (text) => <span className="font-medium text-gray-900">{text || "-"}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 130,
      render: (value) => (
        <span className="font-bold text-red-600">
          {formatPrice(value)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)} className="font-medium px-3 py-0.5 rounded-full">
          {status}
        </Tag>
      ),
    },
    {
      title: "Transaction Info",
      key: "transaction",
      width: 200,
      render: (record) => (
        <div className="text-xs">
          <div className="text-gray-700 font-medium">{record.paymentMethod}</div>
          {record.transactionId && (
            <div className="text-gray-500 mt-1 truncate max-w-[150px]" title={record.transactionId}>
              Ref: {record.transactionId}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (value) => (
        <div className="text-xs text-gray-600">
          <div>{dayjs(value).format("DD MMM YYYY")}</div>
          <div className="text-gray-400">{dayjs(value).format("h:mm A")}</div>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (record) => (
        <div className="flex gap-2">
          {record.status === "Pending" ? (
            <Tooltip title="Complete Refund">
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                className="bg-green-600 hover:!bg-green-700 border-none"
                onClick={() =>
                  dispatch(
                    setAction({
                      refund: true,
                      type: ActionType.UPDATE,
                      payload: record,
                    })
                  )
                }
              />
            </Tooltip>
          ) : (
            <Tooltip title="Refund Completed">
              <span className="text-green-500 text-lg ml-2">
                <CheckCircleOutlined />
              </span>
            </Tooltip>
          )}
          <Tooltip title="View Details">
            <Button
              size="small"
              icon={<InfoCircleOutlined />}
              className="hover:!text-blue-600"
              onClick={() => {
                // Future: show full details modal
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <Table
        scroll={{ x: 1000 }}
        loading={global.loading.loading}
        columns={columns}
        dataSource={refunds}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          className: "mt-4 pr-4",
        }}
        size="middle"
        className="modern-table"
        rowClassName={(record) =>
          record.status === "Pending" ? "bg-orange-50/10" : ""
        }
      />
      <RefundCompleteModal />
    </div>
  );
};

export default RefundList;
