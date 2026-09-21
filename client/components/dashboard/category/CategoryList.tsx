"use client";
import { CategoryTreeRow } from "@/lib/apis/categories";
import { getImageUrl } from "@/lib/utils/imageUrl";
import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Button, Image, Input, Popconfirm, Table, TableColumnsType, Tag, Tooltip } from "antd";
import React, { useEffect, useMemo, useState } from "react";

interface CategoryListProps {
  categories: CategoryTreeRow[];
  totalItem: number;
  loading: boolean;
  page: number;
  pageSize: number;
  search: string;
  deletingId: number | null;
  onPageChange: (page: number, pageSize: number) => void;
  onSearch: (search: string) => void;
  onEdit: (record: CategoryTreeRow) => void;
  onDelete: (id: number) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  totalItem,
  loading,
  page,
  pageSize,
  search,
  deletingId,
  onPageChange,
  onSearch,
  onEdit,
  onDelete,
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearch(localSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, search, onSearch]);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const columns: TableColumnsType<CategoryTreeRow> = useMemo(
    () => [
      {
        title: "Category Name",
        dataIndex: "name",
        key: "name",
        render: (_text, record) => {
          const displayName = record.name || record.label || "-";
          return (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                <Image
                  width={40}
                  height={40}
                  src={getImageUrl(record.image)}
                  alt={displayName}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{displayName}</span>
                {record.slug && <span className="text-xs text-gray-400">/{record.slug}</span>}
              </div>
            </div>
          );
        },
      },
      {
        title: "Parent Category",
        key: "parent",
        render: (_text, record: any) => {
          const parentName = record.parent?.name || record.parent?.label;
          return parentName ? (
            <Tag color="blue" className="rounded-full px-2">
              {parentName}
            </Tag>
          ) : (
            <span className="text-gray-400 text-xs">Root Level</span>
          );
        },
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        render: (text) => <span className="text-gray-500 line-clamp-1">{text || "-"}</span>,
      },
      {
        title: "Status",
        key: "active",
        dataIndex: "active",
        render: (active: boolean) => (
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
              active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-red-500"}`}></span>
            {active ? "Active" : "Inactive"}
          </div>
        ),
      },
      {
        title: "Featured",
        key: "isFeatured",
        dataIndex: "isFeatured",
        render: (value: boolean) =>
          value ? (
            <Tag color="cyan" className="rounded-full px-2 border-0 bg-cyan-50 text-cyan-700">
              Yes
            </Tag>
          ) : (
            <Tag color="default" className="rounded-full px-2 border-0 bg-gray-50 text-gray-500">
              No
            </Tag>
          ),
      },
      {
        title: "Action",
        key: "action",
        width: 100,
        align: "right",
        render: (_value, record) => (
          <div className="flex items-center justify-end gap-2">
            <Tooltip title="Edit Category">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined className="text-gray-500" />}
                className="hover:text-global-primary hover:bg-global-primary/5"
                onClick={() => onEdit(record)}
              />
            </Tooltip>
            <Popconfirm
              title="Delete Category"
              description="Are you sure you want to delete this category?"
              onConfirm={() => onDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true, loading: deletingId === record.id }}
            >
              <Tooltip title="Delete Category">
                <Button
                  type="text"
                  size="small"
                  danger
                  loading={deletingId === record.id}
                  icon={<DeleteOutlined />}
                  className="hover:bg-red-50"
                />
              </Tooltip>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [deletingId, onDelete, onEdit],
  );

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search categories by name or slug..."
          className="w-full sm:w-72 border-gray-200 hover:border-global-primary focus:border-global-primary transition-colors"
          style={{ borderRadius: "var(--button-border-radius)" }}
          value={localSearch}
          allowClear
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={categories}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: totalItem,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          onChange: onPageChange,
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} categories`,
          position: ["bottomRight"],
        }}
        size="middle"
        scroll={{ x: 800 }}
        rowClassName="hover:bg-gray-50 transition-colors cursor-default"
      />
    </div>
  );
};

export default CategoryList;