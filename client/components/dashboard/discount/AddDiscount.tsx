"use client";
import uploadButton from "@/components/share-component/uploadButton";
import { getProducts } from "@/lib/apis/admin/product";
import { getBrands } from "@/lib/apis/brand";
import { getCategories } from "@/lib/apis/categories";
import { getDiscount, saveDiscount, updateDiscount } from "@/lib/apis/discount";
import { fileDeleteWithPhoto } from "@/lib/apis/file";
import {
  handleAsyncAction,
  handlePreview,
  normFile,
} from "@/lib/utils/commonFunctions";
import { handleGlobalUpload } from "@/lib/utils/handleGlobalUpload";
import { imageSetFile } from "@/lib/utils/imageSetFile";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
  Typography,
  Upload,
} from "antd";
import { 
  ArrowLeftOutlined, 
  InfoCircleOutlined, 
  TagsOutlined, 
  CalendarOutlined, 
  DeploymentUnitOutlined, 
  PictureOutlined,
  AlignLeftOutlined
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

const { Title, Text } = Typography;


const AddDiscount = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formValues, setFormValues] = useState({
    fileList: [],
  }) as any;

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
      const res = await getDiscount(id);
      const discountData = parseDateFields(res.data);
      const applicableProducts = discountData.applicableProducts?.map(
        (item: any) => item.productId
      );

      const applicableBrands = discountData.applicableBrands?.map(
        (item: any) => item.brandId
      );

      const applicableCategories = discountData.applicableCategories?.map(
        (item: any) => item.categoryId
      );

      discountData.fileList = [
        imageSetFile(discountData?.image),
      ];

      form.setFieldsValue({
        ...discountData,
        applicableProducts,
        applicableBrands,
        applicableCategories,
      });

      setFormValues({
        ...discountData,
        applicableProducts,
        applicableBrands,
        applicableCategories,
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

  const parseDateFields = (data: any) => ({
    ...data,
    startDate: data.startDate ? dayjs(data.startDate) : null,
    endDate: data.endDate ? dayjs(data.endDate) : null,
    createdAt: data.createdAt ? dayjs(data.createdAt) : null,
    updatedAt: data.updatedAt ? dayjs(data.updatedAt) : null,
  });

  const fetchInitialData = async () => {
    try {
      // Fetch larger limit for admin dropdowns, but still bounded
      const [categoriesRes, brandsRes, productsRes] = await Promise.all([
        getCategories(),
        getBrands(),
        getProducts({ perPage: 1000 }), 
      ]);

      setCategories(categoriesRes.data);
      setBrands(brandsRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  };

  // Memoize options for Select components to prevent expensive re-mapping on every render
  const productOptions = useMemo(() => 
    (products || []).map((item: any) => ({
      value: item.id,
      label: item.name,
    })), [products]);

  const brandOptions = useMemo(() => 
    (brands || []).map((item: any) => ({
      value: item.id,
      label: item.name,
    })), [brands]);

  const categoryOptions = useMemo(() => 
    (categories || []).map((item: any) => ({
      value: item.id,
      label: item.name,
    })), [categories]);

  const handleSubmit = async (values: any) => {
    const newData = { ...values };
    newData.startDate = new Date(values.startDate).toISOString();
    newData.endDate = new Date(values.endDate).toISOString();
    newData.value = +values.value;

    const result = newData.id
      ? () => updateDiscount(newData)
      : () => saveDiscount(newData);

    const res = await handleAsyncAction(result, dispatch);

    if (res) {
      route.push("/dashboard/discounts");
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



  const customUploadRequest = async (options: any) => {
    const result = await handleGlobalUpload(options);
    if (result) {
      const { newFile, newFileName } = result;
      form.setFieldsValue({
        fileList: [newFile],
        image: newFileName,
      });
      setFormValues((prev: any) => ({
        ...prev,
        fileList: [newFile],
        image: newFileName,
      }));
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
        <div className="flex items-center gap-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => route.push("/dashboard/discounts")}
            className="hover:!text-red-600 hover:!border-red-600 rounded-lg"
          />
          <div>
            <Title level={2} className="!mb-0 !text-gray-800">
              {isEditMode ? "Edit Discount" : "Create Discount"}
            </Title>
            <Text type="secondary" className="text-sm">
              {isEditMode
                ? "Update discount details and campaign settings"
                : "Set up a new discount campaign for your products"}
            </Text>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            size="large"
            onClick={resetFormData}
            style={{ borderRadius: "var(--button-border-radius)" }}
          >
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
            {isEditMode ? "Update Discount" : "Save Discount"}
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

        <Form.Item name="image" hidden>
          <Input />
        </Form.Item>

        {/* Basic Information Card */}
        <Card
          title={
            <Space className="py-1">
              <div className="p-2 bg-red-50 rounded-lg">
                <InfoCircleOutlined className="text-red-600" />
              </div>
              <span className="text-base font-bold text-gray-700">General Information</span>
            </Space>
          }
          className="shadow-sm border-gray-100 rounded-2xl overflow-hidden mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="name"
              label="Discount Name"
              rules={[
                {
                  required: true,
                  message: "Name is required",
                },
              ]}
              className="!mb-0"
            >
              <Input placeholder="e.g., Summer Sale 2024" size="large" />
            </Form.Item>

            <Form.Item
              name="promotionType"
              label="Promotion Type"
              rules={[
                {
                  required: true,
                  message: "Promotion Type is required",
                },
              ]}
              className="!mb-0"
            >
              <Select
                allowClear
                placeholder="Select promotion type"
                size="large"
              >
                <Select.Option value="Discount">Discount</Select.Option>
                <Select.Option value="Offer">Offer</Select.Option>
                <Select.Option value="FlashSale">Flash Sale</Select.Option>
                <Select.Option value="Seasonal">Seasonal</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="scope"
              label="Scope"
              rules={[
                {
                  required: true,
                  message: "Scope is required",
                },
              ]}
              className="!mb-0"
            >
              <Select
                allowClear
                placeholder="Select scope"
                size="large"
                onChange={(v) => {
                  form.setFieldsValue({ applicableProducts: [] });
                  form.setFieldsValue({ applicableBrands: [] });
                  form.setFieldsValue({ applicableCategories: [] });
                  setFormValues({ ...formValues, scope: v });
                }}
              >
                <Select.Option value="Global">Global (All Products)</Select.Option>
                <Select.Option value="Product">Single Product</Select.Option>
                <Select.Option value="Products">Multiple Products</Select.Option>
                <Select.Option value="Category">Category</Select.Option>
                <Select.Option value="Brand">Brand</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              className="!mb-0"
            >
              <Select placeholder="Select status" size="large">
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Card>

        {/* Campaign Duration Card */}
        <Card
          title={
            <Space className="py-1">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CalendarOutlined className="text-blue-600" />
              </div>
              <span className="text-base font-bold text-gray-700">Campaign Duration</span>
            </Space>
          }
          className="shadow-sm border-gray-100 rounded-2xl overflow-hidden mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[
                {
                  required: true,
                  message: "Start Date is required",
                },
              ]}
              className="!mb-0"
            >
              <DatePicker className="w-full !rounded-lg" size="large" />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="End Date"
              rules={[
                {
                  required: true,
                  message: "End Date is required",
                },
              ]}
              className="!mb-0"
            >
              <DatePicker className="w-full !rounded-lg" size="large" />
            </Form.Item>
          </div>
        </Card>

        {/* Discount Configuration Card */}
        <Card
          title={
            <Space className="py-1">
              <div className="p-2 bg-orange-50 rounded-lg">
                <TagsOutlined className="text-orange-600" />
              </div>
              <span className="text-base font-bold text-gray-700">Discount Configuration</span>
            </Space>
          }
          className="shadow-sm border-gray-100 rounded-2xl overflow-hidden mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="discountStrategy"
              label="Discount Strategy"
              rules={[
                {
                  required: true,
                  message: "Discount Strategy is required",
                },
              ]}
              className="!mb-0"
            >
              <Select
                allowClear
                placeholder="Select strategy"
                size="large"
              >
                <Select.Option value="Percentage">Percentage (%)</Select.Option>
                <Select.Option value="Fixed">Fixed Amount</Select.Option>
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
              <InputNumber
                placeholder="Enter discount value"
                className="w-full !rounded-lg"
                size="large"
                min={0}
              />
            </Form.Item>
          </div>
        </Card>

        {/* Applicability Card - Conditional */}
        {(formValues?.scope === "Products" ||
          formValues?.scope === "Brand" ||
          formValues?.scope === "Category") && (
            <Card
              title={
                <Space className="py-1">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <DeploymentUnitOutlined className="text-indigo-600" />
                  </div>
                  <span className="text-base font-bold text-gray-700">Applicability</span>
                </Space>
              }
              className="shadow-sm border-gray-100 rounded-2xl overflow-hidden mb-6"
            >
              {formValues?.scope === "Products" && (
                <Form.Item
                  name="applicableProducts"
                  label="Select Products"
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
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
                    }
                    options={productOptions}
                  />
                </Form.Item>
              )}

              {formValues?.scope === "Brand" && (
                <Form.Item
                  name="applicableBrands"
                  label="Select Brands"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one brand",
                    },
                  ]}
                  className="!mb-0"
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder="Search and select brands"
                    mode="multiple"
                    size="large"
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
                    }
                    options={brandOptions}
                  />
                </Form.Item>
              )}

              {formValues?.scope === "Category" && (
                <Form.Item
                  name="applicableCategories"
                  label="Select Categories"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one category",
                    },
                  ]}
                  className="!mb-0"
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder="Search and select categories"
                    mode="multiple"
                    size="large"
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
                    }
                    options={categoryOptions}
                  />
                </Form.Item>
              )}
            </Card>
          )}

        {/* Media Card */}
        <Card
          title={
            <Space className="py-1">
              <div className="p-2 bg-cyan-50 rounded-lg">
                <PictureOutlined className="text-cyan-600" />
              </div>
              <span className="text-base font-bold text-gray-700">Campaign Media</span>
            </Space>
          }
          className="shadow-sm border-gray-100 rounded-2xl overflow-hidden mb-6"
        >
          <Form.Item
            name="fileList"
            label="Discount Banner Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload a banner image for this discount campaign"
            className="!mb-0"
          >
          
              <Upload
                name="image"
                listType="picture-card"
                fileList={formValues?.fileList || []}
                onRemove={async (v) => {
                  if (v.fileName) {
                    form.setFieldsValue({ image: null, fileList: [] });
                    setFormValues({ image: null, fileList: [] });
                    const params = { filename: v.fileName };
                    await fileDeleteWithPhoto(params);
                  }
                }}
                className="avatar-uploader"
                onPreview={(file) => handlePreview(file, dispatch)}
                customRequest={customUploadRequest}
                maxCount={1}
              >
                {formValues?.fileList?.length >= 1 ? null : uploadButton}
              </Upload>
            
          </Form.Item>
        </Card>

        {/* Additional Details Card */}
        <Card
          title={
            <Space className="py-1">
              <div className="p-2 bg-gray-50 rounded-lg">
                <AlignLeftOutlined className="text-gray-600" />
              </div>
              <span className="text-base font-bold text-gray-700">Additional Details</span>
            </Space>
          }
          className="shadow-sm border-gray-100 rounded-2xl overflow-hidden"
        >
          <Form.Item
            name="description"
            label="Description"
            extra="Optional description for internal reference"
            className="!mb-0"
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter any additional notes or description"
              className="rounded-lg"
            />
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
};

export default AddDiscount;
