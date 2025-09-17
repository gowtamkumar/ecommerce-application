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
import { Button, Form, Input } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

        <Form.Item name="phone" label="Whatsapp number">
          <Input placeholder="Please Input format: 8801700000000 " />
        </Form.Item>

        <Form.Item name="message" label="Message">
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

export default WhatsAppWidgetSetting;
