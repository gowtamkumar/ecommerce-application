/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Select, theme } from "antd";
import { ActionType } from "../../../../constants/constants";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import {
  selectGlobal,
  setAction,
  setFormValues,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveCurrency, updateCurrency } from "@/lib/apis/currency";

const AddCurrency = () => {
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...payload };
    setFormData(newData);
    return () => {
      dispatch(setFormValues({}));
      form.resetFields();
    };
  }, [global.action]);

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      // return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = newData.id
        ? await updateCurrency(newData)
        : await saveCurrency(newData);
      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        dispatch(setAction({}));
      }, 100);
    } catch (err: any) {
      toast.error(err);
    }
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  const setFormData = (v: any) => {
    const newData = { ...v };
    form.setFieldsValue(newData);
  };

  const resetFormData = () => {
    if (payload?.id) {
      form.setFieldsValue(global.action?.payload);
    } else {
      form.resetFields();
    }
  };

  return (
    <Modal
      title={
        global.action.type === ActionType.UPDATE
          ? "Update Currency"
          : "Create Currency"
      }
      width={500}
      zIndex={1050}
      open={
        global.action.currency &&
        (global.action.type === ActionType.CREATE ||
          global.action.type === ActionType.UPDATE)
      }
      onCancel={handleClose}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError={true}
        initialValues={{ Currency: "#b7eb8f" }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="name"
          className="mb-1"
          label="Currency Name"
          rules={[
            {
              required: true,
              message: "Name is required",
            },
          ]}
        >
          <Input placeholder="Enter Currency" />
        </Form.Item>

        <Form.Item
          name="symbol"
          className="mb-1"
          label="Symbol"
          rules={[
            {
              required: true,
              message: "Symbol is required",
            },
          ]}
        >
          <Input placeholder="Enter Symbol" />
        </Form.Item>

        <Button
          className="mx-2 capitalize"
          size="small"
          onClick={resetFormData}
        >
          Reset
        </Button>
        <Button
          size="small"
          htmlType="submit"
          className="capitalize"
          loading={global.loading.save}
        >
          {payload?.id ? "Update" : "Save"}
        </Button>
      </Form>
    </Modal>
  );
};

export default AddCurrency;
