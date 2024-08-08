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
import { toast } from "react-toastify";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  saveDashboardPayment,
  savePayment,
  updatePayment,
} from "@/lib/apis/payment";
import { getUsers } from "@/lib/apis/user";
import dayjs from "dayjs";

const AddPayment = () => {
  const [users, setUsers] = useState([]);
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let newData = { ...global.action.payload };
        if (newData.paymentDate)
          newData.paymentDate = dayjs(newData.paymentDate);
        form.setFieldsValue(newData);
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
    return () => {
      form.resetFields();
    };
  }, [form, global.action]);

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      // return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = newData.id
        ? await updatePayment(newData)
        : await saveDashboardPayment(newData);
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
                  {users.map((item: { name: string; id: number }) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="col-span-1">
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
            </div>

            <div className="col-span-1">
              <Form.Item
                name="paymentMethod"
                label="Payment Method"
                className="mb-1"
              >
                <Select placeholder="Select">
                  <Select.Option value="Cash"> Cash </Select.Option>
                  <Select.Option value="SSLCOMMERZ"> SSLCOMMERZ </Select.Option>
                  <Select.Option value="Stripe"> Stripe </Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div className="col-span-1">
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
