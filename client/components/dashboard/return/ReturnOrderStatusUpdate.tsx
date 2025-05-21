/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setFormValues,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import { singleProductReturn } from "@/lib/apis/return";

const ReturnOrderStatusUpdate = () => {
  const global = useSelector(selectGlobal);
  const { payload, orderReturnStatusUpdate, type } = global.action;
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
    console.log("Status", values);

    // return;

    const result = () => singleProductReturn(values);

    const messageData = values.id
      ? "Successfully Updated"
      : "Successfully Added";

    const res = await handleAsyncAction(result, messageData, dispatch);
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
      title={"Return Order"}
      width={500}
      zIndex={1050}
      open={
        (type === ActionType.CREATE || type === ActionType.UPDATE) &&
        orderReturnStatusUpdate
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
        <Form.Item name="orderItemId" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          className="mb-1"
          rules={[
            {
              required: true,
              message: "Status is required",
            },
          ]}
        >
          <Select placeholder="Select Status">
            {["Processing", "Approved", "Rejected", "Completed"].map(
              (item, idx) => (
                <Select.Option key={idx} value={item}>
                  {item}
                </Select.Option>
              )
            )}
          </Select>
        </Form.Item>

        {global.formValues.status === "Completed" && (
          <Form.Item
            name="approvedQty"
            className="mb-1"
            label="Approved Qty"
            rules={[
              {
                required: true,
                message: "Qty is required",
              },
            ]}
          >
            <InputNumber placeholder="Enter location" />
          </Form.Item>
        )}

        <div className="text-end">
          <Button className="mx-2" size="small" onClick={resetFormData}>
            Reset
          </Button>
          <Button
            size="small"
            color="primary"
            htmlType="submit"
            loading={global.loading.save}
            disabled={!payload?.orderItemId}
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ReturnOrderStatusUpdate;
