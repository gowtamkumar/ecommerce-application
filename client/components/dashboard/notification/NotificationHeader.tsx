"use client";

import { Button, Select, Tooltip } from "antd";
import dayjs from "dayjs";
import {
    FiBell,
    FiCheckCircle,
    FiClock,
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
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
      {/* Title, Live Badge, and Last Synced indicator */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-global-primary/10 text-global-primary flex items-center justify-center text-xl shadow-xs shrink-0">
            <FiBell />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight break-words m-0">
                Notification & Alert Center
              </h1>
              {autoRefreshInterval > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync ({autoRefreshInterval}s)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                  Manual Mode
                </span>
              )}
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1 m-0 flex items-center gap-2 flex-wrap">
              <span>Real-time operational alerts, automated warnings, and customer promotional broadcasts.</span>
              {lastUpdated && (
                <span className="text-gray-400 font-medium flex items-center gap-1">
                  <FiClock className="text-[10px]" />
                  <span>Synced {dayjs(lastUpdated).format("h:mm:ss A")}</span>
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Switcher & Action Controls */}
      <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
        {/* Tab Selector Segment */}
        <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => onTabChange("history")}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "history"
                ? "bg-white text-gray-900 shadow-xs font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FiShield className="text-xs" />
            <span>Alerts History</span>
            {unreadCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange("broadcast")}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "broadcast"
                ? "bg-global-primary text-white shadow-xs font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FiSend className="text-xs" />
            <span>Broadcast Studio</span>
          </button>
        </div>

        {/* Sync Frequency Dropdown Selector */}
        <Tooltip title="Configure background polling frequency to optimize server API calls">
          <Select
            size="middle"
            value={autoRefreshInterval}
            onChange={onIntervalChange}
            className="w-36 h-9"
            options={[
              { value: 0, label: "Sync: Off" },
              { value: 30, label: "Sync: 30s" },
              { value: 60, label: "Sync: 60s" },
              { value: 120, label: "Sync: 2m" },
            ]}
          />
        </Tooltip>

        {/* Global Action Buttons */}
        {unreadCount > 0 && activeTab === "history" && (
          <Button
            type="default"
            icon={<FiCheckCircle className="text-emerald-600" />}
            onClick={onMarkAllRead}
            className="rounded-xl text-xs font-semibold h-9 !border-gray-200 hover:!border-emerald-500 hover:!text-emerald-600"
          >
            Mark All Read
          </Button>
        )}

        <Button
          type="default"
          icon={<FiRefreshCw className={loading ? "animate-spin text-global-primary" : "text-gray-600"} />}
          onClick={onRefresh}
          loading={loading}
          className="rounded-xl text-xs font-semibold h-9 !border-gray-200 hover:!border-global-primary hover:!text-global-primary"
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
