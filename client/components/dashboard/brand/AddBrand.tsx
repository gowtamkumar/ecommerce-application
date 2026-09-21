"use client";
import uploadButton from "@/components/share-component/uploadButton";
import { saveBrand, updateBrand, type Brand as BrandItem } from "@/lib/apis/brand";
import { fileDeleteWithPhoto } from "@/lib/apis/file";
import { handlePreview, handlePreviewCancel, normFile } from "@/lib/utils/commonFunctions";
import { handleGlobalUpload } from "@/lib/utils/handleGlobalUpload";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { SaveOutlined, TagsOutlined, UndoOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface AddBrandProps {
  open: boolean;
  mode: "create" | "update";
  payload: BrandItem | null;
  onCancel: () => void;
  onSaved: () => void;
}

const AddBrand = ({ open, mode, payload, onCancel, onSaved }: AddBrandProps) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const [formValues, setFormValues] = useState<any>({ fileList: [] });
  const [submitting, setSubmitting] = useState(false);

  // Populate the form whenever the modal opens for a record; reset otherwise.
  useEffect(() => {
    if (open) {
      const initial = { ...(payload ?? {}) };
      form.setFieldsValue(initial);
      setFormValues(initial);
    } else {
      form.resetFields();
      setFormValues({ fileList: [] });
    }
  }, [open, payload, form]);

  const handleSubmit = useCallback(
    async (values: any) => {
      setSubmitting(true);
      try {
        const res = values.id ? await updateBrand(values) : await saveBrand(values);

        if (!res?.success) {
          errorNotification({ message: res?.message || "Operation failed" });
          return;
        }

        successNotification({ message: res.message || "Brand saved successfully" });
        onSaved();
      } catch (error: any) {
        errorNotification({
          message:
            error?.response?.data?.message || error?.message || "An unexpected error occurred",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [onSaved],
  );

  const resetFormData = useCallback(() => {
    if (payload?.id) {
      form.setFieldsValue(payload);
      setFormValues(payload);
    } else {
      form.resetFields();
      setFormValues({ fileList: [] });
    }
  }, [form, payload]);

  const customUploadRequest = async (options: any) => {
    const result = await handleGlobalUpload(options);
    if (result) {
      const { newFile, newFileName } = result;
      form.setFieldsValue({ fileList: [newFile], image: newFileName });
      setFormValues((prev: any) => ({ ...prev, fileList: [newFile], image: newFileName }));
    }
  };

  const isEditMode = mode === "update";

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isEditMode ? "bg-blue-50" : "bg-green-50"
            }`}
          >
            <TagsOutlined className={`text-xl ${isEditMode ? "text-blue-600" : "text-green-600"}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 m-0">
              {isEditMode ? "Edit Brand" : "Create New Brand"}
            </h3>
            <p className="text-sm text-gray-500 m-0">
              {isEditMode ? "Update brand information" : "Add a new brand to your store"}
            </p>
          </div>
        </div>
      }
      width={560}
      zIndex={1050}
      open={open}
      onCancel={onCancel}
      forceRender
      footer={null}
      className="modern-modal"
      styles={{
        header: { borderBottom: "none", paddingBottom: 0 },
        body: { paddingTop: 24 },
      }}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        onValuesChange={(_v, values) => setFormValues(values)}
        layout="vertical"
        autoComplete="off"
        scrollToFirstError={true}
        className="modern-form"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="space-y-6">
          {/* Name */}
          <Form.Item
            name="name"
            label={<span className="font-semibold text-gray-700">Brand Name</span>}
            rules={[{ required: true, message: "Please enter brand name" }]}
            className="mb-0"
          >
            <Input placeholder="Enter brand name" size="large" className="rounded-lg" />
          </Form.Item>

          {/* Status */}
          <Form.Item
            name="status"
            label={<span className="font-semibold text-gray-700">Status</span>}
            rules={[{ required: true, message: "Status is required" }]}
            className="mb-0"
          >
            <Select placeholder="Select Status" size="large" className="rounded-lg">
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Divider />

        {/* Image Upload */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-semibold text-gray-700">Brand Logo</span>
          </div>

          <Form.Item
            name="fileList"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            className="mb-0"
          >
            <ImgCrop rotationSlider showReset aspect={16 / 9}>
              <Upload
                name="image"
                listType="picture-card"
                fileList={formValues?.fileList || []}
                onRemove={async (v) => {
                  if ((v as any).fileName) {
                    form.setFieldsValue({ image: null, fileList: [] });
                    setFormValues({ image: null, fileList: [] });
                    await fileDeleteWithPhoto({ filename: (v as any).fileName });
                  }
                }}
                className="brand-uploader"
                onPreview={(file) => handlePreview(file, dispatch)}
                customRequest={customUploadRequest}
                maxCount={1}
              >
                {formValues?.fileList?.length >= 1 ? null : uploadButton}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item name="image" hidden>
            <Input />
          </Form.Item>
        </div>

        {/* Preview Modal */}
        <Modal
          open={global.previewOpen}
          title="Image Preview"
          footer={null}
          onCancel={() => handlePreviewCancel(dispatch)}
          centered
        >
          <Image
            alt="preview"
            preview={false}
            style={{ width: "100%" }}
            src={global.previewImage}
            className="rounded-lg"
          />
        </Modal>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6">
          <Button size="large" icon={<UndoOutlined />} onClick={resetFormData} className="rounded-lg">
            Reset
          </Button>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            disabled={submitting}
            loading={submitting}
            className="rounded-lg min-w-[120px]"
          >
            {payload?.id ? "Update" : "Save"} Brand
          </Button>
        </div>
      </Form>

      <style jsx global>{`
        .brand-uploader .ant-upload-select {
          width: 200px !important;
          height: 200px !important;
          border-radius: 12px !important;
          border: 2px dashed #d9d9d9 !important;
          transition: all 0.3s ease !important;
        }

        .brand-uploader .ant-upload-select:hover {
          border-color: #1890ff !important;
          background: #fafafa !important;
        }

        .brand-uploader .ant-upload-list-item-container {
          width: 200px !important;
          height: 200px !important;
          border-radius: 12px !important;
        }

        .modern-modal .ant-modal-header {
          padding: 24px 24px 0 !important;
        }
      `}</style>
    </Modal>
  );
};

export default AddBrand;