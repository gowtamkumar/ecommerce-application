"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, Form, Input, Modal, Upload, Image as AntImage, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import appConfig from "@/appConfig";
import {
  selectGlobal,
  setAction,
  setSetting,
} from "@/redux/features/global/globalSlice";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";
import {
  handlePreview,
  handlePreviewCancel,
  normFile,
} from "@/lib/utils/commonFunctions";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";

const { Title, Text } = Typography;

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

const FooterOption = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  const initialData = React.useMemo(() => ({
    id: global.setting?.id,
    ...global.setting?.footerOption,
    ...global.setting?.socialLink,
  }), [global.setting]);

  useEffect(() => {
    form.setFieldsValue(initialData);
  }, [form, initialData]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const {
      id,
      copyRight,
      image,
      facebookUrl,
      instagramUrl,
      linkedinUrl,
      twitterUrl,
    } = values;

    const payload = {
      id,
      footerOption: { copyRight, image },
      socialLink: { facebookUrl, instagramUrl, linkedinUrl, twitterUrl },
    };

    try {
      const res = id
        ? await updateSetting(payload)
        : await saveSetting(payload);

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

  const customUploadRequest = async ({ file, onSuccess, onError }: any) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadFile(formData);
      const filename = res?.data?.[0]?.filename;
      if (!filename) throw new Error("No filename returned");

      const newFile = {
        uid: Date.now().toString(),
        name: `footer-${filename}`,
        status: "done",
        fileName: filename,
        url: getUploadImageUrl(filename),
      };

      const newValues = {
        ...form.getFieldsValue(),
        fileList: [newFile],
        image: filename,
      };

      form.setFieldsValue(newValues);
      dispatch(setSetting({ ...global.setting, footerOption: newValues }));
      onSuccess("OK");
    } catch (err) {
      onError(err);
    }
  };

  const handleRemoveImage = async (file: any) => {
    const values = {
      ...form.getFieldsValue(),
      fileList: [],
      image: null,
    };
    form.setFieldsValue(values);
    dispatch(setSetting({ ...global.setting, footerOption: values }));

    if (file.fileName) {
      await fileDeleteWithPhoto({ filename: file.fileName });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title level={4} className="!mb-1">
          Footer Configuration
        </Title>
        <Text type="secondary">
          Manage your website footer content and social media links
        </Text>
      </div>

      <Card className="shadow-sm border border-gray-100 rounded-2xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <div className="space-y-4">
            {/* Copyright */}
            <Form.Item
              name="copyRight"
              label={<span className="text-base font-medium">Copyright Text</span>}
              rules={[{ required: true, message: "Copyright text is required" }]}
              extra="Text displayed in the footer (e.g., © 2024 Your Store. All rights reserved.)"
              className="!mb-0"
            >
              <Input
                size="large"
                placeholder="© 2024 Your Store. All rights reserved."
                className="max-w-xl"
              />
            </Form.Item>

            {/* Social Media Links Section */}
            <div className="pt-6 border-t mt-6">
              <Title level={5} className="!mb-4">
                Social Media Links
              </Title>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="facebookUrl"
                  label={<span className="text-base font-medium">Facebook URL</span>}
                  className="!mb-0"
                >
                  <Input
                    size="large"
                    placeholder="https://facebook.com/yourpage"
                    prefix={<span className="text-blue-600">𝑓</span>}
                  />
                </Form.Item>

                <Form.Item
                  name="instagramUrl"
                  label={<span className="text-base font-medium">Instagram URL</span>}
                  className="!mb-0"
                >
                  <Input
                    size="large"
                    placeholder="https://instagram.com/yourprofile"
                    prefix={<span className="text-pink-600">📷</span>}
                  />
                </Form.Item>

                <Form.Item
                  name="linkedinUrl"
                  label={<span className="text-base font-medium">LinkedIn URL</span>}
                  className="!mb-0"
                >
                  <Input
                    size="large"
                    placeholder="https://linkedin.com/company/yourcompany"
                    prefix={<span className="text-blue-700">in</span>}
                  />
                </Form.Item>

                <Form.Item
                  name="twitterUrl"
                  label={<span className="text-base font-medium">Twitter URL</span>}
                  className="!mb-0"
                >
                  <Input
                    size="large"
                    placeholder="https://twitter.com/yourhandle"
                    prefix={<span className="text-sky-500">𝕏</span>}
                  />
                </Form.Item>
              </div>
            </div>

            {/* Payment Methods Image */}
            <div className="pt-6 border-t mt-6">
              <Form.Item
                name="fileList"
                label={<span className="text-base font-medium">Payment Methods Image</span>}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Upload an image showing accepted payment methods (e.g., Visa, Mastercard, PayPal)"
                className="!mb-0"
              >
                <Upload
                  name="image"
                  listType="picture-card"
                  fileList={initialData.fileList?.length || []}
                  customRequest={customUploadRequest}
                  onPreview={(file) => handlePreview(file, dispatch)}
                  onRemove={handleRemoveImage}
                  maxCount={1}
                >
                  {initialData.fileList?.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>

              <Form.Item name="image" hidden>
                <Input />
              </Form.Item>
            </div>
          </div>

          <Modal
            open={global.previewOpen}
            title={global.previewTitle}
            footer={null}
            onCancel={() => handlePreviewCancel(dispatch)}
          >
            <AntImage
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
              Save Footer Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default FooterOption;
