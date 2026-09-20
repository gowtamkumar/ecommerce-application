"use client";

import { getImageUrl } from "@/lib/utils/imageUrl";
import {
    AppstoreOutlined,
    CheckCircleFilled,
    ClearOutlined,
    DeploymentUnitOutlined,
    GlobalOutlined,
    SelectOutlined,
    ShoppingOutlined,
    SkinOutlined,
    TagsOutlined
} from "@ant-design/icons";
import { Button, Card, Form, FormInstance, Select, Space, Tag, Typography } from "antd";
import Image from "next/image";
import { useMemo } from "react";

const { Text, Title } = Typography;

export interface DiscountScopeRenderProps {
  scope?: "Global" | "Product" | "Products" | "Category" | "Brand" | string;
  form: FormInstance;
  products: any[];
  categories: any[];
  brands: any[];
}

export default function DiscountScopeRender({
  scope,
  form,
  products = [],
  categories = [],
  brands = [],
}: DiscountScopeRenderProps) {
  const watchedApplicableProducts = Form.useWatch("applicableProducts", form);
  const watchedApplicableCategories = Form.useWatch("applicableCategories", form);
  const watchedApplicableBrands = Form.useWatch("applicableBrands", form);

  // Memoized options for select dropdowns
  const productOptions = useMemo(
    () =>
      (products || []).map((item: any) => ({
        value: item.id,
        label: `${item.name}${item.sku ? ` (${item.sku})` : ""}`,
        item,
      })),
    [products]
  );

  const categoryOptions = useMemo(
    () =>
      (categories || []).map((item: any) => ({
        value: item.id,
        label: item.name,
        item,
      })),
    [categories]
  );

  const brandOptions = useMemo(
    () =>
      (brands || []).map((item: any) => ({
        value: item.id,
        label: item.name,
        item,
      })),
    [brands]
  );

  // Selected single product resolution
  const singleProductId = Array.isArray(watchedApplicableProducts)
    ? watchedApplicableProducts[0]
    : watchedApplicableProducts;

  const selectedSingleProduct = useMemo(
    () => products?.find((p: any) => p.id === singleProductId),
    [products, singleProductId]
  );

  // Quick actions
  const handleSelectAllProducts = () => {
    form.setFieldsValue({
      applicableProducts: products.map((p: any) => p.id),
    });
  };

  const handleClearProducts = () => {
    form.setFieldsValue({ applicableProducts: [] });
  };

  const handleSelectAllCategories = () => {
    form.setFieldsValue({
      applicableCategories: categories.map((c: any) => c.id),
    });
  };

  const handleClearCategories = () => {
    form.setFieldsValue({ applicableCategories: [] });
  };

  const handleSelectAllBrands = () => {
    form.setFieldsValue({
      applicableBrands: brands.map((b: any) => b.id),
    });
  };

  const handleClearBrands = () => {
    form.setFieldsValue({ applicableBrands: [] });
  };

  // 1. GLOBAL SCOPE COMPONENT
  if (scope === "Global") {
    return (
      <Card
        title={
          <Space className="py-1">
            <div className="p-2 bg-purple-50 rounded-lg">
              <GlobalOutlined className="text-purple-600 text-lg" />
            </div>
            <div>
              <span className="text-base font-bold text-gray-800">
                Scope: Global (Store-Wide)
              </span>
              <Tag color="purple" className="ml-2 font-semibold rounded-full px-2.5">
                All Products
              </Tag>
            </div>
          </Space>
        }
        className="shadow-sm border-gray-100 rounded-2xl overflow-hidden mb-6"
      >
        <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 shrink-0 text-xl font-bold">
              ✓
            </div>
            <div className="space-y-2 flex-1">
              <h4 className="text-base font-bold text-gray-900">
                Automatic Catalog-Wide Discount
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                This discount campaign is configured as <strong>Global</strong>. It will be applied automatically across all products, categories, and brands throughout your online store without requiring specific item selection.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="bg-white p-3 rounded-lg border border-purple-100 flex items-center gap-2 text-xs font-semibold text-gray-700 shadow-2xs">
                  <CheckCircleFilled className="text-emerald-500" />
                  <span>All Catalog Items ({products.length} Products)</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-purple-100 flex items-center gap-2 text-xs font-semibold text-gray-700 shadow-2xs">
                  <CheckCircleFilled className="text-emerald-500" />
                  <span>Automatically includes new arrivals</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-purple-100 flex items-center gap-2 text-xs font-semibold text-gray-700 shadow-2xs">
                  <CheckCircleFilled className="text-emerald-500" />
                  <span>No manual item tagging needed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // 2. SINGLE PRODUCT SCOPE COMPONENT
  if (scope === "Product") {
    return (
      <Card
        title={
          <Space className="py-1">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <SkinOutlined className="text-emerald-600 text-lg" />
            </div>
            <div>
              <span className="text-base font-bold text-gray-800">
                Scope: Single Product
              </span>
              <Tag color="green" className="ml-2 font-semibold rounded-full px-2.5">
                1 Specific Item
              </Tag>
            </div>
          </Space>
        }
        className="shadow-sm border-gray-100 rounded-2xl overflow-hidden mb-6"
      >
        <div className="space-y-6">
          <Form.Item
            name="applicableProducts"
            label={
              <span className="font-semibold text-gray-700">
                Choose Target Product <span className="text-red-500">*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Please select a product for this discount",
              },
            ]}
            getValueProps={(val) => ({
              value: Array.isArray(val) ? val[0] : val,
            })}
            getValueFromEvent={(val) => (val !== undefined && val !== null ? [val] : [])}
            className="mb-0"
          >
            <Select
              showSearch
              allowClear
              placeholder="Search and select a single product by title, SKU..."
              size="large"
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
              }
              options={productOptions}
            />
          </Form.Item>

          {/* Selected Product Preview Card */}
          {selectedSingleProduct ? (
            <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-xl p-4 sm:p-5 transition-all">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-100">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircleFilled className="text-emerald-600" />
                  Target Product Configured
                </span>
                <Button
                  type="text"
                  size="small"
                  danger
                  onClick={handleClearProducts}
                  className="text-xs font-medium"
                >
                  Change Product
                </Button>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-white border border-gray-200/80 p-1 shrink-0 overflow-hidden relative shadow-2xs">
                  <Image
                    src={getImageUrl(
                      selectedSingleProduct?.thumbnailImage || selectedSingleProduct?.image
                    )}
                    alt={selectedSingleProduct.name || "Product"}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm truncate">
                    {selectedSingleProduct.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {selectedSingleProduct.sku && (
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-700">
                        SKU: {selectedSingleProduct.sku}
                      </span>
                    )}
                    {selectedSingleProduct.category?.name && (
                      <Tag color="orange" className="mr-0 rounded-full">
                        {selectedSingleProduct.category.name}
                      </Tag>
                    )}
                    {selectedSingleProduct.brand?.name && (
                      <Tag color="cyan" className="mr-0 rounded-full">
                        {selectedSingleProduct.brand.name}
                      </Tag>
                    )}
                  </div>
                  <div className="pt-1 text-xs font-medium text-emerald-700">
                    Discount will only apply to this product at checkout.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-5 text-center text-xs text-gray-500">
              Select a product from the dropdown above to view its details and link this discount.
            </div>
          )}
        </div>
      </Card>
    );
  }

  // 3. MULTIPLE PRODUCTS SCOPE COMPONENT
  if (scope === "Products") {
    const selectedCount = Array.isArray(watchedApplicableProducts)
      ? watchedApplicableProducts.length
      : 0;

    return (
      <Card
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1 w-full">
            <Space>
              <div className="p-2 bg-blue-50 rounded-lg">
                <ShoppingOutlined className="text-blue-600 text-lg" />
              </div>
              <div>
                <span className="text-base font-bold text-gray-800">
                  Scope: Multiple Products
                </span>
                <Tag color="blue" className="ml-2 font-semibold rounded-full px-2.5">
                  {selectedCount} Selected
                </Tag>
              </div>
            </Space>

            <div className="flex items-center gap-2">
              <Button
                size="small"
                icon={<SelectOutlined />}
                onClick={handleSelectAllProducts}
                className="text-xs text-blue-600 border-blue-200 hover:border-blue-400"
              >
                Select All ({products.length})
              </Button>
              {selectedCount > 0 && (
                <Button
                  size="small"
                  icon={<ClearOutlined />}
                  onClick={handleClearProducts}
                  className="text-xs text-gray-500 hover:text-red-600"
                >
                  Clear Selection
                </Button>
              )}
            </div>
          </div>
        }
        className="shadow-sm border-gray-100 rounded-2xl overflow-hidden mb-6"
      >
        <div className="space-y-4">
          <Form.Item
            name="applicableProducts"
            label={
              <span className="font-semibold text-gray-700">
                Select Eligible Products <span className="text-red-500">*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Please select at least one product for this discount",
              },
            ]}
            className="mb-0"
          >
            <Select
              showSearch
              allowClear
              placeholder="Search and choose products..."
              mode="multiple"
              size="large"
              optionFilterProp="label"
              maxTagCount="responsive"
              filterOption={(input, option) =>
                (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
              }
              options={productOptions}
            />
          </Form.Item>

          {/* Quick Stats or Preview */}
          {selectedCount > 0 && (
            <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-3.5 flex items-center justify-between text-xs text-blue-800">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircleFilled className="text-blue-600 text-sm" />
                <span>
                  <strong>{selectedCount}</strong> product{selectedCount > 1 ? "s" : ""} currently linked to this discount campaign.
                </span>
              </span>
              <span className="text-gray-400 font-mono text-[11px]">
                {((selectedCount / (products.length || 1)) * 100).toFixed(0)}% of catalog
              </span>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // 4. CATEGORY SCOPE COMPONENT
  if (scope === "Category") {
    const selectedCount = Array.isArray(watchedApplicableCategories)
      ? watchedApplicableCategories.length
      : 0;

    return (
      <Card
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1 w-full">
            <Space>
              <div className="p-2 bg-orange-50 rounded-lg">
                <AppstoreOutlined className="text-orange-600 text-lg" />
              </div>
              <div>
                <span className="text-base font-bold text-gray-800">
                  Scope: Category
                </span>
                <Tag color="orange" className="ml-2 font-semibold rounded-full px-2.5">
                  {selectedCount} Categories
                </Tag>
              </div>
            </Space>

            <div className="flex items-center gap-2">
              <Button
                size="small"
                icon={<SelectOutlined />}
                onClick={handleSelectAllCategories}
                className="text-xs text-orange-600 border-orange-200 hover:border-orange-400"
              >
                Select All ({categories.length})
              </Button>
              {selectedCount > 0 && (
                <Button
                  size="small"
                  icon={<ClearOutlined />}
                  onClick={handleClearCategories}
                  className="text-xs text-gray-500 hover:text-red-600"
                >
                  Clear Selection
                </Button>
              )}
            </div>
          </div>
        }
        className="shadow-sm border-gray-100 rounded-2xl overflow-hidden mb-6"
      >
        <div className="space-y-4">
          <Form.Item
            name="applicableCategories"
            label={
              <span className="font-semibold text-gray-700">
                Select Eligible Categories <span className="text-red-500">*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Please select at least one category",
              },
            ]}
            className="mb-0"
          >
            <Select
              showSearch
              allowClear
              placeholder="Search and choose product categories..."
              mode="multiple"
              size="large"
              optionFilterProp="label"
              maxTagCount="responsive"
              filterOption={(input, option) =>
                (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
              }
              options={categoryOptions}
            />
          </Form.Item>

          {selectedCount > 0 && (
            <div className="bg-orange-50/40 border border-orange-100 rounded-xl p-3.5 flex items-center justify-between text-xs text-orange-800">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircleFilled className="text-orange-600 text-sm" />
                <span>
                  All products belonging to the <strong>{selectedCount}</strong> selected categor{selectedCount > 1 ? "ies" : "y"} will automatically receive this discount.
                </span>
              </span>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // 5. BRAND SCOPE COMPONENT
  if (scope === "Brand") {
    const selectedCount = Array.isArray(watchedApplicableBrands)
      ? watchedApplicableBrands.length
      : 0;

    return (
      <Card
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1 w-full">
            <Space>
              <div className="p-2 bg-cyan-50 rounded-lg">
                <TagsOutlined className="text-cyan-600 text-lg" />
              </div>
              <div>
                <span className="text-base font-bold text-gray-800">
                  Scope: Brand
                </span>
                <Tag color="cyan" className="ml-2 font-semibold rounded-full px-2.5">
                  {selectedCount} Brands
                </Tag>
              </div>
            </Space>

            <div className="flex items-center gap-2">
              <Button
                size="small"
                icon={<SelectOutlined />}
                onClick={handleSelectAllBrands}
                className="text-xs text-cyan-600 border-cyan-200 hover:border-cyan-400"
              >
                Select All ({brands.length})
              </Button>
              {selectedCount > 0 && (
                <Button
                  size="small"
                  icon={<ClearOutlined />}
                  onClick={handleClearBrands}
                  className="text-xs text-gray-500 hover:text-red-600"
                >
                  Clear Selection
                </Button>
              )}
            </div>
          </div>
        }
        className="shadow-sm border-gray-100 rounded-2xl overflow-hidden mb-6"
      >
        <div className="space-y-4">
          <Form.Item
            name="applicableBrands"
            label={
              <span className="font-semibold text-gray-700">
                Select Eligible Brands <span className="text-red-500">*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Please select at least one brand",
              },
            ]}
            className="mb-0"
          >
            <Select
              showSearch
              allowClear
              placeholder="Search and choose brands..."
              mode="multiple"
              size="large"
              optionFilterProp="label"
              maxTagCount="responsive"
              filterOption={(input, option) =>
                (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
              }
              options={brandOptions}
            />
          </Form.Item>

          {selectedCount > 0 && (
            <div className="bg-cyan-50/40 border border-cyan-100 rounded-xl p-3.5 flex items-center justify-between text-xs text-cyan-800">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircleFilled className="text-cyan-600 text-sm" />
                <span>
                  All products under the <strong>{selectedCount}</strong> selected brand{selectedCount > 1 ? "s" : ""} will automatically receive this discount.
                </span>
              </span>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // 6. DEFAULT / UNSELECTED SCOPE PLACEHOLDER
  return (
    <Card className="shadow-sm border-dashed border-gray-200 rounded-2xl overflow-hidden mb-6 bg-gray-50/40">
      <div className="py-8 px-4 text-center max-w-md mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto text-xl shadow-2xs">
          <DeploymentUnitOutlined />
        </div>
        <h4 className="font-bold text-gray-800 text-base">
          Configure Discount Applicability
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          Please select a <strong>Scope</strong> (Global, Single Product, Multiple Products, Category, or Brand) in the General Information section above to render the targeting configuration.
        </p>
      </div>
    </Card>
  );
}

