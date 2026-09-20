"use client";

import { Button, DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import { FiCalendar, FiPrinter, FiRefreshCw } from "react-icons/fi";
import { TbReportAnalytics } from "react-icons/tb";

const { RangePicker } = DatePicker;

export type ReportPreset = "today" | "7d" | "month" | "quarter" | "year" | "custom";

interface ReportHeaderProps {
  activePreset: ReportPreset;
  dateRange: [Dayjs, Dayjs];
  onPresetChange: (preset: ReportPreset) => void;
  onRangeChange: (values: [Dayjs, Dayjs]) => void;
  onRefresh: () => void;
  loading: boolean;
  refreshing: boolean;
}

export default function ReportHeader({
  activePreset,
  dateRange,
  onPresetChange,
  onRangeChange,
  onRefresh,
  loading,
  refreshing,
}: ReportHeaderProps) {
  const presets: { label: string; value: ReportPreset }[] = [
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "7d" },
    { label: "This Month", value: "month" },
    { label: "This Quarter", value: "quarter" },
    { label: "This Year", value: "year" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 space-y-4">
      {/* ── Tier 1: Page Title, Date Window & Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-global-primary/10 text-global-primary flex items-center justify-center text-xl shrink-0 shadow-2xs">
            <TbReportAnalytics />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight leading-tight m-0 truncate">
                Report & Business Intelligence
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Audit Ready
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 flex-wrap">
              <FiCalendar className="text-global-primary shrink-0" />
              <span className="text-gray-400">Reporting window:</span>
              <span className="text-gray-800 font-bold whitespace-nowrap">
                {dateRange[0].format("MMM DD, YYYY")} — {dateRange[1].format("MMM DD, YYYY")}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.print();
              }
            }}
            className="h-9.5 px-3.5 rounded-xl border border-gray-200 hover:border-global-primary hover:text-global-primary text-gray-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Print or Save Report as PDF"
          >
            <FiPrinter className="text-sm" />
            <span>Print Report</span>
          </Button>

          <Button
            onClick={onRefresh}
            disabled={loading || refreshing}
            className="h-9.5 px-3.5 rounded-xl border border-gray-200 hover:border-global-primary hover:text-global-primary text-gray-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <FiRefreshCw
              className={`text-sm ${refreshing ? "animate-spin text-global-primary" : ""}`}
            />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>
        </div>
      </div>

      {/* ── Tier 2: Filter Toolbar (Period Presets & Custom RangePicker) ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-0.5">
        {/* Presets Button Group */}
        <div className="flex items-center gap-1 bg-gray-50/90 p-1.5 rounded-xl border border-gray-100 overflow-x-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2 select-none shrink-0">
            Period:
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {presets.map((p) => {
              const isActive = activePreset === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => onPresetChange(p.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-global-primary text-white shadow-xs font-bold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom RangePicker */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium whitespace-nowrap hidden sm:inline select-none">
            Custom Range:
          </span>
          <RangePicker
            value={dateRange}
            onChange={(values) => {
              if (values && values[0] && values[1]) {
                onRangeChange([values[0], values[1]]);
              }
            }}
            className="h-9.5 rounded-xl border-gray-200 text-xs shadow-2xs hover:border-global-primary focus:border-global-primary w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
