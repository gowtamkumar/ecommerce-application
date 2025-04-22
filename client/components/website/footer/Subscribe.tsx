"use client";
import React, { useState } from "react";
import { saveLead } from "@/lib/apis/leads";
import { Button, Form, Input, message, Space } from "antd";

export default function Subscribe() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  async function handleSubmit(value: any) {
    setLoading(true);
    const lead = await saveLead(value);
    if (!lead.success) {
      message.error(lead.message);
      setLoading(false);
      return;
    }

    if (lead.success && lead.data) {
      message.success(lead.data.message);
    }

    setTimeout(() => {
      form.resetFields();
      setLoading(false);
    }, 2000);
  }

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleSubmit}
      autoComplete="off"
      scrollToFirstError={true}
    >
      <Space.Compact>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input E-mail",
            },
          ]}
        >
          <Input placeholder="Enter your email" size="large" />
        </Form.Item>

        <Button type="primary" size="large" htmlType="submit" loading={loading}>
          Subscribe
        </Button>
      </Space.Compact>
    </Form>
  );
}
