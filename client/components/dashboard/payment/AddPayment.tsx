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
import { savePayment, updatePayment } from "@/lib/apis/payment";

const AddPayment = () => {
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...global.action.payload };
    form.setFieldsValue(newData);
    return () => {
      form.resetFields();
    };
  }, [dispatch, form, global.action]);

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = newData.id
        ? await updatePayment(newData)
        : await savePayment(newData);
      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
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
        global.action.type === ActionType.UPDATE
          ? "Update Payment"
          : "Create Payment"
      }
      width={500}
      zIndex={1050}
      open={
        global.action.type === ActionType.CREATE ||
        global.action.type === ActionType.UPDATE
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

        <div className="my-5 flex items-start justify-between gap-4">
          <div className="grid flex-grow grid-cols-1 gap-5">
            <div className="col-span-1">
              <Form.Item
                name="name"
                className="mb-1"
                label="Payment Name"
                rules={[
                  {
                    required: true,
                    message: "Name is required",
                  },
                ]}
              >
                <Input placeholder="Enter Payment Name" />
              </Form.Item>
            </div>

            <div className="col-span-1 text-end">
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
              >
                {payload?.id ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddPayment;
