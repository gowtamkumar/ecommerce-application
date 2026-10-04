"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { getProduct } from "@/lib/apis/admin/product";
import { ProductType } from "@/lib/types/product";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import {
    ArrowLeftOutlined,
    CheckOutlined,
    CopyOutlined,
    EditOutlined,
    EyeOutlined,
    RocketOutlined,
} from "@ant-design/icons";
import { Button, Image, Spin, Tag, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    FiAlertCircle,
    FiBox,
    FiCheckCircle,
    FiDollarSign,
    FiLayers,
    FiShield,
    FiTag,
    FiTrendingUp
} from "react-icons/fi";

interface ProductDetailsProps {
  productId: string;
}

const ProductDetails = ({ productId }: ProductDetailsProps) => {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProduct(productId);
        if (res.data) {
          setProduct(res.data);
          setSelectedImage(res.data.thumbnailImage || res.data.images?.[0] || "");
        }
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
      <div className="flex flex-col justify-center items-center h-96 gap-3">
        <Spin size="large" />
        <span className="text-sm text-slate-500 font-medium">Loading product details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          !
        </div>
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 mt-1 text-sm">
          The requested product ID could not be loaded or may have been removed.
        </p>
        <Button
          type="primary"
          onClick={() => router.push("/dashboard/product")}
          className="mt-6"
        >
          Back to Product List
        </Button>
      </div>
    );
  }

  // Financial & Pricing Configuration
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

  const variants = product.productVariants || [];
  const totalStock = variants.reduce((acc, v) => acc + (Number(v.stockQty) || 0), 0);
  const totalRetailValue = variants.reduce((acc, v) => {
    const { finalTotal } = calculateVariant(v.unitPrice, v.purchasePrice);
    return acc + finalTotal * (Number(v.stockQty) || 0);
  }, 0);
  const totalCostValue = variants.reduce(
    (acc, v) => acc + (Number(v.purchasePrice) || 0) * (Number(v.stockQty) || 0),
    0
  );
  const totalPotentialProfit = totalRetailValue - totalCostValue;

  const firstVariantCalc =
    variants.length > 0
      ? calculateVariant(variants[0].unitPrice, variants[0].purchasePrice)
      : calculateVariant(0, 0);

  const handleCopyLink = () => {
    if (!product.slug) return;
    const url = `${window.location.origin}/products/${product.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    message.success("Live product URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* ── Top Navigation Bar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
            <button
              onClick={() => router.push("/dashboard/product")}
              className="hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeftOutlined className="text-[11px]" />
              Products
            </button>
            <span>/</span>
            <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <Tag
              color={product.status === "Active" ? "success" : "error"}
              className="!mr-0 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              {product.status || "Draft"}
            </Tag>
            {product.type && (
              <Tag color="cyan" className="!mr-0 rounded-full text-xs font-medium">
                {product.type}
              </Tag>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
            <span>Slug:</span>
            <code className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-xs">
              {product.slug || "no-slug"}
            </code>
            {product.slug && (
              <button
                onClick={handleCopyLink}
                className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 cursor-pointer ml-1"
                title="Copy live URL"
              >
                {copied ? (
                  <CheckOutlined className="text-emerald-600" />
                ) : (
                  <CopyOutlined />
                )}
                <span>{copied ? "Copied!" : "Copy URL"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
          {product.slug && (
            <>
              <Button
                icon={<EyeOutlined />}
                href={`/products/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 border-slate-300 text-slate-700 hover:border-slate-400 font-medium"
                style={{ borderRadius: "var(--button-border-radius)" }}
              >
                Live Store
              </Button>
              <Button
                icon={<RocketOutlined />}
                href={`/landing/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 border-amber-300 text-amber-800 bg-amber-50 hover:!bg-amber-100 hover:!border-amber-400 font-medium"
                style={{ borderRadius: "var(--button-border-radius)" }}
              >
                Ads Landing
              </Button>
            </>
          )}
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => router.push(`/dashboard/product/${productId}/edit`)}
            className="flex items-center gap-1.5 font-medium shadow-sm"
            style={{ borderRadius: "var(--button-border-radius)" }}
          >
            Edit Product
          </Button>
        </div>
      </div>

      {/* ── Key Metrics Overview Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Selling Price */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Final Selling Price
            </span>
            <div className="text-2xl font-bold text-emerald-700 tracking-tight">
              {formatPrice(firstVariantCalc.finalTotal)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span>Unit: {formatPrice(firstVariantCalc.basePrice)}</span>
              {hasDiscount && (
                <span className="text-red-500 font-medium">
                  (-{discountStrategy === "Percentage" ? `${discountVal}%` : formatPrice(discountVal)})
                </span>
              )}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <FiDollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Estimated Profit / Margin */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Profit Per Unit
            </span>
            <div
              className={`text-2xl font-bold tracking-tight ${
                firstVariantCalc.profitPerUnit >= 0 ? "text-slate-900" : "text-red-600"
              }`}
            >
              {formatPrice(firstVariantCalc.profitPerUnit)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Tag
                color={Number(firstVariantCalc.marginPercent) >= 20 ? "green" : "orange"}
                className="!mr-0 text-[11px] font-semibold rounded-md py-0"
              >
                {firstVariantCalc.marginPercent}% Margin
              </Tag>
              <span>Cost: {formatPrice(firstVariantCalc.cost)}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
            <FiTrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Total Inventory Stock */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Total In Stock
            </span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {totalStock}{" "}
              <span className="text-sm font-normal text-slate-500">
                {product.unit?.name || "units"}
              </span>
            </div>
            <div className="text-xs mt-1 flex items-center gap-1.5">
              {totalStock <= (Number(product.alertQty) || 0) ? (
                <span className="text-red-600 font-medium flex items-center gap-1">
                  <FiAlertCircle className="w-3.5 h-3.5" /> Low Stock Alert
                </span>
              ) : (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <FiCheckCircle className="w-3.5 h-3.5" /> Healthy Stock
                </span>
              )}
              <span className="text-slate-400">• Alert @ {product.alertQty || 0}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0">
            <FiBox className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Inventory Valuation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Inventory Valuation
            </span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatPrice(totalRetailValue)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span>Cost: {formatPrice(totalCostValue)}</span>
              <span className="text-emerald-600 font-medium">
                (+{formatPrice(totalPotentialProfit)})
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
            <FiLayers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Main Content Grid: 2 Columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media & Specifications */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Gallery Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
              <Image
                src={getUploadImageUrl(selectedImage || product.thumbnailImage)}
                fallback="/default-placeholder.png"
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Thumbnail Carousel / Grid */}
            {product.images && product.images.length > 0 && (
              <div className="mt-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Gallery ({product.images.length} images)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {product.thumbnailImage && (
                    <button
                      type="button"
                      onClick={() => setSelectedImage(product.thumbnailImage)}
                      className={`aspect-square rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                        selectedImage === product.thumbnailImage
                          ? "border-blue-600 ring-2 ring-blue-100"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <img
                        src={getUploadImageUrl(product.thumbnailImage)}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )}
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                        selectedImage === img
                          ? "border-blue-600 ring-2 ring-blue-100"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <img
                        src={getUploadImageUrl(img)}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Specifications Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FiTag className="w-4 h-4 text-blue-600" />
                Product Information
              </h3>
            </div>
            <div className="p-5 divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex justify-between items-center first:pt-0">
                <span className="text-slate-500 font-medium">Brand</span>
                <span className="font-semibold text-slate-800">
                  {product.brand?.name || <span className="text-slate-400 font-normal">—</span>}
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Product Type</span>
                <span className="font-semibold text-slate-800">
                  {product.type || <span className="text-slate-400 font-normal">Standard</span>}
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Measurement Unit</span>
                <span className="font-semibold text-slate-800">
                  {product.unit?.name || <span className="text-slate-400 font-normal">Piece</span>}
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Active Tax</span>
                {product.tax ? (
                  <Tag color="orange" className="!mr-0 font-medium">
                    {product.tax.name} (+{product.tax.value || 0}%)
                  </Tag>
                ) : (
                  <span className="text-slate-400 font-normal">No Tax (0%)</span>
                )}
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Applied Discount</span>
                {product.discount ? (
                  <Tag color="red" className="!mr-0 font-medium">
                    {product.discount.name || "Promo"} (
                    {product.discount.discountStrategy === "Percentage"
                      ? `${product.discount.value}% OFF`
                      : `${formatPrice(product.discount.value || 0)} OFF`}
                    )
                  </Tag>
                ) : (
                  <span className="text-slate-400 font-normal">No Discount</span>
                )}
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Customer Reviews</span>
                <Tag color={product.enableReview ? "blue" : "default"} className="!mr-0">
                  {product.enableReview ? "Enabled" : "Disabled"}
                </Tag>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Purchase Limit</span>
                <span className="font-medium text-slate-700">
                  {product.limitPurchaseQty ? `${product.limitPurchaseQty} per order` : "Unlimited"}
                </span>
              </div>
            </div>
          </div>

          {/* Categories & Tags */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Categories
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.productCategories && product.productCategories.length > 0 ? (
                  product.productCategories.map((cat, idx) => (
                    <Tag
                      key={idx}
                      color="cyan"
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    >
                      {cat.category?.name}
                    </Tag>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Uncategorized</span>
                )}
              </div>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <Tag
                      key={tag}
                      color="blue"
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    >
                      #{tag}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Variants Table + Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* ── Product Variants & Pricing Breakdown Table ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Header with Title & Calculation Badges */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <FiDollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-tight">
                      Product Variants & Tax/Discount Breakdown
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Live price calculations across all size and color variants.
                    </p>
                  </div>
                </div>

                <Tag color="blue" className="!mr-0 px-2.5 py-0.5 rounded-full text-xs font-semibold self-start sm:self-auto">
                  {variants.length} {variants.length === 1 ? "Variant" : "Variants"}
                </Tag>
              </div>

              {/* Formula & Rule Badges Strip */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-600">Active Pricing Rules:</span>
                {hasDiscount && (
                  <Tag color="red" className="!mr-0 font-medium">
                    Discount: {product.discount?.name || "Active"} (-
                    {discountStrategy === "Percentage"
                      ? `${discountVal}%`
                      : formatPrice(discountVal)}
                    )
                  </Tag>
                )}
                {hasTax && (
                  <Tag color="orange" className="!mr-0 font-medium">
                    Tax: {product.tax?.name || "VAT"} (+{taxRate}%)
                  </Tag>
                )}
                <Tag color="default" className="!mr-0 bg-slate-100 text-slate-600 border-slate-200">
                  Formula: (Unit Price - Discount) + Tax = Final Total
                </Tag>
              </div>
            </div>

            {/* Variants Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Variant</th>
                    <th className="py-3 px-4">Attributes</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">
                      Discount
                      {hasDiscount && (
                        <span className="block text-[10px] font-normal text-red-500 lowercase">
                          (-{discountStrategy === "Percentage" ? `${discountVal}%` : formatPrice(discountVal)})
                        </span>
                      )}
                    </th>
                    <th className="py-3 px-4 text-right">
                      Tax
                      {hasTax && (
                        <span className="block text-[10px] font-normal text-amber-600 lowercase">
                          (+{taxRate}%)
                        </span>
                      )}
                    </th>
                    <th className="py-3 px-4 text-right bg-emerald-50/70 text-emerald-800">
                      Total Price
                      <span className="block text-[10px] font-normal text-emerald-600 lowercase">
                        (final selling)
                      </span>
                    </th>
                    <th className="py-3 px-4 text-right">Cost Price</th>
                    <th className="py-3 px-4 text-right">Est. Profit</th>
                    <th className="py-3 px-4 text-center">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {variants.map((variant) => {
                    const calc = calculateVariant(variant.unitPrice, variant.purchasePrice);
                    const isLowStock =
                      Number(variant.stockQty || 0) <= (Number(product.alertQty) || 0);

                    return (
                      <tr key={variant.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <Tag color="geekblue" className="font-mono text-xs font-semibold">
                            #{variant.id}
                          </Tag>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1">
                            {variant.size?.name || variant.sizeId ? (
                              <span className="font-semibold text-slate-800 text-xs">
                                Size: {variant.size?.name || variant.sizeId}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs">Standard</span>
                            )}
                            {variant.color && (
                              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                                {variant.color.color && (
                                  <span
                                    className="w-3 h-3 rounded-full border border-slate-300 inline-block shrink-0 shadow-sm"
                                    style={{ backgroundColor: variant.color.color }}
                                  />
                                )}
                                {variant.color.name}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-slate-800">
                          {formatPrice(calc.basePrice)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {calc.discountAmount > 0 ? (
                            <div>
                              <span className="font-semibold text-red-600">
                                -{formatPrice(calc.discountAmount)}
                              </span>
                              <div className="text-[11px] text-slate-400">
                                Sub: {formatPrice(calc.priceAfterDiscount)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {calc.taxAmount > 0 ? (
                            <span className="font-semibold text-amber-700">
                              +{formatPrice(calc.taxAmount)}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right bg-emerald-50/40 font-bold text-base text-emerald-700">
                          {formatPrice(calc.finalTotal)}
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-600 font-medium">
                          {formatPrice(calc.cost)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div
                            className={
                              calc.profitPerUnit >= 0 ? "text-emerald-700" : "text-red-600"
                            }
                          >
                            <span className="font-semibold">{formatPrice(calc.profitPerUnit)}</span>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {calc.marginPercent}% margin
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Tag
                            color={isLowStock ? "error" : "success"}
                            className="!mr-0 font-medium px-2 py-0.5 rounded-full text-xs"
                          >
                            {variant.stockQty || 0} units
                          </Tag>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50/90 border-t-2 border-slate-200 text-xs font-semibold text-slate-700">
                  <tr>
                    <td colSpan={2} className="py-3 px-4">
                      Total ({variants.length} {variants.length === 1 ? "variant" : "variants"})
                    </td>
                    <td colSpan={3} className="py-3 px-4 text-right text-slate-500 font-medium">
                      Combined Valuation:
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-bold text-emerald-800 bg-emerald-50/70">
                      {formatPrice(totalRetailValue)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700 font-bold">
                      {formatPrice(totalCostValue)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">
                      +{formatPrice(totalPotentialProfit)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Tag color="blue" className="!mr-0 font-bold px-2 py-0.5 rounded-full">
                        {totalStock} units
                      </Tag>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ── Product Description Card ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FiShield className="w-4 h-4 text-blue-600" />
              Product Overview & Descriptions
            </h3>

            {product.shortDescription && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Short Description
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>
            )}

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Full Description
              </span>
              <div
                className="text-sm text-slate-700 leading-relaxed prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description || "<p class='text-slate-400'>No description provided.</p>" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

