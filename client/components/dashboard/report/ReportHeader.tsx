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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
      {/* Title & Badge */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-global-primary/10 text-global-primary flex items-center justify-center text-lg">
            <TbReportAnalytics />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Report & Business Intelligence
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-global-primary/10 text-global-primary border border-global-primary/30">
                Audit Ready
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <FiCalendar className="text-global-primary" />
              <span>Reporting window:</span>
              <strong className="text-gray-700 font-semibold">
                {dateRange[0].format("MMM DD, YYYY")} — {dateRange[1].format("MMM DD, YYYY")}
              </strong>
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

        {/* Custom RangePicker */}
        <RangePicker
          value={dateRange}
          onChange={(values) => {
            if (values && values[0] && values[1]) {
              onRangeChange([values[0], values[1]]);
            }
          }}
          className="rounded-xl border-gray-200 text-xs shadow-sm hover:border-global-primary focus:border-global-primary"
        />

        {/* Print / Report Summary Button */}
        <Button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.print();
            }
          }}
          className="h-9 px-3 rounded-xl border border-gray-200 hover:border-global-primary hover:text-global-primary text-gray-700 flex items-center justify-center cursor-pointer"
          title="Print or Save Report as PDF"
        >
          <FiPrinter className="text-xs mr-1.5" />
          <span className="text-xs font-semibold">Print</span>
        </Button>

        {/* Instant Refresh Button */}
        <Button
          onClick={onRefresh}
          disabled={loading || refreshing}
          className="h-9 px-3 rounded-xl border border-gray-200 hover:border-global-primary hover:text-global-primary text-gray-700 flex items-center justify-center cursor-pointer"
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

