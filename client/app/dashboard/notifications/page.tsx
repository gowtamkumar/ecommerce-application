"use client";

import { Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useDispatch } from "react-redux";

import NotificationHeader from "@/components/dashboard/notification/NotificationHeader";
import NotificationKpiCards from "@/components/dashboard/notification/NotificationKpiCards";
import NotificationList from "@/components/dashboard/notification/NotificationList";
import NotificationSendForm from "@/components/dashboard/notification/NotificationSendForm";
import {
    getNotificationsForAdmin,
    readNotification,
} from "@/lib/apis/notification";
import { getSettings } from "@/lib/apis/setting";
import { getUsers } from "@/lib/apis/user";
import {
    errorNotification,
    successNotification,
} from "@/lib/utils/notification";
import { setSetting } from "@/redux/features/global/globalSlice";

function NotificationManagerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"history" | "broadcast">(
    tabParam === "broadcast" ? "broadcast" : "history"
  );
  const [notifications, setNotifications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [kpiFilterTab, setKpiFilterTab] = useState<string>("all");

  // API Call Frequency & Polling Controls
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(30); // Default: 30s auto-refresh
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // In-flight request deduplication lock & throttle
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const hasLoadedUsersRef = useRef(false);

  // Sync tab with URL
  useEffect(() => {
    if (tabParam === "broadcast") {
      setActiveTab("broadcast");
    } else if (tabParam === "history") {
      setActiveTab("history");
    }
  }, [tabParam]);

  const handleTabChange = (tab: "history" | "broadcast") => {
    setActiveTab(tab);
    router.push(`/dashboard/notifications?tab=${tab}`);
  };

  // 1. Fetch Users once (cached in memory)
  const fetchUsersOnce = useCallback(async () => {
    if (hasLoadedUsersRef.current) return;
    try {
      const res = await getUsers();
      if (res?.data) {
        setUsers(res.data);
        hasLoadedUsersRef.current = true;
      }
    } catch (err) {
      console.error("Failed to load users list:", err);
    }
  }, []);

  // 2. Fetch Notifications with in-flight lock & manual throttle
  const fetchNotifications = useCallback(
    async (isBackground = false) => {
      // Guard against overlapping concurrent requests
      if (isFetchingRef.current) return;

      // Throttle manual refreshes (minimum 2s window)
      const now = Date.now();
      if (!isBackground && now - lastFetchTimeRef.current < 2000) {
        return;
      }

      isFetchingRef.current = true;
      lastFetchTimeRef.current = now;

      if (!isBackground) {
        setLoading(true);
      }

      try {
        const [resNotifs, settingRes] = await Promise.all([
          getNotificationsForAdmin(),
          getSettings(),
        ]);

        if (settingRes?.data) {
          dispatch(setSetting(settingRes.data));
        }

        const list = resNotifs?.data || [];
        setNotifications(list);
        setLastUpdated(new Date());

        // Ensure users list is also loaded once
        fetchUsersOnce();
      } catch (err: any) {
        console.error("Notification fetch error:", err);
        if (!isBackground) {
          errorNotification({
            message: err?.message || "Failed to load notifications",
          });
        }
      } finally {
        isFetchingRef.current = false;
        if (!isBackground) {
          setLoading(false);
        }
      }
    },
    [dispatch, fetchUsersOnce]
  );

  // Initial fetch on mount
  useEffect(() => {
    fetchNotifications(false);
  }, [fetchNotifications]);

  // Controllable background polling with tab visibility detection
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;

    const intervalId = setInterval(() => {
      // Do not poll if the browser tab or window is in background / hidden
      if (typeof document !== "undefined" && document.hidden) {
        return;
      }
      fetchNotifications(true);
    }, autoRefreshInterval * 1000);

    return () => clearInterval(intervalId);
  }, [autoRefreshInterval, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Mark all unread as read
  const handleMarkAllRead = async () => {
    const unreadItems = notifications.filter((n) => !n.isRead);
    if (unreadItems.length === 0) return;

    setLoading(true);
    try {
      await Promise.all(
        unreadItems.map((n) => readNotification({ id: String(n.id) }))
      );
      successNotification({
        message: `Marked all ${unreadItems.length} notifications as read`,
      });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setLastUpdated(new Date());
    } catch (err: any) {
      errorNotification({
        message: err?.message || "Failed to mark all as read",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectKpiFilter = (filterKey: string) => {
    setKpiFilterTab(filterKey);
    if (activeTab !== "history") {
      handleTabChange("history");
    }
  };

  const handleBroadcastSuccess = () => {
    fetchNotifications(false);
    handleTabChange("history");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* 1. Executive Operations Header with Frequency Control */}
      <NotificationHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onRefresh={() => fetchNotifications(false)}
        onMarkAllRead={handleMarkAllRead}
        loading={loading}
        unreadCount={unreadCount}
        autoRefreshInterval={autoRefreshInterval}
        onIntervalChange={setAutoRefreshInterval}
        lastUpdated={lastUpdated}
      />

      {/* 2. 4 Telemetry KPI Cards */}
      <NotificationKpiCards
        notifications={notifications}
        onSelectFilterTab={handleSelectKpiFilter}
      />

      {/* 3. Main Operational Workspaces (Kept mounted to eliminate duplicate fetches on tab switch) */}
      <div className={activeTab === "history" ? "block" : "hidden"}>
        <NotificationList
          notifications={notifications}
          users={users}
          loading={loading}
          onRefresh={() => fetchNotifications(false)}
          onUpdateNotifications={(updated) => setNotifications(updated)}
          externalFilterTab={kpiFilterTab}
        />
      </div>

      <div className={activeTab === "broadcast" ? "block" : "hidden"}>
        <NotificationSendForm onSuccess={handleBroadcastSuccess} />
      </div>
    </div>
  );
}

export default function NotificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-100 flex items-center justify-center">
          <Spin size="large" />
        </div>
      }
    >
      <NotificationManagerContent />
    </Suspense>
  );
}
