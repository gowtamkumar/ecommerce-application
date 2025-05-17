"use client";
import { saveContact, updateContact } from "@/lib/apis/contact";
import { Button, Form, Input } from "antd";
import React, { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [form] = Form.useForm();

  const handleSubmit = async (values: { id: number; status: string }) => {
    setLoading(true);

    try {
      const result = values.id
        ? await updateContact(values)
        : await saveContact(values);

      console.log("result", result);

      if (result.success) {
        setSuccess(result.message);
        setLoading(false);
      }

      if (!result.success) {
        setSuccess(result.message);
        setLoading(false);
        return;
      }
      form.resetFields();

      setTimeout(() => {
        setSuccess("");
        setLoading(false);
      }, 5000);
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Name is Required",
            },
          ]}
        >
          <Input placeholder="Enter Name" />
        </Form.Item>
        <Form.Item
          name="email"
          // rules={[
          //   {
          //     required: true,
          //     message: " E-mail is Required",
          //   },
          // ]}
        >
          <Input placeholder="Enter E-mail" />
        </Form.Item>

        <Form.Item
          name="phone"
          // label="Phone No"
          rules={[
            {
              required: true,
              message: "Phone No is Required",
            },
          ]}
        >
          <Input placeholder="Enter Phone No" />
        </Form.Item>

        <Form.Item
          name="subject"
          rules={[
            {
              required: true,
              message: "Subject is Required",
            },
          ]}
        >
          <Input placeholder="Enter Subject" />
        </Form.Item>

        <Form.Item
          name="message"
          rules={[
            {
              required: true,
              message: "message is Required",
            },
          ]}
        >
          <Input.TextArea rows={6} placeholder="Enter" />
        </Form.Item>

        <Form.Item className="flex gap-2">
          <Button
            type="primary"
            htmlType="submit"
            className="me-2"
            loading={loading}
          >
            Send
          </Button>
        </Form.Item>
        <div className="alert">{success}</div>
      </Form>
    </>
  );
}
