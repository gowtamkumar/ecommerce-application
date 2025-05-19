/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { ActionType } from "../../../constants/constants";
import { toast } from "react-toastify";
import {
  selectGlobal,
  setAction,
  setFormValues,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import { orderStatusUpdateApi } from "@/lib/apis/orders";

const OrderStatusUpdate = () => {
  const global = useSelector(selectGlobal);
  const { payload, orderStatusUpdate, type } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...payload };
    setFormData(newData);
    return () => {
      dispatch(setFormValues({}));
      form.resetFields();
    };
  }, [global.action]);

  const handleSubmit = async (values: any) => {
    const result = () => orderStatusUpdateApi(values);

    const messageData = values.id
      ? "Successfully Updated"
      : "Successfully Added";

  const res =  await handleAsyncAction(result, messageData, dispatch);
  console.log("res", res);
  
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  const setFormData = (v: any) => {
    const newData = { ...v };
    form.setFieldsValue(newData);
    dispatch(setFormValues(form.getFieldsValue()));
  };

  const resetFormData = () => {
    if (payload?.id) {
      form.setFieldsValue(global.action?.payload);
      dispatch(setFormValues(global.action?.payload));
    } else {
      form.resetFields();
      dispatch(setFormValues(form.getFieldsValue()));
    }
  };

  return (
    <Modal
      title={
        type === ActionType.UPDATE
          ? "Update Order Status "
          : "Create Order Status"
      }
      width={500}
      zIndex={1050}
      open={
        (type === ActionType.CREATE || type === ActionType.UPDATE) &&
        orderStatusUpdate
      }
      onCancel={handleClose}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        onValuesChange={(_v, values) => dispatch(setFormValues(values))}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="status" label="Status" className="mb-1">
          <Select placeholder="Select Status">
            {[
              "Processing",
              "Approved",
              "On Shipping",
              "Shipped",
              "Completed",
              "Pending",
              "Returned",
              "Canceled",
            ].map((item, idx) => (
              <Select.Option key={idx} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="location"
          className="mb-1"
          label="Tracking Message"
          rules={[
            {
              required: true,
              message: "location is required",
            },
          ]}
        >
          <Input.TextArea placeholder="Enter location" />
        </Form.Item>

        <div className="flex gap-2 justify-end">
          <Button
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

export default OrderStatusUpdate;
