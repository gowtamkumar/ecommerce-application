/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { ActionType } from "../../../constants/constants";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  selectGlobal,
  setAction,
  setFormValues,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { orderStatusUpdate, updateOrder } from "@/lib/apis/orders";

const OrderStatusChange = () => {
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
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
    try {
      let newData = { ...values };
      // return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = newData.id && (await orderStatusUpdate(newData));

      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        toast.success(
          `Order Status Change${
            newData?.id ? "Updated" : "Created"
          } Successfully`
        );
        dispatch(setAction({}));
      }, 100);
    } catch (err: any) {
      toast.error(err);
    }
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
        global.action.type === ActionType.UPDATE
          ? "Update Order Status "
          : "Create Order Status"
      }
      width={500}
      zIndex={1050}
      open={
        (global.action.type === ActionType.CREATE ||
          global.action.type === ActionType.UPDATE) &&
        global.action.orderStatusChange
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
            ].map((item, idx) => (
              <Select.Option key={idx} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
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
            color="blue"
            htmlType="submit"
            className="capitalize"
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

export default OrderStatusChange;
