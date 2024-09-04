"use client";
import { saveLead } from "@/lib/apis/leads";
import { Button, Form, Input, Space } from "antd";
import React, { useState } from "react";

export default function Subscribe() {
  const [success, setSuccess] = useState("");
  const [form] = Form.useForm();

  async function handleSubmit(value: any) {
    const lead = await saveLead(value);
    setSuccess("Newsletter Successfully");
    setTimeout(() => {
      setSuccess("");
      form.resetFields();
    }, 2000);
  }

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError={true}
      >
        {success}
        <div className="flex">
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

            <Button type="primary" size="large" htmlType="submit">
              Subscribe
            </Button>
          </Space.Compact>
        </div>
      </Form>
    </>
  );
}
