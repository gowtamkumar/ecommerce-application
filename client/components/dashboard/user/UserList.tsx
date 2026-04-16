'use client'
import { ActionType } from "@/constants/constants";
import { deleteUser, getUsers } from "@/lib/apis/user";
import { imageSetFile } from "@/lib/utils/imageSetFile";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
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
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import type { TableColumnsType, TableColumnType } from "antd";
import { Avatar, Button, Input, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";

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
  lastLogout: string;
  ipAddress: string;
  diviceId: string;
  status: any;
}

type DataIndex = keyof DataType;

const UserList = () => {
  const [users, setUsers] = useState<DataType[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState<string>("");

  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const fetchData = useCallback(async (page: number, limit: number) => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getUsers(page, limit);
      if (res?.success) {
        setUsers(res.data);
        setTotal(res.meta?.total || 0);
      }
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [fetchData, currentPage, pageSize, global.action]);

  const handleDelete = async (id: string) => {
    dispatch(setLoading({ delete: true }));
    try {
      await deleteUser(id);
      successNotification({ message: "Successfully deleted" });
      fetchData(currentPage, pageSize);
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
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
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
  }), [global.searchedColumn, global.searchText]);

  const getUserTypeColor = useCallback((type: string) => {
    switch (type) {
      case "Admin": return "purple";
      case "Vendor": return "blue";
      case "Delivery Man": return "orange";
      default: return "green";
    }
  }, []);

  const columns: TableColumnsType<DataType> = useMemo(() => [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      width: 250,
      fixed: "left",
      sorter: true,
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
            <div className="font-semibold text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">@{record.username}</div>
          </div>
        </div>
      ),
    },
    {
      title: "User Type",
      dataIndex: "type",
      key: "type",
      width: 130,
      sorter: true,
      ...getColumnSearchProps("type"),
      render: (type) => (
        <Tag color={getUserTypeColor(type)} className="font-medium">
          {type}
        </Tag>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
      ...getColumnSearchProps("email"),
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
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      width: 140,
      render: (value) =>
        value ? (
          <span className="text-gray-600">{dayjs(value).format("DD MMM YYYY")}</span>
        ) : (
          <span className="text-gray-400">-</span>
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
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (value) => (
        <div className="flex gap-2 justify-end">
          <Tooltip title="Edit User">
            <Button
              size="small"
              icon={<EditOutlined />}
              className="hover:!bg-green-50 hover:!text-green-600"
              onClick={() => {
                const newData = { ...value };
                if (newData.image) {
                  newData.fileList = [imageSetFile(newData.image)];
                }
                dispatch(
                  setAction({
                    type: ActionType.UPDATE,
                    payload: newData,
                    user: true,
                  })
                );
              }}
            />
          </Tooltip>
          <Popconfirm
            title={
              <span>
                Are you sure <span className="font-bold text-red-600">delete</span>{" "}
                this User?
              </span>
            }
            onConfirm={() => handleDelete(value.id)}
            placement="left"
            okText="Yes"
            okType="danger"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Tooltip title="Delete User">
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
  ], [getColumnSearchProps, getUserTypeColor, dispatch, global.loading?.delete, currentPage, pageSize]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <Table
      scroll={{ x: "auto" }}
      loading={global.loading.loading}
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
  );
};

export default UserList;
