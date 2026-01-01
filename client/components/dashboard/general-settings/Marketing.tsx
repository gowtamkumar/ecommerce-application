"use client";

import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Switch,
  Typography,
  Upload,
  ColorPicker,
} from "antd";
import ImgCrop from "antd-img-crop";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import uploadButton from "@/components/share-component/uploadButton";
import { fileDeleteWithPhoto } from "@/lib/apis/file";
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

const Marketing = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const global = useSelector(selectGlobal);

  const marketingData = React.useMemo(() => ({
    id: global.setting.id,
    ...global.setting.marketing,
  }), [global.setting]);

  // Populate form on setting change
  useEffect(() => {
    form.setFieldsValue(marketingData);
  }, [form, global.setting, marketingData]);

  // Submit Handler
  const handleSubmit = async (values: any) => {
    setLoading(true);

    const payload = {
      id: values.id,
      marketing: {
        ...values,
      },
    };

    delete payload.marketing.id;

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
        popupImagefileList: [newFile],
        popupImage: newFileName,
      };

      form.setFieldsValue(updatedData);

      dispatch(setSetting({
        ...global.setting,
        marketing: {
          ...global.setting.marketing,
          ...updatedData
        },
      }));
    }
  };

  // File Remove Handler
  const handleImageRemove = async (file: any) => {
    if (file.fileName) {
      const resetData = {
        popupImage: null,
        popupImagefileList: [],
      };

      form.setFieldsValue(resetData);

      dispatch(setSetting({
        ...global.setting,
        marketing: {
          ...global.setting.marketing,
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
          Marketing Configuration
        </Title>
        <Text type="secondary">
          Manage your marketing tools, popups, and integrations
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

          {/* Integration Section */}
          <div className="space-y-4">
            <Title level={5} className="!mb-3">
              External Integrations
            </Title>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                name="facebookPixelId"
                label={<span className="text-base font-medium">Facebook Pixel ID</span>}
                className="!mb-0"
              >
                <Input placeholder="e.g., 123456789012345" size="large" />
              </Form.Item>

              <Form.Item
                name="googleAdsId"
                label={<span className="text-base font-medium">Google Ads ID</span>}
                className="!mb-0"
              >
                <Input placeholder="e.g., AW-123456789" size="large" />
              </Form.Item>

              <Form.Item
                name="mailchimpApiKey"
                label={<span className="text-base font-medium">Mailchimp API Key</span>}
                className="!mb-0"
              >
                <Input.Password placeholder="Enter your Mailchimp API Key" size="large" />
              </Form.Item>

              <Form.Item
                name="mailchimpListId"
                label={<span className="text-base font-medium">Mailchimp List ID</span>}
                className="!mb-0"
              >
                <Input placeholder="e.g., a1b2c3d4e5" size="large" />
              </Form.Item>
            </div>
          </div>

          <Divider className="!my-8" />

          {/* Announcement Bar Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Title level={5} className="!mb-0">
                Announcement Bar
              </Title>
              <Form.Item name="announcementEnabled" valuePropName="checked" className="!mb-0">
                <Switch />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                name="announcementText"
                label={<span className="text-base font-medium">Message</span>}
                className="md:col-span-2 !mb-0"
              >
                <Input placeholder="e.g., 20% OFF on all products! Use code: SAVE20" size="large" />
              </Form.Item>

              <Form.Item
                name="announcementColor"
                label={<span className="text-base font-medium">Background Color</span>}
                className="!mb-0"
              >
                 <Input type="color" className="h-12" />
              </Form.Item>

              <Form.Item
                name="announcementTextColor"
                label={<span className="text-base font-medium">Text Color</span>}
                className="!mb-0"
              >
                <Input type="color" className="h-12" />
              </Form.Item>

              <Form.Item
                name="announcementLink"
                label={<span className="text-base font-medium">Link</span>}
                className="md:col-span-2 !mb-0"
              >
                <Input placeholder="e.g., /offers" size="large" />
              </Form.Item>
            </div>
          </div>

          <Divider className="!my-8" />

          {/* Marketing Popup Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Title level={5} className="!mb-0">
                Marketing Popup
              </Title>
              <Form.Item name="popupEnabled" valuePropName="checked" className="!mb-0">
                <Switch />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                name="popupTitle"
                label={<span className="text-base font-medium">Popup Title</span>}
                className="!mb-0"
              >
                <Input placeholder="Subscribe to our newsletter" size="large" />
              </Form.Item>

              <Form.Item
                name="popupDelay"
                label={<span className="text-base font-medium">Display Delay (ms)</span>}
                className="!mb-0"
              >
                <Input type="number" placeholder="5000" size="large" />
              </Form.Item>

              <Form.Item
                name="popupDescription"
                label={<span className="text-base font-medium">Description</span>}
                className="md:col-span-2 !mb-0"
              >
                <Input.TextArea placeholder="Get the latest updates and offers." rows={2} size="large" />
              </Form.Item>

              <Form.Item
                name="popupImagefileList"
                label={<span className="text-base font-medium">Popup Image</span>}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                className="!mb-0"
              >
                <ImgCrop rotationSlider showReset aspect={1}>
                  <Upload
                    name="popupImage"
                    listType="picture-card"
                    fileList={marketingData?.popupImagefileList || []}
                    onRemove={handleImageRemove}
                    onPreview={(file) => handlePreview(file, dispatch)}
                    customRequest={customUploadRequest}
                    maxCount={1}
                  >
                    {marketingData?.popupImagefileList?.length >= 1 ? null : uploadButton}
                  </Upload>
                </ImgCrop>
              </Form.Item>

              <Form.Item name="popupImage" hidden>
                <Input />
              </Form.Item>

              <Form.Item
                name="popupLink"
                label={<span className="text-base font-medium">Button Link</span>}
                className="!mb-0"
              >
                <Input placeholder="e.g., /subscribe" size="large" />
              </Form.Item>
            </div>
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
              Save Marketing Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Marketing;
