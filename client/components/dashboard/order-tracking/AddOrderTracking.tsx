import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  saveOrderTracking,
  updateOrderTracking,
} from "@/lib/apis/order-tracking";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";

const AddOrderTracking = () => {
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...payload };
    form.setFieldsValue(newData);
    return () => {
      form.resetFields();
    };
  }, [global.action]);

  const handleSubmit = async (values: any) => {
    const result = values.id
      ? () => updateOrderTracking(values)
      : () => saveOrderTracking(values);

    const messageData = values.id
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
      form.setFieldsValue(payload);
    } else {
      form.resetFields();
    }
  };

  return (
    <Modal
      title={
        global.action.type === ActionType.UPDATE
          ? "Update Order Tracking"
          : "Create Order Tracking"
      }
      width={500}
      zIndex={1050}
      open={
        (global.action.type === ActionType.CREATE ||
          global.action.type === ActionType.UPDATE) &&
        global.action.addOrderTracking
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

        <Form.Item name="orderId" hidden>
          <Input />
        </Form.Item>

        <div className="my-5 flex items-start justify-between gap-4">
          <div className="grid flex-grow grid-cols-1 gap-5">
            <div className="col-span-1">
              <Form.Item
                name="location"
                className="mb-1"
                label="Location"
                rules={[
                  {
                    required: true,
                    message: "location is required",
                  },
                ]}
              >
                <Input.TextArea placeholder="Enter location" />
              </Form.Item>
            </div>
            <div className={`col-span-1 `}>
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
                  {[
                    "Order Placed",
                    "Order Approved",
                    "Order Ready to Ship",
                    "Order Handover to Courier",
                    "Order Delivered",
                  ].map((item, idx) => (
                    <Select.Option key={idx} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
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
                color="primary"
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

export default AddOrderTracking;
