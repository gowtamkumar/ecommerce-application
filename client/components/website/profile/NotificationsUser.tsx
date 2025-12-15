"use client";
import {
  clearNotifications,
  getNotifications,
  readNotification,
} from "@/lib/apis/notification";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import {
  BellOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Card, Empty, Modal, Skeleton, Tag, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

dayjs.extend(relativeTime);
const { Title, Text, Paragraph } = Typography;

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
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading({ notification: false }));
    }
  };

  const handleRowClick = async (value: any) => {
    // If opening details for a specific notification
    setNotification(value);

    // Mark as read if not already
    if (!value.isRead) {
      const res = await readNotification({ id: value.id } as any);
      if (res.success) {
        fetchData();
      }
    }
  };

  const clearAll = async () => {
    const res = await clearNotifications();
    if (res.success) {
      fetchData();
    }
  };

  const handleOk = () => {
    setNotification({});
  };

  // Render Loading Skeletons
  if (global.loading.notification) {
    return (
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center mb-6">
          <Skeleton.Input active size="small" />
          <Skeleton.Button active size="small" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} variant="borderless" className="shadow-sm">
            <Skeleton avatar active paragraph={{ rows: 1 }} />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={4} className="!mb-0">
            Notifications
          </Title>
          <Text type="secondary">Stay updated with your latest activities</Text>
        </div>
        {notifications.length > 0 && (
          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            onClick={clearAll}
          >
            Clear all
          </Button>
        )}
      </div>

      {!notifications.length ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No notifications yet"
          className="mt-12"
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((item: any) => (
            <div
              key={item.id}
              onClick={() => handleRowClick(item)}
              className={`
                        group relative p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md
                        ${item.isRead
                  ? "bg-white border-gray-100"
                  : "bg-blue-50 border-blue-100"
                }
                    `}
            >
              <div className="flex gap-4 items-start">
                <div
                  className={`
                             mt-1 p-2 rounded-full shrink-0
                             ${item.isRead
                      ? "bg-gray-100 text-gray-400"
                      : "bg-blue-100 text-blue-500"
                    }
                          `}
                >
                  <BellOutlined />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <Text
                      strong={!item.isRead}
                      className="text-base mb-1 block"
                    >
                      {item.title}
                    </Text>
                    <Text
                      type="secondary"
                      className="text-xs whitespace-nowrap ml-2"
                    >
                      {dayjs(item.createdAt).fromNow()}
                    </Text>
                  </div>
                  <Text type="secondary" className="line-clamp-2">
                    {item.message}
                  </Text>
                </div>

                {!item.isRead && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Tag color="blue">Mark as Read</Tag>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <InfoCircleOutlined className="text-blue-500" />
            <span>Notification Details</span>
          </div>
        }
        open={!!notification?.title}
        onOk={handleOk}
        onCancel={handleOk}
        footer={[
          <Button key="close" onClick={handleOk}>
            Close
          </Button>,
        ]}
        centered
      >
        <div className="space-y-4 py-2">
          <div>
            <Text type="secondary" className="text-xs uppercase tracking-wide">
              Title
            </Text>
            <div className="font-medium text-lg">{notification.title}</div>
          </div>

          <div>
            <Text type="secondary" className="text-xs uppercase tracking-wide">
              Date
            </Text>
            <div className="flex items-center gap-2 text-gray-600">
              <ClockCircleOutlined />
              {dayjs(notification.createdAt).format("MMMM D, YYYY h:mm A")}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
            <Text
              type="secondary"
              className="text-xs uppercase tracking-wide block mb-2"
            >
              Message
            </Text>
            <Paragraph className="!mb-0 text-gray-800">
              {notification.message}
            </Paragraph>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationsUser;
