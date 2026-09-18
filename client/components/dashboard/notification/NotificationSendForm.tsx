"use client";

import { sendPromotionalNotification } from "@/lib/apis/notification";
import {
    errorNotification,
    successNotification,
} from "@/lib/utils/notification";
import { Button, Form, Input, Select } from "antd";
import { useState } from "react";
import {
    FiExternalLink,
    FiGift,
    FiInfo,
    FiRadio,
    FiSend,
    FiSmartphone,
    FiTool,
    FiZap,
} from "react-icons/fi";

const { TextArea } = Input;

interface NotificationSendFormProps {
  onSuccess?: () => void;
}

export default function NotificationSendForm({ onSuccess }: NotificationSendFormProps) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Watch form fields for live device preview
  const watchedType = Form.useWatch("type", form) || "NewOffer";
  const watchedTitle = Form.useWatch("title", form) || "Summer Flash Sale: Up to 50% Off!";
  const watchedMessage = Form.useWatch("message", form) || "Discover exclusive limited-time reductions across our bestselling seasonal collections. Free express shipping applies.";
  const watchedUrl = Form.useWatch("offerUrl", form) || "/offers";

  const titleSuggestions = [
    { label: "🔥 Flash Sale", title: "Flash Sale: Up to 50% Off Selected Collections!" },
    { label: "🎁 Member Perk", title: "Special Gift: Your Exclusive Member Reward Inside" },
    { label: "⚡ Free Shipping", title: "Weekend Special: Free Shipping On All Orders" },
    { label: "🛠️ Maintenance", title: "Notice: Scheduled Platform Maintenance" },
  ];

  const handleApplyTitle = (title: string) => {
    form.setFieldsValue({ title });
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await sendPromotionalNotification({
        type: values.type,
        title: values.title.trim(),
        message: values.message.trim(),
        offerUrl: values.offerUrl?.trim() || "",
      });

      if (res.success) {
        successNotification({
          message: "Broadcast notification dispatched to all store customers!",
        });
        form.resetFields();
        if (onSuccess) onSuccess();
      } else {
        errorNotification({
          message: res.message || "Failed to dispatch notification",
        });
      }
    } catch (error: any) {
      errorNotification({
        message: error?.response?.data?.message || error?.message || "Unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ========================================================================= */}
      {/* 1. Left Form Column: Notification Controls */}
      {/* ========================================================================= */}
      <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-sm">
        <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2 m-0">
              <FiRadio className="text-global-primary text-xl" /> Compose Customer Broadcast
            </h2>
            <p className="text-xs text-gray-500 mt-1 m-0">
              Deliver urgent announcements, promotional alerts, or maintenance bulletins to all active customers.
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            Target: All Users
          </span>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            type: "NewOffer",
            title: "Summer Flash Sale: Up to 50% Off!",
            offerUrl: "/offers",
            message: "Discover exclusive limited-time reductions across our bestselling seasonal collections. Free express shipping applies.",
          }}
          scrollToFirstError
        >
          {/* Notification Type Selector */}
          <Form.Item
            name="type"
            label={<span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Broadcast Category</span>}
            rules={[{ required: true, message: "Please select broadcast category" }]}
          >
            <Select size="large" className="w-full">
              <Select.Option value="NewOffer">
                <div className="flex items-center gap-2 py-0.5">
                  <FiGift className="text-amber-500" />
                  <span className="font-semibold text-xs text-gray-800">New Offer / Promotional Deal</span>
                </div>
              </Select.Option>
              <Select.Option value="General">
                <div className="flex items-center gap-2 py-0.5">
                  <FiInfo className="text-blue-500" />
                  <span className="font-semibold text-xs text-gray-800">General Store Announcement</span>
                </div>
              </Select.Option>
              <Select.Option value="Maintenance">
                <div className="flex items-center gap-2 py-0.5">
                  <FiTool className="text-rose-500" />
                  <span className="font-semibold text-xs text-gray-800">System Maintenance Notice</span>
                </div>
              </Select.Option>
            </Select>
          </Form.Item>

          {/* Quick Suggestion Chips */}
          <div className="mb-2">
            <span className="text-[11px] font-semibold text-gray-400 block mb-1.5">
              Quick Title Suggestions:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {titleSuggestions.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => handleApplyTitle(s.title)}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <Form.Item
            name="title"
            label={<span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Notification Title</span>}
            rules={[
              { required: true, message: "Title is required" },
              { max: 100, message: "Title cannot exceed 100 characters" },
            ]}
          >
            <Input
              size="large"
              placeholder="e.g. Weekend Flash Sale: 30% Off Storewide!"
              className="rounded-xl h-11"
            />
          </Form.Item>

          {/* Offer URL (Optional or for Offers) */}
          <Form.Item
            name="offerUrl"
            label={
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Call To Action Target URL
              </span>
            }
            extra="Deep link for customers (e.g. /offers, /products, or full URL)"
          >
            <Input
              size="large"
              placeholder="e.g. /offers/summer-sale or https://store.com/promo"
              className="rounded-xl h-11"
              prefix={<FiExternalLink className="text-gray-400" />}
            />
          </Form.Item>

          {/* Message Body */}
          <Form.Item
            name="message"
            label={<span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Message Content</span>}
            rules={[
              { required: true, message: "Message content is required" },
              { min: 10, message: "Message must be at least 10 characters long" },
              { max: 400, message: "Message cannot exceed 400 characters" },
            ]}
          >
            <TextArea
              rows={4}
              showCount
              maxLength={400}
              placeholder="Provide clear, concise details about this announcement or offer..."
              className="rounded-xl p-3"
            />
          </Form.Item>

          {/* Submit CTA */}
          <div className="pt-2">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<FiSend className="text-sm" />}
              className="w-full h-12 rounded-xl text-sm font-bold !bg-global-primary hover:!brightness-110 border-0 shadow-md shadow-global-primary/20"
            >
              Broadcast Notification to All Users
            </Button>
            <p className="text-[11px] text-gray-400 text-center mt-2">
              This message will be placed directly in every user's notification center and bell dropdown.
            </p>
          </div>
        </Form>
      </div>

      {/* ========================================================================= */}
      {/* 2. Right Column: Live Device & Dropdown Preview */}
      {/* ========================================================================= */}
      <div className="lg:col-span-5 space-y-6">
        {/* Dropdown Card Preview */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-global-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Customer Dropdown Preview
              </span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Desktop & Mobile
            </span>
          </div>

          {/* Mock Notification Item */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  watchedType === "NewOffer"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : watchedType === "Maintenance"
                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}
              >
                {watchedType}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">Just now</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-snug m-0 break-words">
                {watchedTitle || "Notification Title"}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed mt-1 m-0 break-words line-clamp-3">
                {watchedMessage || "Your message body text will appear here exactly as your customers see it."}
              </p>
            </div>

            {watchedUrl && (
              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-global-primary flex items-center gap-1">
                  <FiExternalLink className="text-xs" /> View Announcement
                </span>
                <span className="text-[10px] font-mono text-gray-400 truncate max-w-[140px]">
                  {watchedUrl}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2.5">
            <FiZap className="text-amber-600 text-base shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Instant Delivery:</strong> Broadcasts are immediately stored in customer notifications and increment unread indicators.
            </div>
          </div>
        </div>

        {/* Mobile Push Notification Mock */}
        <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-sm border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <FiSmartphone className="text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Mobile Banner Simulation
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Push Banner</span>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/80 shadow-lg space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                <span className="w-4 h-4 rounded-md bg-global-primary text-white flex items-center justify-center text-[9px] font-black">
                  S
                </span>
                <span>Store Alert</span>
              </div>
              <span>now</span>
            </div>
            <div className="text-xs font-bold text-white leading-tight break-words">
              {watchedTitle || "Notification Title"}
            </div>
            <div className="text-[11px] text-slate-300 leading-snug line-clamp-2 break-words">
              {watchedMessage || "Notification message content..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
