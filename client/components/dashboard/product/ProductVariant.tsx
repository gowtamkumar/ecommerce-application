"use client";
import { PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Checkbox,
    Form,
    Input,
    InputNumber,
    Select,
    Tag,
    Tooltip,
} from "antd";
import { FiDollarSign, FiPackage, FiTrash2 } from "react-icons/fi";

export default function ProductVariant({
  formValues,
  form,
  sizes,
  colors,
}: any) {
  const productType = Form.useWatch("type", form);
  const variants = Form.useWatch("productVariants", form);

  if (!formValues.variant) return null;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-global-primary">
            Variant Rows
          </p>
          <p className="text-xs text-global-secondary mt-0.5">
            Each row is a distinct size/color/material combination with its own
            stock & price.
          </p>
        </div>
        <Form.List name="productVariants">
          {(_, { add }) => (
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => add()}
              disabled={productType === "SimpleProduct" && variants?.length === 1}
              className="!border-gray-400 !text-gray-600 hover:!border-gray-600 hover:!text-global-primary flex items-center gap-1"
              style={{ borderRadius: "var(--button-border-radius)" }}
            >
              Add Variant
            </Button>
          )}
        </Form.List>
      </div>

      {/* Variant cards */}
      <Form.List name="productVariants">
        {(fields, { add, remove }) => (
          <div className="space-y-3">
            {fields.map(({ key, name, ...restField }, index) => (
              <div
                key={key}
                className="relative border border-gray-200 rounded-xl p-4 bg-gray-50"
              >
                {/* Variant badge + remove */}
                <div className="flex items-center justify-between mb-3">
                  <Tag
                    color="blue"
                    className="!text-xs !font-semibold !px-2 !py-0.5"
                  >
                    Variant #{index + 1}
                  </Tag>
                  {fields.length > 1 && (
                    <Tooltip title="Remove variant">
                      <button
                        type="button"
                        onClick={() => remove(name)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  )}
                </div>

                {/* Hidden id */}
                <Form.Item {...restField} name={[name, "id"]} hidden>
                  <Input />
                </Form.Item>

                {/* Price + qty row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                  <Form.Item
                    {...restField}
                    name={[name, "unitPrice"]}
                    label={
                      <span className="flex items-center gap-1 text-xs font-medium text-global-primary">
                        <FiDollarSign className="w-3 h-3 text-global-secondary" />
                        Unit Price <span className="text-red-500">*</span>
                      </span>
                    }
                    rules={[{ required: true, message: "Required" }]}
                    className="!mb-0"
                  >
                    <InputNumber
                      placeholder="0.00"
                      min={0}
                      step={0.01}
                      className="!w-full"
                      size="middle"
                      prefix="$"
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "purchasePrice"]}
                    label={
                      <span className="flex items-center gap-1 text-xs font-medium text-global-primary">
                        <FiDollarSign className="w-3 h-3 text-global-secondary" />
                        Purchase Price <span className="text-red-500">*</span>
                      </span>
                    }
                    rules={[{ required: true, message: "Required" }]}
                    className="!mb-0"
                  >
                    <InputNumber
                      placeholder="0.00"
                      min={0}
                      step={0.01}
                      className="!w-full"
                      size="middle"
                      prefix="$"
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "stockQty"]}
                    label={
                      <span className="flex items-center gap-1 text-xs font-medium text-global-primary">
                        <FiPackage className="w-3 h-3 text-global-secondary" />
                        Stock Qty <span className="text-red-500">*</span>
                      </span>
                    }
                    rules={[{ required: true, message: "Required" }]}
                    className="!mb-0"
                  >
                    <InputNumber
                      placeholder="0"
                      min={0}
                      className="!w-full"
                      size="middle"
                    />
                  </Form.Item>
                </div>

                {/* Attributes row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <Form.Item
                    {...restField}
                    name={[name, "sizeId"]}
                    label={
                      <span className="text-xs font-medium text-global-primary">
                        Size
                      </span>
                    }
                    className="!mb-0"
                  >
                    <Select allowClear showSearch placeholder="Select size" size="middle">
                      {(sizes || []).map((item: any) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "colorId"]}
                    label={
                      <span className="text-xs font-medium text-global-primary">
                        Color
                      </span>
                    }
                    className="!mb-0"
                  >
                    <Select allowClear showSearch placeholder="Select color" size="middle">
                      {(colors || []).map((item: any) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "material"]}
                    label={
                      <span className="text-xs font-medium text-global-primary">
                        Material
                      </span>
                    }
                    className="!mb-0"
                  >
                    <Input placeholder="e.g. Cotton" size="middle" />
                  </Form.Item>
                </div>

                {/* Default variant toggle */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <Form.Item
                    {...restField}
                    name={[name, "default"]}
                    valuePropName="checked"
                    className="!mb-0"
                  >
                    <Checkbox
                      onChange={(e) => {
                        if (e.target.checked) {
                          fields.forEach((field, idx) => {
                            if (idx !== key) {
                              form.setFields([
                                {
                                  name: ["productVariants", idx, "default"],
                                  value: false,
                                },
                              ]);
                            }
                          });
                        }
                      }}
                    >
                      <span className="text-xs text-global-primary font-medium">
                        Set as default variant
                      </span>
                    </Checkbox>
                  </Form.Item>
                </div>
              </div>
            ))}

            {fields.length === 0 && (
              <button
                type="button"
                onClick={() => add()}
                className="w-full rounded-xl border-2 border-dashed border-gray-300 py-6 flex flex-col items-center gap-2 text-gray-400 hover:border-gray-500 hover:text-gray-600 transition-colors"
              >
                <PlusOutlined className="text-xl" />
                <span className="text-sm font-medium">Add First Variant</span>
              </button>
            )}
          </div>
        )}
      </Form.List>
    </div>
  );
}
