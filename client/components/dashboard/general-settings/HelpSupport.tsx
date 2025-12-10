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

const HelpSupport = () => {
  const [loading, setLoading] = useState(false);
  const global = useSelector(selectGlobal);
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const helpSupport = {
    id: global.setting.id,
    ...global.setting.helpSupport,
  };
  form.setFieldsValue(helpSupport);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const cashDelivery = values.cashDelivery;
    const returnSupport = values.returnSupport;
    const guarantee = values.guarantee;
    const originalProduct = values.originalProduct;

    let payload = {
      id: values.id,
      helpSupport: {
        returnSupport,
        originalProduct,
        guarantee,
        cashDelivery,
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
          Help & Support Features
        </Title>
        <Text type="secondary">
          Configure customer service and support features displayed on your website
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
            {/* Cash Delivery */}
            <Form.Item
              name="cashDelivery"
              label={<span className="text-base font-medium">Cash on Delivery</span>}
              extra="Text to display for cash on delivery option"
              className="!mb-0"
            >
              <Input
                size="large"
                placeholder="e.g., Pay when you receive"
                className="max-w-xl"
              />
            </Form.Item>

            {/* Return Support */}
            <Form.Item
              name="returnSupport"
              label={<span className="text-base font-medium">Return Support</span>}
              extra="Text to display for return policy"
              className="!mb-0"
            >
              <Input
                size="large"
                placeholder="e.g., 7-day return guarantee"
                className="max-w-xl"
              />
            </Form.Item>

            {/* Original Product */}
            <Form.Item
              name="originalProduct"
              label={<span className="text-base font-medium">Product Authenticity</span>}
              extra="Text to assure customers about product authenticity"
              className="!mb-0"
            >
              <Input
                size="large"
                placeholder="e.g., 100% Original Products"
                className="max-w-xl"
              />
            </Form.Item>

            {/* Guarantee */}
            <Form.Item
              name="guarantee"
              label={<span className="text-base font-medium">Guarantee</span>}
              extra="Text to display warranty/guarantee information"
              className="!mb-0"
            >
              <Input
                size="large"
                placeholder="e.g., 1-year warranty"
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

export default HelpSupport;
