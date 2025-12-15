"use client";
import {
  getNotificationsForAdmin,
  readNotification,
} from "@/lib/apis/notification";
import { BellOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Badge, Button, Empty, List, Popover, Spin, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);

const { Text } = Typography;

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const session = useSession();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotificationsForAdmin();
      if (res?.data) {
        setNotifications(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Optional: Poll for new notifications every 60s
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRead = async (id: string) => {
    try {
      await readNotification({ id });
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark read", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const content = (
    <div className="w-80 max-h-[400px] overflow-y-auto">
      <div className="p-3 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10">
        <Text strong>Notifications</Text>
        <Link href="/dashboard/notifications" onClick={() => setOpen(false)}>
          <Text
            type="secondary"
            className="text-xs hover:text-blue-500 cursor-pointer"
          >
            View All
          </Text>
        </Link>
      </div>

      {loading && notifications.length === 0 ? (
        <div className="flex justify-center p-4">
          <Spin size="small" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No notifications"
          />
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={notifications.slice(0, 5)} // Show latest 5
          renderItem={(item) => (
            <div
              className={`p-3 border-b hover:bg-gray-50 transition-colors cursor-pointer ${!item.isRead ? "bg-blue-50/30" : ""
                }`}
              onClick={() => handleRead(item.id)}
            >
              <div className="flex gap-3">
                <div className="mt-1">
                  {!item.isRead ? (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  ) : (
                    <CheckCircleOutlined className="text-gray-300 text-xs" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <Text
                      strong={!item.isRead}
                      className="text-sm line-clamp-1"
                    >
                      {item.title}
                    </Text>
                    <Text
                      type="secondary"
                      className="text-xs whitespace-nowrap ml-2"
                    >
                      {dayjs(item.createdAt).fromNow(true)}
                    </Text>
                  </div>
                  <Text className="text-gray-500 text-xs line-clamp-2 mt-0.5">
                    {item.message}
                  </Text>
                </div>
              </div>
            </div>
          )}
        />
      )}

      {notifications.length > 5 && (
        <div className="p-2 text-center border-t sticky bottom-0 bg-white">
          <Link
            href={
              session.data?.user.role === "admin"
                ? "/dashboard/notifications"
                : "/profile?tab=notification"
            }
            onClick={() => setOpen(false)}
          >
            <Button type="text" size="small" className="text-xs">
              See all {notifications.length} notifications
            </Button>
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      arrow={false}
      open={open}
      onOpenChange={setOpen}
    // overlayInnerStyle={{ padding: 0 }}
    >
      <Badge
        count={unreadCount}
        size="small"
        style={{
          backgroundColor: "#ef4444",
          boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)",
        }}
      >
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: "18px", color: "inherit" }} />}
          style={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            color: open ? "#3b82f6" : "#6b7280",
          }}
          className="hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 transition-all duration-300"
        />
      </Badge>
    </Popover>
  );
};

export default NotificationDropdown;
