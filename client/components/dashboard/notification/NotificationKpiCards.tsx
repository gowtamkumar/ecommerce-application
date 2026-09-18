"use client";

import {
    FiAlertTriangle,
    FiBell,
    FiCheckCircle,
    FiInbox,
    FiRadio,
    FiSend,
} from "react-icons/fi";

interface NotificationKpiCardsProps {
  notifications: any[];
  onSelectFilterTab?: (tab: string) => void;
}

export default function NotificationKpiCards({
  notifications = [],
  onSelectFilterTab,
}: NotificationKpiCardsProps) {
  const total = notifications.length;
  const unread = notifications.filter((n) => !n.isRead).length;
  const unreadPercent = total > 0 ? Math.round((unread / total) * 100) : 0;

  const critical = notifications.filter((n) =>
    [
      "ServerDown",
      "PaymentGatewayError",
      "CronJobFailed",
      "HighTraffic",
      "SmsEmailFailed",
      "AdminPaymentFailed",
    ].includes(n.type)
  ).length;

  const promotional = notifications.filter((n) =>
    ["NewOffer", "General", "Maintenance", "PromotionalMarketing"].includes(n.type)
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Alerts Dispatched */}
      <div
        onClick={() => onSelectFilterTab && onSelectFilterTab("all")}
        className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-global-primary/40 shadow-sm transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Total Logged Alerts
          </span>
          <div className="w-8 h-8 rounded-lg bg-global-primary/15 text-global-primary flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform">
            <FiBell />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {total}
          </div>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
              <FiCheckCircle className="text-xs" /> System active
            </span>
            <span className="text-gray-400">• Across all nodes</span>
          </p>
        </div>
      </div>

      {/* 2. Unread Review Queue */}
      <div
        onClick={() => onSelectFilterTab && onSelectFilterTab("unread")}
        className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-amber-300 shadow-sm transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Unread Alerts
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform border border-amber-200/60">
            <FiInbox />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-baseline gap-2">
            {unread}
            {unread > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {unreadPercent}% pending
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {unread > 0 ? (
              <span className="text-amber-700 font-medium">Awaiting administrator review</span>
            ) : (
              <span className="text-emerald-600 font-medium">All caught up — 0 pending</span>
            )}
          </p>
        </div>
      </div>

      {/* 3. Critical Infrastructure & System Alerts */}
      <div
        onClick={() => onSelectFilterTab && onSelectFilterTab("critical")}
        className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-rose-300 shadow-sm transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Critical System Issues
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform border border-rose-200/60">
            <FiAlertTriangle />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-baseline gap-2">
            {critical}
            {critical > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                Requires Action
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {critical > 0 ? (
              <span className="text-rose-600 font-semibold">Payment or server disruptions</span>
            ) : (
              <span className="text-gray-500">Zero critical infrastructure incidents</span>
            )}
          </p>
        </div>
      </div>

      {/* 4. Promotional & Marketing Broadcasts */}
      <div
        onClick={() => onSelectFilterTab && onSelectFilterTab("promotional")}
        className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-indigo-300 shadow-sm transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Promotions & Broadcasts
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform border border-indigo-200/60">
            <FiRadio />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {promotional}
          </div>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
              <FiSend className="text-xs" /> Customer campaigns
            </span>
            <span className="text-gray-400">• High reach</span>
          </p>
        </div>
      </div>
    </div>
  );
}

