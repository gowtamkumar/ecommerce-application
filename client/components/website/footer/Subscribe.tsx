"use client";
import { saveLead } from "@/lib/apis/leads";
import {
  successNotification,
  warningNotification,
} from "@/lib/utils/notification";
import { Form, Input } from "antd";
import { useState } from "react";
import { HiArrowRight } from "react-icons/hi";

export default function Subscribe() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  async function handleSubmit(value: any) {
    setLoading(true);
    const lead = await saveLead(value);
    if (!lead.success) {
      warningNotification({ message: lead.message });
      setLoading(false);
      return;
    }

    if (lead.success && lead.data) {
      successNotification({ message: lead.message });
    }

    setTimeout(() => {
      form.resetFields();
      setLoading(false);
    }, 2000);
  }

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      autoComplete="off"
      className="subscribe-form"
    >
      <div className="relative group">
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email",
            },
            {
              type: "email",
              message: "Please enter a valid email",
            },
          ]}
          className="mb-0"
        >
          <Input
            size="large"
            placeholder="Enter your email address"
            className="!bg-global-footer-text/10 !border-global-footer-text/20 !text-global-footer-text placeholder:!text-global-footer-text/40 !rounded-lg !pr-32 !py-3 !backdrop-blur-sm hover:!bg-global-footer-text/15 hover:!border-global-footer-text/30 focus:!bg-global-footer-text/15 focus:!border-global-primary focus:!shadow-[0_0_20px_var(--button-primary-color)] transition-all duration-300"
          />
        </Form.Item>

        <button
          type="submit"
          className="h-12 px-8 rounded-global-button-radius bg-global-button-primary text-global-button-text hover:bg-global-button-hover font-global-button-weight flex items-center gap-2 group transition-all duration-300 shadow-lg shadow-global-button-primary/20"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin"></span>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Subscribe</span>
              <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </button>
      </div>

      {/* <style jsx global>{`
        .subscribe-form .ant-form-item-explain-error {
          color: #fca5a5;
          font-size: 12px;
          margin-top: 4px;
        }
        
        .subscribe-form .ant-input::placeholder {
          color: rgb(156 163 175) !important;
        }
        
        .subscribe-form .ant-input:focus {
          outline: none;
        }
      `}</style> */}
    </Form>
  );
}
