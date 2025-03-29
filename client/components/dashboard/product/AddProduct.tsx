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
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getProduct,
  saveProduct,
  updateProduct,
} from "@/lib/apis/admin/product";
import ImgCrop from "antd-img-crop";
import { fileDeleteWithPhoto, uploadFile } from "@/lib/apis/file";
import appConfig from "@/appConfig";
import { ProductType } from "@/lib/types/product";
import {
  handleAsyncAction,
  handlePreview,
  handlePreviewCancel,
  normFile,
} from "@/lib/utils/commonFunctions";
import { errorNotification } from "@/lib/utils/notification";
import ProductVariant from "./ProductVariant";

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

const AddProduct = ({
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
  const [product, setProduct] = useState<ProductType | null>(null);
  const [formValues, setFormValues] = useState({
    fileList: [],
    images: [],
    thumbnailImage: "",
    fileThumbnailList: [],
  }) as any;

  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const params = useParams<{ new: string }>();
  const route = useRouter();

  useEffect(() => {
    // Call the async function
    fetchData();
    // Cleanup function
    return () => {
      if (params.new === "new") {
        form.resetFields();
        setTags([]);
      }
    };
  }, []);

  const fetchData = async () => {
    const generateFile = (fileName: string, identifier: string | number) => ({
      uid: `${Math.random() * 1000}`,
      name: `photo ${identifier}`,
      status: "done",
      fileName,
      url: `${appConfig.baseApiUrl}/uploads/${fileName || "no-data.png"}`,
    });

    try {
      dispatch(setLoading({ loading: true }));

      if (params.new === "new") {
        form.resetFields();
        setTags([]);
        return;
      }

      if (params.new !== "new") {
        const id = params.new.toString();
        const result = await getProduct(id);
        const productData = { ...result.data };

        // Populate variant data if no variant is selected
        if (!productData.variant && productData.productVariants?.length) {
          const [firstVariant] = productData.productVariants;
          Object.assign(productData, {
            purchasePrice: +firstVariant.purchasePrice,
            unitPrice: +firstVariant.unitPrice,
            stockQty: firstVariant.stockQty,
            variantId: firstVariant.id,
          });
        }

        // Map categories
        const productCategories = productData.productCategories?.map(
          (category: any) => category.categoryId
        );

        // Handle images, thumbnails, and hover images
        productData.fileList =
          productData.images?.map((image: string, idx: number) =>
            generateFile(image, idx)
          ) || [];

        if (productData.thumbnailImage) {
          productData.fileThumbnailList = [
            generateFile(productData.thumbnailImage, "thumbnail"),
          ];
        }

        if (productData.hoverImage) {
          productData.fileHoverList = [
            generateFile(productData.hoverImage, "hover"),
          ];
        }

        // Update form and state
        form.setFieldsValue({
          ...productData,
          productCategories,
        });
        setProduct({ ...productData, productCategories });
        setTags(productData.tags || []);
        setFormValues(productData);
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  const handleSubmit = async () => {
    const newData = await form.validateFields();

    delete newData.fileList;
    delete newData.fileThumbnailList;
    delete newData.fileHoverList;

    if (!newData.variant) {
      const productVariants = {
        purchasePrice: +newData.purchasePrice,
        unitPrice: +newData.unitPrice,
        stockQty: newData.stockQty,
        id: newData?.variantId,
      };
      newData.productVariants = [productVariants];
    }

    const result = newData.id
      ? () => updateProduct(newData)
      : () => saveProduct(newData);

    const messageData = newData.id
      ? "Successfully Updated"
      : "Successfully Added";

    await handleAsyncAction(result, messageData, dispatch);

    setTags([]);
    setFormValues({});
    route.push(`/dashboard/product`);
    form.resetFields();
  };

  const setFormData = (value: any) => {
    const newData = { ...value };
    if (newData.images) {
      const file = (newData.images || []).map((item: string, idx: number) => ({
        uid: Math.random() * 1000 + "",
        name: `photo ${idx}`,
        status: "done",
        fileName: item,
        url: `${appConfig.baseApiUrl}/uploads/${item || "no-data.png"}`,
      }));
      newData.fileList = file;
    }

    if (newData.thumbnailImage) {
      const newfileThumbnail = {
        uid: Math.random() * 1000 + "",
        name: `photo ${Math.random() * 10000 + ""}`,
        status: "done",
        fileName: newData.thumbnailImage,
        url: `${appConfig.baseApiUrl}/uploads/${
          newData.thumbnailImage || "no-data.png"
        }`,
      };
      newData.fileThumbnailList = [newfileThumbnail];
    }

    if (newData.hoverImage) {
      const newfileHover = {
        uid: Math.random() * 1000 + "",
        name: `photo ${Math.random() * 10000 + ""}`,
        status: "done",
        fileName: newData.hoverImage,
        url: `${appConfig.baseApiUrl}/uploads/${
          newData.hoverImage || "no-data.png"
        }`,
      };
      newData.fileHoverList = [newfileHover];
    }

    setFormValues(form.getFieldsValue());
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
        errorNotification({ message: res.message });
      }

      const newfile = res.data.map((item: { filename: string }) => ({
        uid: Math.random() * 1000 + "",
        name: `photo ${Math.random() * 10000 + ""}`,
        status: "done",
        fileName: item.filename,
        url: `${appConfig.baseApiUrl}/uploads/${item.filename}`,
      }));

      const newFileName = res.data.length ? res.data[0].filename : null;
      // Assuming you're updating form data here:
      if (filename === "images") {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          fileList: [...form.getFieldsValue().fileList, ...newfile],
          images: [...form.getFieldsValue().images, newFileName],
        });
        setFormValues({
          ...formValues,
          fileList: [...formValues.fileList, ...newfile],
          images: [...formValues.images, newFileName],
        });
      }

      if (filename === "thumbnailImage") {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          fileThumbnailList: newfile,
          thumbnailImage: newFileName,
        });
        setFormValues({
          ...formValues,
          fileThumbnailList: newfile,
          thumbnailImage: newFileName,
        });
      }

      if (filename === "hoverImage") {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          fileHoverList: newfile,
          hoverImage: newFileName,
        });
        setFormValues({
          ...formValues,
          fileHoverList: newfile,
          hoverImage: newFileName,
        });
      }

      onSuccess("Ok");
    } catch (err) {
      console.error("🚀 ~ Upload error:", err);
      onError({ err });
    }
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

  if (global?.loading?.loading) {
    return <Spin />;
  }

  return (
    <>
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
          thumbnailImage: "",
          fileThumbnailList: [],
          hoverImage: "",
          fileHoverList: [],
        }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="variantId" hidden>
          <Input />
        </Form.Item>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="col-span-2">
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
              <Input
                placeholder="Enter"
                onChange={(value) => {
                  const slug = value.target.value.trim().split(" ").join("-");
                  form.setFieldsValue({ slug });
                }}
              />
            </Form.Item>

            <Form.Item
              name="slug"
              label="Slug"
              rules={[
                {
                  required: true,
                  message: "Slug is required",
                },
              ]}
            >
              <Input placeholder="Enter" />
            </Form.Item>

            <Form.Item
              name="shortDescription"
              label="Short Description"
              rules={[
                {
                  required: true,
                  message: "Short Description is required",
                },
              ]}
            >
              <Input.TextArea placeholder="Enter" rows={8} />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Description is required",
                },
              ]}
            >
              <Input.TextArea placeholder="Enter" rows={10} />
            </Form.Item>

            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-1">
                <Form.Item
                  name="taxId"
                  label="Tax"
                  className="p-0"
                  rules={[
                    {
                      required: true,
                      message: "Tax is required",
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
                        {`${item.value} - ${item.discountStrategy}`}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Form.Item name="enableReview" valuePropName="checked">
                <Checkbox>Enable Review</Checkbox>
              </Form.Item>

              <Form.Item
                name="limitPurchaseQty"
                label="Limit Purchase Qty"
                className="w-full"
              >
                <InputNumber placeholder="Enter" />
              </Form.Item>

              <Form.Item
                name="alertQty"
                label="Alert Qty"
                rules={[
                  {
                    required: true,
                    message: "Alert Qty is required",
                  },
                ]}
                className="w-full"
              >
                <InputNumber placeholder="Enter" className="w-full" />
              </Form.Item>
            </div>
            <div className="flex justify-between">
              <Form.Item name="variant" valuePropName="checked">
                <Checkbox>Product Variant</Checkbox>
              </Form.Item>

              {!formValues.variant && (
                <>
                  <Form.Item
                    name="purchasePrice"
                    label="Purchase Price"
                    rules={[
                      {
                        required: true,
                        message: "Purchase Price is required",
                      },
                    ]}
                  >
                    <InputNumber placeholder="Enter" className="w-full" />
                  </Form.Item>

                  <Form.Item
                    name="unitPrice"
                    label="Unit Price"
                    rules={[
                      {
                        required: true,
                        message: "Unit Price is required",
                      },
                    ]}
                  >
                    <InputNumber placeholder="Enter" className="w-full" />
                  </Form.Item>

                  <Form.Item
                    name="stockQty"
                    label="Stock Qty"
                    rules={[
                      {
                        required: true,
                        message: "Stock Qty is required",
                      },
                    ]}
                  >
                    <InputNumber placeholder="Enter" className="w-full" />
                  </Form.Item>
                </>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <Form.Item
              name="status"
              label="Status"
              rules={[
                {
                  required: true,
                  message: "Status is required",
                },
              ]}
            >
              <Select showSearch allowClear placeholder="Select Status">
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="brandId" label="Brand">
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

            <div>
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
                        setTags(
                          tags.filter((item: any, idex) => idex !== index)
                        )
                      }
                      className="cursor-pointer"
                    >
                      X
                    </span>
                  </Tag>
                ))}
              </div>
            </div>
            {/* image upload section */}
            <div className="flex justify-between">
              <div>
                <Form.Item
                  name="fileThumbnailList"
                  label="Thumbnail Image"
                  valuePropName="fileThumbnailList"
                  getValueFromEvent={normFile}
                  rules={[
                    {
                      required: true,
                      message: "Thumbnail Image is required",
                    },
                  ]}
                >
                  <ImgCrop rotationSlider showReset>
                    <Upload
                      name="thumbnailImage"
                      listType="picture-card"
                      fileList={formValues?.fileThumbnailList || []}
                      onRemove={async (v) => {
                        if (v.fileName) {
                          form.setFieldsValue({
                            ...form.getFieldsValue(),
                            thumbnailImage: null,
                            fileThumbnailList: [],
                          });
                          setFormValues({
                            ...formValues,
                            thumbnailImage: null,
                            fileThumbnailList: [],
                          });
                          const params = { filename: v.fileName };
                          await fileDeleteWithPhoto(params);
                        }
                      }}
                      className="avatar-uploader"
                      onPreview={(file) => handlePreview(file, dispatch)}
                      customRequest={customUploadRequest}
                      maxCount={1}
                    >
                      {!formValues.thumbnailImage && uploadButton}
                    </Upload>
                  </ImgCrop>
                </Form.Item>

                <Form.Item name="thumbnailImage" hidden>
                  <Input />
                </Form.Item>
              </div>

              <div>
                <Form.Item
                  name="fileHoverList"
                  label="Hover Image"
                  valuePropName="fileHoverList"
                  getValueFromEvent={normFile}
                  rules={[
                    {
                      required: true,
                      message: "Hover Image is required",
                    },
                  ]}
                >
                  <ImgCrop rotationSlider showReset>
                    <Upload
                      name="hoverImage"
                      listType="picture-card"
                      fileList={formValues?.fileHoverList || []}
                      onRemove={async (v) => {
                        if (v.fileName) {
                          form.setFieldsValue({
                            ...form.getFieldsValue(),
                            hoverImage: null,
                            fileHoverList: [],
                          });
                          setFormValues({
                            ...formValues,
                            hoverImage: null,
                            fileHoverList: [],
                          });
                          const params = { filename: v.fileName };
                          await fileDeleteWithPhoto(params);
                        }
                      }}
                      className="avatar-uploader"
                      onPreview={(file) => handlePreview(file, dispatch)}
                      customRequest={customUploadRequest}
                      maxCount={1}
                    >
                      {!formValues.hoverImage && uploadButton}
                    </Upload>
                  </ImgCrop>
                </Form.Item>

                <Form.Item name="hoverImage" hidden>
                  <Input />
                </Form.Item>
              </div>
            </div>
            <div>
              <Form.Item
                name="fileList"
                label="Images"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: true,
                    message: "Images is required",
                  },
                ]}
              >
                <ImgCrop rotationSlider showReset>
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
                    onPreview={(file) => handlePreview(file, dispatch)}
                    customRequest={customUploadRequest}
                    maxCount={5}
                  >
                    {uploadButton}
                  </Upload>
                </ImgCrop>
              </Form.Item>

              <Form.Item name="images" hidden>
                <Input />
              </Form.Item>

              <Modal
                open={global.previewOpen}
                title={global.previewTitle}
                footer={null}
                onCancel={() => handlePreviewCancel(dispatch)}
              >
                <Image
                  alt="example"
                  style={{
                    width: "100%",
                  }}
                  src={global.previewImage}
                  preview={false}
                />
              </Modal>
            </div>
          </div>
        </div>

        <ProductVariant
          formValues={formValues}
          form={form}
          sizes={sizes}
          colors={colors}
        />

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
            color="primary"
            onClick={handleSubmit}
            className="capitalize"
            loading={global.loading.save}
            disabled={global.loading.save}
          >
            {product?.id ? "Update" : "Save"}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default AddProduct;
