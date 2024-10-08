"use client";
import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import {
  selectGlobal,
  setAction,
  setFormValues
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveSetting, updateSetting } from "@/lib/apis/setting";

const SocialLink = () => {
  const [loading, setLoading] = useState(false);
  const global = useSelector(selectGlobal);
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const socialLink = {
    id: global.formValues.id,
    ...global.formValues.socialLink,
  };
  form.setFieldsValue(socialLink);

  const handleSubmit = async (values: any) => {
    const facebookUrl = values.facebookUrl;
    const instagramUrl = values.instagramUrl;
    const linkedinUrl = values.linkedinUrl;
    const twitterUrl = values.twitterUrl;

    try {
      let newData = {
        id: values.id,
        socialLink: { facebookUrl, instagramUrl, linkedinUrl, twitterUrl },
      };
      // return console.log("newData:", newData);
      setLoading(true);
      const result = newData.id
        ? await updateSetting(newData)
        : await saveSetting(newData);
      setTimeout(async () => {
        setLoading(false);
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
    setLoading(false);
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

        <Form.Item name="facebookUrl" label="Facebook Url">
          <Input placeholder="Enter " />
        </Form.Item>
        <Form.Item name="instagramUrl" label="Instagram Url">
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item name="linkedinUrl" label="Linkedin Url">
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item name="twitterUrl" label="Twitter Url">
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

export default SocialLink;
