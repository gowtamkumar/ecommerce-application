"use client";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ColumnHeightOutlined,
    DownloadOutlined,
    ReloadOutlined,
    SearchOutlined,
    SyncOutlined
} from "@ant-design/icons";
import type { TableProps } from "antd";
import {
    Button,
    Card,
    Dropdown,
    Empty,
    Input,
    Table,
    Tag,
    Tooltip
} from "antd";
import React, { useMemo, useState } from "react";

export interface EnterpriseTableProps<T = any> extends Omit<TableProps<T>, "title"> {
  title?: React.ReactNode;
  subtitle?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRefresh?: () => void;
  exportFileName?: string;
  extraActions?: React.ReactNode;
}

/**
 * Standard semantic status tags helper for all dashboard tables
 */
export const renderStatusTag = (status: string) => {
  if (!status) return null;
  const s = status.toLowerCase();

  let color = "default";
  let icon: React.ReactNode = null;

  if (s.includes("deliv") || s.includes("paid") || s.includes("active") || s.includes("approve") || s.includes("complete")) {
    color = "success";
    icon = <CheckCircleOutlined />;
  } else if (s.includes("pend") || s.includes("unpaid") || s.includes("wait")) {
    color = "warning";
    icon = <ClockCircleOutlined />;
  } else if (s.includes("process") || s.includes("ship") || s.includes("transit")) {
    color = "processing";
    icon = <SyncOutlined spin={s.includes("process")} />;
  } else if (s.includes("cancel") || s.includes("fail") || s.includes("reject") || s.includes("return")) {
    color = "error";
    icon = <CloseCircleOutlined />;
  }

  return (
    <Tag color={color} icon={icon} className="uppercase font-bold px-2.5 py-0.5 rounded-full text-[10px] tracking-wider">
      {status}
    </Tag>
  );
};

export default function EnterpriseTable<T extends object = any>({
  title,
  subtitle,
  columns = [],
  dataSource = [],
  loading = false,
  searchable = true,
  searchPlaceholder = "Search records...",
  onRefresh,
  exportFileName = "table-export",
  extraActions,
  pagination = { pageSize: 10, showSizeChanger: true },
  ...restProps
}: EnterpriseTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [density, setDensity] = useState<"small" | "middle" | "large">("middle");

  // Filter dataSource based on local search if no custom onSearch is provided
  const filteredData = useMemo(() => {
    if (!searchTerm || !dataSource) return dataSource;
    const term = searchTerm.toLowerCase();

    return dataSource.filter((record: any) =>
      Object.keys(record).some((key) => {
        const val = record[key];
        if (typeof val === "string" || typeof val === "number") {
          return val.toString().toLowerCase().includes(term);
        }
        return false;
      })
    );
  }, [dataSource, searchTerm]);

  // Export CSV handler
  const handleExportCSV = () => {
    if (!filteredData || filteredData.length === 0) return;

    // Extract headers from columns
    const headers = columns
      .filter((col: any) => col.dataIndex || col.title)
      .map((col: any) => col.title || col.dataIndex);

    const keys = columns
      .filter((col: any) => col.dataIndex)
      .map((col: any) => col.dataIndex);

    const csvRows = [
      headers.join(","),
      ...filteredData.map((row: any) =>
        keys
          .map((k: string) => {
            const val = row[k];
            const escaped = (val === null || val === undefined ? "" : String(val)).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${exportFileName}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const densityMenuItems = [
    { key: "small", label: "Compact Density" },
    { key: "middle", label: "Default Density" },
    { key: "large", label: "Spacious Density" },
  ];

  return (
    <Card
      variant="borderless"
      className="shadow-sm rounded-2xl border border-gray-100 overflow-hidden bg-white"
      styles={{ body: { padding: 0 } }}
    >
      {/* Table Header Toolbar */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {title && (
            <div className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              {title}
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-gray-400 font-medium mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Actions & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {searchable && (
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="w-full sm:w-64 h-9 rounded-xl text-xs bg-gray-50 border-gray-200 focus:bg-white transition-all"
            />
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {onRefresh && (
              <Tooltip title="Refresh Data">
                <Button
                  icon={<ReloadOutlined className={loading ? "animate-spin" : ""} />}
                  onClick={onRefresh}
                  className="rounded-xl h-9 w-9 p-0 flex items-center justify-center border-gray-200 hover:text-blue-600"
                />
              </Tooltip>
            )}

            <Dropdown
              menu={{
                items: densityMenuItems,
                onClick: ({ key }) => setDensity(key as any),
              }}
              trigger={["click"]}
            >
              <Tooltip title="Table Density">
                <Button
                  icon={<ColumnHeightOutlined />}
                  className="rounded-xl h-9 w-9 p-0 flex items-center justify-center border-gray-200"
                />
              </Tooltip>
            </Dropdown>

            <Tooltip title="Export to CSV">
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExportCSV}
                className="rounded-xl h-9 px-3 flex items-center gap-1 text-xs font-bold border-gray-200 hover:border-blue-500 hover:text-blue-600"
              >
                Export
              </Button>
            </Tooltip>

            {extraActions}
          </div>
        </div>
      </div>

      {/* Main AntD Table */}
      <div className="overflow-x-auto">
        <Table<T>
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          size={density}
          pagination={
            pagination === false
              ? false
              : {
                  showTotal: (total, range) => (
                    <span className="text-xs text-gray-400 font-medium">
                      Showing {range[0]}-{range[1]} of {total} records
                    </span>
                  ),
                  className: "!px-4 !py-3 !m-0 border-t border-gray-100",
                  ...pagination,
                }
          }
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span className="text-gray-400 text-xs font-medium">No records found</span>}
                className="py-12"
              />
            ),
          }}
          scroll={{ x: "max-content" }}
          className="enterprise-table"
          {...restProps}
        />
      </div>
    </Card>
  );
}
