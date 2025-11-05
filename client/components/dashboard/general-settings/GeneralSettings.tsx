"use client";
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import appConfig from "@/appConfig";
import uploadButton from "@/components/website/uploadButton";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import {
  handlePreview,
  handlePreviewCancel,
} from "@/lib/utils/commonFunctions";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setSetting,
} from "@/redux/features/global/globalSlice";

const FileUploadField = ({
  name,
  label,
  fileListKey,
}: {
  name: string;
  label: string;
  fileListKey: "fileList" | "faviconfileList";
}) => {
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const form = Form.useFormInstance();

  const currentList = global?.setting?.[fileListKey] || [];

  const handleRemove = async (file: any) => {
    form.setFieldsValue({ [name]: null, [fileListKey]: [] });
    dispatch(
      setSetting({ ...global.setting, [name]: null, [fileListKey]: [] })
    );

    if (file.fileName) {
      await fileDeleteWithPhoto({ filename: file.fileName });
    }
  };

  const customRequest: UploadProps["customRequest"] = async (options) => {
    const { file, filename, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append(filename!, file as Blob);

    try {
      const res = await uploadFile(formData);
      const uploaded = res?.data?.[0];

      if (!uploaded?.filename) throw new Error("Upload failed");

      const uploadedFile: UploadFile = {
        uid: Date.now().toString(),
        name: `${filename}`,
        status: "done",
        url: `${appConfig.baseApiUrl}/uploads/${uploaded.filename}`,
        fileName: uploaded.filename,
      };

      const updatedFields = {
        [fileListKey]: [uploadedFile],
        [name]: uploaded.filename,
      };

      form.setFieldsValue(updatedFields);
      dispatch(setSetting({ ...global.setting, ...updatedFields }));
      onSuccess?.("Ok");
    } catch (err: any) {
      onError?.(err);
    }
  };

  return (
    <>
      <Form.Item
        name={fileListKey}
        label={label}
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
      >
        <ImgCrop rotationSlider showReset>
          <Upload
            name={name}
            listType="picture-card"
            fileList={currentList}
            onRemove={handleRemove}
            onPreview={(file) => handlePreview(file, dispatch)}
            customRequest={customRequest}
            maxCount={1}
          >
            {currentList.length >= 1 ? null : uploadButton}
          </Upload>
        </ImgCrop>
      </Form.Item>
      <Form.Item name={name} hidden>
        <Input />
      </Form.Item>
    </>
  );
};

const GeneralSettings = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  useEffect(() => {
    form.setFieldsValue(global.setting);
  }, [global.setting, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = values.id
        ? await updateSetting(values)
        : await saveSetting(values);

      if (!res?.success) {
        errorNotification({ message: res?.message || "Operation failed" });
        return;
      }

      successNotification({ message: res.message });
    } catch (error: any) {
      errorNotification({
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unexpected error",
      });
    } finally {
      setLoading(false);
      dispatch(setSetting({}));
      dispatch(setAction({}));
    }
  };

  return (
    <div className="container mx-auto">
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="siteName"
          label="Site name"
          rules={[{ required: true, message: "Site name is required" }]}
        >
          <Input className="md:!w-1/2" placeholder="Enter site name" />
        </Form.Item>

        <Form.Item name="email" label="E-mail">
          <Input className="md:!w-1/2" placeholder="Enter email" />
        </Form.Item>

        <Form.Item name="phone" label="Phone No">
          <Input className="md:!w-1/2" placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item name="address" label="Address">
          <Input.TextArea className="md:!w-1/2" placeholder="Enter address" />
        </Form.Item>

        <div className="flex gap-10">
          <FileUploadField name="image" label="Logo" fileListKey="fileList" />
          <FileUploadField
            name="favicon"
            label="Favicon"
            fileListKey="faviconfileList"
          />
        </div>

        <Modal
          open={global.previewOpen}
          title={global.previewTitle}
          footer={null}
          onCancel={() => handlePreviewCancel(dispatch)}
        >
          <Image
            alt="Preview"
            style={{ width: "100%" }}
            preview={false}
            src={global.previewImage}
          />
        </Modal>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GeneralSettings;
