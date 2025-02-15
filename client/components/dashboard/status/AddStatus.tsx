import React, { useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";
import { ActionType } from "../../../constants/constants";
import { saveStatus, updateStatus } from "@/lib/apis/status";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";

const AddStatus = () => {
  const global = useSelector(selectGlobal);
  const { payload, type, status } = global.action;
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
    const result = values.id
      ? () => updateStatus(values)
      : () => saveStatus(values);

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
      form.setFieldsValue(payload);
    } else {
      form.resetFields();
      dispatch(setLoading({}));
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
      title={type === ActionType.UPDATE ? "Update Status" : "Create Status"}
      width={500}
      zIndex={1050}
      open={
        status && (type === ActionType.CREATE || type === ActionType.UPDATE)
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
              message: "Name is required",
            },
          ]}
        >
          <Input placeholder="Enter Name" />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button className="me-2" size="small" onClick={resetFormData}>
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

export default AddStatus;
