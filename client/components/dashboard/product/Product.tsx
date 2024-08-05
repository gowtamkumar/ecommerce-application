"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Checkbox,
  ColorPicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Tag,
  Upload,
} from "antd";
import {
  selectGlobal,
  setAction,
  setFormValues,
  setLoading,
} from "@/redux/features/global/globalSlice";
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, saveProduct, updateProduct } from "@/lib/apis/product";
import { toast } from "react-toastify";

// Define the shape of product data
interface ProductCategory {
  categoryId: number;
}

interface ProductVariant {
  id: number;
  price: number;
  purchasePrice: number;
  productId: number;
  sizeId: number;
  colorId: number;
  weight: string;
  stockQty: number;
}

interface Product {
  id: number;
  name: string;
  type: string;
  taxId: number;
  unitId: number;
  images: string[]; // Assuming this is an array of image URLs
  singleImage: string;
  brandId: number;
  discountId: number;
  alertQty: number;
  limitPurchaseQty: number;
  tags: string[];
  description: string;
  shortDescription: string;
  enableReview: boolean;
  status: string;
  productVariants: ProductVariant[];
  productCategories: ProductCategory[];
}

const Product = ({
  sizes,
  brands,
  units,
  colors,
  discounts,
  categories,
  taxs,
}: any) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const params = useParams();
  const route = useRouter();

  useEffect(() => {
    // Define the asynchronous function
    const fetchProductData = async () => {
      dispatch(setLoading({ loading: true }));
      try {
        if (params.new !== "new") {
          const id = params.new.toString(); // Convert to string if necessary
          // Fetch product data
          const product = await getProduct(id);
          const productCategories = product.data?.productCategories?.map(
            ({ categoryId }: { categoryId: number }) => categoryId
          );

          form.setFieldsValue({ ...product.data, productCategories });
          setProduct({ ...product.data, productCategories });
          setTags(product.data?.tags || []); // Use product.data?.tags or default to empty array
        } else {
          // Reset form and tags if new product
          form.resetFields();
          setTags([]);
        }
      } catch (err) {
        console.error("Error fetching product data:", err);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    };

    // Call the async function
    fetchProductData();

    // Cleanup function
    return () => {
      // Only reset the form and tags if it's necessary
      if (params.new === "new") {
        form.resetFields();
        setTags([]);
      }
    };

    // Dependencies array
  }, [dispatch, form, params]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newData = { ...values, tags };

      dispatch(setLoading({ save: true }));

      const result = newData.id
        ? await updateProduct(newData)
        : await saveProduct(newData);

      if (result.message.fieldErrors) {
        dispatch(setLoading({ save: false }));
        console.log("error", result.message.fieldErrors);
        return;
      }

      setTimeout(() => {
        dispatch(setLoading({ save: false }));
        dispatch(setAction({}));
        form.resetFields();
        route.push(`/dashboard/products`);
      }, 100);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      if (inputValue.trim() !== "") {
        setTags([...tags, inputValue]);
        setInputValue(" ");
      }
    }
  };

  // const setFormData = (v: any) => {
  //   const newData = { ...v };
  //   form.setFieldsValue(newData);
  //   dispatch(setFormValues(form.getFieldsValue()));
  // };

  const resetFormData = (value: any) => {
    const newData = { ...value };
    if (newData?.id) {
      form.setFieldsValue(newData);
      dispatch(setFormValues(newData));
      setTags(newData.tags);
    } else {
      form.resetFields();
      dispatch(setFormValues(form.getFieldsValue()));
      setTags([]);
    }
    dispatch(setLoading({ save: false }));
  };

  if (global?.loading?.loading) {
    return <Spin />;
  }

  return (
    <div>
      <Divider orientation="left">Create New Product</Divider>
      <Form
        layout="vertical"
        form={form}
        // onValuesChange={(_v, values) => dispatch(setFormValues(values))}
        autoComplete="off"
        scrollToFirstError={true}
        initialValues={{ productVariants: [{}] }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-1">
            <Form.Item
              name="type"
              label="Type"
              className="p-0"
              rules={[
                {
                  required: true,
                  message: "Type is required",
                },
              ]}
            >
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
                <Select.Option value="SimpleProduct">
                  Simple Product
                </Select.Option>
                <Select.Option value="VarientProduct">
                  Varient Product
                </Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              name="brandId"
              label="Brand"
              className="p-0"
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
          </div>

          <div className="col-span-1">
            <Form.Item
              name="taxId"
              label="Tax"
              className="p-0"
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
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as any)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {(taxs || []).map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {`${item.name}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="discountId" label="Discount">
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
                {(discounts || []).map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {`${item.value} - ${item.discountType}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="col-span-1">
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
              <Input placeholder="Enter name" />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="limitPurchaseQty" label="Limit Purchase Qty">
              <InputNumber placeholder="Enter" className="w-auto" />
            </Form.Item>
          </div>

          {/* <div className="col-span-1">
            <Form.Item name="shippingCost" label="Shipping Cost">
              <InputNumber placeholder="Enter" className="w-auto" />
            </Form.Item>
          </div> */}

          <div className="col-span-1">
            <Form.Item name="singleImage" label="Single image">
              <Input placeholder="Enter" className="w-auto" />
              {/* <Upload>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload> */}
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="images" label="Images">
              <Upload>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="shortDescription" label="Short Description">
              <Input.TextArea placeholder="Enter" />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="description" label="Description">
              <Input.TextArea placeholder="Enter" />
            </Form.Item>
          </div>

          <div className={`col-span-1 `}>
            <label htmlFor="tags">Tags</label>

            <Input
              type="text"
              id="tags"
              value={inputValue}
              onPressEnter={handleKeyPress}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type something and press Enter"
            />
            <div className="flex mt-2">
              {(tags || []).map((item, index) => (
                <Tag key={index}>
                  {item}{" "}
                  <span
                    onClick={() =>
                      setTags(tags.filter((item: any, idex) => idex !== index))
                    }
                    className="cursor-pointer"
                  >
                    X
                  </span>
                </Tag>
              ))}
            </div>
          </div>

          <div className="col-span-1 mt-4">
            <Form.Item name="enableReview" valuePropName="checked">
              <Checkbox>Enable Review</Checkbox>
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              name="unitId"
              label="Unit"
              rules={[
                {
                  required: true,
                  message: "Unit is required",
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
                {(units || []).map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="alertQty" label="Alert Qty">
              <InputNumber placeholder="Enter" className="w-auto" />
            </Form.Item>
          </div>

          <div className={`col-span-1 `}>
            <Form.Item hidden={!product?.id} name="status" label="Status">
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
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-1">
            <Divider orientation="left">Product Category</Divider>

            <Form.Item
              name="productCategories"
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
          </div>
          <div className="col-span-3">
            <Form.List name="productVariants">
              {(fields, { add, remove }) => (
                <div>
                  <div className="grid grid-cols-4 justify-center items-center gap-1">
                    <div className="col-span-3">
                      <Divider
                        orientation="center"
                        style={{ margin: "0px", padding: "0px" }}
                      >
                        Product Variants{" "}
                      </Divider>
                    </div>
                    <div className="col-span-1">
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                          disabled={
                            form.getFieldValue("type") === "SimpleProduct" &&
                            form.getFieldValue("productVariants")?.length === 1
                          }
                        >
                          Add
                        </Button>
                      </Form.Item>
                    </div>
                  </div>

                  <table width="100%">
                    <thead className="mb-1 text-start">
                      <tr className="text-start">
                        <th>Sale Price</th>
                        <th>Purchase Price</th>
                        <th>Size</th>
                        <th>Color</th>
                        <th>Weight</th>
                        <th>Qty</th>
                      </tr>
                    </thead>

                    {fields.map(({ key, name, ...restField }) => (
                      <tbody key={key}>
                        <tr>
                          <td hidden>
                            <Form.Item {...restField} name={[name, "id"]}>
                              <Input />
                            </Form.Item>
                          </td>
                          <td>
                            <Form.Item
                              {...restField}
                              name={[name, "price"]}
                              rules={[
                                { required: true, message: "Regular Price" },
                              ]}
                            >
                              <InputNumber
                                placeholder="Regular Price"
                                min={1}
                              />
                            </Form.Item>
                          </td>

                          <td>
                            <Form.Item
                              {...restField}
                              name={[name, "purchasePrice"]}
                              rules={[
                                { required: true, message: "Purchase Price" },
                              ]}
                            >
                              <InputNumber
                                placeholder="Purchase Price"
                                min={1}
                              />
                            </Form.Item>
                          </td>
                          <td>
                            <Form.Item
                              {...restField}
                              name={[name, "sizeId"]}
                              rules={[
                                { required: true, message: "Size Is Required" },
                              ]}
                            >
                              <Select
                                allowClear
                                showSearch
                                placeholder="Select"
                              >
                                {(sizes || []).map((item: any) => (
                                  <Select.Option key={item.id} value={item.id}>
                                    {`${item.id} ${item.name}`}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </td>
                          <td>
                            <Form.Item {...restField} name={[name, "colorId"]}>
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
                                {(colors || []).map((item: any) => (
                                  <Select.Option key={item.id} value={item.id}>
                                    <ColorPicker
                                      size="small"
                                      value={item.color}
                                    />{" "}
                                    {item.name}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </td>

                          <td>
                            {" "}
                            <Form.Item {...restField} name={[name, "weight"]}>
                              <Input placeholder="Weight" />
                            </Form.Item>
                          </td>
                          <td>
                            {" "}
                            <Form.Item
                              {...restField}
                              name={[name, "stockQty"]}
                              rules={[{ required: true, message: "Stock Qty" }]}
                            >
                              <InputNumber placeholder="Enter" min={1} />
                            </Form.Item>
                          </td>

                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
              )}
            </Form.List>
          </div>
        </div>

        <div className="col-span-1 text-end">
          <Button
            className="mx-2 capitalize"
            size="small"
            onClick={() => resetFormData(product)}
          >
            Reset
          </Button>
          <Button
            size="small"
            color="blue"
            onClick={handleSubmit}
            className="capitalize"
            loading={global.loading.save}
          >
            {product?.id ? "Update" : "Save"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Product;
