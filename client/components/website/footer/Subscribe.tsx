"use client";
import React, { useState } from "react";
import { saveLead } from "@/lib/apis/leads";
import { Form, Input, message } from "antd";
import {
  successNotification,
  warningNotification,
} from "@/lib/utils/notification";
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
            className="!bg-white/10 !border-white/20 !text-white placeholder:!text-gray-400
                     !rounded-lg !pr-32 !py-3 !backdrop-blur-sm
                     hover:!bg-white/15 hover:!border-white/30
                     focus:!bg-white/15 focus:!border-blue-400/50 focus:!shadow-[0_0_20px_rgba(59,130,246,0.3)]
                     transition-all duration-300"
          />
        </Form.Item>
        
        <button
          type="submit"
          disabled={loading}
          className="absolute right-1.5 top-1.5 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600
                   text-white rounded-md font-medium
                   hover:from-blue-600 hover:to-purple-700
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transform transition-all duration-300 hover:scale-105
                   shadow-lg hover:shadow-xl
                   flex items-center gap-2 group"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
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
      
      <style jsx global>{`
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
      `}</style>
    </Form>
  );
}
