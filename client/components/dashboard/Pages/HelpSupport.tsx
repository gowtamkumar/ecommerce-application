"use client";
import React, { useState } from "react";
import { Button, Form, Input } from "antd";
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

  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 10 },
  };

  return (
    <div className="container mx-auto">
      <Form
        {...layout}
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="cashDelivery" label="Cash Delivery">
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item name="returnSupport" label="Return Support">
          <Input placeholder="Enter " />
        </Form.Item>
        <Form.Item name="originalProduct" label="Original Product">
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item name="guarantee" label="Guarantee">
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item>
          <Button
            size="small"
            color="primary"
            htmlType="submit"
            className="capitalize"
            loading={loading}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default HelpSupport;
