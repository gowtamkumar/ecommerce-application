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
import { saveDiscount, updateDiscount } from "@/lib/apis/discount";

const AddDiscount = () => {
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
      // return console.log('newData:', newData)
      dispatch(setLoading({ save: true }));
      const result = newData.id
        ? await updateDiscount(newData)
        : await saveDiscount(newData);
      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        router.refresh();
        toast.success(
          `Discount ${newData?.id ? "Updated" : "Created"} Successfully`
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
          ? "Update Discount"
          : "Create Discount"
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
        onValuesChange={(_v, values) => setFormValues(values)}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-1">
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
          </div>
          <div className={`col-span-1 `}>
            <Form.Item name="type" label="Type">
              <Select
                showSearch
                allowClear
                placeholder="Select Type"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as any)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {["Percentage", "FixedAmount", "FreeShipping"].map(
                  (item, idx) => (
                    <Select.Option key={idx} value={item}>
                      {item}
                    </Select.Option>
                  )
                )}
              </Select>
            </Form.Item>
          </div>
          <div className="col-span-1">
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
          </div>

          <div className="col-span-1">
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
          </div>

          <div className="col-span-1">
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
              <DatePicker placeholder="Enter" className="w-auto" />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[
                {
                  required: true,
                  message: "Date is required",
                },
              ]}
            >
              <DatePicker placeholder="Enter" />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="minOrderAmount" label="Min Order Amount">
              <InputNumber placeholder="Enter" />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="maxUser" label="Max user">
              <InputNumber placeholder="Enter" />
            </Form.Item>
          </div>

        

          <div className={`col-span-1 `}>
            <Form.Item hidden={!payload?.id} name="status" label="Status">
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
      </Form>
    </Modal>
  );
};

export default AddDiscount;
