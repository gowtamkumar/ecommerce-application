import React, { useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";
import { ActionType } from "../../../../constants/constants";
import { useRouter } from "next/navigation";
import {
  selectGlobal,
  setAction,
  setFormValues,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveCurrency, updateCurrency } from "@/lib/apis/currency";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";

const AddCurrency = () => {
  const global = useSelector(selectGlobal);
  const { payload, currency, type } = global.action;
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...payload };
    form.setFieldsValue(newData);
    return () => {
      dispatch(setFormValues({}));
      form.resetFields();
    };
  }, [global.action]);

  const handleSubmit = async (values: any) => {
    const result = values.id
      ? () => updateCurrency(values)
      : () => saveCurrency(values);

    const messageData = values.id
      ? "Successfully Updated"
      : "Successfully Added";

    await handleAsyncAction(result, messageData, dispatch);
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  const resetFormData = () => {
    if (payload?.id) {
      form.setFieldsValue(global.action?.payload);
    } else {
      form.resetFields();
    }
  };

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };

  const tailLayout = {
    wrapperCol: { offset: 7, span: 14 },
  };

  return (
    <Modal
      title={type === ActionType.UPDATE ? "Update Currency" : "Create Currency"}
      width={500}
      zIndex={1050}
      open={
        currency && (type === ActionType.CREATE || type === ActionType.UPDATE)
      }
      onCancel={handleClose}
      footer={null}
    >
      <Form
        {...layout}
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

        <Form.Item {...tailLayout}>
          <Button className="me-2" size="small" onClick={resetFormData}>
            Reset
          </Button>
          <Button
            size="small"
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

export default AddCurrency;
