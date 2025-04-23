"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
} from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setFormValues,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  handleAsyncAction,
  handlePreview,
  normFile,
} from "@/lib/utils/commonFunctions";
import ImgCrop from "antd-img-crop";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";
import appConfig from "@/appConfig";
import { PlusOutlined } from "@ant-design/icons";
import { getProducts } from "@/lib/apis/admin/product";
import { getCategories } from "@/lib/apis/categories";
import { getBrands } from "@/lib/apis/brand";
import { getDiscount, saveDiscount, updateDiscount } from "@/lib/apis/discount";
import { useParams } from "next/navigation";
import dayjs from "dayjs";

const uploadButton = (
  <div>
    <PlusOutlined />
    <div
      style={{
        marginTop: 8,
      }}
    >
      Upload
    </div>
  </div>
);

const AddDiscount = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formValues, setFormValues] = useState({
    fileList: [],
  }) as any;
  const params = useParams<{ new: string }>();
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const generateFile = (fileName: string, identifier: string | number) => ({
    uid: `${Math.random() * 1000}`,
    name: `photo ${identifier}`,
    status: "done",
    fileName,
    url: `${appConfig.baseApiUrl}/uploads/${fileName || "no-data.png"}`,
  });

  useEffect(() => {
    const initialize = async () => {
      await fetchInitialData();

      if (params.new === "new") {
        form.resetFields();
      } else {
        if (params.new !== "new") {
          const id = params.new.toString();
          const res = await getDiscount(id);
          const discountData = {
            ...res.data,
            startDate: res.data.startDate
              ? dayjs(res.data.startDate)
              : null,
            endDate: res.data.endDate
              ? dayjs(res.data.endDate)
              : null,
            createdAt: res.data.createdAt
              ? dayjs(res.data.createdAt)
              : null,
            updatedAt: res.data.updatedAt
              ? dayjs(res.data.updatedAt)
              : null,
          };


          console.log("discountData", discountData);

          // if (!discountData.variant && discountData.productVariants?.length) {
          //   const [firstVariant] = discountData.productVariants;
          //   Object.assign(discountData, {
          //     purchasePrice: +firstVariant.purchasePrice,
          //     unitPrice: +firstVariant.unitPrice,
          //     stockQty: firstVariant.stockQty,
          //     variantId: firstVariant.id,
          //   });
          // }

          const applicableProducts = discountData.applicableProducts?.map(
            (item: any) => item.productId
          );

          const applicableBrands = discountData.applicableBrands?.map(
            (item: any) => item.brandId
          );

          const applicableCategories = discountData.applicableCategories?.map(
            (item: any) => item.categoryId
          );

          console.log("applicableBrands", applicableBrands);

          // Handle images, thumbnails, and hover images
          discountData.fileList =
            discountData.images?.map((image: string, idx: number) =>
              generateFile(image, idx)
            ) || [];

          form.setFieldsValue({
            ...discountData,
            applicableProducts,
            applicableBrands,
            applicableCategories,
          });

          // setProduct({ ...discountData, productCategories });

          setFormValues(discountData);
        }

        setFormData({ ...payload });
      }
    };

    initialize();

    return () => {
      if (params.new === "new") {
        form.resetFields();
        setFormValues({ fileList: [] });
      }
    };
  }, [global.action]);

  const fetchInitialData = async () => {
    try {
      const [categories, brands, products] = await Promise.all([
        getCategories(),
        getBrands(),
        getProducts(),
      ]);

      setCategories(categories.data);
      setBrands(brands.data);
      setProducts(products.data);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      // Optional: show notification or fallback
    }
  };

  const handleSubmit = async (values: any) => {
    const newData = { ...values };
    newData.startDate = new Date(values.startDate).toISOString();
    newData.endDate = new Date(values.endDate).toISOString();
    newData.value = +values.value

    const result = newData.id
      ? () => updateDiscount(newData)
      : () => saveDiscount(newData);

    const messageData = values.id
      ? "Successfully Updated"
      : "Successfully Added";

    const res = await handleAsyncAction(result, messageData, dispatch);

    console.log("res", res);


    if (res.success) {
      form.resetFields();
      setFormValues({ fileList: [] });
    }
  };

  const setFormData = (v: any) => {
    const newData = { ...v };
    form.setFieldsValue(newData);
    setFormValues(form.getFieldsValue());
  };

  const resetFormData = (value: any) => {
    const newData = { ...value };
    if (newData?.id) {
      form.setFieldsValue(newData);
      setFormValues(newData);
    } else {
      form.resetFields();
      setFormValues(form.getFieldsValue());
    }
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };

  const tailLayout = {
    wrapperCol: { offset: 6, span: 12 },
  };

  const customUploadRequest = async (options: any) => {
    const { filename, file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append(filename, file);

    try {
      const res = await uploadFile(formData);
      if (!res || !res.data) {
        throw new Error("Invalid response format");
      }
      const filename = res.data[0].filename;
      const newfile = {
        uid: Math.random() * 1000 + "",
        name: `photo ${Math.random() * 10000 + ""}`,
        status: "done",
        fileName: filename,
        url: `${appConfig.baseApiUrl}/uploads/${filename || "no-data.png"}`,
      };
      const newFileName = res.data.length ? filename : null;
      // Assuming you're updating form data here:
      form.setFieldsValue({
        fileList: [newfile],
        image: newFileName,
      });
      setFormValues({
        ...formValues,
        fileList: [newfile],
        image: newFileName,
      });

      onSuccess("Ok");
    } catch (err) {
      console.error("🚀 ~ Upload error:", err);
      onError({ err });
    }
  };

  return (
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
        name="name"
        label="Name"
        rules={[
          {
            required: true,
            message: "Name is required",
          },
        ]}
      >
        <Input placeholder="Enter" />
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
      >
        <Select
          allowClear
          placeholder="Select"
          optionFilterProp="children"
          onChange={(v) => {
            form.setFieldsValue({ applicableProducts: [] });
            form.setFieldsValue({ applicableBrands: [] });
            form.setFieldsValue({ applicableCategories: [] });
            setFormValues({ ...formValues, scope: v });
          }}
        >
          <Select.Option value="Global">Global</Select.Option>
          <Select.Option value="Product">Product</Select.Option>
          <Select.Option value="Products">Products</Select.Option>
          <Select.Option value="Category">Category</Select.Option>
          <Select.Option value="Brand">Brand</Select.Option>
        </Select>
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
      >
        <Select allowClear placeholder="Select" optionFilterProp="children">
          <Select.Option value="Discount">Discount</Select.Option>
          <Select.Option value="Offer">Offer</Select.Option>
          <Select.Option value="FlashSale">Flash Sale</Select.Option>
          <Select.Option value="Seasonal">Seasonal</Select.Option>
        </Select>
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
        name="endDate"
        label="End Date"
        rules={[
          {
            required: true,
            message: "Date is required",
          },
        ]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        name="discountStrategy"
        label="Discount Strategy"
        rules={[
          {
            required: true,
            message: "Discount Strategy is required",
          },
        ]}
      >
        <Select allowClear placeholder="Select" optionFilterProp="children">
          <Select.Option value="Percentage">Percentage</Select.Option>
          <Select.Option value="Fixed">Fixed Amount</Select.Option>
          <Select.Option value="FreeShipping">Free Shipping</Select.Option>
          <Select.Option value="FreeGift">Free Gift</Select.Option>
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
        <InputNumber placeholder="Enter Value" />
      </Form.Item>

      {/* applicable */}

      {formValues?.scope === "Products" && (
        <Form.Item
          name="applicableProducts"
          label="Applicable Products"
          rules={[
            {
              required: true,
              message: "Applicable Products is required",
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

      {formValues?.scope === "Brand" && (
        <Form.Item
          name="applicableBrands"
          label="Brands"
          rules={[
            {
              required: true,
              message: "Brand is required",
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
            {(brands || []).map((item: any) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {formValues?.scope === "Category" && (
        <Form.Item
          name="applicableCategories"
          label="Category"
          rules={[
            {
              required: true,
              message: "Category is required",
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
            {(categories || []).map((item: any) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      <Form.Item
        name="fileList"
        label="Image"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <ImgCrop rotationSlider showReset>
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
        </ImgCrop>
      </Form.Item>

      <Form.Item name="image" hidden>
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea rows={2} placeholder="Enter Description" />
      </Form.Item>

      <Form.Item name="status" label="Status">
        <Select placeholder="Select">
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Inactive">Inactive</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button
          className="me-2"
          size="small"
          onClick={() => resetFormData(payload)}
        >
          Reset
        </Button>
        <Button
          size="small"
          type="primary"
          htmlType="submit"
          disabled={global.loading.save}
          loading={global.loading.save}
        >
          {payload?.id ? "Update" : "Save"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddDiscount;
