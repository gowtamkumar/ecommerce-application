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
  }, [form, global.action, payload]);

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      // return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = newData.id
        ? await updateLead(newData)
        : await saveLead(newData);
      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        dispatch(setAction({}));
      }, 100);
    } catch (err: any) {
      console.error(err);
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
        >
          {payload?.id ? "Update" : "Save"}
        </Button>
      </Form>
    </Modal>
  );
};

export default AddLead;
