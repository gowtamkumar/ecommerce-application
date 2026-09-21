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
import { Button, Form, Input } from "antd";
import { useMemo, useState } from "react";
import {
    FiAlertCircle,
    FiCheck,
    FiCheckCircle,
    FiInfo,
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

  // Password Strength Calculations
  const hasMinLength = newPasswordValue.length >= 8;
  const hasUpper = /[A-Z]/.test(newPasswordValue);
  const hasLower = /[a-z]/.test(newPasswordValue);
  const hasNumber = /[0-9]/.test(newPasswordValue);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPasswordValue);

  const strengthScore = useMemo(() => {
    if (!newPasswordValue) return 0;
    let score = 0;
    if (hasMinLength) score += 1;
    if (hasUpper && hasLower) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;
    return score;
  }, [newPasswordValue, hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial]);

  const strengthMeta = useMemo(() => {
    if (!newPasswordValue) return { label: "", color: "bg-gray-200", textColor: "text-gray-400", width: "0%" };
    if (strengthScore <= 1) return { label: "Weak", color: "bg-rose-500", textColor: "text-rose-600", width: "25%" };
    if (strengthScore === 2) return { label: "Fair", color: "bg-amber-500", textColor: "text-amber-600", width: "50%" };
    if (strengthScore === 3) return { label: "Good", color: "bg-sky-500", textColor: "text-sky-600", width: "75%" };
    return { label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-600", width: "100%" };
  }, [newPasswordValue, strengthScore]);

  const passwordsMatch =
    Boolean(confirmPasswordValue) && newPasswordValue === confirmPasswordValue;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* ── Header Bar ── */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Security & Credentials
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your master account password and security validation rules.
          </p>
        </div>
      </div>

      {/* ── 2-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Password Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <FiKey className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                Update Master Password
              </h3>
              <p className="text-xs text-gray-400">
                Enter your current credentials followed by your new password
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
                <span className="text-xs font-bold text-gray-700">
                  Current Password <span className="text-rose-500">*</span>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter your current password",
                },
              ]}
              className="mb-4"
            >
              <Input.Password
                prefix={<FiLock className="text-gray-400 mr-2" />}
                placeholder="Enter current password"
                className="rounded-xl h-11 border-gray-200 hover:border-amber-400 focus:border-amber-500"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label={
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-gray-700">
                    New Password <span className="text-rose-500">*</span>
                  </span>
                  {newPasswordValue && (
                    <span className={`text-[11px] font-bold ${strengthMeta.textColor}`}>
                      Strength: {strengthMeta.label}
                    </span>
                  )}
                </div>
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
              className="mb-1"
            >
              <Input.Password
                prefix={<FiKey className="text-gray-400 mr-2" />}
                placeholder="Enter new strong password"
                onChange={(e) => setNewPasswordValue(e.target.value)}
                className="rounded-xl h-11 border-gray-200 hover:border-amber-400 focus:border-amber-500"
              />
            </Form.Item>

            {/* Password Strength Progress Bar */}
            {newPasswordValue ? (
              <div className="mb-4 pt-1">
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${strengthMeta.color}`}
                    style={{ width: strengthMeta.width }}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-3" />
            )}

            <Form.Item
              name="confirmPassword"
              label={
                <span className="text-xs font-bold text-gray-700">
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
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
              className="mb-6"
            >
              <Input.Password
                prefix={<FiLock className="text-gray-400 mr-2" />}
                placeholder="Re-type your new password"
                onChange={(e) => setConfirmPasswordValue(e.target.value)}
                className="rounded-xl h-11 border-gray-200 hover:border-amber-400 focus:border-amber-500"
              />
            </Form.Item>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Button
                type="text"
                icon={<FiRotateCcw className="w-3.5 h-3.5" />}
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-gray-700 font-bold"
              >
                Reset
              </Button>

              <button
                type="submit"
                disabled={global.loading.savePassword}
                className="inline-flex items-center justify-center gap-2 px-6 h-11 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <FiCheck className="w-4 h-4" />
                <span>
                  {global.loading.savePassword
                    ? "Updating..."
                    : "Save New Password"}
                </span>
              </button>
            </div>
          </Form>
        </div>

        {/* Right Column: Security Checklist & Recommendations */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <FiShield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Password Requirements
                </h4>
                <p className="text-[11px] text-gray-400">
                  Live verification checklist
                </p>
              </div>
            </div>

            {/* Live Requirement Checklist */}
            <div className="space-y-2.5">
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
                {hasUpper && hasLower ? (
                  <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <FiAlertCircle className="w-4 h-4 text-gray-300 shrink-0" />
                )}
                <span
                  className={
                    hasUpper && hasLower
                      ? "text-emerald-700 font-semibold"
                      : "text-gray-500"
                  }
                >
                  Both uppercase and lowercase letters
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {hasNumber ? (
                  <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <FiAlertCircle className="w-4 h-4 text-gray-300 shrink-0" />
                )}
                <span
                  className={
                    hasNumber
                      ? "text-emerald-700 font-semibold"
                      : "text-gray-500"
                  }
                >
                  At least one numeric digit (0-9)
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {hasSpecial ? (
                  <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <FiAlertCircle className="w-4 h-4 text-gray-300 shrink-0" />
                )}
                <span
                  className={
                    hasSpecial
                      ? "text-emerald-700 font-semibold"
                      : "text-gray-500"
                  }
                >
                  At least one special symbol (!@#$%^&*)
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
                  Passwords match
                </span>
              </div>
            </div>

            {/* Security Advisory Callout */}
            <div className="pt-3 border-t border-gray-100">
              <div className="p-3.5 bg-amber-500/[0.04] rounded-xl border border-amber-200/50 flex items-start gap-2.5">
                <FiInfo className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  For your security, changing your password will require signing in again on other devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
