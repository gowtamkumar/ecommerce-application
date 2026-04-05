/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { saveCurrency, updateCurrency } from "@/lib/apis/currency";
import {
  handleAsyncAction,
} from "@/lib/utils/commonFunctions";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { Button, Form, Input, InputNumber, Modal } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../constants/constants";

const AddCurrency = () => {
  const [formValues, setFormValues] = useState({}) as any;
  const global = useSelector(selectGlobal);
  const { payload, type } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...payload };
    setFormData(newData);
  }, [payload]);

  const handleSubmit = async (values: any) => {
    const newData = { ...values };

    const result = newData.id
      ? () => updateCurrency(newData)
      : () => saveCurrency(newData);

    await handleAsyncAction(result, dispatch);
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
    setFormValues({});
    form.resetFields();
  };

  const setFormData = (v: any) => {
    const newData = { ...v };
    form.setFieldsValue(newData);
    setFormValues(form.getFieldsValue());
  };

  const resetFormData = (value: any) => {
    if (value?.id) {
      form.setFieldsValue(value);
      setFormValues(form.getFieldsValue());
    } else {
      form.resetFields();
      setFormValues(form.getFieldsValue());
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-semibold">
          {type === ActionType.UPDATE ? "Update Currency" : "Create Currency"}
        </span>
      }
      width={550}
      zIndex={1050}
      open={type === ActionType.CREATE || type === ActionType.UPDATE}
      onCancel={handleClose}
      footer={
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button size="large" onClick={() => resetFormData(payload)} style={{ borderRadius: "var(--button-border-radius)" }}>
            Reset
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={() => form.submit()}
            disabled={global.loading.save}
            loading={global.loading.save}
            className="!px-8"
            style={{ 
              borderRadius: "var(--button-border-radius)",
              backgroundColor: "var(--global-primary)"
            }}
          >
            {payload?.id ? "Update" : "Save"}
          </Button>
        </div>
      }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        onValuesChange={(_v, values) => setFormValues(values)}
        autoComplete="off"
        scrollToFirstError={true}
        className="mt-6"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="space-y-4">
          <Form.Item
            name="name"
            label="Currency Name"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
            className="!mb-0"
          >
            <Input placeholder="Enter currency name (e.g. US Dollar)" size="large" />
          </Form.Item>

          <Form.Item
            name="symbol"
            label="Symbol"
            rules={[
              {
                required: true,
                message: "Symbol is required",
              },
            ]}
            className="!mb-0"
          >
            <Input placeholder="Enter symbol (e.g. $)" size="large" />
          </Form.Item>

          <Form.Item
            name="exchangeRate"
            label="Exchange Rate (Base: 1)"
            rules={[
              {
                required: true,
                message: "Exchange Rate is required",
              },
            ]}
            className="!mb-0"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter exchange rate (e.g. 1.0 or 120.0)"
              size="large"
              min={0}
              precision={4}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddCurrency;
