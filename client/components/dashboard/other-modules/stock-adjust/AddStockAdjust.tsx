import { ActionType } from "@/constants/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { getDashboardProducts } from "@/lib/apis/product";
import { saveStockAdjust } from "@/lib/apis/stock-adjust";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { MinusCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddStockAdjust = () => {
  const [products, setProducts] = useState([]);
  const global = useSelector(selectGlobal);
  const { payload, type, stockAdjust } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    fetchData();
  }, [global.action]);

  console.log("form", form.getFieldsValue());


  const fetchData = async () => {
    const products = await getDashboardProducts();
    setProducts(products.data);
  };

  const handleSubmit = async (values: any) => {
    try {
      dispatch(setLoading({ save: true }));

      const res = await saveStockAdjust(values);

      if (!res.success) {
        errorNotification({ message: res.message });
        return;
      }

      successNotification({ message: res.message });
      dispatch(setAction({}));
    } catch (error: any) {
      errorNotification({ message: error.message || "Something went wrong" });
    } finally {
      dispatch(setLoading({ save: false }));
    }
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
    form.resetFields();
  };

  const resetFormData = () => {
    if (payload?.id) {
      form.setFieldsValue(payload);
    } else {
      form.resetFields();
      dispatch(setLoading({ loading: false }));
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-semibold">
          {type === ActionType.UPDATE
            ? "Update Stock Adjustment"
            : "Create Stock Adjustment"}
        </span>
      }
      width={900}
      zIndex={1050}
      open={
        stockAdjust &&
        (type === ActionType.CREATE || type === ActionType.UPDATE)
      }
      onCancel={handleClose}
      footer={
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button size="large" onClick={resetFormData} style={{ borderRadius: "var(--button-border-radius)" }}>
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
            {payload?.id ? "Update" : "Save"}
          </Button>
        </div>
      }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError={true}

        className="mt-6"
      >
        {/* Basic Settings */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Adjustment Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="type"
              label="Adjustment Type"
              rules={[
                {
                  required: true,
                  message: "Type is required",
                },
              ]}
              className="!mb-0"
            >
              <Select placeholder="Select type" size="large" showSearch allowClear>
                <Select.Option value="Add">Add Stock</Select.Option>
                <Select.Option value="Subtract">Subtract Stock</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="productId"
              label="Product"
              rules={[
                {
                  required: true,
                  message: "Product is required",
                },
              ]}
              className="!mb-0"
            >
              <Select
                showSearch
                allowClear
                placeholder="Search and select product"
                size="large"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as any)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                onChange={(v) => {
                  const findProduct = products.find((item: any) => item.id === v);
                  form.setFieldsValue(findProduct ?? { productVariants: [] });
                }}
              >
                {(products || []).map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>

        {/* Product Variants Table */}
        {/* {form.getFieldsValue().productVariants && ( */}
        <Form.List name="productVariants">
          {(fields, { add, remove }) => (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Product Variants
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 border-b font-semibold text-gray-700">Color</th>
                      <th className="text-left p-3 border-b font-semibold text-gray-700">Size</th>
                      <th className="text-left p-3 border-b font-semibold text-gray-700">Unit Price</th>
                      <th className="text-left p-3 border-b font-semibold text-gray-700">Purchase Price</th>
                      <th className="text-left p-3 border-b font-semibold text-gray-700">Stock Qty</th>
                      <th className="text-left p-3 border-b font-semibold text-gray-700">
                        <span className="text-red-500">* </span>Qty
                      </th>
                      <th className="text-left p-3 border-b font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map(({ key, name, ...restField }) => (
                      <tr key={key} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 border-b" hidden>
                          <Form.Item {...restField} name={[name, "id"]} className="!mb-0">
                            <Input />
                          </Form.Item>
                        </td>

                        {/* Read-only display values */}
                        <td className="p-3 border-b">
                          <Form.Item {...restField} name={[name, "color"]} className="!mb-0">
                            <span className="text-gray-600">
                              {form.getFieldValue([
                                "productVariants",
                                name,
                                "color",
                              ])?.name ?? "-"}
                            </span>
                          </Form.Item>
                        </td>

                        <td className="p-3 border-b">
                          <Form.Item {...restField} name={[name, "size"]} className="!mb-0">
                            <span className="text-gray-600">
                              {form.getFieldValue([
                                "productVariants",
                                name,
                                "size",
                              ])?.name ?? "-"}
                            </span>
                          </Form.Item>
                        </td>

                        <td className="p-3 border-b">
                          <Form.Item {...restField} name={[name, "unitPrice"]} className="!mb-0">
                            <span className="text-gray-600">
                              {formatPrice(form.getFieldValue([
                                "productVariants",
                                name,
                                "unitPrice",
                              ])) ?? "-"}
                            </span>
                          </Form.Item>
                        </td>

                        <td className="p-3 border-b">
                          <Form.Item
                            {...restField}
                            name={[name, "purchasePrice"]}
                            className="!mb-0"
                          >
                            <span className="text-gray-600">
                              {formatPrice(form.getFieldValue([
                                "productVariants",
                                name,
                                "purchasePrice",
                              ])) ?? "-"}
                            </span>
                          </Form.Item>
                        </td>

                        <td className="p-3 border-b">
                          <Form.Item {...restField} name={[name, "stockQty"]} className="!mb-0">
                            <span className="font-semibold text-blue-600">
                              {formatPrice(form.getFieldValue([
                                "productVariants",
                                name,
                                "stockQty",
                              ])) ?? "-"}
                            </span>
                          </Form.Item>
                        </td>

                        {/* Editable input for qty */}
                        <td className="p-3 border-b">
                          <Form.Item
                            {...restField}
                            name={[name, "qty"]}
                            rules={[
                              { required: true, message: "Qty is required" },
                            ]}
                            className="!mb-0"
                          >
                            <InputNumber
                              placeholder="Enter Qty"
                              min={1}
                              className="!w-full"
                              size="large"
                            />
                          </Form.Item>
                        </td>

                        <td className="p-3 border-b text-center">
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            className="text-red-500 hover:text-red-700 cursor-pointer text-lg"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Form.List>
        {/* )} */}
      </Form>
    </Modal>
  );
};

export default AddStockAdjust;
