"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { selectGlobal, setAction } from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { discountStatusUpdate } from "@/lib/apis/discount";
import { useRouter } from "next/navigation";
import { ActionType } from "@/constants/constants";

export default function DiscountStatusUpdate() {
  const [loading, setLoading] = useState(false);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const value = { ...global.action.payload };
  const route = useRouter();
  
  useEffect(() => {
    form.setFieldsValue({ id: value.id });
  }, [form, value.id]);

  const handleSubmit = async (values: { id: number; status: string }) => {
    if (!values?.id || !values?.status) return;

    setLoading(true);

    try {
      const result = await discountStatusUpdate(values);

      if (!result.success) return;

      form.resetFields();
      dispatch(setAction({}));
      route.push("/dashboard/discounts");
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };

  const tailLayout = {
    wrapperCol: { offset: 6, span: 12 },
  };

  return (
    <Modal
      title="Status Update"
      open={global.action.type === ActionType.UPDATE}
      footer={null}
      width={400}
      onCancel={() => dispatch(setAction({}))}
    >
      <Form
        {...layout}
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[
            {
              required: true,
              message: "Status is Required",
            },
          ]}
        >
          <Select placeholder="Select">
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            size="small"
            className="w-full"
            type="primary"
            htmlType="submit"
            disabled={!value.id && !form.getFieldValue("status")}
            loading={loading}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
