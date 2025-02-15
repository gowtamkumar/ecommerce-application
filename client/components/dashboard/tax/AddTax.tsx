import React, { useEffect } from "react";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveTax, updateTax } from "@/lib/apis/tax";
import dayjs from "dayjs";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";

const AddTax = () => {
  const global = useSelector(selectGlobal);
  const { payload, tax, type } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...payload };
    form.setFieldsValue(newData);
    return () => {
      form.resetFields();
    };
  }, [global.action]);

  const handleSubmit = async (values: any) => {    
    const result = values.id ? () => updateTax(values) : () => saveTax(values);

    const messageData = values.id
      ? "Successfully Updated"
      : "Successfully Added";

    await handleAsyncAction(result, messageData, dispatch);
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

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
  };

  return (
    <Modal
      title={type === ActionType.UPDATE ? "Update Tax" : "Create Tax"}
      width={600}
      zIndex={1050}
      open={tax && (type === ActionType.CREATE || type === ActionType.UPDATE)}
      onCancel={handleClose}
      footer={null}
    >
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
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "name is required",
            },
          ]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          name="value"
          label="Value"
          rules={[
            {
              required: true,
              message: "value is required",
            },
          ]}
        >
          <InputNumber placeholder="Enter Value" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select placeholder="Select">
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            className="me-2"
            size="small"
            onClick={() => resetFormData(global.action?.payload)}
          >
            Reset
          </Button>
          <Button
            size="small"
            type="primary"
            htmlType="submit"
            loading={global.loading.save}
            disabled={global.loading.save}
          >
            {payload?.id ? "Update" : "Save"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTax;
