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
    const newData = { ...payload };
    form.setFieldsValue(newData);
    return () => {
      form.resetFields();
    };
  }, [global.action]);

  const handleSubmit = async (values: any) => {
    const asyncFn = values.id
      ? () => updateLead(values)
      : () => saveLead(values);

    const successMessage = values.id
      ? "Successfully Updated"
      : "Successfully Added";

    await handleAsyncAction(asyncFn, successMessage, dispatch);
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

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
  };


  return (
    <Modal
      title={
        type === ActionType.UPDATE ? "Update Lead" : "Create Lead"
      }
      width={500}
      zIndex={1050}
      open={
        lead &&
        (type === ActionType.CREATE ||
          type === ActionType.UPDATE)
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
          name="email"
          label="E-mail"
          rules={[
            {
              required: true,
              message: "E-mail is required",
            },
          ]}
        >
          <Input placeholder="Enter E-mail" />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <div className="flex gap-2">
            <Button
            size="small"
            onClick={resetFormData}
          >
            Reset
          </Button>
          <Button
            size="small"
            htmlType="submit"
            type="primary"
            loading={global.loading.save}
            disabled={global.loading.save}
          >
            {payload?.id ? "Update" : "Save"}
          </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddLead;
