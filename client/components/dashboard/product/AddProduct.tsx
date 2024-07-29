"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  ColorPicker,
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
import { useParams, useRouter } from "next/navigation";
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
import { getFilterDiscounts } from "@/lib/apis/discount";
import { toast } from "react-toastify";
import { getColors } from "@/lib/apis/color";
import { getUnits } from "@/lib/apis/unit";

const AddProduct = () => {
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [colors, setColors] = useState([]);
  const [taxs, setTaxs] = useState([]);
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  const params = useParams();
  const route = useRouter();

  // need to optimize this component

  useEffect(() => {
    try {
      (async () => {
        const newData = { ...payload };
        if (newData.id) {
          setTags(newData.tags);
        }

        if (params.new === "new") {
          form.resetFields();
          setTags([]);
          console.log("sdfasdf");
          return;
        }

        setFormData(newData);
        const resBrand = await getBrands();
        const resSize = await getSizes();
        const resUnit = await getUnits();
        const resColor = await getColors();
        const resDiscount = await getFilterDiscounts({ type: "Discount" });
        const resCategory = await getAllCategories();
        const resTax = await getTaxs();
        setUnits(resUnit.data);
        setSizes(resSize.data);
        setColors(resColor.data);
        setDiscounts(resDiscount.data);
        setCategories(resCategory.data);
        setBrands(resBrand.data);
        setTaxs(resTax.data);
        // if()
      })();
      return () => {
        dispatch(setFormValues({}));
        // dispatch(setAction({}));
        form.resetFields();
        setTags([]);
      };
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, form, params.new, payload]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      let newData = { ...values, tags };

      // return console.log("newData:", newData);

      dispatch(setLoading({ save: true }));
      const result = newData.id
        ? await updateProduct(newData)
        : await saveProduct(newData);

      if (result.message.fieldErrors) {
        dispatch(setLoading({ save: false }));
        console.log("error", result.message.fieldErrors);
        return;
      }

      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        dispatch(setAction({}));
        route.push(`/dashboard/products/new`);
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

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  const setFormData = (v: any) => {
    const newData = { ...v };
    console.log("🚀 ~ newData:", newData);
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
    dispatch(setLoading({ save: false }));
  };

  return (
    <Form
      layout="vertical"
      form={form}
      // onFinish={handleSubmit}
      onValuesChange={(_v, values) => dispatch(setFormValues(values))}
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
              {(brands || []).map((item: any, idx) => (
                <Select.Option key={idx} value={item.id}>
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
              {(taxs || []).map((item: any, idx) => (
                <Select.Option key={idx} value={item.id}>
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
              {(discounts || []).map((item: any, idx) => (
                <Select.Option key={idx} value={item.id}>
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

        <div className="col-span-1">
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
              {(categories || []).map((item: any, idx) => (
                <Select.Option key={idx} value={item.id}>
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
                          global.formValues.type === "SimpleProduct" &&
                          global.formValues.productVariants?.length === 1
                        }
                      >
                        Add field
                      </Button>
                    </Form.Item>
                  </div>
                </div>

                <table width="100%">
                  <thead className="mb-1 text-start">
                    <tr className="text-start">
                      <th>Sale Price</th>
                      <th>Size</th>
                      <th>Color</th>
                      <th>Weight</th>
                      <th>Qty</th>
                    </tr>
                  </thead>

                  {fields.map(({ key, name, ...restField }) => (
                    <tbody key={key}>
                      <tr>
                        <td>
                          <Form.Item
                            {...restField}
                            name={[name, "price"]}
                            rules={[
                              { required: true, message: "Regular Price" },
                            ]}
                          >
                            <InputNumber placeholder="Regular Price" min={1} />
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
                            <Select allowClear showSearch placeholder="Select">
                              {(sizes || []).map((item: any, index) => (
                                <Select.Option key={index} value={item.id}>
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
                              {(colors || []).map((item: any, idx) => (
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
          onClick={() => resetFormData(global.action?.payload)}
        >
          Reset
        </Button>
        <Button
          size="small"
          color="blue"
          onClick={handleSubmit}
          // htmlType="submit"
          className="capitalize"
          loading={global.loading.save}
        >
          {payload?.id ? "Update" : "Save"}
        </Button>
      </div>
    </Form>
  );
};

export default AddProduct;
