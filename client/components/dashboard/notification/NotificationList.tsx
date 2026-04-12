'use client'
import { NOTIFICATION_TYPES } from "@/constants/constants";
import { deleteNotification, getNotificationsForAdmin, readNotification } from "@/lib/apis/notification";
import { getUsers } from "@/lib/apis/user";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  selectGlobal,
  setLoading
} from "@/redux/features/global/globalSlice";
import { DeleteOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { Button, Popconfirm, Select, Space, Table, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";




interface DataType {
  id: string;
  key: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [filteredNotifications, setFilteredNotifications] = useState<any[]>([]);

  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const session = useSession();


  const fetchData = useCallback(async () => {
    if (session.status !== "authenticated") return;
    dispatch(setLoading({ loading: true }));
    try {
      const [resNotifs, resUsers] = await Promise.all([
        getNotificationsForAdmin(),
        getUsers()
      ]);

      setNotifications(resNotifs.data || []);
      setFilteredNotifications(resNotifs.data || []);
      setUsers(resUsers.data || []);

    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchData();
    }
  }, [fetchData, session.status]);

  // Handle Filtering
  useEffect(() => {
    let filtered = [...notifications];

    if (selectedUser) {
      filtered = filtered.filter((n: any) => n.userId === selectedUser);
    }

    if (selectedType) {
      filtered = filtered.filter((n: any) => n.type === selectedType);
    }

    setFilteredNotifications(filtered);
  }, [selectedUser, selectedType, notifications]);

  const handleDelete = async (id: string) => {
    dispatch(setLoading({ delete: true }));
    try {
      await deleteNotification(id);
      successNotification({ message: "Notification deleted" });
      fetchData();
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ delete: false }));
    }
  };

  const handleRead = async (id: string) => {
    try {
      await readNotification({ id });
      fetchData(); // Refresh to update status
    } catch (error: any) {
      errorNotification({ message: error.message });
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'ServerDown': return 'red';
      case 'HighTraffic': return 'orange';
      case 'PaymentGatewayError': return 'volcano';
      case 'SmsEmailFailed': return 'magenta';
      case 'CronJobFailed': return 'magenta';
      default: return 'blue';
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type) => (
        <Tag color={getNotificationColor(type)} className="font-medium">
          {type}
        </Tag>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 200,
      render: (text, record) => (
        <span className={record.isRead ? "text-gray-500" : "font-bold text-gray-900"}>
          {text}
        </span>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value) => (
        <div className="text-sm">
          <div className="text-gray-900">{dayjs(value).format("DD MMM YYYY")}</div>
          <div className="text-gray-500">{dayjs(value).format("h:mm A")}</div>
        </div>
      ),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (value) => (
        <div className="flex gap-2 justify-end">
          {!value.isRead && (
            <Tooltip title="Mark as Read">
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleRead(value.id)}
              />
            </Tooltip>
          )}

          <Popconfirm
            title="Delete Alert?"
            onConfirm={() => handleDelete(value.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-xl font-semibold">Notifications History</h2>

        <Space wrap>
          <Select
            placeholder="Filter by Type"
            allowClear
            style={{ width: 200 }}
            onChange={setSelectedType}
            showSearch
          >
            {NOTIFICATION_TYPES.map(type => (
              <Select.Option key={type} value={type}>{type}</Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Filter by User"
            allowClear
            style={{ width: 200 }}
            onChange={setSelectedUser}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={users.map(u => ({ label: u.name || u.email, value: u.id }))}
          />

          <Button onClick={fetchData} icon={<SearchOutlined />}>Refresh</Button>
        </Space>
      </div>
      <Table
        scroll={{ x: "auto" }}
        loading={global.loading.loading}
        columns={columns}
        dataSource={filteredNotifications}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  );
};

export default NotificationList;
