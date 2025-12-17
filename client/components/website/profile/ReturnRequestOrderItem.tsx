/* eslint-disable react-hooks/exhaustive-deps */
import { saveReturn } from "@/lib/apis/return";
import { errorNotification } from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { Button, Form, Input, InputNumber, Modal } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../constants/constants";

const ReturnRequestOrderItem = () => {
  const global = useSelector(selectGlobal);
  const { payload, returnOrderItem, type } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  console.log("payload", payload);

  useEffect(() => {
    form.setFieldsValue(payload);
    return () => {
      form.resetFields();
    };
  }, [global.action]);

  const handleSubmit = async (values: any) => {
    console.log("asdf", values);

    const result = await saveReturn(values);
    if (!result.success) {
      errorNotification({ message: result.message });
    }
    handleClose();
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
      title={`Order Return`}
      width={500}
      zIndex={1050}
      open={type === ActionType.UPDATE && returnOrderItem}
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
        <Form.Item name="orderId" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="orderItemId" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason"
          rules={[
            {
              required: true,
              message: "Return Resson is required",
            },
          ]}
        >
          <Input.TextArea role="alert" placeholder="Enter Reason" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            {
              required: true,
              message: "Phone is required",
            },
          ]}
        >
          <Input role="alert" placeholder="Enter Reason" />
        </Form.Item>

        <Form.Item
          name="requestedQty"
          label="Request Qty"
          rules={[
            {
              required: true,
              message: "requestedQty is required",
            },
          ]}
        >
          <InputNumber placeholder="Enter " />
        </Form.Item>

        <Form.Item
          name="image"
          label="Image"
          rules={[
            {
              required: true,
              message: "Phone is required",
            },
          ]}
        >
          <Input role="alert" placeholder="Enter Reason" />
        </Form.Item>

        <div className="text-end">
          <Button className="mx-2" size="small" onClick={resetFormData}>
            Reset
          </Button>
          <Button
            size="small"
            color="primary"
            htmlType="submit"
            loading={global.loading.save}
            disabled={!payload?.orderId}
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ReturnRequestOrderItem;
