"use client";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  Modal,
  Typography,
  Upload,
  UploadProps
} from "antd";
import ImgCrop from "antd-img-crop";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import uploadButton from "@/components/share-component/uploadButton";
import { fileDeleteWithPhoto } from "@/lib/apis/file";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import {
  handlePreview,
  handlePreviewCancel,
} from "@/lib/utils/commonFunctions";
import { handleGlobalUpload } from "@/lib/utils/handleGlobalUpload";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setSetting,
} from "@/redux/features/global/globalSlice";
import TextArea from "antd/es/input/TextArea";

const { Title, Text } = Typography;

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
    const result = await handleGlobalUpload(options);
    const { newFile, newFileName }: any = result;

    const uploadedFile = {
      uid: Date.now().toString(),
      name: `${newFileName}`,
      status: "done",
      url: getUploadImageUrl(newFileName),
      fileName: newFileName,
    };

    const updatedFields = {
      [fileListKey]: [uploadedFile],
      [name]: newFileName,
    };

    form.setFieldsValue(updatedFields);
    dispatch(setSetting({ ...global.setting, ...updatedFields }));

  };

  return (
    <>
      <Form.Item
        name={fileListKey}
        label={<span className="text-base font-medium">{label}</span>}
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title level={4} className="!mb-1">
          Basic Information
        </Title>
        <Text type="secondary">
          Configure your store's basic details and contact information
        </Text>
      </div>

      <Card className="shadow-sm border border-gray-100 rounded-2xl">
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

          <div className="space-y-4">
            {/* Site Name */}
            <Form.Item
              name="siteName"
              label={<span className="text-base font-medium">Site Name</span>}
              rules={[{ required: true, message: "Site name is required" }]}
              className="!mb-0"
            >
              <Input
                size="large"
                placeholder="Enter your store name"
                className="max-w-xl"
              />
            </Form.Item>




            {/* Email */}
            <Form.Item
              name="email"
              label={<span className="text-base font-medium">Email Address</span>}
              rules={[
                { type: "email", message: "Please enter a valid email" },
              ]}
              className="!mb-0"
            >
              <Input
                size="large"
                placeholder="contact@yourstore.com"
              // className="max-w-xl"
              />
            </Form.Item>

            {/* Phone */}
            <Form.Item
              name="phone"
              label={<span className="text-base font-medium">Phone Number</span>}
              className="!mb-0"
            >
              <Input
                size="large"
                placeholder="+1 (555) 123-4567"
                className="max-w-xl"
              />
            </Form.Item>
            <Form.Item
              name="description"
              label={<span className="text-base font-medium">Description</span>}
              className="!mb-0"
            >
              <TextArea
                size="large"
                placeholder="Enter your store description"
              />
            </Form.Item>

            {/* Address */}
            <Form.Item
              name="address"
              label={<span className="text-base font-medium">Store Address</span>}
              className="!mb-0"
            >
              <Input.TextArea
                size="large"
                placeholder="Enter your store address"
                rows={3}
                className="max-w-xl"
              />
            </Form.Item>



            {/* Branding Section */}
            <div className="pt-6 border-t mt-6">
              <Title level={5} className="!mb-3">
                Branding
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadField name="image" label="Store Logo" fileListKey="fileList" />
                <FileUploadField
                  name="favicon"
                  label="Favicon"
                  fileListKey="faviconfileList"
                />
              </div>
            </div>
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

          <Form.Item className="!mb-0 !mt-8">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="!bg-black hover:!bg-gray-800 !rounded-xl !h-11 !px-8 !font-medium"
            >
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default GeneralSettings;
