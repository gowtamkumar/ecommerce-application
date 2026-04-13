
import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import { orderStatusUpdateApi } from "@/lib/apis/orders";

const CancelOrder = () => {
  const global = useSelector(selectGlobal);
  const { payload, cancelOrder, type } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldsValue(global.action.payload);
    return () => {
      form.resetFields();
    };
  }, [form, global.action]);

  const handleSubmit = async (values: any) => {
    const result = () => values.id && orderStatusUpdateApi(values);
    await handleAsyncAction(result, dispatch);
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
    }
  };

  return (
    <Modal
      title={`Cancel Order`}
      width={500}
      zIndex={1050}
      open={type === ActionType.UPDATE && cancelOrder}
      onCancel={handleClose}
      footer={null}
      forceRender
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

        <Form.Item name="status" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="cancelResson"
          label="Reason"
          rules={[
            {
              required: true,
              message: "Cancel Resson is required",
            },
          ]}
        >
          <Input.TextArea role="alert" placeholder="Enter Reason" />
        </Form.Item>

        <div className="text-end">
          <Button
            className="mx-2 capitalize"
            size="small"
            onClick={resetFormData}
          >
            Reset
          </Button>
          <Button
            size="small"
            color="primary"
            htmlType="submit"
            loading={global.loading.save}
            disabled={!payload?.id}
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CancelOrder;
