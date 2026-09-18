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
    Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
    FiCalendar,
    FiCamera,
    FiEdit2,
    FiMail,
    FiMapPin,
    FiPhone,
    FiSave,
    FiUser,
    FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

// ── Utility ──────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-4 py-3.5 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800 truncate">
          {value || <span className="text-gray-300 font-normal italic">Not set</span>}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4 pb-3 border-b border-gray-100">
      <p className="text-xs font-bold uppercase tracking-widest text-global-primary">
        {title}
      </p>
      {subtitle && (
        <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
export default function MyAccount() {
  const [edit, setEdit] = useState(false);
  const [formValues, setFormValues] = useState<any>({ fileList: [] });
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

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
      const result = await updateUser(values);
      if (result.success) {
        successNotification({ message: result.message });
        setEdit(false);
      } else {
        errorNotification({ message: result.message });
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
  };

  // Avatar: get the first preview URL if available
  const avatarUrl =
    formValues?.fileList?.[0]?.url ||
    formValues?.fileList?.[0]?.thumbUrl ||
    null;
  const userName: string = formValues?.name || "";
  const userInitial = userName.charAt(0).toUpperCase() || "U";

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── VIEW MODE ─────────────────────────────────── */}
      {!edit && (
        <div className="animate-in fade-in duration-300">
          {/* Avatar + identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8 pb-7 border-b border-gray-100">
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-global-primary ring-4 ring-amber-100 shadow-md">
                {avatarUrl ? (
                   
                  <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl font-black">
                    {userInitial}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-black text-gray-900 mb-0.5">
                {formValues?.name || "—"}
              </h3>
              <p className="text-sm text-gray-400 font-medium mb-4">
                {formValues?.email || "—"}
              </p>
              <button
                onClick={() => setEdit(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-global-primary text-white text-xs font-bold rounded-xl shadow-sm shadow-amber-200/60 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <FiEdit2 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-0">
            <SectionHeader title="Personal Information" />
            <InfoRow icon={<FiUser className="w-4 h-4" />} label="Full Name" value={formValues?.name} />
            <InfoRow
              icon={<FiCalendar className="w-4 h-4" />}
              label="Birthday"
              value={formValues?.dob ? dayjs(formValues.dob).format("MMMM D, YYYY") : null}
            />
            <InfoRow icon={<FiUser className="w-4 h-4" />} label="Gender" value={formValues?.gender} />

            <div className="pt-5">
              <SectionHeader title="Contact Details" />
            </div>
            <InfoRow icon={<FiMail className="w-4 h-4" />} label="Email Address" value={formValues?.email} />
            <InfoRow icon={<FiPhone className="w-4 h-4" />} label="Phone Number" value={formValues?.phone} />

            <div className="pt-5">
              <SectionHeader title="Address" />
            </div>
            <InfoRow icon={<FiMapPin className="w-4 h-4" />} label="Address" value={formValues?.address} />
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

            {/* ── Profile Photo ── */}
            <div className="mb-8 pb-7 border-b border-gray-100">
              <SectionHeader
                title="Profile Photo"
                subtitle="Click the avatar to upload a new photo"
              />
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* Circular upload */}
                <Form.Item
                  name="fileList"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                  className="mb-0"
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
                      className="!rounded-full overflow-hidden [&_.ant-upload]:!rounded-full [&_.ant-upload-list-item]:!rounded-full [&_.ant-upload-list-picture-card]:!rounded-full"
                    >
                      {formValues?.fileList?.length >= 1 ? null : (
                        <div className="flex flex-col items-center justify-center text-gray-400 gap-1">
                          <FiCamera className="w-5 h-5" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Upload</span>
                        </div>
                      )}
                    </Upload>
                  </ImgCrop>
                </Form.Item>

                <div className="text-center sm:text-left">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Profile picture
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG or JPG, max 1MB.<br />
                    Recommended: square image, at least 200×200px.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Personal Information ── */}
            <div className="mb-8 pb-7 border-b border-gray-100">
              <SectionHeader title="Personal Information" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1">
                <Form.Item
                  name="name"
                  label={<span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Name</span>}
                  rules={[{ required: true, message: "Name is required" }]}
                >
                  <Input
                    prefix={<FiUser className="text-gray-300 mr-1" />}
                    placeholder="John Doe"
                    size="large"
                    className="!rounded-xl !h-11"
                  />
                </Form.Item>

                <Form.Item
                  name="dob"
                  label={<span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Birthday</span>}
                >
                  <DatePicker
                    placeholder="Select date"
                    className="w-full !rounded-xl !h-11"
                    size="large"
                    format="YYYY-MM-DD"
                    suffixIcon={<FiCalendar className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  name="gender"
                  label={<span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Gender</span>}
                  className="sm:col-span-2"
                >
                  <Radio.Group className="flex gap-4 mt-1">
                    <Radio value="Male" className="font-medium text-sm text-gray-700">Male</Radio>
                    <Radio value="Female" className="font-medium text-sm text-gray-700">Female</Radio>
                    <Radio value="Other" className="font-medium text-sm text-gray-700">Other</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>

            {/* ── Contact Details ── */}
            <div className="mb-8 pb-7 border-b border-gray-100">
              <SectionHeader title="Contact Details" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1">
                <Form.Item
                  name="email"
                  label={<span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</span>}
                  rules={[{ required: true, message: "E-mail is required", type: "email" }]}
                >
                  <Input
                    prefix={<FiMail className="text-gray-300 mr-1" />}
                    placeholder="name@example.com"
                    disabled
                    size="large"
                    className="!rounded-xl !h-11 !bg-gray-50"
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label={<span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Phone Number</span>}
                  rules={[{ required: true, message: "Phone is required" }]}
                >
                  <Input
                    prefix={<FiPhone className="text-gray-300 mr-1" />}
                    placeholder="+1 234 567 890"
                    size="large"
                    className="!rounded-xl !h-11"
                  />
                </Form.Item>
              </div>
            </div>

            {/* ── Address ── */}
            <div className="mb-8">
              <SectionHeader title="Address" />
              <Form.Item
                name="address"
                label={<span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Street Address</span>}
              >
                <Input.TextArea
                  placeholder="Enter your full address"
                  rows={3}
                  className="!rounded-xl !p-3 resize-none"
                />
              </Form.Item>
            </div>

            {/* ── Action Bar ── */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-5 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
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
                className="w-full sm:w-auto !h-11 !px-8 !rounded-xl !font-bold flex items-center justify-center gap-2"
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}
