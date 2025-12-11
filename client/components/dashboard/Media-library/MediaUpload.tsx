"use client";
import { normFile } from "@/lib/utils/commonFunctions";
import { handleGlobalUpload } from "@/lib/utils/handleGlobalUpload";
import { Form, Upload } from "antd";
import { FaUpload } from "react-icons/fa";


export default function MediaUpload({ setFiles }: any) {
  const [form] = Form.useForm();



  const customUploadRequest = async (options: any) => {
    const result = await handleGlobalUpload(options);
    if (result) {
      const { newFile } = result;
      setFiles((prev: any) => [newFile, ...prev]);
      // alert is removed as handleGlobalUpload handles success/error notifications usually, 
      // but if we want to keep the specific alert message from the original code we might lose it unless handleGlobalUpload returns message.
      // However, handleGlobalUpload calls onSuccess.
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
            <FaUpload />Add new
          </button>
        </Upload>
      </Form.Item>
    </Form>
  );
}
