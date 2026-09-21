"use client";

import { fileDeleteWithPhoto } from "@/lib/apis/file";
import { getMe, updateUser } from "@/lib/apis/user";
import { handleGlobalUpload } from "@/lib/utils/handleGlobalUpload";
import { imageSetFile } from "@/lib/utils/imageSetFile";
import { imageUploadSizeFileValidation } from "@/lib/utils/imageUploadValidation";
import {
    errorNotification,
    successNotification,
} from "@/lib/utils/notification";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import {
    Button,
    DatePicker,
    Form,
    Input,
    Radio,
    Tooltip,
    Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    FiArrowRight,
    FiCalendar,
    FiCamera,
    FiCheck,
    FiCopy,
    FiEdit2,
    FiLock,
    FiMail,
    FiMapPin,
    FiPhone,
    FiPlus,
    FiSave,
    FiShield,
    FiUser,
    FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export default function MyAccount() {
  const [edit, setEdit] = useState(false);
  const [formValues, setFormValues] = useState<any>({ fileList: [] });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const router = useRouter();
  const searchQuery = useSearchParams();

  const isEditParam = searchQuery.get("edit") === "true";

  useEffect(() => {
    if (isEditParam) {
      setEdit(true);
    }
  }, [isEditParam]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        const newData = { ...res.data };
        if (newData.image) {
          const newfile = await imageSetFile(newData.image);
          newData.fileList = [newfile];
        }
        if (newData.dob) newData.dob = dayjs(newData.dob);
        form.setFieldsValue(newData);
        setFormValues(newData);
      } catch {
        errorNotification({ message: "Failed to fetch user data." });
      }
    };
    fetchUser();
  }, [form]);

  const handleSubmit = async (values: any) => {
    dispatch(setLoading({ save: true }));
    try {
      const payload = {
        ...values,
        dob: values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : undefined,
      };
      const result = await updateUser(payload);
      if (result.success) {
        successNotification({ message: result.message || "Profile updated successfully!" });
        setEdit(false);
        const updatedData = { ...formValues, ...payload, image: payload.image || formValues.image };
        setFormValues(updatedData);
        router.replace("/profile?tab=my_account", { scroll: false });
      } else {
        errorNotification({ message: result.message || "Failed to update profile." });
      }
    } catch {
      errorNotification({ message: "Something went wrong while updating." });
    } finally {
      dispatch(setLoading({ save: false }));
    }
  };

  const customUploadRequest = async (options: any) => {
    const { file } = options;
    if (!imageUploadSizeFileValidation(file)) {
      form.setFieldsValue({ image: null, fileList: [] });
      setFormValues((v: any) => ({ ...v, image: null, fileList: [] }));
      return;
    }
    const result = await handleGlobalUpload(options);
    if (result) {
      const { newFile, newFileName } = result;
      const updated = { ...formValues, fileList: [newFile], image: newFileName };
      form.setFieldsValue(updated);
      setFormValues(updated);
    }
  };

  const handleRemove = async (file: any) => {
    try {
      if (file.fileName) {
        await fileDeleteWithPhoto({ filename: file.fileName });
        form.setFieldsValue({ image: null, fileList: [] });
        setFormValues((v: any) => ({ ...v, image: null, fileList: [] }));
      }
    } catch {
      errorNotification({ message: "Failed to delete image." });
    }
  };

  const handleCancel = () => {
    setEdit(false);
    form.resetFields();
    form.setFieldsValue(formValues);
    router.replace("/profile?tab=my_account", { scroll: false });
  };

  const handleCopy = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Top Header Strip inside Tab ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              Personal Profile & Details
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
              Active Member
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Manage your personal identity, contact information, and default delivery address.
          </p>
        </div>

        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-global-primary text-white text-xs font-bold rounded-xl shadow-sm shadow-amber-200/60 hover:opacity-95 transition-all cursor-pointer shrink-0"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-gray-500 hover:text-gray-800 text-xs font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
          >
            <FiX className="w-3.5 h-3.5" />
            <span>Exit Editing</span>
          </button>
        )}
      </div>

      {/* ── VIEW MODE ─────────────────────────────────── */}
      {!edit && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Card 1: Personal Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
                <FiUser />
              </span>
              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight">Personal Information</h4>
                <p className="text-[11px] text-gray-400 font-medium">Your legal name, birthday, and identity</p>
              </div>
            </div>

            <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Full Name</p>
                <p className="text-sm font-bold text-gray-800">
                  {formValues?.name || <span className="text-gray-300 font-normal italic">Not provided</span>}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Birthday</p>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                  <FiCalendar className="text-gray-400 text-xs" />
                  <span>
                    {formValues?.dob ? dayjs(formValues.dob).format("MMMM D, YYYY") : (
                      <span className="text-gray-300 font-normal italic">Not provided</span>
                    )}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Gender</p>
                <div>
                  {formValues?.gender ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {formValues.gender}
                    </span>
                  ) : (
                    <span className="text-gray-300 font-normal italic text-sm">Not specified</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Account Role</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                  {formValues?.role || "User"}
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Membership Type</p>
                <p className="text-sm font-semibold text-gray-800">
                  {formValues?.type || "Customer"}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Contact Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                <FiMail />
              </span>
              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight">Contact Channels</h4>
                <p className="text-[11px] text-gray-400 font-medium">Used for order receipts, tracking notifications, and delivery updates</p>
              </div>
            </div>

            <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Block */}
              <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Email Address</p>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {formValues?.email || "—"}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1">
                    <FiCheck className="text-xs" /> Primary & Verified
                  </span>
                </div>
                {formValues?.email && (
                  <Tooltip title={copiedField === "email" ? "Copied!" : "Copy email"}>
                    <button
                      onClick={() => handleCopy(formValues.email, "email")}
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedField === "email" ? <FiCheck className="text-emerald-500 text-sm" /> : <FiCopy className="text-sm" />}
                    </button>
                  </Tooltip>
                )}
              </div>

              {/* Phone Block */}
              <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Phone Number</p>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {formValues?.phone || <span className="text-gray-400 font-normal italic">No phone number registered</span>}
                  </p>
                  <span className="inline-flex items-center text-[10px] text-gray-500 font-medium mt-1">
                    Direct contact for courier delivery
                  </span>
                </div>
                {formValues?.phone ? (
                  <Tooltip title={copiedField === "phone" ? "Copied!" : "Copy phone"}>
                    <button
                      onClick={() => handleCopy(formValues.phone, "phone")}
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedField === "phone" ? <FiCheck className="text-emerald-500 text-sm" /> : <FiCopy className="text-sm" />}
                    </button>
                  </Tooltip>
                ) : (
                  <button
                    onClick={() => setEdit(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-global-primary hover:bg-amber-50 text-xs font-bold rounded-lg border border-amber-300/80 transition-colors cursor-pointer"
                  >
                    <FiPlus className="text-xs" /> Add
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Primary Delivery Address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                  <FiMapPin />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">Primary Delivery Address</h4>
                  <p className="text-[11px] text-gray-400 font-medium">Default shipping destination pre-filled during checkout</p>
                </div>
              </div>
              {formValues?.address && (
                <button
                  onClick={() => setEdit(true)}
                  className="text-xs font-semibold text-gray-600 hover:text-global-primary transition-colors cursor-pointer px-3 py-1 rounded-lg border border-gray-200 hover:border-global-primary bg-white"
                >
                  Edit Address
                </button>
              )}
            </div>

            <div className="p-5 sm:p-6">
              {formValues?.address ? (
                <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 flex items-start gap-3">
                  <FiMapPin className="text-emerald-500 text-base mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Street Address</p>
                    <p className="text-sm font-semibold text-gray-800 leading-relaxed whitespace-pre-line">
                      {formValues.address}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl border-2 border-dashed border-gray-200 text-center bg-gray-50/40">
                  <FiMapPin className="mx-auto text-3xl text-gray-300 mb-2" />
                  <p className="text-sm font-bold text-gray-800 mb-1">No default street address registered</p>
                  <p className="text-xs text-gray-400 mb-4 max-w-sm mx-auto">
                    Add your primary residential or business address to enjoy fast 1-click checkout.
                  </p>
                  <button
                    onClick={() => setEdit(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-200 shadow-2xs transition-colors cursor-pointer"
                  >
                    <FiPlus className="text-xs" /> Add Street Address
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Account Security & Password */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
                <FiShield />
              </span>
              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight">Account Protection & Credentials</h4>
                <p className="text-[11px] text-gray-400 font-medium">Keep your account secure with regular password updates</p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <FiLock className="text-sm" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Password Encryption Active</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    Your password is encrypted. We recommend changing it periodically.
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.replace("/profile?tab=change_password", { scroll: false })}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer shrink-0"
              >
                <span>Change Password</span>
                <FiArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODE ─────────────────────────────────── */}
      {edit && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            scrollToFirstError
            requiredMark="optional"
          >
            <Form.Item name="id" hidden><Input /></Form.Item>
            <Form.Item name="image" hidden><Input /></Form.Item>

            <div className="space-y-6">
              {/* Photo Upload Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
                    <FiCamera />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">Profile Picture</h4>
                    <p className="text-[11px] text-gray-400 font-medium">Upload a photo to personalize your account</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <Form.Item
                    name="fileList"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    className="mb-0 shrink-0"
                  >
                    <ImgCrop rotationSlider showGrid showReset quality={0.8} aspect={1}>
                      <Upload
                        name="image"
                        listType="picture-card"
                        fileList={formValues?.fileList || []}
                        onRemove={handleRemove}
                        customRequest={customUploadRequest}
                        maxCount={1}
                        showUploadList={{ showPreviewIcon: false }}
                        className="rounded-2xl overflow-hidden [&_.ant-upload]:rounded-2xl [&_.ant-upload-list-item]:rounded-2xl [&_.ant-upload-list-picture-card]:rounded-2xl"
                      >
                        {formValues?.fileList?.length >= 1 ? null : (
                          <div className="flex flex-col items-center justify-center text-gray-400 gap-1.5 p-2">
                            <FiCamera className="w-6 h-6 text-global-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Upload</span>
                          </div>
                        )}
                      </Upload>
                    </ImgCrop>
                  </Form.Item>

                  <div className="text-center sm:text-left pt-1">
                    <p className="text-sm font-bold text-gray-800 mb-1">
                      Upload Avatar Image
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">
                      Supports PNG, JPG, or WEBP formats up to 1MB in size.
                      Recommended square ratio (at least 300×300px).
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium">
                      Cropping tool is available right after selecting your image.
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
                    <FiUser />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">Personal Details</h4>
                    <p className="text-[11px] text-gray-400 font-medium">Update your name, birthday, and gender</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  <Form.Item
                    name="name"
                    label={<span className="text-xs font-bold text-gray-700">Full Name</span>}
                    rules={[{ required: true, message: "Please enter your full name" }]}
                  >
                    <Input
                      prefix={<FiUser className="text-gray-400 mr-1.5" />}
                      placeholder="John Doe"
                      size="large"
                      className="rounded-xl h-11 border-gray-200 hover:border-global-primary focus:border-global-primary"
                    />
                  </Form.Item>

                  <Form.Item
                    name="dob"
                    label={<span className="text-xs font-bold text-gray-700">Birthday</span>}
                  >
                    <DatePicker
                      placeholder="Select date"
                      className="w-full rounded-xl h-11 border-gray-200"
                      size="large"
                      format="YYYY-MM-DD"
                      suffixIcon={<FiCalendar className="text-gray-400" />}
                    />
                  </Form.Item>

                  <Form.Item
                    name="gender"
                    label={<span className="text-xs font-bold text-gray-700">Gender</span>}
                    className="sm:col-span-2"
                  >
                    <Radio.Group className="flex gap-4 mt-1">
                      <Radio value="Male" className="font-semibold text-xs sm:text-sm text-gray-700">Male</Radio>
                      <Radio value="Female" className="font-semibold text-xs sm:text-sm text-gray-700">Female</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                    <FiMail />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">Contact Information</h4>
                    <p className="text-[11px] text-gray-400 font-medium">Your primary email and phone number</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  <Form.Item
                    name="email"
                    label={
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-700">Email Address</span>
                        <Tooltip title="Email is tied to your account login and cannot be modified directly here.">
                          <FiLock className="text-gray-400 text-xs cursor-help" />
                        </Tooltip>
                      </div>
                    }
                    rules={[{ required: true, message: "E-mail is required", type: "email" }]}
                  >
                    <Input
                      prefix={<FiMail className="text-gray-400 mr-1.5" />}
                      placeholder="name@example.com"
                      disabled
                      size="large"
                      className="rounded-xl h-11 bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                    />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label={<span className="text-xs font-bold text-gray-700">Phone Number</span>}
                    rules={[{ required: true, message: "Please enter your phone number" }]}
                  >
                    <Input
                      prefix={<FiPhone className="text-gray-400 mr-1.5" />}
                      placeholder="+1 (555) 000-0000"
                      size="large"
                      className="rounded-xl h-11 border-gray-200 hover:border-global-primary focus:border-global-primary"
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Primary Address Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                    <FiMapPin />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">Default Shipping Address</h4>
                    <p className="text-[11px] text-gray-400 font-medium">Street, building, apartment, city, and postal code</p>
                  </div>
                </div>

                <Form.Item
                  name="address"
                  label={<span className="text-xs font-bold text-gray-700">Street Address</span>}
                >
                  <Input.TextArea
                    placeholder="Enter your complete street address (e.g. 123 Main St, Apt 4B, New York, NY 10001)"
                    rows={3}
                    className="rounded-xl p-3 resize-none border-gray-200 hover:border-global-primary focus:border-global-primary text-sm"
                  />
                </Form.Item>
              </div>

              {/* Action Bar */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 sm:p-5 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 h-11 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <FiX className="w-4 h-4" />
                  Cancel
                </button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<FiSave className="w-4 h-4" />}
                  loading={global.loading.save}
                  disabled={global.loading.save}
                  className="w-full sm:w-auto h-11 px-8 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm shadow-amber-200/60"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}
