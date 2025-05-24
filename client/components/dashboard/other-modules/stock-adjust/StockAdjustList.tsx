"use client";
import React, { useCallback, useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Space, Table, Tag } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGlobal,
  setAction,
  setLoading,
  setSearchedColumn,
  setSearchText,
} from "@/redux/features/global/globalSlice";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import { deleteStockAdjust, getStockAdjusts } from "@/lib/apis/stock-adjust";

interface DataType {
  key: string;
  type: string;
  qty: number;
  product: { name: string };
}

type DataIndex = keyof DataType;

const StockAdjustList: React.FC = () => {
  const [StockAdjusts, setStockAdjusts] = useState([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  
  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getStockAdjusts();
      setStockAdjusts(res?.data);
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
    try {
      dispatch(setLoading({ delete: true }));
      await deleteStockAdjust(id);
      successNotification({ message: "Successfully deleted" });
      fetchData();
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ delete: false }));
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
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            setSearchInput(e.target.value);
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
      sorter: (a, b) => a.type.length - b.type.length,
      ...getColumnSearchProps("type"),
    },
    {
      title: "Name",
      dataIndex: "product",
      key: "product",
      sorter: (a, b) => a.product.name.length - b.product.name.length,
      render: (value) => {
        return <p>{value.name}</p>;
      },
    },

    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      sorter: (a, b) => a.qty - b.qty,
    },
  ];

  return (
    <Table
      scroll={{ x: "auto" }}
      loading={global.loading.loading}
      columns={columns}
      dataSource={StockAdjusts}
      pagination={{ pageSize: 10 }}
      bordered
      size="small"
    />
  );
};

export default StockAdjustList;
