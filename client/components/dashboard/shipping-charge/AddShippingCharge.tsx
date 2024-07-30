/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
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
import {
  saveShippingCharge,
  updateShippingCharge,
} from "@/lib/apis/shipping-charge";
import { getDivisions } from "@/lib/apis/geo-location/division";

const AddShippingCharge = () => {
  const [divisions, setDivisions] = useState([]);
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const newData = { ...payload };
      setFormData(newData);
      const resDivsion = await getDivisions();
      setDivisions(resDivsion.data);
    })();
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
        ? await updateShippingCharge(newData)
        : await saveShippingCharge(newData);
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
          ? "Update shippingCharge"
          : "Create shippingCharge"
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
        onValuesChange={(_v, values) => dispatch(setFormValues(values))}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="my-5 flex items-start justify-between gap-4">
          <div className="grid flex-grow grid-cols-1 gap-5">
            <div className={`col-span-1`}>
              <Form.Item name="divisionId" label="Division" className="mb-1">
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
            </div>

          

            <div className="col-span-1">
              <Form.Item
                name="shippingAmount"
                className="mb-1"
                label="Shipping Amount"
              >
                <InputNumber placeholder="Enter" style={{ width: "100%" }} />
              </Form.Item>
            </div>

            <div className="col-span-1">
              <Form.Item name="note" className="mb-1" label="Note">
                <Input placeholder="Enter" style={{ width: "100%" }} />
              </Form.Item>
            </div>

            <div className="col-span-1">
              <Form.Item
                hidden={!payload?.id}
                name="status"
                label="Status"
                className="mb-1"
              >
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

export default AddShippingCharge;
