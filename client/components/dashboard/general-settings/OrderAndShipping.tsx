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
import { Button, Card, Form, Input, InputNumber, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;

const OrderAdnShhiping = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const global = useSelector(selectGlobal);

  // Populate form on setting change
  useEffect(() => {
    form.setFieldsValue(global.setting);
  }, [form, global.setting]);

  // Submit Handler
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = values.id
        ? await updateSetting(values)
        : await saveSetting(values);

      if (!res?.success) {
        return errorNotification({
          message: res?.message || "Operation failed",
        });
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
          Order & Shipping Configuration
        </Title>
        <Text type="secondary">
          Configure order processing and shipping settings
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

          <div className="space-y-4">
            {/* Free Shipping Amount */}
            <Form.Item
              name="orderFreeShippingAmount"
              label={
                <span className="text-base font-medium">
                  Free Shipping Threshold
                </span>
              }
              extra="Orders above this amount will have free shipping"
              className="!mb-0"
            >
              <InputNumber
                size="large"
                placeholder="Enter minimum amount"
                className="!w-full max-w-xl"
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
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
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default OrderAdnShhiping;
