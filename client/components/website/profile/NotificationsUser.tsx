/* eslint-disable react-hooks/exhaustive-deps */

import { Button, Modal, Table } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
// import "./notification.css";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import {
  clearAllNotifications,
  getNotifications,
  readNotification,
} from "@/lib/apis/admin/notification";

const NotificationsUser = () => {
  const [notification, setNotification] = useState<any>({});
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  useEffect(() => {
    dispatch(setLoading({ notification: true }));
    fetchData();
  }, [dispatch]);

  const fetchData = async () => {
    const notifications = await getNotifications();
    setNotifications(notifications.data);
    dispatch(setLoading({}));
  };

  const handleRowClick = async (value: any) => {
    const notification = await readNotification({ id: value.id });
    if (notification.success) {
      fetchData();
    }
  };

  const clearAll = async () => {
    const notification = await clearAllNotifications();

    if (notification.success) {
      fetchData();
    }
  };

  const handleOk = () => {
    setNotification({});
  };

  const getTime = (date: any) => {
    const now = dayjs();
    const createdTime = dayjs(date);

    const diffInMinutes = now.diff(createdTime, "minute");
    const diffInHours = now.diff(createdTime, "hour");
    const diffInDays = now.diff(createdTime, "day");

    let result;
    if (diffInMinutes < 60) {
      result = `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      result = `${diffInHours} hours ago`;
    } else {
      result = `${diffInDays} days ago`;
    }

    return result;
  };

  const columns: any = [
    {
      key: "title",
      render: (item: any) => {
        return (
          <div>
            <p>{item.title}</p>
            <p>{item.text}</p>
            <p className="text-gray-400">{getTime(item.createdAt)}</p>
          </div>
        );
      },
    },

    {
      key: "action",
      align: "right",
      render: ({ isRead }: { isRead: boolean }) => {
        return !isRead && <p className="bg-green-500 w-2 h-2 rounded-full"></p>;
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-end">
        <div></div>
        <Button className="font-bold self-end" type="text" onClick={clearAll}>
          Clear all
        </Button>
      </div>
      <div className="space-y-2">
        <Table
          dataSource={notifications}
          showHeader={false}
          columns={columns}
          loading={global.loading.notification}
          rowClassName={(record: any) =>
            record.isRead ? "highlighted-row" : "normal-row"
          }
          onRow={(record) => {
            return {
              onClick: () => {
                handleRowClick(record);
                setNotification(record);
              }, // Click event for the row
            };
          }}
          components={{
            body: {
              row: (props: any) => (
                <div
                  style={{
                    // margin: "10px 0", // Margin of 10px around rows
                    width: "100%", // Full width
                    display: "table", // Table layout to ensure proper alignment
                  }}
                >
                  <tr {...props} />
                </div>
              ),
            },
          }}
          pagination={{ pageSize: 8 }}
        />
      </div>

      <Modal
        title={`Notification Details`}
        open={notification?.title}
        onOk={handleOk}
        onCancel={handleOk}
        footer={null}
        loading={global.loading.notification}
      >
        <div>
          <p>Type: {notification.item_type}</p>
          <p>Title: {notification.title}</p>
          <p>Text: {notification.text}</p>
          <p>Date: {dayjs(notification.created_at).format("DD-MMM-YYYY")}</p>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationsUser;
