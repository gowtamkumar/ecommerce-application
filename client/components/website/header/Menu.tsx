"use client";

import { getImageUrl } from "@/lib/utils/imageUrl";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import {
    ArrowRightOutlined,
    CloseCircleFilled,
    FireFilled,
    SearchOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { HiChevronDown } from "react-icons/hi";
import { useSelector } from "react-redux";

const MainMenu = () => {
  const global = useSelector(selectGlobal);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    return Array.isArray(global.categories) ? global.categories : [];
  }, [global.categories]);

  // Filter by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter((c: any) => {
      const matchName = c.name?.toLowerCase().includes(q);
      const matchDesc = c.description?.toLowerCase().includes(q);
      const matchSlug = c.slug?.toLowerCase().includes(q);
      return matchName || matchDesc || matchSlug;
    });
  }, [categories, searchQuery]);

  return (
    <div className="flex items-center">
      <Dropdown
        open={isOpen}
        onOpenChange={setIsOpen}
        trigger={["click"]}
        placement="bottomLeft"
        dropdownRender={() => (
          <div className="w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-gray-100 ring-1 ring-black/5 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="p-3.5 border-b border-gray-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-gray-900 tracking-tight">
                  Shop by Category
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200/60">
                  {categories.length}
                </span>
              </div>
            </div>

            {/* Quick Search */}
            <div className="p-2.5 border-b border-gray-100 bg-white">
              <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 focus-within:bg-white focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all">
                <SearchOutlined className="text-gray-400 text-xs mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find a category..."
                  className="w-full bg-transparent text-xs text-gray-800 placeholder:text-gray-400 border-none outline-hidden p-0 focus:ring-0"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-gray-600 transition-colors ml-1 cursor-pointer"
                    title="Clear search"
                  >
                    <CloseCircleFilled className="text-xs" />
                  </button>
                )}
              </div>
            </div>

            {/* Category List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1 divide-y-0 scrollbar-thin scrollbar-thumb-gray-200">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((item: any) => {
                  const targetHref = item.slug
                    ? `/categories/${item.slug}`
                    : `/products?categoryId=${item.id}&`;

                  return (
                    <Link
                      key={item.id}
                      href={targetHref}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between p-2 rounded-xl hover:bg-amber-50/70 transition-all duration-150 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Thumbnail */}
                        <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-0.5 shrink-0 overflow-hidden group-hover:border-amber-200 group-hover:bg-white transition-colors relative">
                          {item.image ? (
                            <Image
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              width={32}
                              height={32}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <span className="text-xs font-bold text-gray-400 group-hover:text-amber-600">
                              {item.name?.charAt(0) || "C"}
                            </span>
                          )}
                        </div>

                        {/* Text */}
                        <div className="min-w-0">
                          <span className="block text-xs font-semibold text-gray-800 group-hover:text-amber-700 transition-colors truncate">
                            {item.name}
                          </span>
                          {item.isFeatured && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600">
                              <FireFilled className="text-[8px]" />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <ArrowRightOutlined className="text-[10px] text-gray-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </Link>
                  );
                })
              ) : (
                <div className="py-8 text-center px-4">
                  <p className="text-xs text-gray-500 font-medium">
                    No categories found
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-[11px] text-amber-600 hover:underline mt-1 font-semibold cursor-pointer"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>

            {/* Footer: View All Categories */}
            <div className="p-2.5 border-t border-gray-100 bg-gray-50/80">
              <Link
                href="/categories"
                onClick={() => setIsOpen(false)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all group/btn"
              >
                <span>View All Categories</span>
                <ArrowRightOutlined className="text-[9px] group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      >
        <button
          type="button"
          className={`h-10 px-4 rounded-full font-semibold text-xs sm:text-sm
                     border flex items-center gap-2.5 transition-all duration-200 cursor-pointer shadow-xs ${
                       isOpen
                         ? "border-amber-400 text-amber-700 bg-amber-50/30"
                         : "border-gray-200 bg-white text-gray-800 hover:border-amber-400 hover:text-amber-600 hover:bg-slate-50"
                     }`}
        >
          <CiMenuFries className="text-base text-gray-700" />
          <span className="tracking-wide">Categories</span>
          <HiChevronDown
            className={`text-sm transition-transform duration-200 ${
              isOpen
                ? "rotate-180 text-amber-600"
                : "text-gray-400 group-hover:text-amber-600"
            }`}
          />
        </button>
      </Dropdown>
    </div>
  );
};

export default MainMenu;
