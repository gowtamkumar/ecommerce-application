'use client'
import { deleteNotification, getNotifications, readNotification } from "@/lib/apis/notification";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  selectGlobal,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { DeleteOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { Button, Popconfirm, Table, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SYSTEM_ALERT_TYPES = [
  'SystemAlert',
  'ServerDown',
  'HighTraffic',
  'PaymentGatewayError',
  'SmsEmailFailed',
  'CronJobFailed'
];

interface DataType {
  id: string;
  key: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const SystemAlertList = () => {
  const [alerts, setAlerts] = useState([] as any);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getNotifications();
      // Filter only system alerts
      const systemAlerts = res?.data?.filter((n: any) => SYSTEM_ALERT_TYPES.includes(n.type));
      setAlerts(systemAlerts || []);
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
    dispatch(setLoading({ delete: true }));
    try {
      await deleteNotification(id);
      successNotification({ message: "Alert deleted" });
      fetchData();
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ delete: false }));
    }
  };

  const handleRead = async (id: string) => {
    try {
      await readNotification(id);
      fetchData(); // Refresh to update status
    } catch (error: any) {
      errorNotification({ message: error.message });
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'ServerDown': return 'red';
      case 'HighTraffic': return 'orange';
      case 'PaymentGatewayError': return 'volcano';
      case 'SmsEmailFailed': return 'magenta';
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
        <Tag color={getAlertColor(type)} className="font-medium">
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">System Alerts</h2>
        <Button onClick={fetchData} icon={<SearchOutlined />}>Refresh</Button>
      </div>
      <Table
        scroll={{ x: "auto" }}
        loading={global.loading.loading}
        columns={columns}
        dataSource={alerts}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  );
};

export default SystemAlertList;
