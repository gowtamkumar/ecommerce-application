"use client";

import { Button, Select } from "antd";
import dayjs from "dayjs";
import {
    FiBell,
    FiCheckCircle,
    FiRefreshCw,
    FiSend,
    FiShield,
} from "react-icons/fi";

interface NotificationHeaderProps {
  activeTab: "history" | "broadcast";
  onTabChange: (tab: "history" | "broadcast") => void;
  onRefresh: () => void;
  onMarkAllRead: () => void;
  loading: boolean;
  unreadCount: number;
  autoRefreshInterval: number;
  onIntervalChange: (interval: number) => void;
  lastUpdated: Date | null;
}

export default function NotificationHeader({
  activeTab,
  onTabChange,
  onRefresh,
  onMarkAllRead,
  loading,
  unreadCount,
  autoRefreshInterval,
  onIntervalChange,
  lastUpdated,
}: NotificationHeaderProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-3 sm:p-4 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Title, Live Status & Unread Count */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center text-base shrink-0">
            <FiBell />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight m-0">
                Notifications
              </h1>
              {autoRefreshInterval > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live ({autoRefreshInterval}s)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200/60">
                  Manual
                </span>
              )}
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 m-0 font-medium">
              System alerts & broadcasts
              {lastUpdated ? ` • Synced ${dayjs(lastUpdated).format("h:mm:ss A")}` : ""}
            </p>
          </div>
        </div>

        {/* Right: Navigation Tabs, Sync Interval & Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Segmented Tab Switcher */}
          <div className="inline-flex items-center bg-gray-100/90 p-0.5 rounded-lg border border-gray-200/60">
            <button
              type="button"
              onClick={() => onTabChange("history")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "history"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <FiShield className="text-xs" />
              <span>History</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onTabChange("broadcast")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "broadcast"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <FiSend className="text-xs" />
              <span>Broadcast</span>
            </button>
          </div>

          {/* Sync Frequency Dropdown Selector */}
          <Select
            size="small"
            value={autoRefreshInterval}
            onChange={onIntervalChange}
            className="!h-8 w-26 text-xs"
            options={[
              { value: 0, label: "Sync: Off" },
              { value: 30, label: "Sync: 30s" },
              { value: 60, label: "Sync: 60s" },
              { value: 120, label: "Sync: 2m" },
            ]}
          />

          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            {/* Mark All Read Button */}
            {unreadCount > 0 && activeTab === "history" && (
              <Button
                onClick={onMarkAllRead}
                className="!h-8 px-2.5 rounded-lg border-gray-200 hover:border-emerald-500 hover:text-emerald-600 text-gray-600 font-medium text-xs inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Mark all notifications as read"
              >
                <FiCheckCircle className="text-xs text-emerald-600" />
                <span className="hidden sm:inline">Mark All Read</span>
              </Button>
            )}

            {/* Refresh Button */}
            <Button
              onClick={onRefresh}
              disabled={loading}
              className="!h-8 px-2.5 rounded-lg border-gray-200 hover:border-global-primary hover:text-global-primary text-gray-600 font-medium text-xs inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Refresh notifications"
            >
              <FiRefreshCw
                className={`text-xs ${loading ? "animate-spin text-global-primary" : ""}`}
              />
              <span className="hidden sm:inline">{loading ? "Syncing..." : "Refresh"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
