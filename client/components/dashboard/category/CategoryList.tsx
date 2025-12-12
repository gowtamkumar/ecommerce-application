'use client'
import { ActionType } from "@/constants/constants";
import { deleteCategory, getAntdCategories } from "@/lib/apis/categories";
import { getImageUrl, getUploadImageUrl } from "@/lib/utils/imageUrl";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { Button, Image, Input, Popconfirm, Table, Tag } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface DataType {
  key: React.ReactNode;
  label: string;
  slug: string;
  image: string;
  active: boolean;
  isFeatured: boolean;
  children?: DataType[];
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const categories = await getAntdCategories();
      setCategories(categories.data);
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    dispatch(setLoading({ delete: true }));
    try {
      await deleteCategory(id);
      successNotification({ message: "Successfully deleted" });
      fetchData();
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ delete: false }));
      dispatch(setAction({}));
    }
  };

  // Basic client-side filtering (if API doesn't support search params directly effectively or for small datasets)
  // The original code used column-based filtering. Replacing with a global client-side filter for simplicity and UX.
  const filteredCategories = categories.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );



  const columns: TableColumnsType<DataType> = [
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
      )
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span className="text-gray-500 line-clamp-1">{text || "-"}</span>
    },
    {
      title: "Status",
      key: "active",
      dataIndex: "active",
      render: (active: boolean) => (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-500'}`}></span>
          {active ? "Active" : "Inactive"}
        </div>
      ),
    },
    {
      title: "Featured",
      key: "isFeatured",
      dataIndex: "isFeatured",
      render: (value: boolean) => (
        value ? (
          <Tag color="cyan" className="rounded-full px-2 border-0 bg-cyan-50 text-cyan-700">Yes</Tag>
        ) : (
          <Tag color="red" className="rounded-full px-2 border-0 bg-red-50 text-red-700">No</Tag>
        )
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (value) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined className="text-gray-500" />}
            className="hover:!text-blue-600 hover:bg-blue-50"
            title="Edit"
            onClick={() => {
              const newData = { ...value };
              if (newData.image) {
                const file = {
                  uid: Math.random() * 1000 + "",
                  name: `image`,
                  status: "done",
                  fileName: newData.image,
                  url: getUploadImageUrl(newData.image),
                };
                newData.fileList = [file];
              }
              dispatch(
                setAction({
                  type: ActionType.UPDATE,
                  payload: newData,
                })
              );
            }}
          />
          <Popconfirm
            title="Delete Category"
            description="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(value.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              size="small"
              danger
              loading={global.loading?.delete}
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
      {/* Toolbar */}
      <div className="mb-4">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search categories..."
          className="w-full sm:w-64 rounded-xl border-gray-200 hover:border-black focus:border-black transition-colors"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table
        loading={global.loading.loading}
        columns={columns}
        dataSource={filteredCategories}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          position: ["bottomRight"]
        }}
        size="middle"
        scroll={{ x: 800 }}
        rowClassName="hover:bg-gray-50 transition-colors cursor-default"
      />
    </div>
  );
};

export default CategoryList;
