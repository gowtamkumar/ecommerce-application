"use client";

import Breadcrumb from "@/components/share-component/Breadcrumb";
import Card from "@/components/share-component/Card";
import ScrollToCart from "@/components/share-component/ScrollToCart";
import { getImageUrl } from "@/lib/utils/imageUrl";
import {
    AppstoreOutlined,
    CalendarOutlined,
    CheckCircleFilled,
    ClockCircleOutlined,
    CopyOutlined,
    DeploymentUnitOutlined,
    FireFilled,
    GlobalOutlined,
    SearchOutlined,
    ShoppingOutlined,
    SortAscendingOutlined,
    TagsOutlined,
} from "@ant-design/icons";
import { Button, Input, Select, Tooltip, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

interface OfferDetailViewProps {
  discount: any;
  initialProducts: any[];
  slug: string;
}

export default function OfferDetailView({
  discount,
  initialProducts = [],
  slug,
}: OfferDetailViewProps) {
  const offer = discount?.data;
  const isAvailable = discount?.success && !!offer;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name-asc">("featured");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Extract unique categories from products for filter pills
  const availableCategories = useMemo(() => {
    const cats = new Map<string, { id: any; name: string }>();
    initialProducts.forEach((p: any) => {
      if (p.category?.id && p.category?.name) {
        cats.set(String(p.category.id), { id: p.category.id, name: p.category.name });
      }
    });
    return Array.from(cats.values());
  }, [initialProducts]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p: any) =>
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q) ||
          p.brand?.name?.toLowerCase().includes(q)
      );
    }

    // Category pill filter
    if (selectedCategory !== "all") {
      list = list.filter((p: any) => String(p.category?.id) === selectedCategory);
    }

    // Sorting
    if (sortBy === "price-asc") {
      list.sort((a: any, b: any) => (a.finalPrice || a.price || 0) - (b.finalPrice || b.price || 0));
    } else if (sortBy === "price-desc") {
      list.sort((a: any, b: any) => (b.finalPrice || b.price || 0) - (a.finalPrice || a.price || 0));
    } else if (sortBy === "name-asc") {
      list.sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));
    }

    return list;
  }, [initialProducts, searchQuery, selectedCategory, sortBy]);

  // Copy code handler
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    message.success(`Coupon code "${code}" copied to clipboard!`);
  };

  // 1. EXPIRED OR INVALID OFFER VIEW
  if (!isAvailable) {
    return (
      <main className="min-h-[75vh] bg-white flex flex-col justify-center items-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6 bg-gray-50/70 border border-gray-200/80 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 border border-red-100 flex items-center justify-center mx-auto text-3xl shadow-inner">
            <ClockCircleOutlined />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Offer Unavailable
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Campaign Ended or Not Found
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              This promotional offer has concluded or the link is invalid. Check out our active discounts and deals to save on your favorite items.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/offers"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-global-button-radius bg-global-button-primary text-global-button-text font-bold text-sm shadow-md hover:bg-global-button-hover transition-all"
            >
              Browse Active Offers
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-global-button-radius bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all"
            >
              All Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Savings display
  const savingsText =
    offer.discountStrategy === "Percentage"
      ? `${+offer.value}% OFF`
      : `${+offer.value} OFF`;

  // Scope metadata label & icon
  const getScopeBadge = () => {
    switch (offer.scope) {
      case "Global":
        return {
          label: "Store-Wide Offer",
          icon: <GlobalOutlined className="text-purple-600" />,
          color: "purple",
        };
      case "Category":
        return {
          label: "Category Exclusive",
          icon: <AppstoreOutlined className="text-orange-600" />,
          color: "orange",
        };
      case "Brand":
        return {
          label: "Brand Exclusive",
          icon: <TagsOutlined className="text-cyan-600" />,
          color: "cyan",
        };
      case "Product":
        return {
          label: "Single Product Deal",
          icon: <ShoppingOutlined className="text-emerald-600" />,
          color: "green",
        };
      case "Products":
      default:
        return {
          label: "Selected Items",
          icon: <DeploymentUnitOutlined className="text-blue-600" />,
          color: "blue",
        };
    }
  };

  const scopeBadge = getScopeBadge();

  return (
    <main className="min-h-screen bg-[#fafbfc]">
      {/* 1. Global Standard Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Special Offers", href: "/offers" },
          { label: offer.name || "Offer Details" },
        ]}
        className="mb-0 border-b border-gray-200/60 bg-white"
      />

      {/* 2. High-Converting Hero Campaign Banner */}
      <section className="relative bg-white border-b border-gray-200/70 overflow-hidden">
        {/* Subtle theme radial glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-global-primary/5 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-global-hover/5 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className={offer.image ? "lg:col-span-7 space-y-6" : "lg:col-span-12 max-w-4xl mx-auto text-center space-y-6"}>
              
              {/* Top Badges Row */}
              <div className={`flex flex-wrap items-center gap-2.5 ${offer.image ? "justify-start" : "justify-center"}`}>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-global-primary/10 text-global-primary border border-global-primary/20 shadow-2xs">
                  <FireFilled className="text-global-primary" />
                  <span>{offer.promotionType || "Limited-Time Deal"}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100/90 text-gray-700 border border-gray-200/80">
                  {scopeBadge.icon}
                  <span>{scopeBadge.label}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Active Promotion</span>
                </span>
              </div>

              {/* Huge Savings Badge & Title */}
              <div className="space-y-3">
                <div className={`inline-flex items-center gap-3 ${offer.image ? "" : "justify-center"}`}>
                  <div className="bg-global-primary text-global-button-text font-black text-2xl sm:text-3xl px-5 py-2 rounded-2xl shadow-lg shadow-global-primary/20 tracking-tight flex items-center gap-2">
                    <span>{savingsText}</span>
                  </div>
                  {offer.discountStrategy && (
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
                      {offer.discountStrategy} Discount
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-[1.15]">
                  {offer.name}
                </h1>
              </div>

              {/* Description */}
              {offer.description && (
                <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-normal">
                  {offer.description}
                </p>
              )}

              {/* Offer Details / Highlights Chips */}
              <div className={`flex flex-wrap items-center gap-3 pt-2 ${offer.image ? "justify-start" : "justify-center"}`}>
                {offer.endDate && (
                  <div className="inline-flex items-center gap-2 bg-gray-50/90 border border-gray-200/90 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-700 shadow-2xs">
                    <CalendarOutlined className="text-global-primary text-sm" />
                    <span>
                      Valid until{" "}
                      <strong>
                        {new Date(offer.endDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </strong>
                    </span>
                  </div>
                )}

                <div className="inline-flex items-center gap-2 bg-gray-50/90 border border-gray-200/90 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-700 shadow-2xs">
                  <ShoppingOutlined className="text-global-primary text-sm" />
                  <span>
                    <strong>{initialProducts.length}</strong> eligible product{initialProducts.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-2 rounded-xl text-xs font-medium text-emerald-800 shadow-2xs">
                  <CheckCircleFilled className="text-emerald-600 text-sm" />
                  <span>Auto-applied at checkout</span>
                </div>
              </div>

              {/* Promo Code Pill (if key exists) */}
              {offer.key && (
                <div className={`pt-2 flex items-center ${offer.image ? "justify-start" : "justify-center"}`}>
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-200/90 rounded-2xl p-2.5 sm:px-4 shadow-2xs">
                    <div className="text-xs font-semibold text-amber-900">
                      Campaign Code:
                    </div>
                    <code className="font-mono font-bold text-sm sm:text-base text-global-primary bg-white px-3 py-1 rounded-lg border border-amber-200 shadow-2xs tracking-wider">
                      {offer.key}
                    </code>
                    <Tooltip title="Copy Campaign Code">
                      <button
                        type="button"
                        onClick={() => handleCopyCode(offer.key)}
                        className="p-1.5 text-gray-500 hover:text-global-primary transition-colors cursor-pointer rounded-md hover:bg-white"
                        aria-label="Copy campaign code"
                      >
                        <CopyOutlined className="text-base" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>

            {/* Right Media Column */}
            {offer.image && (
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-200/80 bg-gray-100 group">
                  <Image
                    src={getImageUrl(offer.image)}
                    alt={offer.name || "Special Offer Banner"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  {/* Subtle vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

                  {/* Floating badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-bold z-10">
                    <span className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-global-primary" />
                      Official Campaign
                    </span>
                    <span className="bg-global-primary text-global-button-text px-3.5 py-1.5 rounded-full shadow-md font-extrabold">
                      {savingsText}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 3. Products Filter & Listing Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {initialProducts.length > 0 ? (
          <div className="space-y-8">
            
            {/* Section Controls Toolbar */}
            <div className="bg-white border border-gray-200/70 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Left: Section Header & Count */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
                  <span>Products in this Offer</span>
                  <span className="text-xs font-bold bg-global-primary/10 text-global-primary border border-global-primary/20 px-2.5 py-0.5 rounded-full">
                    {filteredProducts.length} Items
                  </span>
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Discount prices will be applied automatically when you add to cart
                </p>
              </div>

              {/* Right: Search & Sort Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="w-full sm:w-64">
                  <Input
                    allowClear
                    placeholder="Search in offer..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl border-gray-200 hover:border-global-primary focus:border-global-primary h-10 text-xs"
                  />
                </div>

                {/* Sort Dropdown */}
                <Select
                  value={sortBy}
                  onChange={(val) => setSortBy(val)}
                  className="w-full sm:w-48 h-10 text-xs"
                  suffixIcon={<SortAscendingOutlined className="text-gray-400" />}
                  options={[
                    { value: "featured", label: "Featured Deals" },
                    { value: "price-asc", label: "Price: Low to High" },
                    { value: "price-desc", label: "Price: High to Low" },
                    { value: "name-asc", label: "Name: A to Z" },
                  ]}
                />
              </div>
            </div>

            {/* Category Filter Pills (if multiple categories available) */}
            {availableCategories.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-global-primary text-global-button-text shadow-sm shadow-global-primary/30"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  All Categories ({initialProducts.length})
                </button>
                {availableCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(String(cat.id))}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      selectedCategory === String(cat.id)
                        ? "bg-global-primary text-global-button-text shadow-sm shadow-global-primary/30"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                {filteredProducts.map((item: any) => (
                  <div key={item.id} className="group">
                    <Card item={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200/80 rounded-3xl p-12 text-center space-y-4 shadow-2xs max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto text-xl">
                  <SearchOutlined />
                </div>
                <h3 className="font-bold text-gray-900 text-base">
                  No matching products found
                </h3>
                <p className="text-xs text-gray-500">
                  Try adjusting your search terms or category filter to discover more products.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="rounded-global-button-radius text-xs font-semibold"
                >
                  Clear Filters
                </Button>
              </div>
            )}

          </div>
        ) : (
          /* Empty Products State */
          <div className="bg-white border border-gray-200/80 rounded-3xl p-12 sm:p-16 text-center space-y-5 shadow-2xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-global-primary/10 text-global-primary flex items-center justify-center mx-auto text-2xl shadow-inner">
              <ShoppingOutlined />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">
                Products Updating
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                Products for this promotional campaign are currently being curated. Browse our full store catalog while we update the list!
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 rounded-global-button-radius bg-global-button-primary text-global-button-text font-bold text-sm shadow-md hover:bg-global-button-hover transition-all"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Sticky Quick Cart Button */}
      <ScrollToCart />
    </main>
  );
}

