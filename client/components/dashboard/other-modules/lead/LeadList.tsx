"use client";
import React, { useCallback, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Space, Table, Tooltip } from "antd";
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
import { ActionType } from "@/constants/constants";
import { deleteLead, getLeads } from "@/lib/apis/leads";
import dayjs from "dayjs";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";

interface DataType {
  key: string;
  email: string;
  createdAt: string;
}

type DataIndex = keyof DataType;

const LeadList: React.FC = () => {
  const [leads, setLeads] = useState([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getLeads();
      setLeads(res?.data);
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
    try {
      dispatch(setLoading({ delete: true }));
      await deleteLead(id);
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
      title: "Email Address",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps("email"),
      render: (text) => <span className="font-semibold text-gray-900">{text}</span>,
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => (
        <span className="text-gray-600">{value && dayjs(value).format("MMM DD, YYYY")}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (value) => (
        <div className="flex gap-2 justify-end">
          <Tooltip title="Edit Lead">
            <Button
              size="small"
              icon={<EditOutlined />}
              className="hover:!bg-green-50 hover:!text-green-600"
              onClick={() => {
                dispatch(
                  setAction({
                    lead: true,
                    type: ActionType.UPDATE,
                    payload: value,
                  })
                );
              }}
            />
          </Tooltip>
          <Popconfirm
            title={
              <span>
                Are you sure <span className="font-bold text-red-600">delete</span>{" "}
                this Lead?
              </span>
            }
            onConfirm={() => handleDelete(value.id)}
            placement="left"
            okText="Yes"
            okType="danger"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Tooltip title="Delete Lead">
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
      dataSource={leads}
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

export default LeadList;
