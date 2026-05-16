"use client";
import {
  getNotificationsForAdmin,
  readNotification,
} from "@/lib/apis/notification";
import {
  BellOutlined,
  CheckCircleOutlined,
  RightOutlined
} from "@ant-design/icons";
import { Badge, Button, Popover, Spin, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);

const { Text, Title } = Typography;

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const session = useSession();

  const fetchNotifications = async () => {
    // 1. STOP if not authenticated or session is in a loading/error state
    if (session.status !== "authenticated" || (session.data as any)?.error === "RefreshAccessTokenError") {
       return;
    }

    setLoading(true);
    try {
      const res = await getNotificationsForAdmin();

      // 2. If the server returns 401, it means the session is definitely dead
      if (res?.status === 401) {
        return;
      }

      if (res?.data) {
        setNotifications(res.data);
      }
    } catch (error) {
      // Avoid logging errors that are just auth timeouts
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only start polling if we are truly authenticated and have no errors
    if (session.status === "authenticated" && (session.data as any)?.error !== "RefreshAccessTokenError") {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [session.status, (session.data as any)?.error]);

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
    <div className="w-[380px] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Title level={5} className="!mb-0 !text-gray-800">Notifications</Title>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-global-button-primary text-global-button-text">
              {unreadCount} New
            </span>
          )}
        </div>
        <Link
          href="/dashboard/notifications"
          onClick={() => setOpen(false)}
          className="group flex items-center gap-1 text-xs font-medium hover:text-global-button-primary transition-colors"
          style={{ color: "#6b7280" }}>
          View All <RightOutlined className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {loading && notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <Spin size="default" />
            <Text type="secondary" className="text-xs">Loading updates...</Text>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 h-60">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <BellOutlined className="text-2xl text-gray-300" />
            </div>
            <Text className="text-gray-500 font-medium">No new notifications</Text>
            <Text className="text-gray-400 text-xs mt-1">You're all caught up!</Text>
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className={`
                  group relative p-4 transition-all duration-200 cursor-pointer border-b border-gray-50 last:border-0
                  ${!item.isRead ? "hover:bg-global-button-primary/10" : "bg-white hover:bg-gray-50"}
                `}
                style={!item.isRead ? { backgroundColor: "rgba(var(--button-primary-color-rgb, 247, 170, 14), 0.05)" } : {}}
                onClick={() => handleRead(item.id)}
              >
                <div className="flex gap-3 items-start ">
                  {/* Indicator/Icon */}
                  <div className={`
                    mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    ${!item.isRead ? 'text-global-button-text' : 'bg-gray-100 text-gray-400'}
                  `}
                    style={!item.isRead ? { backgroundColor: "var(--button-primary-color)" } : {}}>
                    {!item.isRead ? (
                      <BellOutlined className="text-sm" />
                    ) : (
                      <CheckCircleOutlined className="text-sm" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <Text
                        className={`text-sm truncate pr-2 ${!item.isRead ? "font-semibold text-gray-800" : "font-medium text-gray-600"} group-hover:text-global-hover transition-colors`}
                      >
                        {item.title}
                      </Text>
                      <span className="flex items-center text-[10px] text-gray-400 whitespace-nowrap bg-white/50 px-1.5 py-0.5 rounded-md">
                        {dayjs(item.createdAt).fromNow(true)}
                      </span>
                    </div>

                    <Text className={`text-xs block line-clamp-2 leading-relaxed ${!item.isRead ? "text-gray-600" : "text-gray-400"}`}>
                      {item.message}
                    </Text>

                    {!item.isRead && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity text-global-button-primary">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-global-button-primary" />
                        Mark as read
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 5 && (
        <div className="p-3 border-t border-gray-100 bg-gray-50/50 backdrop-blur-sm sticky bottom-0 z-10">
          <Link
            href={
              session.data?.user.role === "Admin"
                ? "/dashboard/notifications"
                : "/profile?tab=notification"
            }
            onClick={() => setOpen(false)}
            className="block"
          >
            <Button
              type="primary"
              block
              ghost
              className="!h-9 !text-xs !font-medium !rounded-lg !border-global-button-primary !text-global-button-primary hover:!bg-global-button-primary/5 transition-colors"
            >
              View all {notifications.length} notifications
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
      styles={{
        content: {
          padding: 0,
          borderRadius: 12,
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
        },
      }}
      className="notification-popover"
    >
      <Badge
        count={unreadCount}
        overflowCount={99}
        size="small"
        offset={[-4, 4]}
        styles={{
          indicator: {
            backgroundColor: "var(--global-primary)",
            boxShadow: "0 2px 4px rgba(239, 68, 68, 0.4)",
            border: "2px solid white",
            fontWeight: "bold",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
          },
        }}
      >

        <Button
          type="primary"
          className={`
            !w-10 !h-10 !flex !items-center !justify-center !rounded-global-button-radius !border-0
            !bg-global-button-primary !text-global-button-text
            transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-lg
            hover:!bg-global-button-hover hover:scale-105
            ${open ? "!scale-105 !shadow-lg" : ""}
          `}
          icon={<BellOutlined style={{ fontSize: "20px" }} />}
        />
      </Badge>
    </Popover>
  );
};

export default NotificationDropdown;
