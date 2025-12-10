'use client'
import React, { useEffect } from "react";
import { Button, Form, Input, InputNumber, Modal, Switch } from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveTax, updateTax } from "@/lib/apis/tax";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";

const AddTax = () => {
  const global = useSelector(selectGlobal);
  const { payload, tax, type } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...global.action.payload };
    form.setFieldsValue(newData);
    return () => {
      form.resetFields();
    };
  }, [form, global.action]);

  const handleSubmit = async (values: any) => {
    const result = values.id ? () => updateTax(values) : () => saveTax(values);

    await handleAsyncAction(result, dispatch);
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  const resetFormData = (value: any) => {
    const newData = { ...value };
    if (newData?.id) {
      form.setFieldsValue(newData);
    } else {
      form.resetFields();
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-semibold">
          {type === ActionType.UPDATE ? "Update Tax" : "Create Tax"}
        </span>
      }
      width={500}
      zIndex={1050}
      open={tax && (type === ActionType.CREATE || type === ActionType.UPDATE)}
      onCancel={handleClose}
      footer={
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            size="large"
            onClick={() => resetFormData(global.action?.payload)}
            className="!rounded-lg"
          >
            Reset
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={() => form.submit()}
            disabled={global.loading.save}
            loading={global.loading.save}
            className="!bg-black hover:!bg-gray-800 !rounded-lg !px-8"
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
            label="Tax Name"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
            className="!mb-0"
          >
            <Input placeholder="Enter tax name (e.g., VAT, GST)" size="large" />
          </Form.Item>

          <Form.Item
            name="value"
            label="Tax Value (%)"
            rules={[
              {
                required: true,
                message: "Value is required",
              },
            ]}
            className="!mb-0"
          >
            <InputNumber 
              placeholder="Enter tax percentage" 
              style={{ width: "100%" }} 
              min={0}
              max={100}
              size="large"
            />
          </Form.Item>

          <Form.Item name="status" label="Status" valuePropName="checked" className="!mb-0">
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              defaultChecked
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddTax;
