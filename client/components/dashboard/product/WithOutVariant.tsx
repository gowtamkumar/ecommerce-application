import React from "react";
import { Checkbox, Form, InputNumber } from "antd";

export default function WithOutVariant({ form }: any) {
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <Form.Item name="enableReview" valuePropName="checked">
          <Checkbox>Enable Review</Checkbox>
        </Form.Item>

        <Form.Item name="limitPurchaseQty" label="Limit Purchase Qty">
          <InputNumber placeholder="Enter" className="!w-full" />
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
        >
          <InputNumber placeholder="Enter" className="!w-full" />
        </Form.Item>
      </div>
      <div className="flex justify-between">
        <Form.Item name="variant" valuePropName="checked">
          <Checkbox className="!w-full">Product Variant</Checkbox>
        </Form.Item>

        {!form.getFieldValue("variant") && (
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
              <InputNumber placeholder="Enter" className="!w-full" />
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
              <InputNumber placeholder="Enter" className="!w-full" />
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
              <InputNumber placeholder="Enter" className="!w-full" />
            </Form.Item>
          </>
        )}
      </div>
    </>
  );
}
