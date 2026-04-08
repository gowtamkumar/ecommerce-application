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
import { useCallback, useEffect, useState } from "react";
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
  const [user, setUsers] = useState([] as any);
  const [searchInput, setSearchInput] = useState<string>("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getUsers();
      setUsers(res?.data);
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
    dispatch(setLoading({ delete: true }));
    try {
      await deleteUser(id);
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

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "Admin": return "purple";
      case "Vendor": return "blue";
      case "Delivery Man": return "orange";
      default: return "green";
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      width: 250,
      fixed: "left",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
      render: (text, record) => (
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
      sorter: (a, b) => a.type.length - b.type.length,
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
      sorter: (a, b) => a.email.length - b.email.length,
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
      ...getColumnSearchProps("point"),
      render: (value) => (
        <span className="font-semibold text-blue-600">{value || 0}</span>
      ),
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      width: 140,
      ...getColumnSearchProps("dob"),
      render: (value) =>
        value ? (
          <span className="text-gray-600">{dayjs(value).format("DD MMM YYYY")}</span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
      sorter: (a, b) => a.dob?.length - b.dob?.length,
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      width: 160,
      ...getColumnSearchProps("lastLogin"),
      sorter: (a, b) => a.lastLogin?.length - b.lastLogin?.length,
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
      title: "Last Logout",
      dataIndex: "lastLogout",
      key: "lastLogout",
      width: 160,
      sorter: (a, b) => a.lastLogout?.length - b.lastLogout?.length,
      ...getColumnSearchProps("lastLogout"),
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
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 140,
      sorter: (a, b) => a.ipAddress?.length - b.ipAddress?.length,
      ...getColumnSearchProps("ipAddress"),
      render: (text) => text ? (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{text}</code>
      ) : (
        <span className="text-gray-400">-</span>
      ),
    },
    {
      title: "Device ID",
      dataIndex: "diviceId",
      key: "diviceId",
      width: 140,
      sorter: (a, b) => a.diviceId?.length - b.diviceId?.length,
      ...getColumnSearchProps("diviceId"),
      render: (text) => text ? (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{text}</code>
      ) : (
        <span className="text-gray-400">-</span>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 110,
      fixed: "right",
      ...getColumnSearchProps("status"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.status.length - b.status.length,
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
  ];

  return (
    <Table
      scroll={{ x: "auto" }}
      loading={global.loading.loading}
      columns={columns}
      rowKey="id"
      dataSource={user}
      pagination={{
        pageSize: 10,
        position: ["bottomRight"],
        showSizeChanger: true,
      }}
      size="middle"
      className="modern-table"
      rowClassName="hover:bg-gray-50 transition-colors"
    />
  );
};

export default UserList;
