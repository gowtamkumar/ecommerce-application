"use client";
import { Form, Select, Switch, TreeSelect } from "antd";
import {
    FiBell,
    FiBox,
    FiGrid,
    FiMessageSquare,
    FiRefreshCw,
    FiStar,
    FiTag,
} from "react-icons/fi";

// Toggle card for boolean product flags
function FlagToggleCard({
  name,
  icon: Icon,
  label,
  description,
}: {
  name: string;
  icon: React.ElementType;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-global-primary bg-global-secondary/5 px-3 py-2.5 gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-global-secondary/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-global-secondary" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-global-primary truncate">
            {label}
          </p>
          <p className="text-xs text-global-secondary truncate">{description}</p>
        </div>
      </div>
      <Form.Item name={name} valuePropName="checked" className="!mb-0 shrink-0">
        <Switch size="small" />
      </Form.Item>
    </div>
  );
}

export default function ProductRightTopSection({
  brands,
  categories,
  units,
  tags,
  setTags,
}: any) {
  return (
    <div className="space-y-4">
      {/* Status */}
      <Form.Item
        name="status"
        label={
          <span className="font-medium text-global-primary text-sm">
            Status <span className="text-red-500">*</span>
          </span>
        }
        rules={[{ required: true, message: "Status is required" }]}
        className="!mb-0"
      >
        <Select placeholder="Select status" size="large">
          <Select.Option value="Active">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block shrink-0" />
              Active
            </span>
          </Select.Option>
          <Select.Option value="Inactive">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block shrink-0" />
              Inactive
            </span>
          </Select.Option>
        </Select>
      </Form.Item>

      {/* Product flags — 2-col toggle cards */}
      <div>
        <p className="text-xs font-semibold text-global-secondary uppercase tracking-wide mb-2">
          Product Flags
        </p>
        <div className="grid grid-cols-1 gap-2">
          <FlagToggleCard
            name="featured"
            icon={FiStar}
            label="Featured"
            description="Show in featured section"
          />
          <FlagToggleCard
            name="isNewArrival"
            icon={FiBell}
            label="New Arrival"
            description="Tag as new arrival"
          />
          <FlagToggleCard
            name="isReturnable"
            icon={FiRefreshCw}
            label="Returnable"
            description="Allow return requests"
          />
          <FlagToggleCard
            name="enableReview"
            icon={FiMessageSquare}
            label="Enable Reviews"
            description="Allow customer reviews"
          />
        </div>
      </div>

      {/* Brand */}
      <Form.Item
        name="brandId"
        label={
          <span className="flex items-center gap-1.5 font-medium text-global-primary text-sm">
            <FiTag className="w-3.5 h-3.5 text-global-secondary" />
            Brand
          </span>
        }
        className="!mb-0"
      >
        <Select
          showSearch
          allowClear
          placeholder="Select brand"
          size="large"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as any)
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
        >
          {(brands || []).map((item: any) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Category */}
      <Form.Item
        name="productCategories"
        label={
          <span className="flex items-center gap-1.5 font-medium text-global-primary text-sm">
            <FiGrid className="w-3.5 h-3.5 text-global-secondary" />
            Category <span className="text-red-500">*</span>
          </span>
        }
        rules={[{ required: true, message: "Category is required" }]}
        className="!mb-0"
      >
        <TreeSelect
          showSearch
          style={{ width: "100%" }}
          styles={{ popup: { root: { maxHeight: 400, overflow: "auto" } } }}
          placeholder="Select categories"
          allowClear
          treeDefaultExpandAll
          treeData={categories}
          multiple
          size="large"
        />
      </Form.Item>

      {/* Unit */}
      <Form.Item
        name="unitId"
        label={
          <span className="flex items-center gap-1.5 font-medium text-global-primary text-sm">
            <FiBox className="w-3.5 h-3.5 text-global-secondary" />
            Unit <span className="text-red-500">*</span>
          </span>
        }
        rules={[{ required: true, message: "Unit is required" }]}
        className="!mb-0"
      >
        <Select
          showSearch
          allowClear
          placeholder="Select unit"
          size="large"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as any)
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
        >
          {(units || []).map((item: any) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Tags — Ant Design Select tags mode */}
      <Form.Item
        label={
          <span className="flex items-center gap-1.5 font-medium text-global-primary text-sm">
            <FiTag className="w-3.5 h-3.5 text-global-secondary" />
            Tags
          </span>
        }
        className="!mb-0"
      >
        <Select
          mode="tags"
          size="large"
          placeholder="Type and press Enter to add tags"
          value={tags}
          onChange={(values: string[]) => {
            // Deduplicate
            const unique = Array.from(new Set(values.map((v) => v.trim()).filter(Boolean)));
            setTags(unique);
          }}
          open={false}
          tokenSeparators={[","]}
          className="w-full"
        />
      </Form.Item>
    </div>
  );
}
