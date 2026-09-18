"use client";
import {
    FiActivity,
    FiCheckSquare,
    FiEdit3,
    FiTrash2,
} from "react-icons/fi";

interface AuditLogKpiCardsProps {
  totalLogs: number;
  byAction: { action: string; count: number }[];
  loading?: boolean;
}

export default function AuditLogKpiCards({
  totalLogs,
  byAction = [],
}: AuditLogKpiCardsProps) {
  const getActionCount = (act: string) => {
    const item = byAction.find(
      (a) => a.action?.toUpperCase() === act.toUpperCase()
    );
    return Number(item?.count) || 0;
  };

  const createCount = getActionCount("CREATE");
  const updateCount = getActionCount("UPDATE");
  const deleteCount = getActionCount("DELETE");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Total System Events */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-global-primary/40 shadow-sm transition-all duration-200 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Total Audited Events
          </span>
          <div className="w-9 h-9 rounded-xl bg-global-primary/10 text-global-primary flex items-center justify-center text-base shadow-sm">
            <FiActivity />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            {totalLogs}
          </h3>
          <p className="text-[11px] text-gray-500 mt-1 font-medium">
            System transactions recorded
          </p>
        </div>
      </div>

      {/* 2. Records Created */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-global-primary/40 shadow-sm transition-all duration-200 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Records Created
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base shadow-sm font-bold">
            <FiCheckSquare />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            {createCount}
          </h3>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
            <span>POST / CREATE operations</span>
          </p>
        </div>
      </div>

      {/* 3. Records Modified */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-global-primary/40 shadow-sm transition-all duration-200 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Records Modified
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base shadow-sm font-bold">
            <FiEdit3 />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            {updateCount}
          </h3>
          <p className="text-[11px] text-blue-600 mt-1 font-semibold">
            PUT / PATCH state updates
          </p>
        </div>
      </div>

      {/* 4. Records Deleted */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-global-primary/40 shadow-sm transition-all duration-200 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Records Purged
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-base shadow-sm font-bold">
            <FiTrash2 />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            {deleteCount}
          </h3>
          <p className="text-[11px] text-rose-600 mt-1 font-semibold">
            DELETE removals logged
          </p>
        </div>
      </div>
    </div>
  );
}

