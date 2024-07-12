/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
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
import { getProducts, saveProduct, updateProduct } from "@/lib/apis/product";

import { getTaxs } from "@/lib/apis/tax";
import { getAllCategories } from "@/lib/apis/categories";
import { getSizes } from "@/lib/apis/size";

import { getUsers } from "@/lib/apis/user";


const AddOrder = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
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
      setUsers(users.data);

      const resSize = await getSizes();
      const resProducts = await getProducts();
      const resCategory = await getAllCategories();
      const resTax = await getTaxs();
      setSizes(resSize.data);
      setProducts(resProducts.data);
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

      return console.log("newData:", newData);
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

  const handleProductSelect = (value: any) => {
    if (!value) return
    const newData = { ...global.formValues, orderItems: [...global.formValues.orderItems] }

    const product = (products || []).find(
      (item: {id: number, price: string,}) => item.id === value
    )
    
    console.log("product", product);
    
    if (!product) return

    // const itemInCart = (global.formValues.orderItems || []).find((item: any) => item.productId === product.id)

    // if (itemInCart) {
    //   newData.orderItems = newData.orderItems.map((item: any) =>
    //     item.productId === itemInCart.productId ? { ...item, quantity: item.quantity + 1 } : item,
    //   )
    // } else {
    //   const orderItem = {
    //     quantity: 1,
    //     productId: 12,
    //     product,
    //     price: product.price || 0,
    //     itemBarcode: product.itemBarcode,
    //     taxId: product.taxId,
    //     // productTax: product.tax ? ((product.salePrice || 0) * (product.tax.rate || 0)) / 100 : 0,
    //     // discountId: product.discountId,
    //     // productDiscount: product.discount
    //     //   ? product.discount.type === 'Fixed'
    //     //     ? product.discount.rate
    //     //     : (product.salePrice * product.discount.rate) / 100
    //     //   : 0,
    //   } as any

    //   orderItem.subTotal = orderItem.price + orderItem.productTax - orderItem.productDiscount
    //   newData.orderItems = [...(newData.orderItems || []), orderItem]
    // }
    // newData.productId = null
    // newData.itemBarcode = null
    // setFormData(newData)
  }

  return (
    <div className="container mx-auto p-3">
      <h2 className="mb-5">Create New Order</h2>
      <Form
        layout="vertical"
        form={form}
        // onFinish={handleSubmit}
        onValuesChange={(_v, values) => dispatch(setFormValues(values))}
        autoComplete="off"
        scrollToFirstError={true}
        initialValues={{ orderItems: [{}] }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-1">
            <Form.Item
              name="orderDate"
              label="Order Date"
              rules={[
                {
                  required: true,
                  message: "Order Date is required",
                },
              ]}
            >
              <DatePicker placeholder="Enter Order Date" />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="paymentMothod" label="Payment Type" className="p-0">
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
          <div className="col-span-1">
            <Form.Item
              name="deliveryAddress"
              label="Full Address"
              rules={[
                {
                  required: true,
                  message: "Full Address is required",
                },
              ]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>
          </div>
        </div>

        <div>
          <Form.Item label="Product">
            <Select
              showSearch
              allowClear
              placeholder="Select"
              value={null}
              optionFilterProp="children"
              onChange={handleProductSelect}
              filterOption={(input, option) =>
                (option?.children as any)
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {products.map((item: any, idx) => (
                <Select.Option key={idx} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="bg-slate-500">
          <Divider orientation="center">Order Items</Divider>
          <table width={"100%"}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Tax</th>
                <th>Sub Total</th>
              </tr>
            </thead>

            <Form.List name="orderItems">
              {(fields, { add, remove }) => (
                <>
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
                            <InputNumber placeholder="Enter Regular Price" />
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item
                            {...restField}
                            name={[name, "salePrice"]}
                            rules={[{ required: true, message: "sale price" }]}
                          >
                            <InputNumber placeholder="Enter sale price" />
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
                          {" "}
                          <Form.Item
                            {...restField}
                            name={[name, "color"]}
                            rules={[
                              {
                                required: true,
                                message: "color Is Required",
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
                              {["Red", "Green"].map((item: any, idx) => (
                                <Select.Option key={idx} value={item}>
                                  {item}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </td>
                        <td>
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
                        </td>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </tr>
                    </tbody>
                  ))}
                </>
              )}
            </Form.List>

            {/* <tfoot>
              <tr>
                <td>Centro comercial Moctezuma</td>
                <td>Francisco Chang</td>
                <td>Mexico</td>
              </tr>
            </tfoot> */}
          </table>
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
    </div>
  );
};

export default AddOrder;
