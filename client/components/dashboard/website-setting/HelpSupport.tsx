"use client";
import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import {
  selectGlobal,
  setAction,
  setFormValues,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveSetting, updateSetting } from "@/lib/apis/setting";

const HelpSupport = () => {
  const [loading, setLoading] = useState(false);
  const global = useSelector(selectGlobal);
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const helpSupport = {
    id: global.formValues.id,
    ...global.formValues.helpSupport,
  };
  form.setFieldsValue(helpSupport);

  const handleSubmit = async (values: any) => {
    const cashDelivery = values.cashDelivery;
    const returnSupport = values.returnSupport;
    const guarantee = values.guarantee;
    const originalProduct = values.originalProduct;

    try {
      let newData = {
        id: values.id,
        helpSupport: {
          returnSupport,
          originalProduct,
          guarantee,
          cashDelivery,
        },
      };
      // return console.log("newData:", newData);
      setLoading(true)
      const result = newData.id
        ? await updateSetting(newData)
        : await saveSetting(newData);
      setTimeout(async () => {
        setLoading(false)
        dispatch(setFormValues({}));
        dispatch(setAction({}));
      }, 100);
    } catch (err: any) {
      console.log("🚀 ~ err:", err);
    }
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
            color="blue"
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
