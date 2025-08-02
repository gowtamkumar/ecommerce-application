/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getCoupon, saveCoupon, updateCoupon } from "@/lib/apis/admin/coupon";
import { getProducts } from "@/lib/apis/admin/product";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { Button, DatePicker, Form, Input, Select, Spin } from "antd";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddCoupon = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [formValues, setFormValues] = useState({}) as any;

  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams<{ new: string }>();
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  const route = useRouter();

  const initialize = useCallback(async () => {
    try {
      await fetchInitialData();

      if (params.new === "new") {
        form.resetFields();
        setLoading(false);
        return;
      }

      const id = params.new.toString();
      const res = await getCoupon(id);
      const newData = { ...res.data };
      newData.expiryDate = dayjs(newData.expiryDate);
      newData.startDate = dayjs(newData.startDate);

      const products = newData?.products?.map((item: any) => item.productId);

      form.setFieldsValue({
        ...newData,
        products,
      });

      setFormValues({
        ...newData,
        products,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Initialization error:", error);
    }
  }, [form, params.new]);

  useEffect(() => {
    setLoading(true);
    initialize();

    return () => {
      if (params.new === "new") {
        form.resetFields();
        setFormValues({ fileList: [] });
      }
    };
  }, [form, initialize, params.new]);

  const fetchInitialData = async () => {
    try {
      const products = await getProducts();
      setProducts(products.data);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  };

  const handleSubmit = async (values: any) => {
    const newData = { ...values };
    newData.expiryDate = dayjs(values.expiryDate);
    newData.startDate = dayjs(values.startDate);
    newData.value = +values.value;

    // return console.log(newData);
    console.log(newData);
    const result = newData.id
      ? () => updateCoupon(newData)
      : () => saveCoupon(newData);

    console.log("result", result);

    const res = await handleAsyncAction(result, dispatch);
    console.log("res", res);

    if (res.success) {
      route.push("/dashboard/coupons");
    }
  };

  const resetFormData = (value: any) => {
    const newData = { ...value };
    initialize();

    if (newData?.id) {
      form.setFieldsValue(newData);
      setFormValues(newData);
    } else {
      form.resetFields();
      setFormValues(form.getFieldsValue());
    }
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
  };

  const tailLayout = {
    wrapperCol: { offset: 4, span: 12 },
  };

  if (loading) {
    return <Spin className="flex justify-center items-center h-screen" />;
  }

  return (
    <div className="my-10">
      <Form
        {...layout}
        form={form}
        onFinish={handleSubmit}
        onValuesChange={(_v, values) => setFormValues(values)}
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
          <Select placeholder="Select">
            <Select.Option value="Order">Order</Select.Option>
            <Select.Option value="Product">Product</Select.Option>
            <Select.Option value="FreeShipping">FreeShipping</Select.Option>
          </Select>
        </Form.Item>

        {/* applicable */}
        {formValues?.type === "Product" && (
          <Form.Item
            name="products"
            label="Products"
            rules={[
              {
                required: true,
                message: "Products is required",
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              placeholder="Select"
              mode="multiple"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as any)
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {(products || []).map((item: any) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="code"
          label="Code"
          rules={[
            {
              required: true,
              message: "Code is required",
            },
          ]}
        >
          <Input placeholder="Enter " />
        </Form.Item>

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
          <Select placeholder="Select">
            <Select.Option value="Percentage">Percentage</Select.Option>
            <Select.Option value="Fixed">Fixed</Select.Option>
            <Select.Option value="FreeShipping">FreeShipping</Select.Option>
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
          <Input placeholder="Enter " />
        </Form.Item>

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
          <DatePicker />
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
          <DatePicker />
        </Form.Item>

        <Form.Item
          name="minOrderAmount"
          label="Min Order Amount"
          rules={[
            {
              required: true,
              message: "Order Amount is required",
            },
          ]}
        >
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item
          name="maxUser"
          label="Max User"
          rules={[
            {
              required: true,
              message: "Max User is required",
            },
          ]}
        >
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item
          name="mincartValue"
          label="Min Cart Value"
          rules={[
            {
              required: true,
              message: "Value is required",
            },
          ]}
        >
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item
          name="maxDiscountValue"
          label="Max Discount Value"
          rules={[
            {
              required: true,
              message: "Value is required",
            },
          ]}
        >
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item
          name="usageLimit"
          label="Usage Limit"
          rules={[
            {
              required: true,
              message: "Usage Limit is required",
            },
          ]}
        >
          <Input placeholder="Enter " />
        </Form.Item>

        <Form.Item
          name="usagePerUser"
          label="Usage Per User"
          rules={[
            {
              required: true,
              message: "Usage Per User is required",
            },
          ]}
        >
          <Input placeholder="Enter " />
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
    </div>
  );
};

export default AddCoupon;
