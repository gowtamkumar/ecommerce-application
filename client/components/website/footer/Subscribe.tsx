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
        <div className="flex py-6">
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
              <Input placeholder="Enter E-mail" />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Subscribe
            </Button>
          </Space.Compact>
          {/* <button
            disabled={!email}
            type="submit"
            className="bg-blue-600 text-white rounded-r-full px-4 py-2 font-semibold hover:bg-gray-800 focus:outline-none"
            onClick={handleSubmit}
          >
            Subscribe
          </button> */}
        </div>
      </Form>
    </>
  );
}
