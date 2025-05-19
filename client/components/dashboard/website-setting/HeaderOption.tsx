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
    try {
      const res = values.id
        ? await updateSetting(values)
        : await saveSetting(values);

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
    wrapperCol: { span: 12 },
  };

  const tailLayout = {
    wrapperCol: { offset: 3, span: 12 },
  };

  return (
    <div className="container mx-auto">
      <Form
        {...layout}
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="companyName"
          label="Company Name"
          rules={[
            {
              required: true,
              message: "Company Name is required",
            },
          ]}
        >
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item name="address" label="Address">
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item {...tailLayout}>
    
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

export default HeaderOption;
