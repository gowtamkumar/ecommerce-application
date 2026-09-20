import { Form, InputNumber, Switch } from "antd";
import { FiAlertTriangle, FiDollarSign, FiLayers, FiPackage, FiShoppingCart } from "react-icons/fi";

export default function WithOutVariant({ form }: any) {
  const variant = Form.useWatch("variant", form);

  return (
    <div className="space-y-5">
      {/* Qty limits row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Form.Item
          name="limitPurchaseQty"
          label={
            <span className="flex items-center gap-1.5 font-medium text-global-primary text-sm">
              <FiShoppingCart className="w-3.5 h-3.5 text-global-secondary" />
              Max Purchase Qty
            </span>
          }
          className="mb-0"
        >
          <InputNumber
            placeholder="e.g. 10"
            className="w-full"
            size="large"
            min={1}
          />
        </Form.Item>

        <Form.Item
          name="alertQty"
          label={
            <span className="flex items-center gap-1.5 font-medium text-global-primary text-sm">
              <FiAlertTriangle className="w-3.5 h-3.5 text-global-secondary" />
              Low-Stock Alert Qty <span className="text-red-500">*</span>
            </span>
          }
          rules={[{ required: true, message: "Alert Qty is required" }]}
          className="mb-0"
        >
          <InputNumber
            placeholder="e.g. 5"
            className="w-full"
            size="large"
            min={1}
          />
        </Form.Item>
      </div>

      {/* Variant toggle card */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <FiLayers className="w-4 h-4 text-global-secondary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-global-primary">
              Enable Product Variants
            </p>
            <p className="text-xs text-global-secondary mt-0.5">
              Toggle to add size, color, and material options with separate stock
            </p>
          </div>
        </div>
        <Form.Item
          name="variant"
          valuePropName="checked"
          className="mb-0 shrink-0"
        >
          <Switch />
        </Form.Item>
      </div>

      {/* Simple pricing — shown when variant is OFF */}
      {!variant && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Form.Item
            name="purchasePrice"
            label={
              <span className="flex items-center gap-1.5 font-medium text-global-primary text-sm">
                <FiDollarSign className="w-3.5 h-3.5 text-global-secondary" />
                Purchase Price <span className="text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "Purchase price is required" }]}
            className="mb-0"
          >
            <InputNumber
              placeholder="0.00"
              className="w-full"
              size="large"
              min={0}
              step={0.01}
              prefix="$"
            />
          </Form.Item>

          <Form.Item
            name="unitPrice"
            label={
              <span className="flex items-center gap-1.5 font-medium text-global-primary text-sm">
                <FiDollarSign className="w-3.5 h-3.5 text-global-secondary" />
                Selling Price <span className="text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "Unit price is required" }]}
            className="mb-0"
          >
            <InputNumber
              placeholder="0.00"
              className="w-full"
              size="large"
              min={0}
              step={0.01}
              prefix="$"
            />
          </Form.Item>

          <Form.Item
            name="stockQty"
            label={
              <span className="flex items-center gap-1.5 font-medium text-global-primary text-sm">
                <FiPackage className="w-3.5 h-3.5 text-global-secondary" />
                Stock Qty <span className="text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "Stock Qty is required" }]}
            className="mb-0"
          >
            <InputNumber
              placeholder="0"
              className="w-full"
              size="large"
              min={0}
            />
          </Form.Item>
        </div>
      )}
    </div>
  );
}
