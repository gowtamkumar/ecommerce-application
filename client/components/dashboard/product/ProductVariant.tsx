import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import React from "react";

export default function ProductVariant({ formValues, form, sizes }: any) {
  return (
    <div>
      {formValues.variant && (
        <div>
          <Form.List name="productVariants">
            {(fields, { add, remove }) => (
              <div>
                <div className="grid grid-cols-4 justify-center items-center gap-1">
                  <div className="col-span-3">
                    <Divider
                      orientation="center"
                      style={{ margin: "0px", padding: "0px" }}
                    >
                      Product Variants
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
                  <thead className="mb-1">
                    <tr className="text-start">
                      <th className="text-start w-1/6">
                        <label className="text-red-500">*</label>Unit Price
                      </th>
                      <th className="text-start w-1/6">
                        <label className="text-red-500">*</label>Purchase Price
                      </th>
                      <th className="text-start w-1/6">Size</th>
                      <th className="text-start w-1/6">
                        <label className="text-red-500">*</label>Qty
                      </th>
                      <th className="text-start w-1/6">Default</th>
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
                            name={[name, "unitPrice"]}
                            rules={[{ required: true, message: "Unit Price" }]}
                          >
                            <InputNumber placeholder="Unit Price" min={1} />
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
                            <InputNumber placeholder="Purchase Price" min={1} />
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item {...restField} name={[name, "sizeId"]}>
                            <Select allowClear showSearch placeholder="Select">
                              {(sizes || []).map((item: any) => (
                                <Select.Option key={item.id} value={item.id}>
                                  {`${item.id} ${item.name}`}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item
                            {...restField}
                            name={[name, "stockQty"]}
                            rules={[{ required: true, message: "Stock Qty" }]}
                          >
                            <InputNumber placeholder="Enter" min={1} />
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item
                            {...restField}
                            name={[name, "default"]}
                            valuePropName="checked"
                          >
                            <Checkbox
                              onChange={(e) => {
                                if (e.target.checked) {
                                  fields.forEach((field, index) => {
                                    if (index !== key) {
                                      form.setFields([
                                        {
                                          name: [
                                            "productVariants",
                                            index,
                                            "default",
                                          ],
                                          value: false,
                                        },
                                      ]);
                                    }
                                  });
                                }
                              }}
                            />
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
      )}
    </div>
  );
}

{/* {formValues.variant && (
          <div>
            <Form.List name="productVariants">
              {(fields, { add, remove }) => (
                <div>
                  <div className="grid grid-cols-4 justify-center items-center gap-1">
                    <div className="col-span-3">
                      <Divider
                        orientation="center"
                        style={{ margin: "0px", padding: "0px" }}
                      >
                        Product Variants
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
                    <thead className="mb-1">
                      <tr className="text-start">
                        <th className="text-start w-1/6">
                          <label className="text-red-500">*</label>Unit Price
                        </th>
                        <th className="text-start w-1/6">
                          <label className="text-red-500">*</label>Purchase
                          Price
                        </th>
                        <th className="text-start w-1/6">Size</th>
                        <th className="text-start w-1/6">
                          <label className="text-red-500">*</label>Qty
                        </th>
                        <th className="text-start w-1/6">Default</th>
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
                              name={[name, "unitPrice"]}
                              rules={[
                                { required: true, message: "Unit Price" },
                              ]}
                            >
                              <InputNumber placeholder="Unit Price" min={1} />
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
                            <Form.Item {...restField} name={[name, "sizeId"]}>
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
                            <Form.Item
                              {...restField}
                              name={[name, "stockQty"]}
                              rules={[{ required: true, message: "Stock Qty" }]}
                            >
                              <InputNumber placeholder="Enter" min={1} />
                            </Form.Item>
                          </td>
                          <td>
                            <Form.Item
                              {...restField}
                              name={[name, "default"]}
                              valuePropName="checked"
                            >
                              <Checkbox
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    fields.forEach((field, index) => {
                                      if (index !== key) {
                                        form.setFields([
                                          {
                                            name: [
                                              "productVariants",
                                              index,
                                              "default",
                                            ],
                                            value: false,
                                          },
                                        ]);
                                      }
                                    });
                                  }
                                }}
                              />
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
        )} */}

