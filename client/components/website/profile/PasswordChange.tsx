"use client";

import { updatePassword } from "@/lib/apis/user";
import {
    errorNotification,
    successNotification,
} from "@/lib/utils/notification";
import {
    selectGlobal,
    setLoading,
} from "@/redux/features/global/globalSlice";
import { Button, Divider, Form, Input } from "antd";
import { useState } from "react";
import {
    FiAlertCircle,
    FiCheck,
    FiCheckCircle,
    FiKey,
    FiLock,
    FiRotateCcw,
    FiShield,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export default function ChangePassword() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const handleSubmit = async (values: any) => {
    try {
      dispatch(setLoading({ savePassword: true }));
      const res = await updatePassword(values);
      if (res.success) {
        successNotification({ message: "Password updated successfully" });
        form.resetFields();
        setNewPasswordValue("");
        setConfirmPasswordValue("");
      } else {
        errorNotification({
          message: res.message || "Failed to update password",
        });
      }
    } catch (err: any) {
      errorNotification({ message: err.message || "Something went wrong" });
    } finally {
      dispatch(setLoading({ savePassword: false }));
    }
  };

  const handleReset = () => {
    form.resetFields();
    setNewPasswordValue("");
    setConfirmPasswordValue("");
  };

  const hasMinLength = newPasswordValue.length >= 8;
  const passwordsMatch =
    Boolean(confirmPasswordValue) && newPasswordValue === confirmPasswordValue;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
            Security & Password
          </h3>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Protected
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          Update your password regularly to maintain maximum account security
        </p>
      </div>

      {/* ── 2-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Password Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-global-primary flex items-center justify-center shrink-0">
              <FiKey className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-tight">
                Update Password
              </h4>
              <p className="text-[11px] text-gray-400">
                Enter your current credentials and choose a strong new password
              </p>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            requiredMark={false}
          >
            <Form.Item
              name="currentPassword"
              label={
                <span className="text-xs font-semibold text-gray-700">
                  Current Password <span className="text-rose-500">*</span>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter your current password",
                },
              ]}
              className="!mb-4"
            >
              <Input.Password
                prefix={<FiLock className="text-gray-400 mr-1.5" />}
                placeholder="Enter current password"
                className="!rounded-xl !h-11 !border-gray-200 focus:!border-global-primary"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label={
                <span className="text-xs font-semibold text-gray-700">
                  New Password <span className="text-rose-500">*</span>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter a new password",
                },
                {
                  min: 8,
                  message: "Password must be at least 8 characters",
                },
              ]}
              className="!mb-4"
            >
              <Input.Password
                prefix={<FiKey className="text-gray-400 mr-1.5" />}
                placeholder="Create a strong password (min 8 chars)"
                onChange={(e) => setNewPasswordValue(e.target.value)}
                className="!rounded-xl !h-11 !border-gray-200 focus:!border-global-primary"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={
                <span className="text-xs font-semibold text-gray-700">
                  Confirm New Password <span className="text-rose-500">*</span>
                </span>
              }
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords that you entered do not match!")
                    );
                  },
                }),
              ]}
              className="!mb-6"
            >
              <Input.Password
                prefix={<FiLock className="text-gray-400 mr-1.5" />}
                placeholder="Re-type your new password"
                onChange={(e) => setConfirmPasswordValue(e.target.value)}
                className="!rounded-xl !h-11 !border-gray-200 focus:!border-global-primary"
              />
            </Form.Item>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Button
                type="text"
                icon={<FiRotateCcw className="w-3.5 h-3.5" />}
                onClick={handleReset}
                className="!text-xs !text-gray-400 hover:!text-gray-700 font-semibold"
              >
                Reset
              </Button>

              <button
                type="submit"
                disabled={global.loading.savePassword}
                className="inline-flex items-center justify-center gap-2 px-6 h-11 bg-global-primary text-white text-xs font-bold rounded-xl shadow-sm shadow-amber-200/60 hover:opacity-95 transition-opacity cursor-pointer"
              >
                <FiCheck className="w-4 h-4" />
                <span>
                  {global.loading.savePassword
                    ? "Updating..."
                    : "Update Password"}
                </span>
              </button>
            </div>
          </Form>
        </div>

        {/* Right Column: Security Guidelines Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200/60">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-global-primary flex items-center justify-center">
                <FiShield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Password Guidelines
                </h4>
                <p className="text-[10px] text-gray-400">
                  Requirements for a secure account
                </p>
              </div>
            </div>

            {/* Live Requirement Checklist */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2 text-xs">
                {hasMinLength ? (
                  <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <FiAlertCircle className="w-4 h-4 text-gray-300 shrink-0" />
                )}
                <span
                  className={
                    hasMinLength
                      ? "text-emerald-700 font-semibold"
                      : "text-gray-500"
                  }
                >
                  Minimum 8 characters in length
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {passwordsMatch ? (
                  <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <FiAlertCircle className="w-4 h-4 text-gray-300 shrink-0" />
                )}
                <span
                  className={
                    passwordsMatch
                      ? "text-emerald-700 font-semibold"
                      : "text-gray-500"
                  }
                >
                  New passwords match
                </span>
              </div>
            </div>

            <Divider className="!my-3 border-gray-200/60" />

            {/* Best practice tips */}
            <div className="space-y-2 text-xs text-gray-600 leading-relaxed">
              <p className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">
                Security Recommendations:
              </p>
              <ul className="space-y-1.5 list-disc list-inside text-gray-500 text-[11px]">
                <li>Use a mix of uppercase and lowercase letters.</li>
                <li>Include at least one number and special symbol.</li>
                <li>Never share your password with anyone.</li>
                <li>Avoid using personal dates or common dictionary words.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
