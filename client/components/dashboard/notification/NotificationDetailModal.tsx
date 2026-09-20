"use client";

import { successNotification } from "@/lib/utils/notification";
import { Button, Modal, Popconfirm } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import {
    FiAlertTriangle,
    FiBell,
    FiCheckCircle,
    FiClock,
    FiCopy,
    FiExternalLink,
    FiTrash2,
    FiUser,
} from "react-icons/fi";

interface NotificationDetailModalProps {
  open: boolean;
  onClose: () => void;
  notification: any | null;
  onMarkAsRead: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  userMap?: Record<string, any>;
}

export default function NotificationDetailModal({
  open,
  onClose,
  notification,
  onMarkAsRead,
  onDelete,
  userMap = {},
}: NotificationDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  if (!notification) return null;

  const recipient = userMap[notification.userId] || null;

  const handleCopyMessage = () => {
    if (notification.message) {
      navigator.clipboard.writeText(notification.message);
      setCopied(true);
      successNotification({ message: "Message copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRead = async () => {
    setActionLoading(true);
    try {
      await onMarkAsRead(notification.id);
      onClose();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await onDelete(notification.id);
      onClose();
    } finally {
      setActionLoading(false);
    }
  };

  const isSystemAlert = [
    "ServerDown",
    "PaymentGatewayError",
    "HighTraffic",
    "CronJobFailed",
    "SmsEmailFailed",
  ].includes(notification.type);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      className="modern-alert-modal"
    >
      <div className="pt-2">
        {/* Header with Type & Status */}
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                isSystemAlert
                  ? "bg-rose-50 text-rose-600 border border-rose-200"
                  : notification.type === "NewOffer"
                  ? "bg-amber-50 text-amber-600 border border-amber-200"
                  : "bg-blue-50 text-blue-600 border border-blue-200"
              }`}
            >
              {isSystemAlert ? <FiAlertTriangle /> : <FiBell />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  {notification.type}
                </span>
                {notification.isRead ? (
                  <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                    <FiCheckCircle className="text-emerald-500" /> Read
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Unread Alert
                  </span>
                )}
              </div>
              <h2 className="text-lg font-black text-gray-900 mt-1 m-0 break-words">
                {notification.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-4">
          {/* Message Box */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1.5">
              <span>Notification Payload:</span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-gray-400 hover:text-gray-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <FiCopy className="text-xs" />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 text-sm text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
              {notification.message}
            </div>
          </div>

          {/* Offer URL Target (if present) */}
          {notification.offerUrl && (
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <FiExternalLink className="text-amber-600 shrink-0" />
                <span className="text-xs text-amber-900 font-medium truncate">
                  {notification.offerUrl}
                </span>
              </div>
              <a
                href={notification.offerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline shrink-0"
              >
                Visit Link →
              </a>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white text-gray-500 flex items-center justify-center text-sm shadow-xs border border-gray-100">
                <FiClock />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">
                  Logged At
                </span>
                <span className="text-xs font-semibold text-gray-800">
                  {dayjs(notification.createdAt).format("MMM DD, YYYY — h:mm A")}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white text-gray-500 flex items-center justify-center text-sm shadow-xs border border-gray-100">
                <FiUser />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">
                  Recipient
                </span>
                <span className="text-xs font-semibold text-gray-800 truncate block">
                  {recipient?.name || recipient?.email || `User #${notification.userId || "All"}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
          <Popconfirm
            title="Delete this notification alert?"
            description="This action will remove the record from system alert history."
            onConfirm={handleDelete}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<FiTrash2 />}
              loading={actionLoading}
              className="rounded-xl font-semibold text-xs"
            >
              Delete Alert
            </Button>
          </Popconfirm>

          <div className="flex items-center gap-2">
            {!notification.isRead && (
              <Button
                type="primary"
                icon={<FiCheckCircle />}
                onClick={handleRead}
                loading={actionLoading}
                className="rounded-xl font-semibold text-xs bg-global-primary hover:brightness-110 border-0"
              >
                Mark as Read
              </Button>
            )}
            <Button onClick={onClose} className="rounded-xl font-semibold text-xs">
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
