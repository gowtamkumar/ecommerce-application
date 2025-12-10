"use client";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setSetting,
} from "@/redux/features/global/globalSlice";
import { Button, Card, Form, Input, Typography } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;

const WhatsAppWidgetSetting = () => {
  const [loading, setLoading] = useState(false);
  const global = useSelector(selectGlobal);
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const whatsAppWidget = {
    id: global?.setting?.id,
    ...global.setting?.whatsAppWidget,
  };
  form.setFieldsValue(whatsAppWidget);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const phone = values.phone;
    const message = values.message;

    const payload = {
      id: values.id,
      whatsAppWidget: {
        message,
        phone,
      },
    };
    try {
      const res = values.id
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title level={4} className="!mb-1">
          WhatsApp Widget Configuration
        </Title>
        <Text type="secondary">
          Configure WhatsApp chat widget for customer support
        </Text>
      </div>

      <Card className="shadow-sm border border-gray-100 rounded-2xl">
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
          scrollToFirstError={true}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <div className="space-y-4">
            {/* WhatsApp Number */}
            <Form.Item
              name="phone"
              label={<span className="text-base font-medium">WhatsApp Number</span>}
              rules={[
                { required: true, message: "WhatsApp number is required" },
              ]}
              className="!mb-0"
              extra="Format: 8801700000000 (country code + number)"
            >
              <Input
                size="large"
                placeholder="8801700000000"
                className="max-w-xl"
              />
            </Form.Item>

            {/* Default Message */}
            <Form.Item
              name="message"
              label={<span className="text-base font-medium">Default Message</span>}
              rules={[
                { required: true, message: "Default message is required" },
              ]}
              className="!mb-0"
              extra="This message will be pre-filled when customers click the WhatsApp widget"
            >
              <Input.TextArea
                size="large"
                placeholder="Hello! I need help with..."
                rows={3}
                className="max-w-xl"
              />
            </Form.Item>
          </div>

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

export default WhatsAppWidgetSetting;
