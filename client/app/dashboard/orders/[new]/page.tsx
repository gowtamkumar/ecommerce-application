/* eslint-disable react-hooks/exhaustive-deps */
"use client";
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
import { toast } from "react-toastify";
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
import { getDiscounts } from "@/lib/apis/discount";
import { getUsers } from "@/lib/apis/user";

const AddOrder = () => {
  const [delivery, setUser] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [taxs, setTaxs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [array, setArray] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const params = useParams();

  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const { payload } = global.action;

  useEffect(() => {
    (async () => {
      const newData = { ...payload };
      if (newData.id) {
        setArray(newData.tags);
      }

      setFormData(newData);

      const users = await getUsers();
      setUser(users.data);

      const resSize = await getSizes();
      const resDiscount = await getDiscounts();
      const resCategory = await getAllCategories();
      const resTax = await getTaxs();
      setSizes(resSize.data);
      setDiscounts(resDiscount.data);
      setCategories(resCategory.data);
    
      setTaxs(resTax.data);

      if (params.new === "new") {
        form.resetFields();
        setFormValues({});
        return;
      }
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
    <Form
      layout="vertical"
      form={form}
      // onFinish={handleSubmit}
      onValuesChange={(_v, values) => dispatch(setFormValues(values))}
      autoComplete="off"
      scrollToFirstError={true}
      initialValues={{ orderItems: [{}]}}
    >
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>

      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-1">
          <Form.Item name="paymentType" label="Payment Type" className="p-0">
            <Select allowClear placeholder="Select Type">
              <Select.Option value="Online">Online</Select.Option>
              <Select.Option value="Offline">Offline</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div className="col-span-1">
          <Form.Item
            name="paymentStatus"
            label="Payment Status"
            className="p-0"
          >
            <Select allowClear placeholder="Select">
              <Select.Option value="Paid">Paid</Select.Option>
              <Select.Option value="NotPaid">Not Paid</Select.Option>
              <Select.Option value="PertialPaid">Pertial Paid</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div className="col-span-1">
          <Form.Item name="deliveryId" label="Delivery Man" className="p-0">
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
              {delivery.map((item: any, idx) => (
                <Select.Option key={idx} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

      


        <div className="col-span-1">
          <Form.Item
            name="phoneNo"
            label="Phone No"
            rules={[
              {
                required: true,
                message: "Phone No is required",
              },
            ]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
        </div>

        <div className="col-span-1">
          <Form.Item
            name="email"
            label="E-Mail"
            rules={[
              {
                required: true,
                message: "E-Mail is required",
              },
            ]}
          >
            <Input placeholder="Enter" />
          </Form.Item>
        </div>
        

      </div>

        <div className="col-span-1">
          <Form.Item  label="Product">
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
              {categories.map((item: any, idx) => (
                <Select.Option key={idx} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="col-span-1 bg-slate-400">
          <Divider orientation="center">Order Items</Divider>
          <Form.List name="orderItems">
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
                      rules={[{ required: true, message: "Size Is Required" }]}
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
                      rules={[{ required: true, message: "color Is Required" }]}
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
                {/* <Form.Item>
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
                </Form.Item> */}
              </>
            )}
          </Form.List>
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
  );
};

export default AddOrder;
