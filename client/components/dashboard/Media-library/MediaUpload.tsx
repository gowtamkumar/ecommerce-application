"use client";
import { uploadFile } from "@/lib/apis/file";
import { normFile } from "@/lib/utils/commonFunctions";
import { Form, Upload } from "antd";
import { FaUpload } from "react-icons/fa";

export default function MediaUpload({ setFiles }: any) {
  const [form] = Form.useForm();

  const customUploadRequest = async (options: any) => {
    const { filename, file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append(filename, file);

    try {
      const res = await uploadFile(formData);

      if (res.success) {
        setFiles((prev: any) => [{ ...res.data[0] }, ...prev]);
        alert(`"${res.message}"`);
      }

      onSuccess("Ok");
    } catch (err) {
      console.error("🚀 ~ Upload error:", err);
      alert(err);
      onError({ err });
    }
  };

  return (
    <Form form={form}>
      <Form.Item
        name="fileList"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          name="image"
          showUploadList={false}
          customRequest={customUploadRequest}
          maxCount={1}
        >
          <button className="flex items-center gap-2 bg-blue-600 !text-white px-2 py-1 rounded-md hover:bg-blue-700">
            <FaUpload /> নতুন যোগ করুন
          </button>
        </Upload>
      </Form.Item>
    </Form>
  );
}
