"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { getProduct } from "@/lib/apis/admin/product";
import { ProductType } from "@/lib/types/product";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { EditOutlined, EyeOutlined, RocketOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Image, Spin, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

interface ProductDetailsProps {
  productId: string;
}

const ProductDetails = ({ productId }: ProductDetailsProps) => {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProduct(productId);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="min-w-0 flex-1">
          <Title level={2} className="!mb-1 break-words !text-xl sm:!text-2xl font-bold">{product.name}</Title>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Text type="secondary" className="break-all text-xs">Product Slug: {product.slug}</Text>
           
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {product.slug && (
            <>
              <Button
                icon={<EyeOutlined />}
                href={`/products/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
                style={{ borderRadius: "var(--button-border-radius)" }}
              >
                View Live Product
              </Button>
              <Button
                icon={<RocketOutlined />}
                href={`/landing/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 border-amber-300 text-amber-700 hover:!border-amber-400 hover:!text-amber-800 bg-amber-50"
                style={{ borderRadius: "var(--button-border-radius)" }}
              >
                Ads Landing Page
              </Button>
            </>
          )}
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => router.push(`/dashboard/product/${productId}/edit`)}
            className="shrink-0"
            style={{ borderRadius: "var(--button-border-radius)" }}
          >
            Edit Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="overflow-hidden">
            <Image
              src={getUploadImageUrl(product.thumbnailImage)}
              fallback="/default-placeholder.png"
              alt={product.name}
              className="w-full object-cover rounded-lg"
            />
          </Card>
          <div className="grid grid-cols-4 gap-2">
            {product.images?.map((img, idx) => (
              <div key={idx} className="border rounded-lg overflow-hidden">
                <Image
                  src={getUploadImageUrl(img)}
                  fallback="/default-placeholder.png"
                  alt={`${product.name} - ${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card title="Basic Information" variant="borderless" className="shadow-sm">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Product Type" span={2}>{product.type || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Brand">{product.brand?.name || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Unit">{product.unit?.name || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Tax">
                {product.tax ? (
                  <Tag color="orange" className="font-medium">
                    {product.tax.name} (+{product.tax.value || 0}%)
                  </Tag>
                ) : (
                  <span className="text-gray-400">No Tax (0%)</span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Discount">
                {product.discount ? (
                  <Tag color="red" className="font-medium">
                    {product.discount.name || "Discount"} (
                    {product.discount.discountStrategy === "Percentage"
                      ? `${product.discount.value}% OFF`
                      : `${formatPrice(product.discount.value || 0)} OFF`}
                    )
                  </Tag>
                ) : (
                  <span className="text-gray-400">No Discount</span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={2}>
                <Tag color={product.status === "Active" ? "green" : "red"}>
                  {product.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Enable Reviews" span={2}>
                <Tag color={product.enableReview ? "blue" : "default"}>
                  {product.enableReview ? "Enabled" : "Disabled"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Description */}
          <Card title="Description" variant="borderless" className="shadow-sm">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Full Description">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </Descriptions.Item>
              <Descriptions.Item label="Short Description">
                {product.shortDescription || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Inventory Settings */}
          <Card title="Inventory Settings" variant="borderless" className="shadow-sm">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Alert Quantity">
                <Tag color="orange">{product.alertQty || 0}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Purchase Limit">
                <Tag color="purple">{product.limitPurchaseQty || "Unlimited"}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Categories */}
          {product.productCategories && product.productCategories.length > 0 && (
            <Card title="Categories" variant="borderless" className="shadow-sm">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Category Names">
                  {product.productCategories.map((cat, idx) => (
                    <Tag key={idx} color="cyan">{cat.category?.name}</Tag>
                  ))}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <Card title="Tags" variant="borderless" className="shadow-sm">
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
              </div>
            </Card>
          )}

          {/* Product Variants & Price Calculation */}
          {product.productVariants && product.productVariants.length > 0 && (() => {
            const taxRate = Number(product.tax?.value) || 0;
            const hasTax = taxRate > 0;
            const discountVal = Number(product.discount?.value) || 0;
            const discountStrategy = product.discount?.discountStrategy || "Percentage";
            const hasDiscount = discountVal > 0;

            const calculateVariant = (unitPrice: number, purchasePrice: number = 0) => {
              const basePrice = Number(unitPrice) || 0;
              const cost = Number(purchasePrice) || 0;

              let discountAmount = 0;
              if (hasDiscount) {
                if (discountStrategy === "Percentage") {
                  discountAmount = (basePrice * discountVal) / 100;
                } else {
                  discountAmount = Math.min(basePrice, discountVal);
                }
              }

              const priceAfterDiscount = Math.max(0, basePrice - discountAmount);
              const taxAmount = (priceAfterDiscount * taxRate) / 100;
              const finalTotal = priceAfterDiscount + taxAmount;
              const profitPerUnit = finalTotal - cost;
              const marginPercent = finalTotal > 0 ? ((profitPerUnit / finalTotal) * 100).toFixed(1) : "0.0";

              return {
                basePrice,
                cost,
                discountAmount,
                priceAfterDiscount,
                taxAmount,
                finalTotal,
                profitPerUnit,
                marginPercent,
              };
            };

            const totalStock = product.productVariants.reduce((acc, v) => acc + (Number(v.stockQty) || 0), 0);
            const totalRetailValue = product.productVariants.reduce((acc, v) => {
              const { finalTotal } = calculateVariant(v.unitPrice, v.purchasePrice);
              return acc + (finalTotal * (Number(v.stockQty) || 0));
            }, 0);
            const totalCostValue = product.productVariants.reduce((acc, v) => {
              return acc + ((Number(v.purchasePrice) || 0) * (Number(v.stockQty) || 0));
            }, 0);

            return (
              <Card
                title={
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 text-base">Product Variants & Price Breakdown</span>
                      <Tag color="blue">{product.productVariants.length} {product.productVariants.length === 1 ? "Variant" : "Variants"}</Tag>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-normal">
                      {hasDiscount && (
                        <Tag color="red" className="!mr-0">
                          Discount: {product.discount?.name || "Active"} ({discountStrategy === "Percentage" ? `${discountVal}%` : formatPrice(discountVal)} OFF)
                        </Tag>
                      )}
                      {hasTax && (
                        <Tag color="orange" className="!mr-0">
                          Tax: {product.tax?.name || "VAT"} (+{taxRate}%)
                        </Tag>
                      )}
                      <Tag color="default" className="!mr-0 text-gray-500">
                        Formula: (Unit Price - Discount) + Tax = Total
                      </Tag>
                    </div>
                  </div>
                }
                variant="borderless"
                className="shadow-sm"
              >
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-700">Variant</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Size / Color</th>
                        <th className="text-right p-3 font-semibold text-gray-700">Unit Price</th>
                        <th className="text-right p-3 font-semibold text-gray-700">
                          Discount
                          {hasDiscount && (
                            <span className="block text-[11px] font-normal text-red-500">
                              (-{discountStrategy === "Percentage" ? `${discountVal}%` : formatPrice(discountVal)})
                            </span>
                          )}
                        </th>
                        <th className="text-right p-3 font-semibold text-gray-700">
                          Tax
                          {hasTax && (
                            <span className="block text-[11px] font-normal text-amber-600">
                              (+{taxRate}%)
                            </span>
                          )}
                        </th>
                        <th className="text-right p-3 font-semibold text-emerald-800 bg-emerald-50/60">
                          Total Price
                          <span className="block text-[11px] font-normal text-emerald-600">(Final Selling)</span>
                        </th>
                        <th className="text-right p-3 font-semibold text-gray-700">Cost (Purchase)</th>
                        <th className="text-right p-3 font-semibold text-gray-700">Est. Profit</th>
                        <th className="text-center p-3 font-semibold text-gray-700">Stock Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {product.productVariants.map((variant) => {
                        const calc = calculateVariant(variant.unitPrice, variant.purchasePrice);
                        const isLowStock = Number(variant.stockQty || 0) <= (Number(product.alertQty) || 0);

                        return (
                          <tr key={variant.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="p-3">
                              <Tag color="geekblue" className="font-mono">#{variant.id}</Tag>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col gap-0.5">
                                {variant.size?.name || variant.sizeId ? (
                                  <span className="font-medium text-gray-800">
                                    Size: {variant.size?.name || variant.sizeId}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-xs">Standard</span>
                                )}
                                {variant.color && (
                                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                                    {variant.color.color && (
                                      <span
                                        className="w-3 h-3 rounded-full border border-gray-300 inline-block shrink-0"
                                        style={{ backgroundColor: variant.color.color }}
                                      />
                                    )}
                                    {variant.color.name}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-right font-medium text-gray-800">
                              {formatPrice(calc.basePrice)}
                            </td>
                            <td className="p-3 text-right">
                              {calc.discountAmount > 0 ? (
                                <div>
                                  <span className="font-medium text-red-600">
                                    -{formatPrice(calc.discountAmount)}
                                  </span>
                                  <div className="text-[11px] text-gray-400">
                                    Sub: {formatPrice(calc.priceAfterDiscount)}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              {calc.taxAmount > 0 ? (
                                <span className="font-medium text-amber-700">
                                  +{formatPrice(calc.taxAmount)}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="p-3 text-right bg-emerald-50/40">
                              <span className="text-base font-bold text-emerald-700">
                                {formatPrice(calc.finalTotal)}
                              </span>
                            </td>
                            <td className="p-3 text-right text-gray-600">
                              {formatPrice(calc.cost)}
                            </td>
                            <td className="p-3 text-right">
                              <div className={calc.profitPerUnit >= 0 ? "text-emerald-700" : "text-red-600"}>
                                <span className="font-semibold">{formatPrice(calc.profitPerUnit)}</span>
                                <div className="text-[11px] text-gray-500">
                                  {calc.marginPercent}% margin
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <Tag color={isLowStock ? "red" : "green"}>
                                {variant.stockQty || 0} units
                              </Tag>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50/80 border-t font-medium text-xs text-gray-700">
                      <tr>
                        <td colSpan={2} className="p-3 font-semibold text-gray-800">
                          Total ({product.productVariants.length} variants)
                        </td>
                        <td colSpan={3} className="p-3 text-right text-gray-500">
                          Combined Inventory Value:
                        </td>
                        <td className="p-3 text-right text-sm font-bold text-emerald-800 bg-emerald-50/60">
                          {formatPrice(totalRetailValue)}
                        </td>
                        <td className="p-3 text-right text-gray-600 font-semibold">
                          {formatPrice(totalCostValue)}
                        </td>
                        <td className="p-3 text-right font-semibold text-emerald-700">
                          +{formatPrice(totalRetailValue - totalCostValue)}
                        </td>
                        <td className="p-3 text-center">
                          <Tag color="blue" className="font-semibold">{totalStock} units</Tag>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
