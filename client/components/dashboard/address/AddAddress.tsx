/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
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
import { saveAddress, updateAddress } from "@/lib/apis/address";

const AddAddress = () => {
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
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
      const result = newData.id
        ? await updateAddress(newData)
        : await saveAddress(newData);
      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        router.refresh();
        toast.success(
          `Address ${newData?.id ? "Updated" : "Created"} Successfully`
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
          ? "Update Address"
          : "Create Address"
      }
      width={850}
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
        onValuesChange={(_v, values) => dispatch(setFormValues(values))}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-1">
            <Form.Item
              name="addressLine1"
              label="Address Line 1"
              rules={[
                {
                  required: true,
                  message: "Address is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>
          <div className="col-span-1">
            <Form.Item
              name="addressLine2"
              label="Address Line 2"
              rules={[
                {
                  required: true,
                  message: "Address is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              name="state"
              label="State"
              rules={[
                {
                  required: true,
                  message: "state is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              name="city"
              label="City"
              rules={[
                {
                  required: true,
                  message: "city is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              name="country"
              label="Country"
              rules={[
                {
                  required: true,
                  message: "country is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              name="zipCode"
              label="Zip Code"
              rules={[
                {
                  required: true,
                  message: "zipCode is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>
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
      </Form>
    </Modal>
  );
};

export default AddAddress;
