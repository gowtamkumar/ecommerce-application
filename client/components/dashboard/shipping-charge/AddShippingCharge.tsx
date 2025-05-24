import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  saveShippingCharge,
  updateShippingCharge,
} from "@/lib/apis/shipping-charge";
import { getDivisions } from "@/lib/apis/geo-location/division";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import { errorNotification } from "@/lib/utils/notification";

const AddShippingCharge = () => {
  const [divisions, setDivisions] = useState([]);
  const global = useSelector(selectGlobal);
  const { payload, type } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const newData = { ...payload };
      const res = await getDivisions();
      setDivisions(res.data);
      form.setFieldsValue(newData);
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch, form, payload]);

  useEffect(() => {
    fetchData();
    return () => {
      form.resetFields();
    };
  }, [fetchData, form, global.action]);

  const handleSubmit = async (values: any) => {
    let newData = { ...values, shippingCharge: +values.shippingCharge };

    const result = newData.id
      ? () => updateShippingCharge(newData)
      : () => saveShippingCharge(newData);

    await handleAsyncAction(result, dispatch);
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

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
  };

  return (
    <Modal
      title={
        type === ActionType.UPDATE
          ? "Update Shipping Charge"
          : "Create Shipping Charge"
      }
      width={600}
      zIndex={1050}
      open={type === ActionType.CREATE || type === ActionType.UPDATE}
      onCancel={handleClose}
      footer={null}
    >
      <Form {...layout} form={form} onFinish={handleSubmit} autoComplete="off">
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="divisionId"
          label="Division"
          rules={[
            {
              required: true,
              message: "Division is required",
            },
          ]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Select "
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as any)
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {divisions.map((item: { name: string; id: number }) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="shippingCharge"
          label="Shipping Amount"
          rules={[
            {
              required: true,
              message: "Shipping Amount is required",
            },
          ]}
        >
          <InputNumber placeholder="Enter" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="note" className="mb-1" label="Note">
          <Input placeholder="Enter" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="status" label="Status" className="mb-1">
          <Select
            showSearch
            allowClear
            placeholder="Select Status"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as any)
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            <Select.Option value={true}>Active</Select.Option>
            <Select.Option value={false}>Inactive</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <div className="flex gap-2">
            <Button size="small" onClick={resetFormData}>
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
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddShippingCharge;
