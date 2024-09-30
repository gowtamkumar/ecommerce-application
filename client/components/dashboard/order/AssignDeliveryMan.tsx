import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { toast } from "react-toastify";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveDashboardPayment, updatePayment } from "@/lib/apis/payment";
import { getUsers } from "@/lib/apis/user";
import { assignDeliveryMan } from "@/lib/apis/orders";

const AssignDeliveryMan = () => {
  const [users, setUsers] = useState([]);
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // let newData = { ...payload };
        form.setFieldsValue(payload);
        const response = await getUsers();
        setUsers(
          response.data.filter(
            (item: { type: string }) => item.type === "Delivery Man"
          )
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
    return () => {
      form.resetFields();
    };
  }, [form, payload]);

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      // return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = await assignDeliveryMan(values);
      console.log("🚀 ~ result:", result)
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

  return (
    <Modal
      title="Assign Delivery Man"
      width={500}
      zIndex={1050}
      open={global.action.assign}
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

        <Form.Item
          name="deliveryId"
          label="Delivery Man"
          className="mb-1"
          rules={[
            {
              required: true,
              message: "Delivery Man is required",
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
            {(users || []).map(
              (item: { name: string; phone: string; id: number }) => (
                <Select.Option key={item.id} value={item.id}>
                  {`${item.name} - ${item.phone}`}
                </Select.Option>
              )
            )}
          </Select>
        </Form.Item>

        <Button
          size="small"
          color="blue"
          htmlType="submit"
          loading={global.loading.save}
        >
          Assign
        </Button>
      </Form>
    </Modal>
  );
};

export default AssignDeliveryMan;
