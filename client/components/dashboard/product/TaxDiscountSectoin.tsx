import { Form, Select } from "antd";
import React from "react";

export default function TaxDiscountSectoin({ discounts, taxs }: any) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="col-span-1">
        <Form.Item
          name="taxId"
          label="Tax"
          className="p-0"
          rules={[
            {
              required: true,
              message: "Tax is required",
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
            {(taxs || []).map((item: any) => (
              <Select.Option key={item.id} value={item.id}>
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
            {(discounts || []).map((item: any) => (
              <Select.Option key={item.id} value={item.id}>
                {`${item.value} - ${item.discountStrategy}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </div>
  );
}
