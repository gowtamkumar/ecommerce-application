"use client";
import { normFile } from "@/lib/utils/commonFunctions";
import { handleGlobalUpload } from "@/lib/utils/handleGlobalUpload";
import { Form, Upload, message } from "antd";
import { FaUpload } from "react-icons/fa";

export default function MediaUpload({ setFiles }: any) {
  const [form] = Form.useForm();

  const customUploadRequest = async (options: any) => {
    const result = await handleGlobalUpload({
      ...options,
      filename: options.filename || "image",
    });
    if (result) {
      const entity = (result as any).entity || result.newFile;
      setFiles((prev: any) => [entity, ...(prev || [])]);
      message.success("File uploaded to MinIO successfully");
    }
  };

  return (
    <Form form={form} className="mb-0">
      <Form.Item
        name="fileList"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        className="mb-0"
      >
        <Upload
          name="image"
          showUploadList={false}
          customRequest={customUploadRequest}
          multiple
        >
          <button
            type="button"
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
          >
            <FaUpload className="w-3.5 h-3.5" />
            Add new
          </button>
        </Upload>
      </Form.Item>
    </Form>
  );
}
