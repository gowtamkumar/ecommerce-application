"use client";
import { saveContact, updateContact } from "@/lib/apis/contact";
import { Button, Form, Input } from "antd";
import { useState } from "react";

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
        className="space-y-4"
      >
        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-100">
            {success}
          </div>
        )}

        <Form.Item
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
          className="mb-0"
        >
          <Input
            placeholder="Your Name"
            className="!px-0 !border-0 !border-b !border-gray-200 !rounded-none !bg-transparent !py-3 focus:!border-black focus:!shadow-none !text-base placeholder:!text-gray-400 font-global-secondary-fontfamily transition-all"
          />
        </Form.Item>

        <Form.Item
          name="email"
          className="mb-0"
        >
          <Input
            placeholder="Email Address"
            className="!px-0 !border-0 !border-b !border-gray-200 !rounded-none !bg-transparent !py-3 focus:!border-black focus:!shadow-none !text-base placeholder:!text-gray-400 font-global-secondary-fontfamily transition-all"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[{ required: true, message: "Phone No is required" }]}
          className="mb-0"
        >
          <Input
            placeholder="Phone Number"
            className="!px-0 !border-0 !border-b !border-gray-200 !rounded-none !bg-transparent !py-3 focus:!border-black focus:!shadow-none !text-base placeholder:!text-gray-400 font-global-secondary-fontfamily transition-all"
          />
        </Form.Item>

        <Form.Item
          name="subject"
          rules={[{ required: true, message: "Subject is required" }]}
          className="mb-0"
        >
          <Input
            placeholder="Subject"
            className="!px-0 !border-0 !border-b !border-gray-200 !rounded-none !bg-transparent !py-3 focus:!border-black focus:!shadow-none !text-base placeholder:!text-gray-400 font-global-secondary-fontfamily transition-all"
          />
        </Form.Item>

        <Form.Item
          name="message"
          rules={[{ required: true, message: "Message is required" }]}
          className="mb-6"
        >
          <Input.TextArea
            rows={4}
            placeholder="How can we help you?"
            className="!px-0 !border-0 !border-b !border-gray-200 !rounded-none !bg-transparent !py-3 focus:!border-black focus:!shadow-none !text-base placeholder:!text-gray-400 font-global-secondary-fontfamily transition-all resize-none"
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="!w-full !h-12 !bg-black hover:!bg-gray-800 !text-white !text-sm !uppercase !tracking-wider !font-bold !rounded-lg !border-none shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Send Message
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
