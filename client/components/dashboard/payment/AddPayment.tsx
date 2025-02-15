import React, { useEffect, useState } from "react";
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
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveDashboardPayment, updatePayment } from "@/lib/apis/payment";
import { getUsers } from "@/lib/apis/user";
import dayjs from "dayjs";
import { errorNotification } from "@/lib/utils/notification";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";

const AddPayment = () => {
  const [users, setUsers] = useState([] as any);
  const global = useSelector(selectGlobal);
  const { payload, payment, type } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
    return () => {
      form.resetFields();
    };
  }, [global.action]);

  const fetchData = async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const newData = {
        ...payload,
        paymentDate: payload?.paymentDate
          ? dayjs(payload.paymentDate)
          : dayjs(), // Optional chaining
      };
      form.setFieldsValue(newData);
      const response = await getUsers();
      setUsers(response.data);
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  const handleSubmit = async (values: any) => {
    let newData = { ...values };

    const result = newData.id
      ? () => updatePayment(newData)
      : () => saveDashboardPayment(newData);

    const messageData = newData.id
      ? "Successfully Updated"
      : "Successfully Added";

    await handleAsyncAction(result, messageData, dispatch);
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

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 6, span: 16 },
  };

  return (
    <Modal
      title={type === ActionType.UPDATE ? "Update Payment" : "Create Payment"}
      width={600}
      zIndex={1050}
      open={
        payment && (type === ActionType.CREATE || type === ActionType.UPDATE)
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
        initialValues={{ paymentType: "Debit", paymentDate: dayjs() }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="orderId" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="paymentDate"
          label="Payment Date"
          rules={[
            {
              required: true,
              message: "Date is required",
            },
          ]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          name="userId"
          label="Customer"
          className="mb-1"
          rules={[
            {
              required: true,
              message: "Customer is required",
            },
          ]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Select"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as any)
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {(users || []).map((item: { name: string; id: number }) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            {
              required: true,
              message: "Name is required",
            },
          ]}
        >
          <InputNumber placeholder="Enter Amount" />
        </Form.Item>

        <Form.Item
          name="paymentType"
          label="Payment Type"
          className="mb-1"
          rules={[
            {
              required: true,
              message: "Payment Type is required",
            },
          ]}
        >
          <Select placeholder="Select">
            <Select.Option value="Debit"> Debit </Select.Option>
            <Select.Option value="Credit"> Credit </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="paymentMethod"
          label="Payment Method"
          className="mb-1"
          rules={[
            {
              required: true,
              message: "Payment Method is required",
            },
          ]}
        >
          <Select placeholder="Select">
            <Select.Option value="Cash"> Cash </Select.Option>
            <Select.Option value="SSLCOMMERZ"> SSLCOMMERZ </Select.Option>
            <Select.Option value="Stripe"> Stripe </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            className="me-1"
            size="small"
            onClick={resetFormData}
          >
            Reset
          </Button>
          <Button
            size="small"
            color="primary"
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

export default AddPayment;
