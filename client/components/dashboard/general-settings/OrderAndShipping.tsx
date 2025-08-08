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
import { Button, Divider, Form, Input, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Layout definition (static)
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

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
    <div className="container mx-auto">
      <Form
        {...layout}
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
        <Divider orientation="left">Order</Divider>
        <Form.Item
          name="orderFreeShippingAmount"
          label="Order Free Shipping amount"
        >
          <InputNumber placeholder="Enter" className="!w-100" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button size="small" htmlType="submit" loading={loading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OrderAdnShhiping;
