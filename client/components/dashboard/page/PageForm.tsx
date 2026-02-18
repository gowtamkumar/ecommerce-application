"use client";
import { ActionType } from "@/constants/constants";
import { createPage, updatePage } from "@/lib/apis/page";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal, setAction, setLoading } from "@/redux/features/global/globalSlice";
import { FileTextOutlined, LinkOutlined } from "@ant-design/icons";
import { Divider, Form, Input, Modal, Radio, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const PageForm: React.FC<{ fetchData: () => void }> = ({ fetchData }) => {
  const [form] = Form.useForm();
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const isEdit = global.action?.type === ActionType.UPDATE;

  useEffect(() => {
    if (isEdit && global.action?.payload) {
      form.setFieldsValue(global.action.payload);
    } else {
      form.resetFields();
    }
  }, [global.action, isEdit, form]);

  const handleSubmit = async (values: any) => {
    try {
      dispatch(setLoading({ loading: true }));

      if (isEdit) {
        const res = await updatePage(global.action?.payload?.id, values);
        successNotification({ message: res.message || "Page updated successfully" });
      } else {
        const res = await createPage(values);
        successNotification({ message: res.message || "Page created successfully" });
      }

      fetchData();
      handleCancel();
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    dispatch(setAction({}));
  };

  return (
    <Modal
      title={
        <div className="flex flex-col gap-1 pb-2 border-b border-gray-100 mb-6">
          <span className="text-xl font-bold text-gray-800">{isEdit ? "Edit Page" : "Create New Page"}</span>
          <span className="text-sm font-normal text-gray-500">Configure your custom page settings below</span>
        </div>
      }
      open={global.action?.page}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={global.loading?.loading}
      width={700}
      okText={isEdit ? "Update Page" : "Create Page"}
      okButtonProps={{ className: "bg-global-primary hover:bg-global-primary/90", size: "large" }}
      cancelButtonProps={{ size: "large" }}
      centered
      className="premium-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          contentType: "markdown",
          status: "draft",
        }}
        className="pt-2"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Page Title"
            name="title"
            rules={[{ required: true, message: "Please enter page title" }]}
            tooltip="The name of your page as it appears in navigation"
          >
            <Input
              size="large"
              prefix={<FileTextOutlined className="text-gray-400" />}
              placeholder="e.g. About Us"
              onChange={(value) => {
                if (!isEdit) {
                  const slug = value.target.value
                    .toLowerCase()
                    .trim()
                    .split(" ")
                    .join("-");
                  form.setFieldsValue({ slug });
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="URL Slug"
            name="slug"
            rules={[{ required: true, message: "Please enter page slug" }]}
            tooltip="The URL path for this page"
          >
            <Input
              size="large"
              prefix={<LinkOutlined className="text-gray-400" />}
              placeholder="e.g. about-us"
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please enter page content" }]}
          className="mb-6"
        >
          <TextArea
            rows={12}
            placeholder="Write your page content here..."
            className="font-mono text-sm"
            showCount
          />
        </Form.Item>

        <Divider dashed className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            label="Content Format"
            name="contentType"
            rules={[{ required: true }]}
            className="mb-0"
          >
            <Radio.Group size="large" buttonStyle="solid" className="w-full flex">
              <Radio.Button value="markdown" className="flex-1 text-center">Markdown</Radio.Button>
              <Radio.Button value="html" className="flex-1 text-center">HTML</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Publish Status"
            name="status"
            rules={[{ required: true }]}
            className="mb-0"
          >
            <Select size="large">
              <Select.Option value="draft">Draft (Hidden)</Select.Option>
              <Select.Option value="published">Published (Visible)</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label="Meta Description (SEO)"
          name="metaDescription"
          className="mt-6 mb-0"
          tooltip="A brief summary for search engines"
        >
          <TextArea
            rows={2}
            placeholder="Enter a brief description for SEO purposes..."
            maxLength={160}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PageForm;
