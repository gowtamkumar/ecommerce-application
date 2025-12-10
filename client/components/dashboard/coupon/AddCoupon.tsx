"use client";
import { getCoupon, saveCoupon, updateCoupon } from "@/lib/apis/admin/coupon";
import { getProducts } from "@/lib/apis/admin/product";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { Button, Card, DatePicker, Form, Input, Select, Spin, Typography } from "antd";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;

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

    const result = newData.id
      ? () => updateCoupon(newData)
      : () => saveCoupon(newData);

    const res = await handleAsyncAction(result, dispatch);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const isEditMode = params.new !== "new";

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <Title level={2} className="!mb-0">
            {isEditMode ? "Edit Coupon" : "Create Coupon"}
          </Title>
          <Text type="secondary">
            {isEditMode
              ? "Update coupon details and restrictions"
              : "Set up a new coupon code for discounts"}
          </Text>
        </div>
        <div className="flex gap-3">
          <Button
            size="large"
            onClick={() => resetFormData(payload)}
            className="!rounded-lg !border-gray-300 !text-gray-600 hover:!text-gray-900 hover:!border-gray-400"
          >
            Reset Changes
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={() => form.submit()}
            disabled={global.loading.save}
            loading={global.loading.save}
            className="!bg-black hover:!bg-gray-800 !border-none !rounded-lg !px-8 !font-medium"
          >
            {isEditMode ? "Update Coupon" : "Save Coupon"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        onValuesChange={(_v, values) => setFormValues(values)}
        autoComplete="off"
        scrollToFirstError={true}
        className="space-y-6"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* Basic Information Card */}
        <Card
          title={<Title level={4} className="!mb-0">Basic Information</Title>}
          className="shadow-sm border border-gray-100 rounded-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="code"
              label="Coupon Code"
              rules={[
                {
                  required: true,
                  message: "Coupon code is required",
                },
              ]}
              className="!mb-0"
              extra="Unique code customers will enter at checkout"
            >
              <Input placeholder="e.g., SUMMER2024" size="large" className="uppercase" />
            </Form.Item>

            <Form.Item
              name="type"
              label="Coupon Type"
              rules={[
                {
                  required: true,
                  message: "Type is required",
                },
              ]}
              className="!mb-0"
            >
              <Select placeholder="Select type" size="large">
                <Select.Option value="Order">Order (Apply to entire order)</Select.Option>
                <Select.Option value="Product">Product (Apply to specific products)</Select.Option>
              </Select>
            </Form.Item>
          </div>

          {formValues?.type === "Product" && (
            <div className="mt-6">
              <Form.Item
                name="products"
                label="Applicable Products"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one product",
                  },
                ]}
                className="!mb-0"
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Search and select products"
                  mode="multiple"
                  size="large"
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
            </div>
          )}
        </Card>

        {/* Discount Configuration Card */}
        <Card
          title={<Title level={4} className="!mb-0">Discount Configuration</Title>}
          className="shadow-sm border border-gray-100 rounded-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="discountType"
              label="Discount Type"
              rules={[
                {
                  required: true,
                  message: "Discount type is required",
                },
              ]}
              className="!mb-0"
            >
              <Select placeholder="Select type" size="large">
                <Select.Option value="Percentage">Percentage (%)</Select.Option>
                <Select.Option value="Fixed">Fixed Amount (৳)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="value"
              label="Discount Value"
              rules={[
                {
                  required: true,
                  message: "Value is required",
                },
              ]}
              className="!mb-0"
            >
              <Input placeholder="Enter discount value" size="large" type="number" min={0} />
            </Form.Item>
          </div>
        </Card>

        {/* Validity Period Card */}
        <Card
          title={<Title level={4} className="!mb-0">Validity Period</Title>}
          className="shadow-sm border border-gray-100 rounded-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[
                {
                  required: true,
                  message: "Start date is required",
                },
              ]}
              className="!mb-0"
            >
              <DatePicker className="w-full" size="large" />
            </Form.Item>

            <Form.Item
              name="expiryDate"
              label="Expiry Date"
              rules={[
                {
                  required: true,
                  message: "Expiry date is required",
                },
              ]}
              className="!mb-0"
            >
              <DatePicker className="w-full" size="large" />
            </Form.Item>
          </div>
        </Card>

        {/* Usage Restrictions Card */}
        <Card
          title={<Title level={4} className="!mb-0">Usage Restrictions</Title>}
          className="shadow-sm border border-gray-100 rounded-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="minOrderAmount"
              label="Min Order Amount (৳)"
              rules={[
                {
                  required: true,
                  message: "Min order amount is required",
                },
              ]}
              className="!mb-0"
              extra="Minimum order value to apply coupon"
            >
              <Input placeholder="Enter amount" size="large" type="number" min={0} />
            </Form.Item>

            <Form.Item
              name="maxUser"
              label="Max Users"
              rules={[
                {
                  required: true,
                  message: "Max users is required",
                },
              ]}
              className="!mb-0"
              extra="Maximum number of unique users"
            >
              <Input placeholder="Enter number" size="large" type="number" min={0} />
            </Form.Item>

            <Form.Item
              name="mincartValue"
              label="Min Cart Value (৳)"
              rules={[
                {
                  required: true,
                  message: "Min cart value is required",
                },
              ]}
              className="!mb-0"
              extra="Minimum cart total required"
            >
              <Input placeholder="Enter amount" size="large" type="number" min={0} />
            </Form.Item>

            <Form.Item
              name="maxDiscountValue"
              label="Max Discount Value (৳)"
              rules={[
                {
                  required: true,
                  message: "Max discount value is required",
                },
              ]}
              className="!mb-0"
              extra="Maximum discount amount cap"
            >
              <Input placeholder="Enter amount" size="large" type="number" min={0} />
            </Form.Item>
          </div>
        </Card>

        {/* Usage Limits Card */}
        <Card
          title={<Title level={4} className="!mb-0">Usage Limits</Title>}
          className="shadow-sm border border-gray-100 rounded-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="usageLimit"
              label="Total Usage Limit"
              rules={[
                {
                  required: true,
                  message: "Usage limit is required",
                },
              ]}
              className="!mb-0"
              extra="Total times coupon can be used"
            >
              <Input placeholder="Enter number" size="large" type="number" min={0} />
            </Form.Item>

            <Form.Item
              name="usagePerUser"
              label="Usage Per User"
              rules={[
                {
                  required: true,
                  message: "Usage per user is required",
                },
              ]}
              className="!mb-0"
              extra="Times each user can use this coupon"
            >
              <Input placeholder="Enter number" size="large" type="number" min={0} />
            </Form.Item>
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default AddCoupon;
