"use client";

import { Button, DatePicker, Switch } from "antd";
import type { Dayjs } from "dayjs";
import { FiClock, FiRefreshCw, FiShield } from "react-icons/fi";

const { RangePicker } = DatePicker;

export type AuditDatePreset = "all" | "today" | "7d" | "30d" | "custom";

interface AuditLogHeaderProps {
  activePreset: AuditDatePreset;
  dateRange: [Dayjs | null, Dayjs | null];
  onPresetChange: (preset: AuditDatePreset) => void;
  onRangeChange: (values: [Dayjs, Dayjs] | null) => void;
  onRefresh: () => void;
  loading: boolean;
  refreshing: boolean;
  autoRefresh: boolean;
  onToggleAutoRefresh: (checked: boolean) => void;
  totalLogs: number;
}

export default function AuditLogHeader({
  activePreset,
  dateRange,
  onPresetChange,
  onRangeChange,
  onRefresh,
  loading,
  refreshing,
  autoRefresh,
  onToggleAutoRefresh,
  totalLogs,
}: AuditLogHeaderProps) {
  const presets: { label: string; value: AuditDatePreset }[] = [
    { label: "All", value: "all" },
    { label: "Today", value: "today" },
    { label: "7D", value: "7d" },
    { label: "30D", value: "30d" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-3 sm:p-4 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Title & Live Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center text-base shrink-0">
            <FiShield />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight m-0">
                Audit Logs
              </h1>
              {autoRefresh ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Security
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 m-0 font-medium">
              {dateRange[0] && dateRange[1]
                ? `${dateRange[0].format("MMM D, YYYY")} – ${dateRange[1].format("MMM D, YYYY")}`
                : "All Time History"}{" "}
              • {totalLogs.toLocaleString()} events
            </p>
          </div>
        </div>

        {/* Right: Date Presets, RangePicker & Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Segmented Filter Presets */}
          <div className="inline-flex items-center bg-gray-100/90 p-0.5 rounded-lg border border-gray-200/60 overflow-x-auto max-w-full">
            {presets.map((p) => {
              const isActive = activePreset === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => onPresetChange(p.value)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-white text-gray-900 shadow-2xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Custom Range Picker */}
          <RangePicker
            value={dateRange[0] && dateRange[1] ? [dateRange[0], dateRange[1]] : null}
            onChange={(values) => {
              if (values && values[0] && values[1]) {
                onRangeChange([values[0], values[1]]);
              } else {
                onRangeChange(null);
              }
            }}
            className="!h-8 rounded-lg border-gray-200 text-xs shadow-2xs hover:border-global-primary focus:border-global-primary w-full sm:w-auto"
          />

          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            {/* Auto Refresh Toggle */}
            <div
              className="flex items-center gap-1.5 bg-gray-50/90 hover:bg-gray-100 px-2.5 rounded-lg border border-gray-200 text-xs shadow-2xs h-8 transition-all cursor-pointer"
              onClick={() => onToggleAutoRefresh(!autoRefresh)}
              title="Toggle Live Auto-Sync"
            >
              <FiClock className="text-gray-500 text-xs" />
              <span className="font-medium text-gray-600 hidden sm:inline select-none">
                Auto-Sync
              </span>
              <Switch
                size="small"
                checked={autoRefresh}
                onChange={onToggleAutoRefresh}
                className={autoRefresh ? "bg-global-primary" : ""}
              />
            </div>

            {/* Refresh Button */}
            <Button
              onClick={onRefresh}
              disabled={loading || refreshing}
              className="!h-8 px-2.5 rounded-lg border-gray-200 hover:border-global-primary hover:text-global-primary text-gray-600 font-medium text-xs inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Refresh audit logs"
            >
              <FiRefreshCw
                className={`text-xs ${refreshing ? "animate-spin text-global-primary" : ""}`}
              />
              <span className="hidden sm:inline">{refreshing ? "Syncing..." : "Refresh"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
