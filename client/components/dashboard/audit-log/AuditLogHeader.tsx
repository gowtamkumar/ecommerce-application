"use client";
import { Button, DatePicker, Switch } from "antd";
import type { Dayjs } from "dayjs";
import { FiCalendar, FiClock, FiRefreshCw, FiShield } from "react-icons/fi";

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
    { label: "All Time", value: "all" },
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
      {/* Title & Live Status */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-global-primary/10 text-global-primary flex items-center justify-center text-xl shadow-sm">
            <FiShield />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight break-words">
                System Audit Logs
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-global-primary/10 text-global-primary border border-global-primary/30">
                Security & Compliance
              </span>
              {autoRefresh && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live Stream
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <FiCalendar className="text-global-primary text-xs" />
                <span>Range:</span>
                <strong className="text-gray-700 font-semibold">
                  {dateRange[0] && dateRange[1]
                    ? `${dateRange[0].format("MMM DD, YYYY")} — ${dateRange[1].format("MMM DD, YYYY")}`
                    : "Full History"}
                </strong>
              </span>
              <span>•</span>
              <span>{totalLogs} total events logged</span>
            </p>
          </div>
        </div>
      </div>

      {/* Date Controls & Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full xl:w-auto">
        {/* Presets Button Group */}
        <div className="flex items-center bg-gray-100/80 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          {presets.map((p) => {
            const isActive = activePreset === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onPresetChange(p.value)}
                className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-global-primary text-white shadow-sm font-bold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Precision RangePicker */}
        <RangePicker
          value={dateRange[0] && dateRange[1] ? [dateRange[0], dateRange[1]] : null}
          onChange={(values) => {
            if (values && values[0] && values[1]) {
              onRangeChange([values[0], values[1]]);
            } else {
              onRangeChange(null);
            }
          }}
          className="rounded-xl border-gray-200 text-xs shadow-sm hover:border-global-primary focus:border-global-primary"
        />

        {/* Auto Refresh Toggle */}
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200/80 text-xs">
          <FiClock className="text-gray-500" />
          <span className="font-semibold text-gray-700 hidden sm:inline">Auto-Sync</span>
          <Switch
            size="small"
            checked={autoRefresh}
            onChange={onToggleAutoRefresh}
            className={autoRefresh ? "bg-global-primary" : ""}
          />
        </div>

        {/* Instant Refresh Button */}
        <Button
          onClick={onRefresh}
          disabled={loading || refreshing}
          className="h-9 px-3 rounded-xl border border-gray-200 hover:border-global-primary hover:text-global-primary text-gray-700 flex items-center justify-center cursor-pointer"
          title="Refresh audit logs"
        >
          <FiRefreshCw
            className={`text-xs mr-1.5 ${refreshing ? "animate-spin text-global-primary" : ""}`}
          />
          <span className="text-xs font-semibold">Refresh</span>
        </Button>
      </div>
    </div>
  );
}

