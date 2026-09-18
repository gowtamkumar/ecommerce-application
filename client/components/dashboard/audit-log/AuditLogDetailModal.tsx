"use client";
import type { IAuditLog } from "@/lib/types/audit-log";
import { Button, Descriptions, Modal, Tag } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import {
    FiCheck,
    FiClock,
    FiCopy,
    FiGlobe,
    FiLayers,
    FiUser,
} from "react-icons/fi";

interface AuditLogDetailModalProps {
  log: IAuditLog | null;
  open: boolean;
  onClose: () => void;
}

export default function AuditLogDetailModal({
  log,
  open,
  onClose,
}: AuditLogDetailModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!log) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getActionBadge = (action: string) => {
    const act = (action || "").toUpperCase();
    if (act === "CREATE") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          CREATE
        </span>
      );
    }
    if (act === "UPDATE") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-global-primary/10 text-global-primary border border-global-primary/30">
          UPDATE
        </span>
      );
    }
    if (act === "DELETE") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          DELETE
        </span>
      );
    }
    return (
      <Tag className="font-semibold text-xs rounded-full">{action}</Tag>
    );
  };

  const method = log.metadata?.method || (log.action === "CREATE" ? "POST" : log.action === "DELETE" ? "DELETE" : "PUT");
  const methodColor =
    method === "POST"
      ? "bg-emerald-100 text-emerald-800"
      : method === "DELETE"
      ? "bg-rose-100 text-rose-800"
      : "bg-blue-100 text-blue-800";

  return (
    <Modal
      title={
        <div className="flex items-center justify-between pr-6">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-900">
              Audit Event Inspector
            </span>
            {getActionBadge(log.action)}
          </div>
          <span className="text-xs text-gray-400 font-normal">
            ID: {log.id}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={780}
      footer={[
        <Button
          key="close"
          onClick={onClose}
          className="rounded-xl border-gray-200 hover:border-global-primary hover:text-global-primary font-semibold"
        >
          Close Inspector
        </Button>,
      ]}
      className="audit-detail-modal"
    >
      <div className="space-y-6 pt-2">
        {/* Core Event Overview */}
        <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <FiClock className="text-global-primary text-sm" />
                <span>Timestamp:</span>
                <strong className="text-gray-900">
                  {dayjs(log.createdAt).format("YYYY-MM-DD HH:mm:ss")} (
                  {dayjs(log.createdAt).fromNow?.() || "recently"})
                </strong>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <FiUser className="text-global-primary text-sm" />
                <span>Actor:</span>
                <strong className="text-gray-900">
                  {log.userName} ({log.userRole || "Admin"})
                </strong>
              </div>
              {log.userEmail && (
                <div className="text-gray-400 pl-6 text-[11px]">
                  {log.userEmail}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <FiLayers className="text-global-primary text-sm" />
                <span>Resource:</span>
                <strong className="text-gray-900">
                  {log.resourceType}
                  {log.resourceId ? ` #${log.resourceId}` : ""}
                </strong>
              </div>
              {log.resourceName && (
                <div className="text-gray-700 pl-6 font-semibold line-clamp-1">
                  Name: &ldquo;{log.resourceName}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>

        {/* HTTP / Network Metadata */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
            <FiGlobe className="text-global-primary" />
            <span>Network & HTTP Diagnostics</span>
          </h4>
          <Descriptions column={2} bordered size="small" className="rounded-xl overflow-hidden">
            <Descriptions.Item label="API Endpoint" span={2}>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${methodColor}`}>
                  {method}
                </span>
                <code className="text-xs text-gray-800 font-mono">
                  {log.metadata?.path || "-"}
                </code>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Client IP">
              <code className="text-xs font-mono text-gray-700">
                {log.metadata?.ip || "Unknown IP"}
              </code>
            </Descriptions.Item>
            <Descriptions.Item label="User Agent">
              <span className="text-[11px] text-gray-600 line-clamp-1" title={log.metadata?.userAgent}>
                {log.metadata?.userAgent || "Standard Browser / Client"}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Payload Inspector: New Values */}
        {log.newValues && Object.keys(log.newValues).length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Payload / Modified Values
              </h4>
              <Button
                size="small"
                type="text"
                onClick={() =>
                  copyToClipboard(JSON.stringify(log.newValues, null, 2), "new")
                }
                className="text-xs text-gray-600 hover:text-global-primary flex items-center gap-1"
              >
                {copiedKey === "new" ? (
                  <>
                    <FiCheck className="text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FiCopy />
                    <span>Copy JSON</span>
                  </>
                )}
              </Button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono max-h-56 overflow-auto border border-slate-800">
              {JSON.stringify(log.newValues, null, 2)}
            </pre>
          </div>
        )}

        {/* Payload Inspector: Old Values */}
        {log.oldValues && Object.keys(log.oldValues).length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Original State / Old Values
              </h4>
              <Button
                size="small"
                type="text"
                onClick={() =>
                  copyToClipboard(JSON.stringify(log.oldValues, null, 2), "old")
                }
                className="text-xs text-gray-600 hover:text-global-primary flex items-center gap-1"
              >
                {copiedKey === "old" ? (
                  <>
                    <FiCheck className="text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FiCopy />
                    <span>Copy JSON</span>
                  </>
                )}
              </Button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono max-h-56 overflow-auto border border-slate-800">
              {JSON.stringify(log.oldValues, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Modal>
  );
}

