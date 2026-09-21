"use client";
import { type Brand } from "@/lib/apis/brand";
import { getImageUrl } from "@/lib/utils/imageUrl";
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { TableColumnsType, TableColumnType } from "antd";
import { Button, Image, Input, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { useMemo, useState } from "react";
import Highlighter from "react-highlight-words";

interface BrandListProps {
  brands: Brand[];
  loading: boolean;
  deletingId: number | null;
  onEdit: (record: Brand) => void;
  onDelete: (id: number) => void;
}

type DataIndex = keyof Pick<Brand, "name" | "status">;

const BrandList: React.FC<BrandListProps> = ({ brands, loading, deletingId, onEdit, onDelete }) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState<DataIndex | "">("");

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const columns = useMemo<TableColumnsType<Brand>>(() => {
    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<Brand> => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0] as string}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    });

    return [
      {
        title: "Brand Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.length - b.name.length,
        ...getColumnSearchProps("name"),
        render: (text) => <span className="font-semibold text-gray-900">{text}</span>,
      },
      {
        title: "Brand Logo",
        dataIndex: "image",
        key: "image",
        width: 100,
        render: (value) =>
          value ? (
            <Image
              width={60}
              height={40}
              alt={value}
              src={getImageUrl(value)}
              className="rounded-lg object-contain border border-gray-200 bg-white p-1"
            />
          ) : (
            <span className="text-gray-400">—</span>
          ),
      },
      {
        title: "Status",
        key: "status",
        ...getColumnSearchProps("status"),
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.status.length - b.status.length,
        render: (_, record) => (
          <Tag color={record.status === "Active" ? "green" : "red"} className="font-medium">
            {record?.status}
          </Tag>
        ),
      },
      {
        title: "Action",
        key: "action",
        fixed: "right",
        width: 120,
        render: (_, record) => (
          <div className="flex gap-2 justify-end">
            <Tooltip title="Edit Brand">
              <Button
                size="small"
                icon={<EditOutlined />}
                className="hover:bg-green-50 hover:text-green-600"
                onClick={() => onEdit(record)}
              />
            </Tooltip>
            <Popconfirm
              title={
                <span>
                  Are you sure <span className="font-bold text-red-600">delete</span> this Brand?
                </span>
              }
              onConfirm={() => onDelete(record.id)}
              placement="left"
              okText="Yes"
              okType="danger"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Tooltip title="Delete Brand">
                <Button
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
    ];
  }, [deletingId, onDelete, onEdit, searchText, searchedColumn]);

  return (
    <Table
      scroll={{ x: "auto" }}
      loading={loading}
      columns={columns}
      rowKey="id"
      dataSource={brands}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      size="middle"
      className="modern-table"
      rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
    />
  );
};

export default BrandList;