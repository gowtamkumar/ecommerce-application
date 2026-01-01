import React, { useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "@/constants/constants";
import { saveLead, updateLead } from "@/lib/apis/leads";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";

const AddLead = () => {
  const global = useSelector(selectGlobal);
  const { payload, type, lead } = global.action;
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
    const asyncFn = values.id
      ? () => updateLead(values)
      : () => saveLead(values);

    await handleAsyncAction(asyncFn, dispatch);
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
    form.resetFields();
  };

  const resetFormData = () => {
    if (payload?.id) {
      form.setFieldsValue(payload);
    } else {
      form.resetFields();
      dispatch(setLoading({ loading: false }));
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-semibold">
          {type === ActionType.UPDATE ? "Update Lead" : "Create Lead"}
        </span>
      }
      width={500}
      zIndex={1050}
      open={
        lead &&
        (type === ActionType.CREATE ||
          type === ActionType.UPDATE)
      }
      onCancel={handleClose}
      footer={
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button size="large" onClick={resetFormData} style={{ borderRadius: "var(--button-border-radius)" }}>
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
        autoComplete="off"
        scrollToFirstError={true}
        className="mt-6"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            {
              required: true,
              message: "Email is required",
            },
            {
              type: "email",
              message: "Please enter a valid email",
            },
          ]}
          className="!mb-0"
        >
          <Input placeholder="Enter email address" size="large" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddLead;
