"use client";
import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import {
  selectGlobal,
  setFormValues
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";

const CurrencySetting = () => {
  const [loading, setLoading] = useState(false);
  const global = useSelector(selectGlobal);
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  form.setFieldsValue(global.formValues);


  const handleSubmit = async (values: any) => {
    const result = values.id
      ? () => updateSetting(values)
      : () => saveSetting(values);

    await handleAsyncAction(result, dispatch);
  };

  const resetFormData = (value: any) => {
    if (value?.id) {
      form.setFieldsValue(value);
      dispatch(setFormValues(form.getFieldsValue()));
    } else {
      form.resetFields();
      dispatch(setFormValues(form.getFieldsValue()));
    }
    setLoading(false)
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
  };

  const tailLayout = {
    wrapperCol: { offset: 4, span: 12 },
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
          name="siteName"
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

        <Form.Item {...tailLayout}>
          <Button
            className="mx-2 capitalize"
            size="small"
            onClick={() => resetFormData(global.formValues)}
          >
            Reset
          </Button>
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

export default CurrencySetting;
