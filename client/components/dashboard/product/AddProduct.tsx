/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Tag,
  Upload,
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
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { saveProduct, updateProduct } from "@/lib/apis/product";
import { getBrands } from "@/lib/apis/brand";
import { getTaxs } from "@/lib/apis/tax";
import { getAllCategories } from "@/lib/apis/categories";
import { getSizes } from "@/lib/apis/size";
import { getDiscounts } from "@/lib/apis/discount";

const AddProduct = () => {
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [taxs, setTaxs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [array, setArray] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const { payload } = global.action;

  useEffect(() => {
    (async () => {
      const newData = { ...payload };
      console.log("newData", newData);
      if (newData.id) {
        setArray(newData.tags);
      }
      setFormData(newData);
      const resBrand = await getBrands();
      const resSize = await getSizes();
      const resDiscount = await getDiscounts();
      const resCategory = await getAllCategories();
      const resTax = await getTaxs();
      setSizes(resSize.data);
      setDiscounts(resDiscount.data);
      setCategories(resCategory.data);
      setBrands(resBrand.data);
      setTaxs(resTax.data);
    })();
    return () => {
      dispatch(setFormValues({}));
      form.resetFields();
    };
  }, [global.action]);

  const handleSubmit = async (values: any) => {

    try {
      let newData = { ...values, tags: array };
      // return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = newData.id
        ? await updateProduct(newData)
        : await saveProduct(newData);
      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        router.refresh();
        toast.success(
          `Product ${newData?.id ? "Updated" : "Created"} Successfully`
        );
        dispatch(setAction({}));
      }, 100);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      if (inputValue.trim() !== "") {
        setArray([...array, inputValue]);
        setInputValue(" ");
        console.log("ss");
      }
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

  const resetFormData = (value: any) => {
    const newData = { ...value };
    if (newData?.id) {
      form.setFieldsValue(newData);
      dispatch(setFormValues(newData));
    } else {
      form.resetFields();
      dispatch(setFormValues(form.getFieldsValue()));
    }
  };

  return (
    <Modal
      title={
        global.action.type === ActionType.UPDATE
          ? "Update Product"
          : "Create Product"
      }
      width={1250}
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
        // onFinish={handleSubmit}
        onValuesChange={(_v, values) => dispatch(setFormValues(values))}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-1">
            <Form.Item name="type" label="Type" className="p-0">
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
            <Form.Item name="brandId" label="Brand" className="p-0">
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
                {brands.map((item: any, idx) => (
                  <Select.Option key={idx} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="taxId" label="Tax" className="p-0">
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
                {taxs.map((item: any, idx) => (
                  <Select.Option key={idx} value={item.id}>
                    {`${item.name} - ${item.type}`}
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
                {discounts.map((item: any, idx) => (
                  <Select.Option key={idx} value={item.id}>
                    {`${item.value} - ${item.type}`}
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

          <div className="col-span-1">
            <Form.Item name="shippingCost" label="Shipping Cost">
              <InputNumber placeholder="Enter" className="w-auto" />
            </Form.Item>
          </div>

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

          <div className="col-span-1">
            <Form.Item name="enableReview" valuePropName="checked">
              <Checkbox>Enable Review</Checkbox>
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
              {array.map((item, index) => (
                <Tag key={index}>
                  {item}{" "}
                  <span
                    onClick={() =>
                      setArray(
                        array.filter((item: any, idex) => idex !== index)
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
                <Select.Option value={"Active"}>Active</Select.Option>
                <Select.Option value={"Inactive"}>Inactive</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="col-span-1">
            <Divider orientation="left">Product Category</Divider>

            <Form.Item name="productCategories" label="Category">
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
                {categories.map((item: any, idx) => (
                  <Select.Option key={idx} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="col-span-2">
            <Divider orientation="center">Product Variants</Divider>
            <Form.List name="productVariants">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "regularPrice"]}
                        rules={[{ required: true, message: "Regular Price" }]}
                      >
                        <InputNumber placeholder="Enter Regular Price" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "salePrice"]}
                        rules={[{ required: true, message: "sale price" }]}
                      >
                        <InputNumber placeholder="Enter sale price" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "sizeId"]}
                        rules={[
                          { required: true, message: "Size Is Required" },
                        ]}
                      >
                        <Select allowClear showSearch placeholder="Select">
                          {(sizes || []).map((item: any, index) => (
                            <Select.Option key={index} value={item.id}>
                              {`${item.id} ${item.name}`}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      {/*#Todo need to dynamic color */}
                      <Form.Item
                        {...restField}
                        name={[name, "color"]}
                        rules={[
                          { required: true, message: "color Is Required" },
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
                          {["Red", "Green"].map((item: any, idx) => (
                            <Select.Option key={idx} value={item}>
                              {item}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "weight"]}>
                        <Input placeholder="Enter weight" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "stockQty"]}
                        rules={[{ required: true, message: "Stock Qty" }]}
                      >
                        <InputNumber placeholder="Enter" />
                      </Form.Item>

                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      disabled={
                        global.formValues.type === "SimpleProduct" &&
                        global.formValues.productVariants?.length === 1
                      }
                    >
                      Add field
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
        </div>

        <div className="col-span-1 text-end">
          <Button
            className="mx-2 capitalize"
            size="small"
            onClick={() => resetFormData(global.action?.payload)}
          >
            Reset
          </Button>
          <Button
            size="small"
            color="blue"
            onClick={() => handleSubmit(global.formValues)}
            // htmlType="submit"
            className="capitalize"
            loading={global.loading.save}
          >
            {payload?.id ? "Update" : "Save"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddProduct;
