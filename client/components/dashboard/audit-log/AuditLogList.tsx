"use client";
import { getAuditLogs } from "@/lib/apis/audit-log";
import type { IAuditLog } from "@/lib/types/audit-log";
import { errorNotification } from "@/lib/utils/notification";
import { EyeOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";

const AuditLogList: React.FC = () => {
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedLog, setSelectedLog] = useState<IAuditLog | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const { RangePicker } = DatePicker;
  const { Option } = Select;

  // Filters
  const [filters, setFilters] = useState({
    action: undefined as string | undefined,
    resourceType: undefined as string | undefined,
    search: "",
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAuditLogs({
        ...filters,
        page,
        limit,
      });
      setLogs(response.data || []);
      setTotal(response.total || 0);
    } catch (error: any) {
      errorNotification({
        message: error.message || "Failed to fetch audit logs",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setFilters((prev) => ({
        ...prev,
        startDate: dates[0].toISOString(),
        endDate: dates[1].toISOString(),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
      }));
    }
    setPage(1);
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: "green",
      UPDATE: "blue",
      DELETE: "red",
      LOGIN: "cyan",
      LOGOUT: "default",
      FAILED_LOGIN: "orange",
    };
    return colors[action] || "default";
  };

  const showDetails = (log: IAuditLog) => {
    setSelectedLog(log);
    setDetailsVisible(true);
  };

  const columns: TableColumnsType<IAuditLog> = [
    {
      title: "Timestamp",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: string) => (
        <div className="flex flex-col">
          <span className="font-medium">
            {dayjs(date).format("MMM DD, YYYY")}
          </span>
          <span className="text-xs text-gray-500">
            {dayjs(date).format("HH:mm:ss")}
          </span>
        </div>
      ),
    },
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
      width: 200,
      render: (name: string, record: IAuditLog) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{name}</span>
          <span className="text-xs text-gray-500">{record.userRole}</span>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 120,
      render: (action: string) => (
        <Tag color={getActionColor(action)} className="font-medium">
          {action}
        </Tag>
      ),
    },
    {
      title: "Resource",
      key: "resource",
      width: 250,
      render: (_, record: IAuditLog) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {record.resourceType}
          </span>
          {record.resourceName && (
            <span className="text-sm text-gray-600">{record.resourceName}</span>
          )}
        </div>
      ),
    },
    {
      title: "Details",
      key: "details",
      width: 100,
      align: "center",
      render: (_, record: IAuditLog) => (
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => showDetails(record)}
          className="hover:!text-blue-600"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track all admin actions and system events
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <Space wrap size="middle" className="w-full">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search users or resources..."
            className="w-64"
            onChange={(e) => handleFilterChange("search", e.target.value)}
            allowClear
          />

          <Select
            placeholder="Action"
            className="w-40"
            onChange={(value) => handleFilterChange("action", value)}
            allowClear
          >
            <Option value="CREATE">Create</Option>
            <Option value="UPDATE">Update</Option>
            <Option value="DELETE">Delete</Option>
            <Option value="LOGIN">Login</Option>
            <Option value="LOGOUT">Logout</Option>
          </Select>

          <Select
            placeholder="Resource Type"
            className="w-48"
            onChange={(value) => handleFilterChange("resourceType", value)}
            allowClear
          >
            <Option value="Product">Product</Option>
            <Option value="Order">Order</Option>
            <Option value="User">User</Option>
            <Option value="Category">Category</Option>
            <Option value="Discount">Discount</Option>
            <Option value="Coupon">Coupon</Option>
          </Select>

          <RangePicker
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
            className="w-72"
          />

          <Button type="primary" icon={<FilterOutlined />} onClick={fetchLogs}>
            Apply Filters
          </Button>
        </Space>
      </Card>

      {/* Table */}
      <Card className="shadow-sm">
        <Table
          loading={loading}
          columns={columns}
          dataSource={logs}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              if (newPageSize !== limit) {
                setLimit(newPageSize);
              }
            },
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} logs`,

          }}
          scroll={{ x: 900 }}
          className="modern-table"
        />
      </Card>

      {/* Details Modal */}
      <Modal
        title="Audit Log Details"
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailsVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedLog && (
          <div className="space-y-4">
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Timestamp">
                {dayjs(selectedLog.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="Action">
                <Tag color={getActionColor(selectedLog.action)}>
                  {selectedLog.action}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="User">
                {selectedLog.userName}
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                {selectedLog.userRole}
              </Descriptions.Item>
              <Descriptions.Item label="Resource Type">
                {selectedLog.resourceType}
              </Descriptions.Item>
              <Descriptions.Item label="Resource ID">
                {selectedLog.resourceId || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Resource Name" span={2}>
                {selectedLog.resourceName || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="API Endpoint" span={2}>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {selectedLog.metadata?.method || "N/A"}{" "}
                  {selectedLog.metadata?.path || "-"}
                </code>
              </Descriptions.Item>
              <Descriptions.Item label="IP Address" span={2}>
                {selectedLog.metadata?.ip || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="User Agent" span={2}>
                <span className="text-xs break-all">
                  {selectedLog.metadata?.userAgent || "-"}
                </span>
              </Descriptions.Item>
            </Descriptions>

            {selectedLog.oldValues && (
              <div>
                <h3 className="font-semibold mb-2">Old Values:</h3>
                <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(selectedLog.oldValues, null, 2)}
                </pre>
              </div>
            )}

            {selectedLog.newValues && (
              <div>
                <h3 className="font-semibold mb-2">New Values:</h3>
                <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(selectedLog.newValues, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuditLogList;
