"use client";
import { MailOutlined, MinusCircleOutlined, PhoneOutlined, PlusOutlined, ShopOutlined, EnvironmentOutlined, InfoCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Space,
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
import { SettingsHeader } from "./CommonComponents";

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
      <SettingsHeader 
         title="Basic Information" 
         description="Configure your store's foundational details, contact information, and core branding."
      />

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

          <div className="space-y-10">
            {/* General Site Data */}
            <div className="space-y-4">
              <SettingsHeader title="Store Details" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                {/* Site Name */}
                <Form.Item
                  name="siteName"
                  label={<span className="text-base font-medium">Site Name</span>}
                  rules={[{ required: true, message: "Site name is required" }]}
                  className="!mb-0"
                >
                  <Input size="large" prefix={<ShopOutlined className="text-gray-400 mr-1" />} placeholder="Enter your store name" />
                </Form.Item>

                {/* Email */}
                <Form.Item
                  name="email"
                  label={<span className="text-base font-medium">Email Address</span>}
                  rules={[{ type: "email", message: "Please enter a valid email" }]}
                  className="!mb-0"
                >
                  <Input size="large" prefix={<MailOutlined className="text-gray-400 mr-1" />} placeholder="contact@yourstore.com" />
                </Form.Item>

                {/* Phone */}
                <Form.Item
                  name="phone"
                  label={<span className="text-base font-medium">Phone Number</span>}
                  className="!mb-0"
                >
                  <Input size="large" prefix={<PhoneOutlined className="text-gray-400 mr-1" />} placeholder="+1 (555) 123-4567" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                {/* Description */}
                <Form.Item
                  name="description"
                  label={(
                    <Space size="small">
                      <span className="text-base font-medium">Description</span>
                      <InfoCircleOutlined className="text-gray-400" title="A brief description of your store used for SEO and about sections." />
                    </Space>
                  )}
                  className="!mb-0"
                >
                  <Input.TextArea
                    size="large"
                    placeholder="Enter your store description and bio..."
                    rows={4}
                  />
                </Form.Item>

                {/* Address */}
                <Form.Item
                  name="address"
                  label={(
                    <Space size="small">
                      <span className="text-base font-medium">Store Address</span>
                      <EnvironmentOutlined className="text-gray-400" title="The physical location of your store." />
                    </Space>
                  )}
                  className="!mb-0"
                >
                  <Input.TextArea
                    size="large"
                    placeholder="E.g., 123 Commerce Avenue, New York, NY 10001"
                    rows={4}
                  />
                </Form.Item>
              </div>
            </div>            {/* Branding Section */}
            <div>
              <SettingsHeader title="Brand Assets" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                   <FileUploadField name="image" label="Store Logo" fileListKey="fileList" />
                   <div className="text-xs text-gray-400 mt-2">Recommended size: 512x512px. Used for main site branding.</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                   <FileUploadField
                     name="favicon"
                     label="Favicon (Tab Icon)"
                     fileListKey="faviconfileList"
                   />
                   <div className="text-xs text-gray-400 mt-2">Recommended: .ico or .png format. Used for browser tabs.</div>
                </div>
              </div>
            </div>

            {/* Return Settings Section */}
            <div>
              <SettingsHeader title="Default Returns & Policies" />
              <div className="space-y-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100 max-w-3xl">
                <Form.Item
                  name={["returnSetting", "returnWindowDays"]}
                  label={<span className="text-base font-medium">Standard Return Window</span>}
                  tooltip="Number of days after delivery a customer can request a return."
                  rules={[{ required: true, message: "Return window is required" }]}
                >
                  <InputNumber 
                      size="large" 
                      min={0} 
                      placeholder="e.g. 7" 
                      addonAfter="Days" 
                      style={{ width: "100%", maxWidth: "300px" }} 
                      className="rounded-md"
                  />
                </Form.Item>

                <div className="space-y-3">
                  <div>
                    <span className="text-base font-medium block text-gray-800">Predefined Return Reasons</span>
                    <Text type="secondary" className="block text-sm">
                      Common reasons shown to customers in the return request dropdown.
                    </Text>
                  </div>

                  <Form.List name={["returnSetting", "predefinedReasons"]}>
                    {(fields, { add, remove }) => (
                      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                        {fields.map(({ key, name, ...restField }) => (
                          <Space key={key} style={{ display: "flex", width: "100%" }} align="center">
                            <Form.Item
                              {...restField}
                              name={[name]}
                              rules={[{ required: true, message: "Reason text is required" }]}
                              className="!mb-0 w-full"
                            >
                              <Input size="large" placeholder="E.g., Defective item, Ordered by mistake..." className="min-w-[300px]" />
                            </Form.Item>
                            <Button 
                                type="text" 
                                danger 
                                icon={<MinusCircleOutlined />} 
                                onClick={() => remove(name)} 
                                className="!px-2 ml-1 opacity-70 hover:opacity-100"
                            />
                          </Space>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                          className="mt-2 text-global-primary border-global-primary/30 hover:border-global-primary hover:text-global-primary w-fit"
                        >
                          Add New Reason
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </div>
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
              className="!h-11 !px-8 !font-medium"
              style={{
                borderRadius: "var(--button-border-radius)",
                backgroundColor: "var(--global-primary)"
              }}
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
