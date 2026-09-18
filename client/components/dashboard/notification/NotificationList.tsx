"use client";

import type { TableColumnsType } from "antd";
import {
    Button,
    Input,
    Popconfirm,
    Select,
    Table,
    Tooltip,
} from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useMemo, useState } from "react";
import {
    FiAlertCircle,
    FiAlertTriangle,
    FiBell,
    FiCheckCircle,
    FiExternalLink,
    FiEye,
    FiGift,
    FiRefreshCw,
    FiSearch,
    FiShoppingBag,
    FiTrash2,
    FiUser,
    FiX,
} from "react-icons/fi";

import { NOTIFICATION_TYPES } from "@/constants/constants";
import {
    deleteNotification,
    readNotification,
} from "@/lib/apis/notification";
import {
    errorNotification,
    successNotification,
} from "@/lib/utils/notification";
import NotificationDetailModal from "./NotificationDetailModal";

dayjs.extend(relativeTime);

interface NotificationListProps {
  notifications: any[];
  users: any[];
  loading: boolean;
  onRefresh: () => void;
  onUpdateNotifications: (updated: any[]) => void;
  externalFilterTab?: string;
}

export default function NotificationList({
  notifications = [],
  users = [],
  loading = false,
  onRefresh,
  onUpdateNotifications,
  externalFilterTab,
}: NotificationListProps) {
  // Filters
  const [activeStatusTab, setActiveStatusTab] = useState<string>(
    externalFilterTab || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Batch Selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);

  // Inspection Modal
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectItem, setInspectItem] = useState<any | null>(null);

  // Sync external filter tab if parent KPI card is clicked
  useEffect(() => {
    if (externalFilterTab) {
      setActiveStatusTab(externalFilterTab);
    }
  }, [externalFilterTab]);

  // Debounce search query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fast user map for O(1) lookup
  const userMap = useMemo(() => {
    const map: Record<string, any> = {};
    users.forEach((u) => {
      map[u.id] = u;
    });
    return map;
  }, [users]);

  // Filtered Notifications based on status tab, search, type, and user
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // 1. Status Tab filter
      if (activeStatusTab === "unread" && item.isRead) {
        return false;
      }
      if (activeStatusTab === "read" && !item.isRead) {
        return false;
      }
      if (activeStatusTab === "critical") {
        const isCritical = [
          "ServerDown",
          "PaymentGatewayError",
          "CronJobFailed",
          "HighTraffic",
          "SmsEmailFailed",
          "AdminPaymentFailed",
        ].includes(item.type);
        if (!isCritical) return false;
      }
      if (activeStatusTab === "promotional") {
        const isPromo = [
          "NewOffer",
          "General",
          "Maintenance",
          "PromotionalMarketing",
        ].includes(item.type);
        if (!isPromo) return false;
      }

      // 2. Type Filter
      if (selectedType && item.type !== selectedType) {
        return false;
      }

      // 3. User Filter
      if (selectedUserId && String(item.userId) !== String(selectedUserId)) {
        return false;
      }

      // 4. Free-text Omni-Search
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const msgMatch = item.message?.toLowerCase().includes(q);
        const urlMatch = item.offerUrl?.toLowerCase().includes(q);
        const typeMatch = item.type?.toLowerCase().includes(q);
        const user = userMap[item.userId];
        const userMatch =
          user?.name?.toLowerCase().includes(q) ||
          user?.email?.toLowerCase().includes(q);

        if (!titleMatch && !msgMatch && !urlMatch && !typeMatch && !userMatch) {
          return false;
        }
      }

      return true;
    });
  }, [
    notifications,
    activeStatusTab,
    selectedType,
    selectedUserId,
    debouncedSearch,
    userMap,
  ]);

  // Actions
  const handleMarkAsRead = async (id: string) => {
    try {
      await readNotification({ id });
      const updated = notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      onUpdateNotifications(updated);
      successNotification({ message: "Notification marked as read" });
    } catch (err: any) {
      errorNotification({ message: err.message || "Failed to mark as read" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      const updated = notifications.filter((n) => n.id !== id);
      onUpdateNotifications(updated);
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
      successNotification({ message: "Notification deleted" });
    } catch (err: any) {
      errorNotification({ message: err.message || "Failed to delete notification" });
    }
  };

  // Batch Mark Selected as Read
  const handleBatchMarkAsRead = async () => {
    if (selectedRowKeys.length === 0) return;
    setBatchLoading(true);
    try {
      await Promise.all(
        selectedRowKeys.map((id) => readNotification({ id: String(id) }))
      );
      const updated = notifications.map((n) =>
        selectedRowKeys.includes(n.id) ? { ...n, isRead: true } : n
      );
      onUpdateNotifications(updated);
      successNotification({
        message: `Marked ${selectedRowKeys.length} notifications as read`,
      });
      setSelectedRowKeys([]);
    } catch (err: any) {
      errorNotification({ message: err.message || "Failed to mark selected" });
    } finally {
      setBatchLoading(false);
    }
  };

  // Batch Delete
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    setBatchLoading(true);
    try {
      await Promise.all(
        selectedRowKeys.map((id) => deleteNotification(String(id)))
      );
      const updated = notifications.filter(
        (n) => !selectedRowKeys.includes(n.id)
      );
      onUpdateNotifications(updated);
      successNotification({
        message: `Deleted ${selectedRowKeys.length} notifications`,
      });
      setSelectedRowKeys([]);
    } catch (err: any) {
      errorNotification({ message: err.message || "Failed to delete selected" });
    } finally {
      setBatchLoading(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setActiveStatusTab("all");
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedType(null);
    setSelectedUserId(null);
  };

  const hasActiveFilters =
    activeStatusTab !== "all" ||
    searchQuery.trim() !== "" ||
    selectedType !== null ||
    selectedUserId !== null;

  // Render Type Badge with Icon
  const renderTypeTag = (type: string) => {
    let icon = <FiBell />;
    let colorClass = "bg-blue-50 text-blue-700 border-blue-200";

    if (
      [
        "ServerDown",
        "PaymentGatewayError",
        "CronJobFailed",
        "AdminPaymentFailed",
      ].includes(type)
    ) {
      icon = <FiAlertTriangle />;
      colorClass = "bg-rose-50 text-rose-700 border-rose-200";
    } else if (type === "HighTraffic" || type === "AdminLowStock") {
      icon = <FiAlertCircle />;
      colorClass = "bg-amber-50 text-amber-800 border-amber-200";
    } else if (type === "NewOffer" || type === "PromotionalMarketing") {
      icon = <FiGift />;
      colorClass = "bg-purple-50 text-purple-700 border-purple-200";
    } else if (type.startsWith("Order") || type === "AdminNewOrder") {
      icon = <FiShoppingBag />;
      colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (type.startsWith("User")) {
      icon = <FiUser />;
      colorClass = "bg-cyan-50 text-cyan-700 border-cyan-200";
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${colorClass} shrink-0`}
      >
        <span className="text-xs">{icon}</span>
        <span>{type}</span>
      </span>
    );
  };

  const columns: TableColumnsType<any> = [
    {
      title: "Category & Alert",
      key: "alert",
      width: 320,
      render: (_, record) => {
        return (
          <div
            className="flex items-start gap-3 cursor-pointer group"
            onClick={() => {
              setInspectItem(record);
              setInspectModalOpen(true);
            }}
          >
            <div className="pt-0.5">{renderTypeTag(record.type)}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm tracking-tight break-words group-hover:text-global-primary transition-colors ${
                    record.isRead
                      ? "text-gray-600 font-medium"
                      : "text-gray-900 font-black"
                  }`}
                >
                  {record.title}
                </span>
                {!record.isRead && (
                  <span className="w-2 h-2 rounded-full bg-global-primary shrink-0 animate-pulse" />
                )}
              </div>
              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 m-0 break-words">
                {record.message}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Target / Recipient",
      key: "recipient",
      width: 200,
      render: (_, record) => {
        const user = userMap[record.userId];
        return (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center shrink-0 border border-gray-200">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : <FiUser />}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-gray-800 truncate">
                {user?.name || `Customer #${record.userId || "All"}`}
              </div>
              {user?.email && (
                <div className="text-[11px] text-gray-400 truncate">
                  {user.email}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Action Link",
      dataIndex: "offerUrl",
      key: "offerUrl",
      width: 160,
      render: (url) => {
        if (!url) return <span className="text-gray-400 text-xs">—</span>;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-global-primary hover:underline truncate max-w-[150px]"
          >
            <FiExternalLink className="shrink-0" />
            <span className="truncate">{url}</span>
          </a>
        );
      },
    },
    {
      title: "Logged Time",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: "descend",
      render: (date) => (
        <div className="text-xs">
          <div className="font-semibold text-gray-800">
            {dayjs(date).fromNow()}
          </div>
          <div className="text-[11px] text-gray-400">
            {dayjs(date).format("MMM DD, YYYY • h:mm A")}
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "right",
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1.5">
          <Tooltip title="View Alert Details">
            <Button
              size="small"
              type="text"
              icon={<FiEye className="text-sm text-gray-600" />}
              onClick={() => {
                setInspectItem(record);
                setInspectModalOpen(true);
              }}
              className="hover:!text-global-primary hover:!bg-global-primary/10"
            />
          </Tooltip>

          {!record.isRead && (
            <Tooltip title="Mark as Read">
              <Button
                size="small"
                type="text"
                icon={<FiCheckCircle className="text-sm text-emerald-600" />}
                onClick={() => handleMarkAsRead(record.id)}
                className="hover:!text-emerald-700 hover:!bg-emerald-50"
              />
            </Tooltip>
          )}

          <Popconfirm
            title="Delete this alert?"
            description="Are you sure you want to remove this record?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Alert">
              <Button
                size="small"
                type="text"
                danger
                icon={<FiTrash2 className="text-sm" />}
                className="hover:!bg-rose-50"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const statusTabs = [
    { key: "all", label: "All Alerts", count: notifications.length },
    {
      key: "unread",
      label: "Unread",
      count: notifications.filter((n) => !n.isRead).length,
    },
    {
      key: "critical",
      label: "Critical Infrastructure",
      count: notifications.filter((n) =>
        [
          "ServerDown",
          "PaymentGatewayError",
          "CronJobFailed",
          "HighTraffic",
          "SmsEmailFailed",
          "AdminPaymentFailed",
        ].includes(n.type)
      ).length,
    },
    {
      key: "promotional",
      label: "Promotions",
      count: notifications.filter((n) =>
        ["NewOffer", "General", "Maintenance", "PromotionalMarketing"].includes(
          n.type
        )
      ).length,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* 1. Status Filter Tabs */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {statusTabs.map((tab) => {
            const isActive = activeStatusTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveStatusTab(tab.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-global-primary text-white shadow-xs"
                    : "bg-gray-100/80 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <Button
          icon={<FiRefreshCw className={loading ? "animate-spin" : ""} />}
          onClick={onRefresh}
          loading={loading}
          size="small"
          className="rounded-xl text-xs font-semibold !border-gray-200 text-gray-600 hover:!border-global-primary hover:!text-global-primary"
        >
          Refresh Feed
        </Button>
      </div>

      {/* 2. Omni-Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
          {/* Omni Search Input */}
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search title, message, URL, user..."
              prefix={<FiSearch className="text-gray-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              className="rounded-xl h-10 border-gray-200"
            />
          </div>

          {/* Type Dropdown */}
          <Select
            placeholder="Filter by Type"
            value={selectedType}
            onChange={setSelectedType}
            allowClear
            showSearch
            className="w-full sm:w-48 h-10"
          >
            {NOTIFICATION_TYPES.map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>

          {/* User Dropdown */}
          <Select
            placeholder="Filter by Recipient"
            value={selectedUserId}
            onChange={setSelectedUserId}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              String(option?.children || "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            className="w-full sm:w-52 h-10"
          >
            {users.map((u) => (
              <Select.Option key={u.id} value={u.id}>
                {u.name ? `${u.name} (${u.email})` : u.email}
              </Select.Option>
            ))}
          </Select>

          {hasActiveFilters && (
            <Button
              type="text"
              icon={<FiX className="text-xs" />}
              onClick={handleResetFilters}
              className="rounded-xl text-xs text-rose-600 hover:!bg-rose-50 font-semibold"
            >
              Reset Filters
            </Button>
          )}
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Showing <strong>{filteredNotifications.length}</strong> of {notifications.length} alerts
        </span>
      </div>

      {/* 3. Batch Action Bar (Appears when rows are selected) */}
      {selectedRowKeys.length > 0 && (
        <div className="p-3 px-5 bg-amber-50 border-b border-amber-200/80 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs font-bold text-amber-900">
              {selectedRowKeys.length} notification{selectedRowKeys.length > 1 ? "s" : ""} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="small"
              icon={<FiCheckCircle className="text-emerald-600" />}
              onClick={handleBatchMarkAsRead}
              loading={batchLoading}
              className="rounded-lg text-xs font-semibold !border-emerald-200 !bg-emerald-50 text-emerald-800 hover:!bg-emerald-100"
            >
              Mark Read
            </Button>

            <Popconfirm
              title={`Delete ${selectedRowKeys.length} selected notifications?`}
              onConfirm={handleBatchDelete}
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                size="small"
                danger
                icon={<FiTrash2 />}
                loading={batchLoading}
                className="rounded-lg text-xs font-semibold"
              >
                Delete Selected
              </Button>
            </Popconfirm>

            <Button
              size="small"
              onClick={() => setSelectedRowKeys([])}
              className="rounded-lg text-xs"
            >
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {/* 4. Table */}
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
        }}
        columns={columns}
        dataSource={filteredNotifications}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) => (
            <span className="text-xs text-gray-500">
              {range[0]}-{range[1]} of {total} alerts
            </span>
          ),
        }}
        scroll={{ x: 800 }}
        className="modern-alert-table"
      />

      {/* 5. Inspection Modal */}
      <NotificationDetailModal
        open={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        notification={inspectItem}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
        userMap={userMap}
      />
    </div>
  );
}
