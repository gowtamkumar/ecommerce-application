"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Checkbox,
  ColorPicker,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Spin,
  Tag,
  Upload,
} from "antd";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, saveProduct, updateProduct } from "@/lib/apis/product";
import { toast } from "react-toastify";
import ImgCrop from "antd-img-crop";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [formValues, setFormValues] = useState({
    fileList: [],
    images: [],
  }) as any;
  const [previewTitle, setPreviewTitle] = useState("");

  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const params = useParams();
  const route = useRouter();

  useEffect(() => {
    // Call the async function
    fetchProductData();
    // Cleanup function
    return () => {
      if (params.new === "new") {
        form.resetFields();
        setTags([]);
      }
    };
  }, [params]);

  const fetchProductData = async () => {
    dispatch(setLoading({ loading: true }));
    try {
      if (params.new !== "new") {
        const id = params.new.toString(); // Convert to string if necessary
        // Fetch product data
        const result = await getProduct(id);
        const newData = { ...result.data };
        const productCategories = newData?.productCategories?.map(
          ({ categoryId }: { categoryId: number }) => categoryId
        );
        if (!newData.images) {
          newData.images = [];
        }
        if (newData.images) {
          const file = (newData.images || []).map(
            (item: string, idx: number) => ({
              uid: Math.random() * 1000 + "",
              name: `photo ${idx}`,
              status: "done",
              fileName: item,
              url: `http://localhost:3900/uploads/${item || "no-data.png"}`,
            })
          );
          newData.fileList = file;
        }
        form.setFieldsValue({ ...newData, productCategories });
        setProduct({ ...newData, productCategories });
        setTags(newData?.tags || []); // Use product.data?.tags or default to empty array
        setFormValues(newData);
        console.log("ddd");
      } else {
        form.resetFields();
        setTags([]);
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let newData = { ...values, tags };
      // console.log("🚀 ~ newData:", newData);
      // return;
      delete newData.fileList;
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

  const setFormData = (value: any) => {
    const newData = { ...value };

    if (newData.images) {
      const file = (newData.images || []).map((item: string, idx: number) => ({
        uid: Math.random() * 1000 + "",
        name: `photo ${idx}`,
        status: "done",
        fileName: item,
        url: `http://localhost:3900/uploads/${item || "no-data.png"}`,
      }));
      newData.fileList = file;
    }

    setFormValues(form.getFieldsValue());
    // setBackup(newData);
  };

  const resetFormData = (value: any) => {
    const newData = { ...value };
    if (newData?.id) {
      setFormData(newData);
      setTags(newData.tags);
    } else {
      form.resetFields();
      setFormValues(form.getFieldsValue());
      setTags([]);
    }
    dispatch(setLoading({ save: false }));
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

      const newfile = res.data.map((item: { filename: string }) => ({
        uid: Math.random() * 1000 + "",
        name: `photo ${Math.random() * 10000 + ""}`,
        status: "done",
        fileName: item.filename,
        url: `http://localhost:3900/uploads/${item.filename || "no-data.png"}`,
      }));

      const newFileName = res.data.length ? res.data[0].filename : null;
      // Assuming you're updating form data here:
      form.setFieldsValue({
        fileList: [...form.getFieldsValue().fileList, ...newfile],
        images: [...form.getFieldsValue().images, newFileName],
      });
      setFormValues({
        fileList: [...formValues.fileList, ...newfile],
        images: [...formValues.images, newFileName],
      });

      onSuccess("Ok");
    } catch (err) {
      console.error("🚀 ~ Upload error:", err);
      onError({ err });
    }
  };

  const normFile = (e: { fileList: string }) => {
    console.log("🚀 ~ e:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  // this function for tag
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      if (inputValue.trim() !== "") {
        setTags([...tags, inputValue]);
        setInputValue(" ");
      }
    }
  };
  
  const handleCancel = () => setPreviewOpen(false);

  // file Preview
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const getBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  if (global?.loading?.loading) {
    return <Spin />;
  }

  return (
    <div>
      <Divider orientation="left">Create New Product</Divider>
      <Form
        layout="vertical"
        form={form}
        onValuesChange={(_v, values) => setFormValues(values)}
        autoComplete="off"
        scrollToFirstError={true}
        initialValues={{
          productVariants: [{}],
          images: [],
          fileList: [],
        }}
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

          <div className="grid grid-cols-1 gap-3 px-3">
            <Form.Item
              name="fileList"
              label="images"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <ImgCrop rotationSlider>
                <Upload
                  name="images"
                  listType="picture-card"
                  fileList={formValues?.fileList || []}
                  onRemove={async (v) => {
                    const find = (form.getFieldValue("images") || []).filter(
                      (item: string) => item !== v.fileName
                    );
                    const newfind = (
                      form.getFieldValue("fileList") || []
                    ).filter(
                      (item: { fileName: string }) =>
                        item.fileName !== v.fileName
                    );
                    form.setFieldsValue({ images: find, fileList: newfind });
                    setFormValues({ images: find, fileList: newfind });
                    if (v.fileName) {
                      const params = { filename: v.fileName };
                      await fileDeleteWithPhoto(params);
                    }
                  }}
                  className="avatar-uploader"
                  onPreview={handlePreview}
                  customRequest={customUploadRequest}
                  maxCount={5}
                >
                  {uploadButton}
                  {/* {formValues?.fileList?.length >= 5 ? null : uploadButton} */}
                </Upload>
              </ImgCrop>
            </Form.Item>

            <Form.Item name="images" hidden>
              <Input />
            </Form.Item>

            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <Image
                alt="example"
                style={{
                  width: "100%",
                }}
                src={previewImage}
              />
            </Modal>
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
            <Form.Item
              name="alertQty"
              label="Alert Qty"
              rules={[
                {
                  required: true,
                  message: "Alert Qty is required",
                },
              ]}
            >
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
