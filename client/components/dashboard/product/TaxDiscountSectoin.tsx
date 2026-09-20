import { Form, Select, Tag } from "antd";
import { FiPercent, FiTag } from "react-icons/fi";

export default function TaxDiscountSectoin({ discounts, taxs }: any) {
  const selectedTaxId = Form.useWatch("taxId");
  const selectedDiscountId = Form.useWatch("discountId");

  const selectedTax = (taxs || []).find((t: any) => t.id === selectedTaxId);
  const selectedDiscount = (discounts || []).find(
    (d: any) => d.id === selectedDiscountId
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Tax */}
      <div>
        <Form.Item
          name="taxId"
          label={
            <span className="flex items-center gap-1.5 font-medium text-global-primary text-sm">
              <FiPercent className="w-3.5 h-3.5 text-global-secondary" />
              Tax Rate <span className="text-red-500">*</span>
              {selectedTax && (
                <Tag
                  color="blue"
                  className="ml-1 text-xs py-0 px-1.5 leading-tight"
                >
                  {selectedTax.name}
                </Tag>
              )}
            </span>
          }
          rules={[{ required: true, message: "Tax is required" }]}
          className="mb-0"
        >
          <Select
            showSearch
            allowClear
            placeholder="Select a tax rate"
            size="large"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as any)
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {(taxs || []).map((item: any) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      {/* Discount */}
      <div>
        <Form.Item
          name="discountId"
          label={
            <span className="flex items-center gap-1.5 font-medium text-global-primary text-sm">
              <FiTag className="w-3.5 h-3.5 text-global-secondary" />
              Discount
              {selectedDiscount && (
                <Tag
                  color="green"
                  className="ml-1 text-xs py-0 px-1.5 leading-tight"
                >
                  {selectedDiscount.value} — {selectedDiscount.discountStrategy}
                </Tag>
              )}
            </span>
          }
          className="mb-0"
        >
          <Select
            showSearch
            allowClear
            placeholder="Select a discount (optional)"
            size="large"
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
