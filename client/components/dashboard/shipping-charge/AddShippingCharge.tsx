"use client";
import { getDistricts } from "@/lib/apis/geo-location/district";
import {
  saveShippingCharge,
  updateShippingCharge,
} from "@/lib/apis/shipping-charge";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import { errorNotification } from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { CarOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Select, Space, Switch } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../constants/constants";

const AddShippingCharge = () => {
  const [districts, setDistricts] = useState([]);
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const { payload, type, shippingCharge } = global.action;

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading({ loading: true }));

      try {
        form.setFieldsValue(payload);
        const districts = await getDistricts({});
        setDistricts(districts.data);
      } catch (err: any) {
        errorNotification({ message: err.message });
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };

    if (type) {
      fetchData();
    }
  }, [dispatch, form, payload, type]);

  const handleSubmit = async (values: any) => {
    const newData = {
      ...values,
      id: values.id ? Number(values.id) : undefined,
      districtId: values.districtId ? Number(values.districtId) : undefined,
      shippingCharge: values.shippingCharge ? Number(values.shippingCharge) : 0,
    };

    const result = newData.id
      ? () => updateShippingCharge(newData)
      : () => saveShippingCharge(newData);
    await handleAsyncAction(result, dispatch);
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
    setDistricts([]);
    form.resetFields();
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
        <Space className="text-xl font-semibold">
          <CarOutlined className="text-blue-500" />
          <span>
            {type === ActionType.UPDATE
              ? "Update Shipping Charge"
              : "Create Shipping Charge"}
          </span>
        </Space>
      }
      width={600}
      zIndex={1050}
      open={
        shippingCharge &&
        (type === ActionType.CREATE || type === ActionType.UPDATE)
      }
      onCancel={handleClose}
      centered
      maskClosable={false}
      forceRender
      footer={
        <div className="flex justify-end gap-3 pt-4">
          <Button size="large" onClick={resetFormData} style={{ borderRadius: "var(--button-border-radius)" }}>
            Reset
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={() => form.submit()}
            disabled={global.loading.save}
            loading={global.loading.save}
            className="!px-8"
            style={{
              borderRadius: "var(--button-border-radius)",
              backgroundColor: "var(--global-primary)"
            }}
          >
            {payload?.id ? "Update" : "Save"}
          </Button>
        </div>
      }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError={true}
        className="mt-6 space-y-6"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="space-y-6">
          <Form.Item
            name="districtId"
            label="District"
            rules={[
              {
                required: true,
                message: "District is required",
              },
            ]}
            className="!mb-0"
          >
            <Select
              showSearch
              allowClear
              placeholder="Select district"
              size="large"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as any)
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {districts.map((item: { name: string; id: number }) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="shippingCharge"
            label="Shipping Charge"
            rules={[
              {
                required: true,
                message: "Shipping charge is required",
              },
            ]}
            className="!mb-0"
          >
            <InputNumber
              placeholder="Enter amount"
              size="large"
              min={0}
              className="!w-full"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") as any
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            valuePropName="checked"
            className="!mb-0"
          >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              defaultChecked
            />
          </Form.Item>
        </div>

        {/* Additional Notes */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Additional Information
          </h3>
          <Form.Item name="note" label="Note" className="!mb-0">
            <Input.TextArea
              placeholder="Add any notes about this shipping charge"
              rows={3}
              className="!rounded-lg"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddShippingCharge;
