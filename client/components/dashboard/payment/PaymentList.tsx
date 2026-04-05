import { ActionType } from "@/constants/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { deletePayment, getPayments } from "@/lib/apis/payment";
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
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";

interface DataType {
  key: string;
  paymentDate: string;
  paymentMethod: string;
  isSuccessfull: boolean;
  status: boolean;
}

type DataIndex = keyof DataType;

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState([] as any);
  const [searchInput, setSearchInput] = useState<string>("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const { formatPrice } = useCurrency();

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getPayments();
      setPayments(res.data);
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
      await deletePayment(id);
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

  const getPaymentMethodColor = (method: string) => {
    switch (method?.toLowerCase()) {
      case "credit card":
      case "card":
        return "blue";
      case "paypal":
        return "cyan";
      case "cash":
      case "cod":
        return "green";
      case "bank transfer":
        return "purple";
      default:
        return "default";
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Customer Name",
      dataIndex: "user",
      key: "user",
      width: 200,
      render: (value) => (
        <span className="font-semibold text-gray-900">{value?.name || "-"}</span>
      ),
    },
    {
      ...getColumnSearchProps("paymentDate"),
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      width: 180,
      render: (value) =>
        value ? (
          <div className="text-sm">
            <div className="text-gray-900">{dayjs(value).format("DD MMM YYYY")}</div>
            <div className="text-gray-500">{dayjs(value).format("h:mm A")}</div>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      render: (value) => (
        <span className="font-semibold text-green-600 text-base">
          {formatPrice(value)}
        </span>
      ),
    },
    {
      ...getColumnSearchProps("paymentMethod"),
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 180,
      render: (value) => (
        <Tag color={getPaymentMethodColor(value)} className="font-medium">
          {value || "N/A"}
        </Tag>
      ),
    },
    {
      ...getColumnSearchProps("isSuccessfull"),
      title: "Status",
      dataIndex: "isSuccessfull",
      key: "isSuccessfull",
      width: 130,
      render: (value) => (
        <Tag color={value ? "success" : "error"} className="font-medium">
          {value ? "Successful" : "Failed"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (value) => (
        <div className="flex gap-2 justify-end">
          <Tooltip title="Edit Payment">
            <Button
              size="small"
              icon={<EditOutlined />}
              className="hover:!bg-green-50 hover:!text-green-600"
              onClick={() =>
                dispatch(
                  setAction({
                    payment: true,
                    type: ActionType.UPDATE,
                    payload: value,
                  })
                )
              }
            />
          </Tooltip>
          <Popconfirm
            title={
              <span>
                Are you sure <span className="font-bold text-red-600">delete</span>{" "}
                this Payment?
              </span>
            }
            onConfirm={() => handleDelete(value.id)}
            placement="left"
            okText="Yes"
            okType="danger"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Tooltip title="Delete Payment">
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
      dataSource={payments}
      pagination={{
        pageSize: 15,
        position: ["bottomRight"],
        showSizeChanger: true,
      }}
      size="middle"
      className="modern-table"
      rowClassName="hover:bg-gray-50 transition-colors"
    />
  );
};

export default PaymentList;
