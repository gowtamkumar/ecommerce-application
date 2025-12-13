"use client";
import React, { useState } from "react";
import { Button, Card, Form, Input, Typography } from "antd";
import {
  selectGlobal,
  setAction,
  setSetting,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";

const { Title, Text } = Typography;

const HeaderOption = () => {
  const [loading, setLoading] = useState(false);
  const global = useSelector(selectGlobal);
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const headerOption = {
    id: global.setting.id,
    ...global.setting.headerOption,
  };

  form.setFieldsValue(headerOption);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const { id, leftText } = values;

    const payload = {
      id,
      headerOption: { leftText },
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title level={4} className="!mb-1">
          Header Configuration
        </Title>
        <Text type="secondary">
          Customize the text displayed in your website header
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
            {/* Left Text */}
            <Form.Item
              name="leftText"
              label={<span className="text-base font-medium">Header Left Text</span>}
              rules={[
                {
                  required: true,
                  message: "Header text is required",
                },
              ]}
              extra="This text will appear on the left side of your website header"
              className="!mb-0"
            >
              <Input
                size="large"
                placeholder="e.g., Welcome to our store!"
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

export default HeaderOption;
