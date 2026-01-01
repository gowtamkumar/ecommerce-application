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

import uploadButton from "@/components/share-component/uploadButton";
import {
  fileDeleteWithPhoto
} from "@/lib/apis/file";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import {
  handlePreview,
  normFile,
} from "@/lib/utils/commonFunctions";
import { handleGlobalUpload } from "@/lib/utils/handleGlobalUpload";
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

  const seoData = React.useMemo(() => ({
    id: global.setting.id,
    ...global.setting.seo,
  }), [global.setting]);

  // Populate form on setting change
  useEffect(() => {
    form.setFieldsValue(seoData);
  }, [form, global.setting, seoData]);

  // Submit Handler
  const handleSubmit = async (values: any) => {
    setLoading(true);

    const payload = {
      id: values.id,
      seo: {
        ...values,
      },
    };

    delete payload.seo.id;

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
        seo: {
            ...global.setting.seo,
            ...updatedData
        },
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
        seo: {
             ...global.setting.seo,
             ...resetData
        },
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

          {/* Home Page Meta Data Section */}
          <div className="space-y-4">
            <Title level={5} className="!mb-3">
              Global Meta Data
            </Title>

            <Form.Item
              name="metaTitle"
              label={<span className="text-base font-medium">Global Meta Title</span>}
              extra="Recommended: 50-60 characters"
              className="!mb-0"
            >
              <Input
                placeholder="Your Store Name - Tagline"
                size="large"
                className="max-w-2xl"
              />
            </Form.Item>

            <Form.Item
              name="metaDescription"
              label={<span className="text-base font-medium">Global Meta Description</span>}
              extra="Recommended: 150-160 characters"
              className="!mb-0"
            >
              <Input.TextArea
                placeholder="Shop the best products online..."
                rows={3}
                size="large"
                className="max-w-2xl"
              />
            </Form.Item>

            <Form.Item
              name="metaKeywords"
              label={<span className="text-base font-medium">Global Meta Keywords</span>}
              className="!mb-0"
            >
              <Select
                mode="tags"
                size="large"
                placeholder="e.g., shopping, electronics"
                tokenSeparators={[","]}
                className="max-w-2xl"
              />
            </Form.Item>

            {/* Meta Image Upload */}
            <Form.Item
              name="metaImagefileList"
              label={<span className="text-base font-medium">Default Share Image (OG)</span>}
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra="Recommended: 1200x630px"
              className="!mb-0"
            >
              <ImgCrop rotationSlider showReset aspect={1200 / 630}>
                <Upload
                  name="metaImage"
                  listType="picture-card"
                  fileList={seoData?.metaImagefileList || []}
                  onRemove={handleImageRemove}
                  onPreview={(file) => handlePreview(file, dispatch)}
                  customRequest={customUploadRequest}
                  maxCount={1}
                >
                  {seoData?.metaImagefileList?.length >= 1 ? null : uploadButton}
                </Upload>
              </ImgCrop>
            </Form.Item>

            <Form.Item name="metaImage" hidden>
              <Input />
            </Form.Item>
          </div>

          <Divider className="!my-8" />

          {/* Social Meta Section */}
          <div className="space-y-4">
            <Title level={5} className="!mb-3">
              Social Media Optimization
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                    name="ogType"
                    label={<span className="text-base font-medium">OG Type</span>}
                    className="!mb-0"
                >
                    <Select size="large">
                        <Select.Option value="website">Website</Select.Option>
                        <Select.Option value="article">Article</Select.Option>
                        <Select.Option value="product">Product</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="twitterCard"
                    label={<span className="text-base font-medium">Twitter Card</span>}
                    className="!mb-0"
                >
                    <Select size="large">
                        <Select.Option value="summary">Summary</Select.Option>
                        <Select.Option value="summary_large_image">Summary with Large Image</Select.Option>
                    </Select>
                </Form.Item>
            </div>
          </div>

          <Divider className="!my-8" />

          {/* Advanced SEO Section */}
          <div className="space-y-4">
            <Title level={5} className="!mb-3">
              Advanced Configuration
            </Title>

            <Form.Item
              name="canonicalUrl"
              label={<span className="text-base font-medium">Canonical URL</span>}
              className="!mb-0"
            >
              <Input placeholder="https://yourstore.com" size="large" />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                    name="googleAnalyticsId"
                    label={<span className="text-base font-medium">Google Analytics ID (G-XXXX)</span>}
                    className="!mb-0"
                >
                    <Input placeholder="G-XXXXXXXXXX" size="large" />
                </Form.Item>

                <Form.Item
                    name="googleSearchConsoleId"
                    label={<span className="text-base font-medium">Google Search Console Verification ID</span>}
                    className="!mb-0"
                >
                    <Input placeholder="Verification key" size="large" />
                </Form.Item>
            </div>

            <Form.Item
              name="robotsTxt"
              label={<span className="text-base font-medium">Robots.txt Content</span>}
              className="!mb-0"
            >
              <Input.TextArea
                placeholder="User-agent: *&#10;Allow: /"
                rows={4}
                size="large"
                className="font-mono text-sm"
              />
            </Form.Item>
          </div>

          <Divider className="!my-8" />

          {/* SEO Code Injection Section */}
          <div className="space-y-4">
            <Title level={5} className="!mb-3">
              Custom Scripts (Code Injection)
            </Title>

            <Form.Item
              name="headerCode"
              label={<span className="text-base font-medium">Header Code</span>}
              extra="Injected in <head>"
              className="!mb-0"
            >
              <Input.TextArea
                placeholder="<!-- Custom scripts -->"
                rows={4}
                size="large"
                className="font-mono text-sm"
              />
            </Form.Item>

            <Form.Item
              name="bodyStartCode"
              label={<span className="text-base font-medium">Body Start Code</span>}
              extra="Injected after <body>"
              className="!mb-0"
            >
              <Input.TextArea
                placeholder="<!-- Custom scripts -->"
                rows={4}
                size="large"
                className="font-mono text-sm"
              />
            </Form.Item>

            <Form.Item
              name="bodyEndCode"
              label={<span className="text-base font-medium">Body End Code</span>}
              extra="Injected before </body>"
              className="!mb-0"
            >
              <Input.TextArea
                placeholder="<!-- Custom scripts -->"
                rows={4}
                size="large"
                className="font-mono text-sm"
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
