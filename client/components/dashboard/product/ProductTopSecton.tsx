import { Form, Input, Tooltip } from "antd";
import { FiInfo, FiRefreshCw } from "react-icons/fi";

const formatSlug = (text: string) =>
  (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function ProductTopSecton({ form }: any) {
  return (
    <div className="space-y-1">
      {/* Name + Slug — 2-column on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Form.Item
          name="name"
          label={
            <span className="font-medium text-global-primary text-sm">
              Product Name <span className="text-red-500">*</span>
            </span>
          }
          rules={[{ required: true, message: "Product name is required" }]}
        >
          <Input
            placeholder="e.g. Premium Cotton T-Shirt"
            size="large"
            onChange={(e) => {
              const isEditing = !!form.getFieldValue("id");
              if (!isEditing || !form.getFieldValue("slug")) {
                form.setFieldsValue({ slug: formatSlug(e.target.value) });
              }
            }}
          />
        </Form.Item>

        <Form.Item
          name="slug"
          label={
            <span className="flex items-center gap-1 font-medium text-global-primary text-sm">
              URL Slug <span className="text-red-500">*</span>
              <Tooltip title="Used in the product URL (/products/[slug]). You can freely edit this, or click the sync icon to regenerate it from the product name.">
                <FiInfo className="w-3.5 h-3.5 text-global-secondary cursor-help" />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: "Slug is required" }]}
        >
          <Input
            placeholder="e.g. premium-cotton-t-shirt"
            size="large"
            className="text-global-secondary font-mono text-sm"
            onChange={(e) => {
              const formatted = e.target.value
                .toLowerCase()
                .replace(/\s+/g, "-");
              form.setFieldsValue({ slug: formatted });
            }}
            suffix={
              <Tooltip title="Regenerate slug from product name">
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => {
                    const name = form.getFieldValue("name");
                    if (name) {
                      form.setFieldsValue({ slug: formatSlug(name) });
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                  aria-label="Regenerate slug"
                >
                  <FiRefreshCw className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            }
          />
        </Form.Item>
      </div>

      {/* Short Description */}
      <Form.Item
        name="shortDescription"
        label={
          <span className="font-medium text-global-primary text-sm">
            Short Description <span className="text-red-500">*</span>
          </span>
        }
        rules={[{ required: true, message: "Short description is required" }]}
      >
        <Input.TextArea
          placeholder="Brief summary shown in product listings and search results (max 200 chars)"
          rows={4}
          showCount
          maxLength={200}
          size="large"
        />
      </Form.Item>

      {/* Full Description */}
      <Form.Item
        name="description"
        label={
          <span className="font-medium text-global-primary text-sm">
            Full Description <span className="text-red-500">*</span>
          </span>
        }
        rules={[{ required: true, message: "Description is required" }]}
      >
        <Input.TextArea
          placeholder="Detailed product description — features, materials, care instructions, etc."
          rows={6}
          size="large"
        />
      </Form.Item>
    </div>
  );
}
