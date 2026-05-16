"use client";
import { getUsers } from "@/lib/apis/user";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { errorNotification } from "@/lib/utils/notification";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import type { TableColumnsType, TableColumnType } from "antd";
import { Avatar, Button, Input, Space, Table, Tag, Card, Typography } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import Highlighter from "react-highlight-words";

const { Title } = Typography;

interface DataType {
  key: string;
  name: string;
  username: string;
  type: any;
  email: string;
  dob: string;
  phone: string;
  point: number;
  image: string;
  lastLogin: string;
  status: any;
}

type DataIndex = keyof DataType;

const CustomerList = () => {
  const [users, setUsers] = useState<DataType[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Fetch only users with role "User" (Customers)
  const fetchData = useCallback(async (page: number, limit: number, search?: string) => {
    setLoading(true);
    try {
      const res = await getUsers(page, limit, { role: "User", search });
      if (res?.success) {
        setUsers(res.data);
        setTotal(res.meta?.total || 0);
      }
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage, pageSize, searchText);
  }, [fetchData, currentPage, pageSize, searchText]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = useCallback((
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
  }), []);

  const columns: TableColumnsType<DataType> = useMemo(() => [
    {
      title: "Customer",
      dataIndex: "name",
      key: "name",
      width: 250,
      fixed: "left",
      ...getColumnSearchProps("name"),
      render: (text: string, record: DataType) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            src={getUploadImageUrl(record.image)}
            icon={<UserOutlined />}
            className="border border-gray-200"
          />
          <div>
            <div className="font-semibold text-gray-900">
               {searchedColumn === "name" ? (
                  <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                  />
                ) : (
                  text
                )}
            </div>
            <div className="text-sm text-gray-500">@{record.username}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => text || <span className="text-gray-400">-</span>,
    },
    {
      title: "Points",
      dataIndex: "point",
      key: "point",
      width: 100,
      render: (value) => (
        <span className="font-semibold text-blue-600">{value || 0}</span>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      width: 160,
      render: (value) =>
        value ? (
          <div className="text-sm">
            <div className="text-gray-900">{dayjs(value).format("DD MMM YYYY")}</div>
            <div className="text-gray-500">{dayjs(value).format("h:mm A")}</div>
          </div>
        ) : (
          <span className="text-gray-400">Never</span>
        ),
    },
    {
      title: "Status",
      key: "status",
      width: 110,
      fixed: "right",
      render: (value) => (
        <Tag color={value.status === "Active" ? "green" : "red"} className="font-medium">
          {value.status}
        </Tag>
      ),
    },
  ], [getColumnSearchProps, searchedColumn, searchText]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="!m-0">Customers</Title>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table
          scroll={{ x: "auto" }}
          loading={loading}
          columns={columns}
          rowKey="id"
          dataSource={users}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
          size="middle"
          className="modern-table"
          rowClassName="hover:bg-gray-50 transition-colors"
        />
      </Card>
    </div>
  );
};

export default CustomerList;
