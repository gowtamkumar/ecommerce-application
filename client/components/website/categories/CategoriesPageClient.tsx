"use client";

import ScrollToCart from "@/components/share-component/ScrollToCart";
import { getImageUrl } from "@/lib/utils/imageUrl";
import {
    AppstoreOutlined,
    ArrowRightOutlined,
    CheckCircleOutlined,
    CloseCircleFilled,
    CustomerServiceOutlined,
    FireFilled,
    SafetyCertificateOutlined,
    SearchOutlined,
    SortAscendingOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import { Button, Select } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

interface CategoryItem {
  id: number | string;
  name: string;
  slug?: string;
  image?: string | null;
  isFeatured?: boolean;
  description?: string | null;
  [key: string]: any;
}

interface CategoriesPageClientProps {
  categories: CategoryItem[];
}

export default function CategoriesPageClient({
  categories = [],
}: CategoriesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "featured">("all");
  const [sortBy, setSortBy] = useState<"default" | "a-z" | "z-a">("default");

  // Count featured
  const featuredCount = useMemo(() => {
    return categories.filter((c) => Boolean(c.isFeatured)).length;
  }, [categories]);

  // Filtered & Sorted list
  const filteredCategories = useMemo(() => {
    let list = [...categories];

    // Filter tab
    if (filterTab === "featured") {
      list = list.filter((c) => Boolean(c.isFeatured));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((c) => {
        const nameMatch = c.name?.toLowerCase().includes(q);
        const descMatch = c.description?.toLowerCase().includes(q);
        const slugMatch = c.slug?.toLowerCase().includes(q);
        return nameMatch || descMatch || slugMatch;
      });
    }

    // Sort
    if (sortBy === "a-z") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "z-a") {
      list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }

    return list;
  }, [categories, filterTab, searchQuery, sortBy]);

  // Featured spotlight list (shown when no search is active)
  const spotlightCategories = useMemo(() => {
    if (searchQuery.trim() || filterTab === "featured") return [];
    return categories.filter((c) => Boolean(c.isFeatured)).slice(0, 4);
  }, [categories, searchQuery, filterTab]);

  return (
    <div className="w-full bg-[#fafbfc] min-h-screen pb-20">
      <ScrollToCart />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 shadow-inner">
        {/* Subtle decorative glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-amber-300">
            <AppstoreOutlined className="text-amber-400" />
            <span>Product Collections</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-white/80">{categories.length} Categories</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Explore All <span className="text-amber-400">Categories</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
            Discover curated collections, everyday essentials, and exclusive finds across every department.
          </p>

          {/* Search Box in Hero */}
          <div className="max-w-xl mx-auto pt-3">
            <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 shadow-2xl focus-within:bg-white focus-within:border-amber-400 transition-all duration-300 group">
              <div className="pl-3.5 pr-2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-700">
                <SearchOutlined className="text-lg" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories (e.g., Fashion, Honda, Monoculars)..."
                className="w-full bg-transparent border-none outline-hidden text-sm sm:text-base text-white group-focus-within:text-slate-900 placeholder:text-slate-400 py-2.5 pr-8 focus:ring-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Clear search"
                >
                  <CloseCircleFilled className="text-base" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {/* Spotlight Showcase (Only when no search is active and featured items exist) */}
        {spotlightCategories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <FireFilled className="text-base" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Featured Collections
                  </h2>
                  <p className="text-xs text-gray-500">
                    Handpicked customer favorites and top trending categories
                  </p>
                </div>
              </div>
              {featuredCount > spotlightCategories.length && (
                <button
                  type="button"
                  onClick={() => setFilterTab("featured")}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1 transition-colors"
                >
                  View all ({featuredCount}) <ArrowRightOutlined className="text-[10px]" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {spotlightCategories.map((item) => {
                const targetHref = item.slug
                  ? `/categories/${item.slug}`
                  : `/products?categoryId=${item.id}`;

                return (
                  <Link
                    key={`spotlight-${item.id}`}
                    href={targetHref}
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50 border border-gray-200/70 p-5 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-full">
                        <FireFilled className="text-[10px] text-amber-500" />
                        Featured
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-amber-500 group-hover:text-white text-gray-400 flex items-center justify-center transition-all duration-300">
                        <ArrowRightOutlined className="text-xs group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    <div className="py-4 flex justify-center items-center">
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            fill
                            className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 150px, 200px"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-amber-100/50 flex items-center justify-center text-amber-600 text-2xl font-bold">
                            {item.name?.charAt(0) || "C"}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {item.description || "Explore collection essentials"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter & Sort Controls Bar */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 ${
                filterTab === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Categories ({categories.length})
            </button>

            {featuredCount > 0 && (
              <button
                type="button"
                onClick={() => setFilterTab("featured")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 inline-flex items-center gap-1.5 ${
                  filterTab === "featured"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FireFilled className={filterTab === "featured" ? "text-white" : "text-amber-500"} />
                Featured ({featuredCount})
              </button>
            )}
          </div>

          {/* Right: Results Count & Sort Dropdown */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <span className="text-xs text-gray-500 font-medium">
              Showing <strong className="text-gray-900">{filteredCategories.length}</strong> of{" "}
              {categories.length}
            </span>

            <Select
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              className="w-36 text-xs font-medium"
              size="middle"
              options={[
                { value: "default", label: "Default Sort" },
                { value: "a-z", label: "Alphabetical: A-Z" },
                { value: "z-a", label: "Alphabetical: Z-A" },
              ]}
              suffixIcon={<SortAscendingOutlined className="text-gray-400 text-xs" />}
            />
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {filteredCategories.map((item) => {
              const targetHref = item.slug
                ? `/categories/${item.slug}`
                : `/products?categoryId=${item.id}`;

              return (
                <Link
                  key={item.id}
                  href={targetHref}
                  className="group relative flex flex-col items-center justify-between bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/75 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-center"
                >
                  {/* Badge */}
                  {item.isFeatured && (
                    <span className="absolute top-2.5 right-2.5 text-[9px] sm:text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200/60 shadow-xs">
                      ★ Featured
                    </span>
                  )}

                  {/* Image Container */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 my-2 flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.name || "Category"}
                        fill
                        className="object-contain p-1 group-hover:scale-110 transition-transform duration-500 ease-out"
                        sizes="(max-width: 640px) 90px, 120px"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-xl font-bold">
                        {item.name?.charAt(0) || "C"}
                      </div>
                    )}
                  </div>

                  {/* Name & Explore Cue */}
                  <div className="w-full mt-2">
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1 leading-snug">
                      {item.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 group-hover:text-amber-600 transition-colors mt-1">
                      Shop now
                      <ArrowRightOutlined className="text-[8px] group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto my-8 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-2xl">
              <SearchOutlined />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No categories found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              We couldn&apos;t find any categories matching{" "}
              <span className="font-semibold text-gray-800">&quot;{searchQuery}&quot;</span>.
            </p>
            <Button
              type="primary"
              onClick={() => {
                setSearchQuery("");
                setFilterTab("all");
              }}
              className="bg-slate-900 hover:bg-slate-800 h-10 px-6 rounded-xl font-semibold text-xs"
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Value Highlights / Trust Banner */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-gray-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
              <CheckCircleOutlined />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">Curated Collections</h4>
            <p className="text-[11px] text-gray-500">Hand-selected quality verified catalog</p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-lg">
              <ThunderboltOutlined />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">Instant Access</h4>
            <p className="text-[11px] text-gray-500">Browse thousands of products immediately</p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
              <SafetyCertificateOutlined />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">Authentic & Verified</h4>
            <p className="text-[11px] text-gray-500">Guaranteed 100% genuine products</p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
              <CustomerServiceOutlined />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">Dedicated Support</h4>
            <p className="text-[11px] text-gray-500">Always available to assist your journey</p>
          </div>
        </div>
      </div>
    </div>
  );
}

