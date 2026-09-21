"use client";
import { CategoryTreeRow } from "@/lib/apis/categories";
import { getImageUrl } from "@/lib/utils/imageUrl";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { TableColumnsType } from "antd";
import { Button, Image, Input, Popconfirm, Table, Tag } from "antd";
import { useMemo, useState } from "react";

interface CategoryListProps {
  categories: CategoryTreeRow[];
  loading: boolean;
  deletingId?: number | null;
  onEdit: (record: CategoryTreeRow) => void;
  onDelete: (id: number) => void;
}

const CategoryList = ({ categories, loading, deletingId, onEdit, onDelete }: CategoryListProps) => {
  const [searchText, setSearchText] = useState("");

  const filteredCategories = useMemo(
    () => categories.filter((item) => item.label.toLowerCase().includes(searchText.toLowerCase())),
    [categories, searchText],
  );

  const columns: TableColumnsType<CategoryTreeRow> = [
    {
      title: "Category Name",
      dataIndex: "label",
      key: "label",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
            <Image
              width={48}
              height={48}
              src={getImageUrl(record.image)}
              alt={text}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <span className="font-semibold text-gray-900">{text}</span>
        </div>
      ),
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
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
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
          <Tag color="red" className="rounded-full px-2 border-0 bg-red-50 text-red-700">
            No
          </Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_value, record) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined className="text-gray-500" />}
            className="hover:text-global-primary hover:bg-global-primary/5"
            title="Edit"
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Delete Category"
            description="Are you sure you want to delete this category?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              size="small"
              danger
              loading={deletingId === record.id}
              icon={<DeleteOutlined />}
              className="hover:bg-red-50"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search categories..."
          className="w-full sm:w-64 border-gray-200 hover:border-global-primary focus:border-global-primary transition-colors"
          style={{ borderRadius: "var(--button-border-radius)" }}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={filteredCategories}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
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