/* eslint-disable react-hooks/exhaustive-deps */
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
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...payload };
    setFormData(newData);
    return () => {
      form.resetFields();
    };
  }, [payload]);


  const handleSubmit = async (values: any) => {
    let newData = { ...values };

    const asyncFn = newData.id
      ? () => updateLead(newData)
      : () => saveLead(newData);

    const successMessage = newData.id
      ? "Successfully Updated"
      : "Successfully Added";

    await handleAsyncAction(asyncFn, successMessage, dispatch);
    form.resetFields();
  };


  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
    form.resetFields();
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
      dispatch(setLoading({ loading: false }));
    }
  };

  return (
    <Modal
      title={
        global.action.type === ActionType.UPDATE ? "Update Lead" : "Create Lead"
      }
      width={500}
      zIndex={1050}
      open={
        global.action.lead &&
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
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          className="mb-1"
          label="E-mail"
          rules={[
            {
              required: true,
              message: "E-mail is required",
            },
          ]}
        >
          <Input placeholder="Enter Title" />
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
          className="capitalize "
          loading={global.loading.save}
          disabled={global.loading.save}
        >
          {payload?.id ? "Update" : "Save"}
        </Button>
      </Form>
    </Modal>
  );
};

export default AddLead;
