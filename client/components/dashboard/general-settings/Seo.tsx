"use client";

import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Select,
  Typography,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import uploadButton from "@/components/website/uploadButton";
import {
  fileDeleteWithPhoto
} from "@/lib/apis/file";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import {
  handlePreview,
  normFile,
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

const { Title, Text } = Typography;


const Seo = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const global = useSelector(selectGlobal);

  const helpSupport = React.useMemo(() => ({
    id: global.setting.id,
    ...global.setting.seo,
    ...global.setting.homePage,
  }), [global.setting]);

  // Populate form on setting change
  useEffect(() => {
    form.setFieldsValue(helpSupport);
  }, [form, global.setting, helpSupport]);

  // Submit Handler
  const handleSubmit = async (values: any) => {
    setLoading(true);

    const payload = {
      id: values.id,
      seo: {
        headerCode: values.headerCode,
        bodyStartCode: values.bodyStartCode,
        bodyEndCode: values.bodyEndCode,
      },
      homePage: {
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        metaImage: values.metaImage,
        metaKeywords: values.metaKeywords,
      },
    };

    try {
      const res = payload.id
        ? await updateSetting(payload)
        : await saveSetting(payload);

      if (!res?.success) {
        return errorNotification({ message: res?.message || "Operation failed" });
      }

      successNotification({ message: res.message });
    } catch (error: any) {
      errorNotification({
        message:
          error?.response?.data?.message || error?.message || "Unexpected error",
      });
    } finally {
      setLoading(false);
      dispatch(setSetting({}));
      dispatch(setAction({}));
    }
  };



  // Custom File Upload Handler
  const customUploadRequest = async (options: any) => {
    const result = await handleGlobalUpload(options);
    if (result) {
      const { newFile, newFileName } = result;
      const updatedData = {
        metaImagefileList: [newFile],
        metaImage: newFileName,
      };

      form.setFieldsValue(updatedData);

      dispatch(setSetting({
        ...global.setting,
        homePage: updatedData,
      }));
    }
  };

  // File Remove Handler
  const handleImageRemove = async (file: any) => {
    if (file.fileName) {
      const resetData = {
        metaImage: null,
        metaImagefileList: [],
      };

      form.setFieldsValue(resetData);

      dispatch(setSetting({
        ...global.setting,
        homePage: resetData,
      }));

      await fileDeleteWithPhoto({ filename: file.fileName });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title level={4} className="!mb-1">
          SEO Configuration
        </Title>
        <Text type="secondary">
          Manage your website's search engine optimization and metadata
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
          {/* Hidden ID */}
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          {/* SEO Code Injection Section */}
          <div className="space-y-4">
            <Title level={5} className="!mb-3">
              Code Injection
            </Title>

            <Form.Item
              name="headerCode"
              label={<span className="text-base font-medium">Header Code</span>}
              extra="Code will be injected in the <head> section (e.g., Google Analytics)"
              className="!mb-0"
            >
              <Input.TextArea
                placeholder="<!-- Google Analytics or other header scripts -->"
                rows={4}
                size="large"
                className="max-w-2xl font-mono text-sm"
              />
            </Form.Item>

            <Form.Item
              name="bodyStartCode"
              label={<span className="text-base font-medium">Body Start Code</span>}
              extra="Code will be injected right after the opening <body> tag"
              className="!mb-0"
            >
              <Input.TextArea
                placeholder="<!-- Facebook Pixel or other body start scripts -->"
                rows={4}
                size="large"
                className="max-w-2xl font-mono text-sm"
              />
            </Form.Item>

            <Form.Item
              name="bodyEndCode"
              label={<span className="text-base font-medium">Body End Code</span>}
              extra="Code will be injected right before the closing </body> tag"
              className="!mb-0"
            >
              <Input.TextArea
                placeholder="<!-- Chat widgets or other body end scripts -->"
                rows={4}
                size="large"
                className="max-w-2xl font-mono text-sm"
              />
            </Form.Item>
          </div>

          <Divider className="!my-8" />

          {/* Home Page Meta Data Section */}
          <div className="space-y-4">
            <Title level={5} className="!mb-3">
              Home Page Meta Data
            </Title>

            <Form.Item
              name="metaTitle"
              label={<span className="text-base font-medium">Meta Title</span>}
              extra="The title that appears in search engine results (50-60 characters recommended)"
              className="!mb-0"
            >
              <Input.TextArea
                placeholder="Your Store Name - Best Products Online"
                rows={2}
                size="large"
                className="max-w-2xl"
              />
            </Form.Item>

            <Form.Item
              name="metaDescription"
              label={<span className="text-base font-medium">Meta Description</span>}
              extra="Description shown in search results (150-160 characters recommended)"
              className="!mb-0"
            >
              <Input.TextArea
                placeholder="Shop the best products online. Free shipping, fast delivery, and great customer service."
                rows={3}
                size="large"
                className="max-w-2xl"
              />
            </Form.Item>

            {/* Meta Image Upload */}
            <Form.Item
              name="metaImagefileList"
              label={<span className="text-base font-medium">Meta Image (Open Graph)</span>}
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra="Image displayed when your site is shared on social media (1200x630px recommended)"
              className="!mb-0"
            >
              <ImgCrop rotationSlider showReset aspect={1200 / 630}>
                <Upload
                  name="metaImage"
                  listType="picture-card"
                  fileList={helpSupport?.metaImagefileList || []}
                  onRemove={handleImageRemove}
                  onPreview={(file) => handlePreview(file, dispatch)}
                  customRequest={customUploadRequest}
                  maxCount={1}
                  className="avatar-uploader"
                >
                  {helpSupport?.metaImagefileList?.length >= 1 ? null : uploadButton}
                </Upload>
              </ImgCrop>
            </Form.Item>

            <Form.Item name="metaImage" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              name="metaKeywords"
              label={<span className="text-base font-medium">Meta Keywords</span>}
              extra="Enter keywords and press Enter (comma-separated also works)"
              className="!mb-0"
            >
              <Select
                mode="tags"
                size="large"
                placeholder="e.g., online shopping, best deals, electronics"
                tokenSeparators={[","]}
                className="max-w-2xl"
              />
            </Form.Item>
          </div>

          {/* Submit Button */}
          <Form.Item className="!mb-0 !mt-8">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="!bg-black hover:!bg-gray-800 !rounded-xl !h-11 !px-8 !font-medium"
            >
              Save SEO Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Seo;
