"use client";
import { ActionType } from "@/constants/constants";
import { deletePage, getPages } from "@/lib/apis/page";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal, setAction, setLoading } from "@/redux/features/global/globalSlice";
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Popconfirm, Table, Tag, Tooltip } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageForm from "./PageForm";

const PageList: React.FC = () => {
  const [pages, setPages] = useState([]);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    try {
      dispatch(setLoading({ loading: true }));
      const res = await getPages();
      setPages(res?.data || []);
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    try {
      dispatch(setLoading({ delete: true }));
      const res = await deletePage(id);
      setPages((prev) => prev.filter((page: any) => page.id !== id));
      successNotification({ message: res.message || "Page deleted successfully" });
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ delete: false }));
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "30%",
      render: (text: string) => (
        <span className="font-semibold text-gray-700">{text}</span>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (text: string) => (
        <span className="text-gray-500 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          /{text}
        </span>
      ),
    },
    {
      title: "Content Type",
      dataIndex: "contentType",
      key: "contentType",
      render: (value: string) => (
        <Tag color="cyan" className="rounded-full px-3 py-1 bg-cyan-50 text-cyan-600 border-cyan-100">
          {value}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        const isPublished = value === "published";
        return (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${isPublished
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-orange-50 text-orange-600 border-orange-100"
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-orange-500"}`} />
            <span className="capitalize">{value}</span>
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: "100px",
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit Page">
            <button
              onClick={() => {
                dispatch(
                  setAction({
                    page: true,
                    type: ActionType.UPDATE,
                    payload: value,
                  })
                );
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-global-primary/10 text-gray-400 hover:text-global-primary transition-colors"
            >
              <EditOutlined />
            </button>
          </Tooltip>

          <Popconfirm
            title={
              <div className="p-2">
                <h4 className="font-medium text-gray-900 mb-1">Delete Page?</h4>
                <p className="text-gray-500 text-sm">This action cannot be undone.</p>
              </div>
            }
            onConfirm={() => handleDelete(value.id)}
            placement="bottomRight"
            okText="Delete"
            okType="danger"
            cancelText="Cancel"
            icon={<QuestionCircleOutlined className="text-red-500" />}
          >
            <Tooltip title="Delete Page">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                disabled={global.loading?.delete}
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        className="premium-table"
        scroll={{ x: "auto" }}
        loading={global.loading.loading}
        columns={columns}
        dataSource={pages}
        pagination={{
          pageSize: 10,
          className: "px-6 pb-6",
        }}
        size="middle"
        rowKey="id"
      />
      {global.action?.page && <PageForm fetchData={fetchData} />}
    </>
  );
};

export default PageList;
