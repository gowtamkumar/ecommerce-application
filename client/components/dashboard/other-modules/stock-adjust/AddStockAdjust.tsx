import { ActionType } from "@/constants/constants";
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
import { Button, Divider, Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddStockAdjust = () => {
  const [products, setProducts] = useState([]);
  const global = useSelector(selectGlobal);
  const { payload, type, stockAdjust } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

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

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };

  const tailLayout = {
    wrapperCol: { offset: 4, span: 12 },
  };

  console.log(form);

  return (
    <Modal
      title={
        type === ActionType.UPDATE
          ? "Update Stock Adjust"
          : "Create Stock Adjust"
      }
      width={800}
      zIndex={1050}
      open={
        stockAdjust &&
        (type === ActionType.CREATE || type === ActionType.UPDATE)
      }
      onCancel={handleClose}
      footer={null}
    >
      <Form
        {...layout}
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item
          name="type"
          label="Type"
          rules={[
            {
              required: true,
              message: "Type is Requried",
            },
          ]}
        >
          <Select placeholder="Select" showSearch allowClear>
            <Select.Option value="Add">Add</Select.Option>
            <Select.Option value="Subtract">Subtract</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="productId" label="Product">
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
        {form.getFieldsValue().productVariants && (
          <Form.List name="productVariants">
            {(fields, { add, remove }) => (
              <div>
                <Divider orientation="left">Variant product</Divider>
                <table width="100%">
                  <thead className="mb-1">
                    <tr className="text-start">
                      <th className="text-start w-1/6">Color</th>
                      <th className="text-start w-1/6">Size</th>
                      <th className="text-start w-1/6">Unit Price</th>
                      <th className="text-start w-1/6">Purchase Price</th>
                      <th className="text-start w-1/6">Stock Qty</th>
                      <th className="text-start w-1/6">
                        <label className="text-red-500">*</label>Qty
                      </th>
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

                        {/* Read-only display values */}
                        <td>
                          <Form.Item {...restField} name={[name, "color"]}>
                            <span>
                              {form.getFieldValue([
                                "productVariants",
                                name,
                                "color",
                              ])?.name ?? "-"}
                            </span>
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item {...restField} name={[name, "size"]}>
                            <span>
                              {form.getFieldValue([
                                "productVariants",
                                name,
                                "size",
                              ])?.name ?? "-"}
                            </span>
                          </Form.Item>
                        </td>

                        <td>
                          <Form.Item {...restField} name={[name, "unitPrice"]}>
                            <span>
                              {form.getFieldValue([
                                "productVariants",
                                name,
                                "unitPrice",
                              ]) ?? "-"}
                            </span>
                          </Form.Item>
                        </td>

                        <td>
                          <Form.Item
                            {...restField}
                            name={[name, "purchasePrice"]}
                          >
                            <span>
                              {form.getFieldValue([
                                "productVariants",
                                name,
                                "purchasePrice",
                              ]) ?? "-"}
                            </span>
                          </Form.Item>
                        </td>

                        <td>
                          <Form.Item {...restField} name={[name, "stockQty"]}>
                            <span>
                              {form.getFieldValue([
                                "productVariants",
                                name,
                                "stockQty",
                              ]) ?? "-"}
                            </span>
                          </Form.Item>
                        </td>

                        {/* Editable input for qty */}
                        <td>
                          <Form.Item
                            {...restField}
                            name={[name, "qty"]}
                            rules={[
                              { required: true, message: "Qty is required" },
                            ]}
                          >
                            <InputNumber placeholder="Enter Qty" min={1} />
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
        )}

        <Form.Item {...tailLayout}>
          <div className="flex gap-2">
            <Button size="small" onClick={resetFormData}>
              Reset
            </Button>
            <Button
              size="small"
              htmlType="submit"
              type="primary"
              loading={global.loading.save}
              disabled={global.loading.save}
            >
              {payload?.id ? "Update" : "Save"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddStockAdjust;
