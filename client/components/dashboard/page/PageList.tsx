"use client";
import { ActionType } from "@/constants/constants";
import { deletePage, getPages } from "@/lib/apis/page";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal, setAction, setLoading } from "@/redux/features/global/globalSlice";
import { FormOutlined, QuestionCircleOutlined, RestOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Tag } from "antd";
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
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Content Type",
      dataIndex: "contentType",
      key: "contentType",
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => (
        <Tag color={value === "published" ? "green" : "orange"}>{value}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      className: "text-end",
      width: "10%",
      render: (value: any) => (
        <div className="gap-2">
          <Button
            size="small"
            icon={<FormOutlined />}
            title="Edit"
            className="me-1"
            onClick={() => {
              dispatch(
                setAction({
                  page: true,
                  type: ActionType.UPDATE,
                  payload: value,
                })
              );
            }}
          />
          <Popconfirm
            title={
              <span>
                Are you sure <span className="text-danger fw-bold">delete</span>{" "}
                this page?
              </span>
            }
            onConfirm={() => handleDelete(value.id)}
            placement="left"
            okText="Yes"
            okType="danger"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              size="small"
              danger
              loading={global.loading?.delete}
              icon={<RestOutlined />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        scroll={{ x: "auto" }}
        loading={global.loading.loading}
        columns={columns}
        dataSource={pages}
        pagination={{ pageSize: 10 }}
        bordered
        size="small"
      />
      {global.action?.page && <PageForm fetchData={fetchData} />}
    </>
  );
};

export default PageList;
