import React, { useEffect } from "react";
import dayjs from "dayjs";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setFormValues,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveDiscount, updateDiscount } from "@/lib/apis/discount";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";

const AddDiscount = () => {
  const global = useSelector(selectGlobal);
  const { payload, type, discount } = global.action;
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
    const result = values.id
      ? () => updateDiscount(values)
      : () => saveDiscount(values);

    const messageData = values.id
      ? "Successfully Updated"
      : "Successfully Added";

    await handleAsyncAction(result, messageData, dispatch);
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  const setFormData = (v: any) => {
    const newData = { ...v };
    if (newData.startDate) newData.startDate = dayjs(newData.startDate);
    if (newData.expiryDate) newData.expiryDate = dayjs(newData.expiryDate);
    form.setFieldsValue(newData);
    dispatch(setFormValues(form.getFieldsValue()));
  };

  const resetFormData = (value: any) => {
    const newData = { ...value };
    if (newData.startDate) newData.startDate = dayjs(newData.startDate);
    if (newData.expiryDate) newData.expiryDate = dayjs(newData.expiryDate);
    if (newData?.id) {
      form.setFieldsValue(newData);
      dispatch(setFormValues(newData));
    } else {
      form.resetFields();
      dispatch(setFormValues(form.getFieldsValue()));
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
      title={type === ActionType.UPDATE ? "Update Discount" : "Create Discount"}
      width={600}
      zIndex={1050}
      open={
        discount && (type === ActionType.CREATE || type === ActionType.UPDATE)
      }
      onCancel={handleClose}
      footer={null}
    >
      <Form
        {...layout}
        form={form}
        onFinish={handleSubmit}
        onValuesChange={(_v, values) => dispatch(setFormValues(values))}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="type"
          label="Type"
          rules={[
            {
              required: true,
              message: "Type is required",
            },
          ]}
        >
          <Select allowClear placeholder="Select">
            <Select.Option value="Discount">Discount</Select.Option>
            <Select.Option value="CouponCode">Coupon Code</Select.Option>
          </Select>
        </Form.Item>

        {global.formValues.type === "CouponCode" && (
          <Form.Item
            name="couponCode"
            label="Coupon code"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
          >
            <Input placeholder="Enter coupon code" />
          </Form.Item>
        )}

        <Form.Item
          name="discountType"
          label="Discount Type"
          rules={[
            {
              required: true,
              message: "Discount Type is required",
            },
          ]}
        >
          <Select
            allowClear
            placeholder="Select"
            optionFilterProp="children"
          >
            <Select.Option value="Percentage">Percentage</Select.Option>
            <Select.Option value="Fixed">Fixed Amount</Select.Option>
            <Select.Option value="FreeShipping">Free Shipping</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="value"
          label="Value"
          rules={[
            {
              required: true,
              message: "value is required",
            },
          ]}
        >
          <InputNumber placeholder="Enter Value" />
        </Form.Item>

        {global.formValues.type === "CouponCode" && (
          <>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[
                {
                  required: true,
                  message: "Start Date is required",
                },
              ]}
            >
              <DatePicker placeholder="Enter Start Date" />
            </Form.Item>
            <Form.Item
              name="expiryDate"
              label="Expiry Date"
              rules={[
                {
                  required: true,
                  message: "Expiry Date is required",
                },
              ]}
            >
              <DatePicker placeholder="Enter" />
            </Form.Item>

            <Form.Item name="minOrderAmount" label="Min Order Amount">
              <InputNumber placeholder="Enter" />
            </Form.Item>

            <Form.Item name="maxUser" label="Max user">
              <InputNumber placeholder="Enter" />
            </Form.Item>
          </>
        )}

        <Form.Item name="active" label="Status">
          <Select placeholder="Select">
            <Select.Option value={true}>Active</Select.Option>
            <Select.Option value={false}>Inactive</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            className="me-2"
            size="small"
            onClick={() => resetFormData(payload)}
          >
            Reset
          </Button>
          <Button
            size="small"
            type="primary"
            htmlType="submit"
            disabled={global.loading.save}
            loading={global.loading.save}
          >
            {payload?.id ? "Update" : "Save"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDiscount;
