"use client";
import { Button, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { FiDownload, FiSearch, FiX } from "react-icons/fi";

const { Option } = Select;

interface AuditLogFilterBarProps {
  search: string;
  action?: string;
  resourceType?: string;
  onSearchChange: (val: string) => void;
  onActionChange: (val?: string) => void;
  onResourceTypeChange: (val?: string) => void;
  onResetFilters: () => void;
  onExportCSV: () => void;
  isFiltered: boolean;
  totalFiltered: number;
}

export default function AuditLogFilterBar({
  search,
  action,
  resourceType,
  onSearchChange,
  onActionChange,
  onResourceTypeChange,
  onResetFilters,
  onExportCSV,
  isFiltered,
  totalFiltered,
}: AuditLogFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  // Keep local search in sync if reset externally
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
      {/* Search & Select Controls */}
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Search Input with instant debounce */}
        <div className="w-full sm:w-72">
          <Input
            prefix={<FiSearch className="text-gray-400 mr-1" />}
            placeholder="Search users or resources..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            allowClear
            className="rounded-xl border-gray-200 text-xs shadow-sm hover:border-global-primary focus:border-global-primary h-9"
          />
        </div>

        {/* Action Filter */}
        <div className="w-36">
          <Select
            placeholder="Filter Action"
            value={action}
            onChange={onActionChange}
            allowClear
            className="w-full text-xs"
            dropdownStyle={{ borderRadius: "12px" }}
          >
            <Option value="CREATE">CREATE</Option>
            <Option value="UPDATE">UPDATE</Option>
            <Option value="DELETE">DELETE</Option>
            <Option value="LOGIN">LOGIN</Option>
            <Option value="LOGOUT">LOGOUT</Option>
            <Option value="FAILED_LOGIN">FAILED LOGIN</Option>
          </Select>
        </div>

        {/* Resource Type Filter */}
        <div className="w-44">
          <Select
            placeholder="Filter Resource"
            value={resourceType}
            onChange={onResourceTypeChange}
            allowClear
            className="w-full text-xs"
            dropdownStyle={{ borderRadius: "12px" }}
          >
            <Option value="Product">Product</Option>
            <Option value="Order">Order</Option>
            <Option value="User">User / Staff</Option>
            <Option value="Category">Category</Option>
            <Option value="Discount">Discount</Option>
            <Option value="Coupon">Coupon</Option>
            <Option value="Brand">Brand</Option>
            <Option value="Setting">Settings</Option>
            <Option value="Customer">Customer</Option>
            <Option value="Refund">Refund</Option>
            <Option value="Return">Return</Option>
          </Select>
        </div>

        {/* Reset Filters button */}
        {isFiltered && (
          <Button
            size="small"
            type="text"
            onClick={onResetFilters}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg flex items-center gap-1 h-9 px-2.5 font-semibold"
          >
            <FiX className="text-xs" />
            <span>Clear Filters</span>
          </Button>
        )}
      </div>

      {/* Export CSV and Count status */}
      <div className="flex items-center justify-between lg:justify-end gap-3 border-t lg:border-t-0 pt-2 lg:pt-0 border-gray-100">
        <span className="text-xs text-gray-500 font-medium">
          Found <strong className="text-gray-900">{totalFiltered}</strong> logs
        </span>

        <Button
          onClick={onExportCSV}
          className="rounded-xl border-gray-200 hover:border-global-primary hover:text-global-primary text-gray-700 text-xs font-semibold flex items-center gap-1.5 h-9"
          title="Export audit logs to CSV"
        >
          <FiDownload className="text-xs" />
          <span>Export CSV</span>
        </Button>
      </div>
    </div>
  );
}
