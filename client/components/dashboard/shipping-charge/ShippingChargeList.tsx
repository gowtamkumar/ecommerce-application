"use client";
import { ActionType } from "@/constants/constants";
import { useCurrency } from "@/context/CurrencyContext";
import {
    deleteShippingCharge,
    getShippingCharges,
} from "@/lib/apis/shipping-charge";
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
    QuestionCircleOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import type { TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Pagination, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import React, { useCallback, useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";

interface DataType {
  districtId: any;
  key: string;
  district: any;
  shippingCharge: number;
  note: string;
  status: boolean;
}

type DataIndex = keyof DataType;

const ShippingChargeList: React.FC = () => {
  const [shippingCharges, setShippingCharge] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState<string>("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const { formatPrice } = useCurrency();

  const fetchData = useCallback(async (page: number, limit: number) => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getShippingCharges({ page, limit });
      if (res?.data) {
        setShippingCharge(res.data);
        setTotal(res.total !== undefined ? res.total : res.data.length);
      } else {
        setShippingCharge([]);
        setTotal(0);
      }
    } catch (err: any) {
      errorNotification({ message: err?.message || "Failed to load shipping charges" });
      setShippingCharge([]);
      setTotal(0);
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [fetchData, currentPage, pageSize, global.action]);

  const handleDelete = async (id: string) => {
    dispatch(setLoading({ save: true }));
    try {
      await deleteShippingCharge(id);
      successNotification({ message: "Successfully deleted" });
      fetchData(currentPage, pageSize);
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
      title: "District",
      dataIndex: "district",
      key: "district",
      render: (value) => (
        <span className="font-semibold text-gray-900">{value?.name}</span>
      ),
    },
    {
      title: "Shipping Amount",
      dataIndex: "shippingCharge",
      key: "shippingCharge",
      sorter: (a, b) => a.shippingCharge - b.shippingCharge,
      ...getColumnSearchProps("shippingCharge"),
      render: (value) => (
        <span className="font-medium text-green-600">{formatPrice(value)}</span>
      ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text) => (
        <span className="text-gray-600">
          {text?.length > 50 ? `${text.substring(0, 50)}...` : text || "-"}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      ...getColumnSearchProps("status"),
      sortDirections: ["descend", "ascend"],
      render: (value) => (
        <Tag
          color={value.status ? "green" : "red"}
          className="font-medium"
        >
          {value.status ? "Active" : "Inactive"}
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
          <Tooltip title="Edit Shipping Charge">
            <Button
              size="small"
              icon={<EditOutlined />}
              className="hover:bg-green-50 hover:text-green-600"
              onClick={() =>
                dispatch(
                  setAction({
                    type: ActionType.UPDATE,
                    payload: value,
                    shippingCharge: true,
                  })
                )
              }
            />
          </Tooltip>

          <Popconfirm
            title={
              <span>
                Are you sure{" "}
                <span className="font-bold text-red-600">delete</span> this
                Shipping Charge?
              </span>
            }
            onConfirm={() => handleDelete(value.id)}
            placement="left"
            okText="Yes"
            okType="danger"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Tooltip title="Delete Shipping Charge">
              <Button
                size="small"
                danger
                loading={global.loading?.delete}
                icon={<DeleteOutlined />}
                className="hover:bg-red-50"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        scroll={{ x: "auto" }}
        loading={global.loading.loading}
        columns={columns}
        rowKey="id"
        dataSource={shippingCharges}
        pagination={false}
        size="middle"
        className="modern-table"
        rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
      />

      <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-white">
        <span className="text-xs text-gray-500 font-medium">
          Showing{" "}
          <strong>
            {total === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            -
            {Math.min(currentPage * pageSize, total)}
          </strong>{" "}
          of <strong>{total}</strong> shipping charges
        </span>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          hideOnSinglePage={false}
          pageSizeOptions={["5", "10", "20", "50", "100"]}
          showQuickJumper
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          size="middle"
        />
      </div>
    </div>
  );
};

export default ShippingChargeList;
