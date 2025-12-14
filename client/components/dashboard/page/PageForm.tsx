"use client";
import { ActionType } from "@/constants/constants";
import { createPage, updatePage } from "@/lib/apis/page";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal, setAction, setLoading } from "@/redux/features/global/globalSlice";
import { Form, Input, Modal, Radio, Select } from "antd";
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
      title={isEdit ? "Edit Page" : "Create Page"}
      open={global.action?.page}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={global.loading?.loading}
      width={800}
      okText={isEdit ? "Update" : "Create"}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          contentType: "markdown",
          status: "draft",
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter page title" }]}
        >
          <Input placeholder="Enter page title"

            onChange={(value) => {
              const slug = value.target.value
                .toLowerCase()
                .trim()
                .split(" ")
                .join("-");
              form.setFieldsValue({ slug });
            }} />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Please enter page slug" }]}
        >
          <Input placeholder="Enter URL-friendly slug (e.g., about-us)" />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please enter page content" }]}
        >
          <TextArea
            rows={10}
            placeholder="Enter page content (Markdown or HTML)"
          />
        </Form.Item>

        <Form.Item
          label="Content Type"
          name="contentType"
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value="markdown">Markdown</Radio>
            <Radio value="html">HTML</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Meta Description"
          name="metaDescription"
        >
          <TextArea
            rows={2}
            placeholder="Enter meta description for SEO (optional)"
          />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="draft">Draft</Select.Option>
            <Select.Option value="published">Published</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PageForm;
