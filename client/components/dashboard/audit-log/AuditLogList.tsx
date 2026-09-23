"use client";
import AuditLogDetailModal from "@/components/dashboard/audit-log/AuditLogDetailModal";
import AuditLogFilterBar from "@/components/dashboard/audit-log/AuditLogFilterBar";
import AuditLogHeader, { AuditDatePreset } from "@/components/dashboard/audit-log/AuditLogHeader";
import AuditLogKpiCards from "@/components/dashboard/audit-log/AuditLogKpiCards";
import { getAuditLogs, getAuditLogStatistics } from "@/lib/apis/audit-log";
import { getSettings } from "@/lib/apis/setting";
import type { IAuditLog } from "@/lib/types/audit-log";
import { errorNotification } from "@/lib/utils/notification";
import { setSetting } from "@/redux/features/global/globalSlice";
import { Avatar, Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEye } from "react-icons/fi";
import { useDispatch } from "react-redux";

dayjs.extend(relativeTime);

export default function AuditLogList() {
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [stats, setStats] = useState<{
    totalLogs: number;
    byAction: { action: string; count: number }[];
  }>({ totalLogs: 0, byAction: [] });

  // Pagination & Filtering state
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [search, setSearch] = useState<string>("");
  const [action, setAction] = useState<string | undefined>(undefined);
  const [resourceType, setResourceType] = useState<string | undefined>(undefined);
  const [activePreset, setActivePreset] = useState<AuditDatePreset>("all");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  // Live Auto-Refresh (every 20 seconds)
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);

  // Inspector Modal State
  const [selectedLog, setSelectedLog] = useState<IAuditLog | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const dispatch = useDispatch();

  // 1. Sync global store settings (theme variables) on mount
  useEffect(() => {
    const syncSettings = async () => {
      try {
        const setting = await getSettings();
        if (setting?.data) {
          dispatch(setSetting(setting.data));
        }
      } catch (e) {
        console.error("Failed to sync settings:", e);
      }
    };
    syncSettings();
  }, [dispatch]);

  // 2. Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const res = await getAuditLogStatistics(30);
      if (res?.success && res.data) {
        setStats({
          totalLogs: res.data.totalLogs || 0,
          byAction: res.data.byAction || [],
        });
      }
    } catch (e) {
      console.warn("Failed to load audit statistics:", e);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // 3. Main logs query - instantly reactive to any change
  const fetchLogs = useCallback(
    async (isSilent = false) => {
      if (isSilent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const params: any = {
          page,
          limit,
        };

        if (search && search.trim()) {
          params.search = search.trim();
        }
        if (action) {
          params.action = action;
        }
        if (resourceType) {
          params.resourceType = resourceType;
        }
        if (dateRange[0]) {
          params.startDate = dateRange[0].toISOString();
        }
        if (dateRange[1]) {
          params.endDate = dateRange[1].toISOString();
        }

        const res = await getAuditLogs(params);
        if (res.data) {
          setLogs(res.data);
          setTotal(res.total || 0);
        }
      } catch (err: any) {
        console.error("Audit log fetch error:", err);
        errorNotification({
          message: err?.message || "Failed to load audit logs.",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, limit, search, action, resourceType, dateRange]
  );

  // Trigger fetch on any filter or page change
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Auto-refresh interval (every 20s if enabled)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLogs(true);
      fetchStats();
    }, 20000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLogs, fetchStats]);

  // Handle Date Presets
  const handlePresetChange = (preset: AuditDatePreset) => {
    setActivePreset(preset);
    setPage(1);

    if (preset === "all") {
      setDateRange([null, null]);
    } else if (preset === "today") {
      setDateRange([dayjs().startOf("day"), dayjs().endOf("day")]);
    } else if (preset === "7d") {
      setDateRange([dayjs().subtract(7, "day").startOf("day"), dayjs().endOf("day")]);
    } else if (preset === "30d") {
      setDateRange([dayjs().subtract(30, "day").startOf("day"), dayjs().endOf("day")]);
    }
  };

  const handleRangeChange = (values: [Dayjs, Dayjs] | null) => {
    setActivePreset(values ? "custom" : "all");
    setDateRange(values ? [values[0].startOf("day"), values[1].endOf("day")] : [null, null]);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setAction(undefined);
    setResourceType(undefined);
    setActivePreset("all");
    setDateRange([null, null]);
    setPage(1);
  };

  const isFiltered = useMemo(() => {
    return Boolean(
      search ||
        action ||
        resourceType ||
        activePreset !== "all" ||
        dateRange[0] !== null
    );
  }, [search, action, resourceType, activePreset, dateRange]);

  // Export CSV handler
  const handleExportCSV = () => {
    if (!logs || logs.length === 0) return;

    const headers = [
      "Log ID",
      "Timestamp",
      "User Name",
      "User Email",
      "Role",
      "Action",
      "Resource Type",
      "Resource ID",
      "Resource Name",
      "HTTP Method",
      "API Path",
      "Client IP",
    ];

    const rows = logs.map((log) => [
      `"${log.id || ""}"`,
      `"${dayjs(log.createdAt).format("YYYY-MM-DD HH:mm:ss")}"`,
      `"${(log.userName || "").replace(/"/g, '""')}"`,
      `"${log.userEmail || ""}"`,
      `"${log.userRole || ""}"`,
      `"${log.action || ""}"`,
      `"${log.resourceType || ""}"`,
      `"${log.resourceId || ""}"`,
      `"${(log.resourceName || "").replace(/"/g, '""')}"`,
      `"${log.metadata?.method || ""}"`,
      `"${(log.metadata?.path || "").replace(/"/g, '""')}"`,
      `"${log.metadata?.ip || ""}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    );
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-logs-${dayjs().format("YYYY-MM-DD")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionTag = (act: string) => {
    const a = (act || "").toUpperCase();
    if (a === "CREATE") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          CREATE
        </span>
      );
    }
    if (a === "UPDATE") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-global-primary/10 text-global-primary border border-global-primary/30">
          UPDATE
        </span>
      );
    }
    if (a === "DELETE") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          DELETE
        </span>
      );
    }
    if (a.includes("LOGIN")) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          {act}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
        {act}
      </span>
    );
  };

  const columns: ColumnsType<IAuditLog> = [
    {
      title: "Timestamp",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (date: string) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-900">
            {dayjs(date).format("MMM DD, YYYY")}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            {dayjs(date).format("HH:mm:ss")} ({dayjs(date).fromNow()})
          </span>
        </div>
      ),
    },
    {
      title: "Actor / User",
      key: "user",
      width: 200,
      render: (_, record: IAuditLog) => {
        const initial = (record.userName || "U").charAt(0).toUpperCase();
        return (
          <div className="flex items-center gap-2.5">
            <Avatar
              size="small"
              className="bg-global-primary/15 text-global-primary font-bold text-xs shrink-0"
            >
              {initial}
            </Avatar>
            <div className="min-w-0">
              <span className="text-xs font-bold text-gray-900 block truncate">
                {record.userName || "System Operator"}
              </span>
              <span className="text-[10px] text-gray-500 block">
                {record.userRole || "Admin"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 110,
      render: (act: string) => getActionTag(act),
    },
    {
      title: "Resource",
      key: "resource",
      width: 220,
      render: (_, record: IAuditLog) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-900">
              {record.resourceType}
            </span>
            {record.resourceId && (
              <span className="text-[10px] text-gray-400 font-mono">
                #{record.resourceId}
              </span>
            )}
          </div>
          {record.resourceName && (
            <span className="text-xs text-gray-600 line-clamp-1">
              {record.resourceName}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Endpoint & IP",
      key: "endpoint",
      width: 190,
      render: (_, record: IAuditLog) => {
        const method = record.metadata?.method || (record.action === "CREATE" ? "POST" : record.action === "DELETE" ? "DELETE" : "PUT");
        return (
          <div className="flex flex-col text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-gray-600 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                {method}
              </span>
              <span className="text-gray-500 truncate max-w-32.5" title={record.metadata?.path}>
                {record.metadata?.path || "-"}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono mt-0.5">
              {record.metadata?.ip || "Local/Loopback"}
            </span>
          </div>
        );
      },
    },
    {
      title: "Inspect",
      key: "actions",
      width: 90,
      align: "center",
      render: (_, record: IAuditLog) => (
        <Button
          size="small"
          type="text"
          onClick={() => {
            setSelectedLog(record);
            setModalOpen(true);
          }}
          className="rounded-lg text-xs font-semibold text-gray-700 hover:text-global-primary hover:border-global-primary flex items-center gap-1"
        >
          <FiEye className="text-xs" />
          <span>View</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* 1. Header with Controls & Presets */}
      <AuditLogHeader
        activePreset={activePreset}
        dateRange={dateRange}
        onPresetChange={handlePresetChange}
        onRangeChange={handleRangeChange}
        onRefresh={() => {
          fetchLogs(true);
          fetchStats();
        }}
        loading={loading}
        refreshing={refreshing}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={setAutoRefresh}
        totalLogs={stats.totalLogs || total}
      />

      {/* 2. Executive Telemetry KPI Cards */}
      <AuditLogKpiCards
        totalLogs={stats.totalLogs || total}
        byAction={stats.byAction}
        loading={loading}
      />

      {/* 3. Instant Reactive Filter Bar */}
      <AuditLogFilterBar
        search={search}
        action={action}
        resourceType={resourceType}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onActionChange={(val) => {
          setAction(val);
          setPage(1);
        }}
        onResourceTypeChange={(val) => {
          setResourceType(val);
          setPage(1);
        }}
        onResetFilters={handleResetFilters}
        onExportCSV={handleExportCSV}
        isFiltered={isFiltered}
        totalFiltered={total}
      />

      {/* 4. Audit Log Table */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <Table
          loading={loading && !refreshing}
          columns={columns}
          dataSource={logs}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: limit,
            total,
            size: "small",
            showSizeChanger: true,
            pageSizeOptions: ["10", "15", "25", "50", "100"],
            onChange: (p, l) => {
              setPage(p);
              if (l !== limit) {
                setLimit(l);
              }
            },
            showTotal: (totalCount, range) => (
              <span className="text-xs text-gray-500">
                Showing <strong>{range[0]}-{range[1]}</strong> of <strong>{totalCount}</strong> logs
              </span>
            ),
          }}
          scroll={{ x: 950 }}
          className="overflow-x-auto"
        />
      </div>

      {/* 5. Detail & Payload Diff Inspector Modal */}
      <AuditLogDetailModal
        log={selectedLog}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedLog(null);
        }}
      />
    </div>
  );
}
