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
import { MinusCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Select, Space, Tag } from "antd";
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
  const productVariants = Form.useWatch("productVariants", form);

  useEffect(() => {
    fetchData();
  }, [global.action]);

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
        <Space className="text-xl font-semibold">
          <SyncOutlined className="text-blue-500" />
          <span>
            {type === ActionType.UPDATE
              ? "Update Stock Adjustment"
              : "Create Stock Adjustment"}
          </span>
        </Space>
      }
      width={900}
      zIndex={1050}
      open={
        stockAdjust &&
        (type === ActionType.CREATE || type === ActionType.UPDATE)
      }
      onCancel={handleClose}
      centered
      mask={{ closable: false }}
      forceRender
      footer={
        <div className="flex justify-end gap-3 pt-4">
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
        className="mt-6 space-y-8"
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
              <Select
                placeholder="Select action"
                size="large"
                showSearch
                allowClear
                className="hover:border-blue-400 transition-colors"
              >
                <Select.Option value="Add">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Stock In (Add)
                  </div>
                </Select.Option>
                <Select.Option value="Subtract">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Stock Out (Subtract)
                  </div>
                </Select.Option>
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
              <div className="overflow-hidden border border-gray-100 rounded-xl shadow-sm">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">Color</th>
                      <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">Size</th>
                      <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">Price (Unit/Pur.)</th>
                      <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100 text-center">Available Stock</th>
                      <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">
                        <span className="text-red-500">* </span>Adjustment Qty
                      </th>
                      <th className="text-center p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {fields.map(({ key, name, ...restField }) => (
                      <tr key={key} className="hover:bg-blue-50/30 transition-all duration-200">
                        <td className="p-4" hidden>
                          <Form.Item {...restField} name={[name, "id"]} className="!mb-0">
                            <Input />
                          </Form.Item>
                        </td>

                        {/* Read-only display values */}
                        <td className="p-4">
                          <Form.Item {...restField} name={[name, "color"]} className="!mb-0">
                            <div className="flex items-center gap-2">
                              {productVariants?.[name]?.color?.colorCode && (
                                <span
                                  className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                                  style={{ backgroundColor: productVariants[name].color.colorCode }}
                                />
                              )}
                              <span className="font-medium text-gray-700">
                                {productVariants?.[name]?.color?.name ?? "-"}
                              </span>
                            </div>
                          </Form.Item>
                        </td>

                        <td className="p-4">
                          <Form.Item {...restField} name={[name, "size"]} className="!mb-0">
                            <Tag color="blue" className="!m-0 rounded-md font-medium border-none bg-blue-50 text-blue-600">
                              {productVariants?.[name]?.size?.name ?? "Default"}
                            </Tag>
                          </Form.Item>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-gray-400">Unit: <span className="text-gray-700 font-medium">{formatPrice(productVariants?.[name]?.unitPrice) ?? "-"}</span></span>
                            <span className="text-xs text-gray-400">Pur.: <span className="text-gray-700 font-medium">{formatPrice(productVariants?.[name]?.purchasePrice) ?? "-"}</span></span>
                          </div>
                        </td>

                        <td className="p-4 text-center">
                          <Form.Item {...restField} name={[name, "stockQty"]} className="!mb-0">
                            <div className="inline-flex flex-col items-center">
                              <span className="text-lg font-bold text-gray-800 leading-tight">
                                {productVariants?.[name]?.stockQty ?? "0"}
                              </span>
                              <span className="text-[10px] text-gray-400 uppercase tracking-tight">Units</span>
                            </div>
                          </Form.Item>
                        </td>

                        {/* Editable input for qty */}
                        <td className="p-4">
                          <Form.Item
                            {...restField}
                            name={[name, "qty"]}
                            rules={[
                              { required: true, message: "Required" },
                              { type: "number", min: 1, message: "> 0" }
                            ]}
                            className="!mb-0"
                          >
                            <InputNumber
                              placeholder="0"
                              min={1}
                              className="!w-full !rounded-lg border-gray-200"
                              size="large"
                              style={{
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                                transition: "all 0.3s ease"
                              }}
                            />
                          </Form.Item>
                        </td>

                        <td className="p-4 text-center">
                          <Button
                            type="text"
                            danger
                            shape="circle"
                            icon={<MinusCircleOutlined className="text-lg" />}
                            onClick={() => remove(name)}
                            className="hover:!bg-red-50 flex items-center justify-center mx-auto"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {fields.length === 0 && (
                  <div className="p-10 text-center text-gray-400 italic bg-gray-50/30">
                    Select a product to see variants...
                  </div>
                )}
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
