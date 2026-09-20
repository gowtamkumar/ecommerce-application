"use client";

import Breadcrumb from "@/components/share-component/Breadcrumb";
import ScrollToCart from "@/components/share-component/ScrollToCart";
import { getImageUrl } from "@/lib/utils/imageUrl";
import {
    AppstoreOutlined,
    ArrowRightOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    CopyOutlined,
    FireFilled,
    GlobalOutlined,
    SearchOutlined,
    ShoppingOutlined,
    SortAscendingOutlined,
    TagOutlined,
    TagsOutlined
} from "@ant-design/icons";
import { Button, Input, Select, Tooltip, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";

interface OffersPageClientProps {
  initialOffers: any[];
}

export default function OffersPageClient({ initialOffers = [] }: OffersPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScope, setSelectedScope] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "discount-desc" | "ending-soon">("newest");

  // Copy code handler
  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    message.success(`Campaign code "${code}" copied!`);
  };

  // Filter & sort offers
  const filteredOffers = useMemo(() => {
    let list = [...initialOffers];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item: any) =>
          item.name?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.promotionType?.toLowerCase().includes(q) ||
          item.scope?.toLowerCase().includes(q) ||
          item.key?.toLowerCase().includes(q)
      );
    }

    // Scope filter
    if (selectedScope !== "all") {
      list = list.filter((item: any) => {
        if (selectedScope === "Products") {
          return item.scope === "Products" || item.scope === "Product";
        }
        return item.scope === selectedScope;
      });
    }

    // Sorting
    if (sortBy === "discount-desc") {
      list.sort((a: any, b: any) => Number(b.value || 0) - Number(a.value || 0));
    } else if (sortBy === "ending-soon") {
      list.sort((a: any, b: any) => {
        const dateA = a.endDate ? new Date(a.endDate).getTime() : Infinity;
        const dateB = b.endDate ? new Date(b.endDate).getTime() : Infinity;
        return dateA - dateB;
      });
    } else {
      // newest
      list.sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    return list;
  }, [initialOffers, searchQuery, selectedScope, sortBy]);

  // Spotlight the first prominent offer if available and no search active
  const spotlightOffer = useMemo(() => {
    if (searchQuery || selectedScope !== "all" || initialOffers.length === 0) {
      return null;
    }
    // Prefer one with image and highest discount
    const withImage = initialOffers.find((item: any) => item.image);
    return withImage || initialOffers[0];
  }, [initialOffers, searchQuery, selectedScope]);

  // Grid offers (excluding spotlight if spotlight is shown)
  const gridOffers = useMemo(() => {
    if (spotlightOffer && !searchQuery && selectedScope === "all") {
      return filteredOffers.filter((o: any) => o.id !== spotlightOffer.id);
    }
    return filteredOffers;
  }, [filteredOffers, spotlightOffer, searchQuery, selectedScope]);

  // Format discount value label
  const getSavingsLabel = (item: any) => {
    if (!item.value) return "Special Deal";
    return item.discountStrategy === "Percentage"
      ? `${+item.value}% OFF`
      : `$${+item.value} OFF`;
  };

  // Format scope tag info
  const getScopeMeta = (scope: string) => {
    switch (scope) {
      case "Global":
        return { label: "Store-Wide", icon: <GlobalOutlined />, color: "purple" };
      case "Category":
        return { label: "Category Deal", icon: <AppstoreOutlined />, color: "orange" };
      case "Brand":
        return { label: "Brand Deal", icon: <TagsOutlined />, color: "cyan" };
      case "Product":
      case "Products":
      default:
        return { label: "Selected Items", icon: <ShoppingOutlined />, color: "blue" };
    }
  };

  return (
    <main className="min-h-screen bg-[#fafbfc]">
      {/* 1. Global Standard Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Exclusive Offers & Deals" },
        ]}
        className="mb-0 border-b border-gray-200/60 bg-white"
      />

      {/* 2. Hero Header Section */}
      <section className="relative bg-white border-b border-gray-200/70 overflow-hidden py-10 sm:py-14">
        {/* Subtle theme radial glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-global-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-global-hover/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-global-primary/10 text-global-primary border border-global-primary/20 shadow-2xs mb-4">
            <FireFilled className="text-global-primary" />
            <span>Curated Promotions & Savings</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
            Special Offers & Discounts
          </h1>

          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Discover limited-time sales, promotional campaigns, and exclusive discounts curated for you across our store catalog.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        
        {/* 3. Spotlight Featured Deal (if available) */}
        {spotlightOffer && (
          <div className="relative bg-gradient-to-br from-white via-gray-50/50 to-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-global-primary/10 text-global-primary border border-global-primary/25">
                    <FireFilled /> Featured Spotlight
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    {getScopeMeta(spotlightOffer.scope).icon}
                    <span>{getScopeMeta(spotlightOffer.scope).label}</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="inline-block bg-global-primary text-global-button-text font-black text-xl sm:text-2xl px-4 py-1.5 rounded-xl shadow-md shadow-global-primary/20">
                    {getSavingsLabel(spotlightOffer)}
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                    {spotlightOffer.name}
                  </h2>
                </div>

                {spotlightOffer.description && (
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-2 max-w-xl">
                    {spotlightOffer.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-500">
                  {spotlightOffer.endDate && (
                    <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-medium text-gray-700 shadow-2xs">
                      <ClockCircleOutlined className="text-global-primary" />
                      <span>
                        Valid until{" "}
                        {new Date(spotlightOffer.endDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  {spotlightOffer.key && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-dashed border-amber-300 px-3 py-1.5 rounded-lg text-amber-900">
                      <span>Code:</span>
                      <strong className="font-mono text-global-primary">{spotlightOffer.key}</strong>
                      <Tooltip title="Copy Code">
                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(e, spotlightOffer.key)}
                          className="text-gray-400 hover:text-global-primary cursor-pointer"
                        >
                          <CopyOutlined />
                        </button>
                      </Tooltip>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/offers/${spotlightOffer.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-global-button-radius bg-global-button-primary text-global-button-text font-bold text-sm shadow-md hover:bg-global-button-hover hover:gap-3 transition-all"
                  >
                    <span>Explore Featured Deal</span>
                    <ArrowRightOutlined />
                  </Link>
                </div>
              </div>

              {/* Right Media */}
              <div className="lg:col-span-5">
                <Link href={`/offers/${spotlightOffer.slug}`} className="block">
                  <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-gray-100">
                    <Image
                      src={getImageUrl(spotlightOffer.image)}
                      alt={spotlightOffer.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                      <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        {spotlightOffer.promotionType || "Special Offer"}
                      </span>
                      <span className="bg-global-primary text-global-button-text px-3 py-1 rounded-full shadow-sm">
                        {getSavingsLabel(spotlightOffer)}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

            </div>
          </div>
        )}

        {/* 4. Controls Toolbar (Search & Filter Pills) */}
        <div className="bg-white border border-gray-200/70 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Scope Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: `All Offers (${initialOffers.length})` },
              { id: "Global", label: "Store-Wide" },
              { id: "Category", label: "Category Deals" },
              { id: "Brand", label: "Brand Deals" },
              { id: "Products", label: "Product Deals" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedScope(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedScope === tab.id
                    ? "bg-global-primary text-global-button-text shadow-sm shadow-global-primary/30"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-60">
              <Input
                allowClear
                placeholder="Search deals & campaigns..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border-gray-200 hover:border-global-primary focus:border-global-primary h-10 text-xs"
              />
            </div>

            <Select
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              className="w-full sm:w-44 h-10 text-xs"
              suffixIcon={<SortAscendingOutlined className="text-gray-400" />}
              options={[
                { value: "newest", label: "Newest First" },
                { value: "discount-desc", label: "Biggest Savings" },
                { value: "ending-soon", label: "Ending Soon" },
              ]}
            />
          </div>
        </div>

        {/* 5. Offers Cards Grid */}
        {gridOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {gridOffers.map((item: any) => {
              const scopeMeta = getScopeMeta(item.scope);
              const savings = getSavingsLabel(item);

              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  {/* Card Image / Visual Header */}
                  <Link href={`/offers/${item.slug}`} className="block relative aspect-[16/10] bg-gray-100 overflow-hidden">
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                    {/* Top Floating Savings Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-global-primary text-global-button-text font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl shadow-md tracking-tight flex items-center gap-1">
                        {savings}
                      </span>
                    </div>

                    {/* Top Floating Scope Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                        {scopeMeta.icon}
                        <span>{scopeMeta.label}</span>
                      </span>
                    </div>

                    {/* Bottom Promo Tag on Image */}
                    {item.promotionType && (
                      <div className="absolute bottom-3 left-4 text-white text-xs font-semibold drop-shadow-sm flex items-center gap-1">
                        <FireFilled className="text-amber-400 text-xs" />
                        <span>{item.promotionType}</span>
                      </div>
                    )}
                  </Link>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Validity Date */}
                      {item.endDate && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <CalendarOutlined className="text-global-primary" />
                          <span>
                            Valid until{" "}
                            {new Date(item.endDate).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      )}

                      {/* Offer Name */}
                      <Link href={`/offers/${item.slug}`} className="block">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 hover:text-global-primary transition-colors tracking-tight line-clamp-1">
                          {item.name}
                        </h3>
                      </Link>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed font-normal">
                        {item.description || "Enjoy exclusive discounted prices on eligible products while this promotion lasts."}
                      </p>
                    </div>

                    {/* Footer Section */}
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                      {/* Promo Code Pill (if available) */}
                      {item.key && (
                        <div className="flex items-center justify-between bg-amber-50/70 border border-dashed border-amber-200 rounded-xl px-3 py-1.5 text-xs text-amber-900">
                          <span className="font-semibold text-[11px] text-amber-800">Coupon:</span>
                          <span className="font-mono font-bold text-global-primary tracking-wider">{item.key}</span>
                          <Tooltip title="Copy Code">
                            <button
                              type="button"
                              onClick={(e) => handleCopyCode(e, item.key)}
                              className="text-gray-400 hover:text-global-primary cursor-pointer"
                            >
                              <CopyOutlined />
                            </button>
                          </Tooltip>
                        </div>
                      )}

                      {/* View Offer CTA */}
                      <Link
                        href={`/offers/${item.slug}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-global-button-radius bg-global-button-primary text-global-button-text font-bold text-xs sm:text-sm shadow-sm hover:bg-global-button-hover transition-all group-hover:gap-3"
                      >
                        <span>View Offer Deals</span>
                        <ArrowRightOutlined className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Offers State */
          <div className="bg-white border border-gray-200/80 rounded-3xl p-12 sm:p-16 text-center space-y-4 shadow-2xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-global-primary/10 text-global-primary flex items-center justify-center mx-auto text-2xl shadow-inner">
              <TagOutlined />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">
                {searchQuery || selectedScope !== "all"
                  ? "No matching offers found"
                  : "No Active Offers Right Now"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                {searchQuery || selectedScope !== "all"
                  ? "Try clearing your search query or selecting a different scope filter."
                  : "We are preparing exciting new promotions and discounts. Please check back shortly!"}
              </p>
            </div>
            <div className="pt-2">
              {searchQuery || selectedScope !== "all" ? (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedScope("all");
                  }}
                  className="rounded-global-button-radius text-xs font-semibold"
                >
                  Clear All Filters
                </Button>
              ) : (
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-global-button-radius bg-global-button-primary text-global-button-text font-bold text-sm shadow-md hover:bg-global-button-hover transition-all"
                >
                  Browse Store Catalog
                </Link>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Floating Quick Cart Drawer Trigger */}
      <ScrollToCart />
    </main>
  );
}

