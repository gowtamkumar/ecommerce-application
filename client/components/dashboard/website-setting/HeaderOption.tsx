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

const HeaderOption = () => {
  const [loading, setLoading] = useState(false);
  const global = useSelector(selectGlobal);
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  form.setFieldsValue(global.setting);

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

        <Form.Item
          name="leftText"
          label="Left Text"
          rules={[
            {
              required: true,
              message: "Left Text is required",
            },
          ]}
        >
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item>
          <Button
            size="small"
            color="primary"
            htmlType="submit"
            loading={loading}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default HeaderOption;
