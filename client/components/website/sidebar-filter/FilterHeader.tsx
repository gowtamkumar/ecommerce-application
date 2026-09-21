"use client";

import {
    selectGlobal,
    setProductFilter,
    setProductView,
} from "@/redux/features/global/globalSlice";
import { selectLayout, setOpen } from "@/redux/features/layout/layoutSlice";
import { selectProduct } from "@/redux/features/products/productSlice";
import {
    AppstoreOutlined,
    BarsOutlined,
    CloseOutlined,
    FilterOutlined,
    SortAscendingOutlined,
} from "@ant-design/icons";
import { Drawer, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import FilterSidebar from "./FilterSidebar";

export default function FilterHeader() {
  const global = useSelector(selectGlobal);
  const layout = useSelector(selectLayout);
  const { products } = useSelector(selectProduct);
  const dispatch = useDispatch();

  const productFilter = global.productFilter || {};

  const handleSort = (value: string) => {
    const updated = { ...productFilter };
    if (value === "lowPrice") {
      updated.lowPrice = true;
      updated.highPrice = false;
      delete updated.rating;
    } else if (value === "highPrice") {
      updated.lowPrice = false;
      updated.highPrice = true;
      delete updated.rating;
    } else if (value === "rating") {
      delete updated.lowPrice;
      delete updated.highPrice;
      updated.rating = 4;
    } else {
      delete updated.lowPrice;
      delete updated.highPrice;
      delete updated.rating;
    }
    dispatch(setProductFilter(updated));
  };

  const removeFilterKey = (key: string) => {
    const updated = { ...productFilter };
    delete updated[key];
    dispatch(setProductFilter(updated));
  };

  const clearAllFilters = () => {
    dispatch(setProductFilter({}));
  };

  // Compute active filters for chips
  const activeChips: { key: string; label: string }[] = [];
  if (productFilter.minPrice || productFilter.maxPrice) {
    activeChips.push({
      key: "price",
      label: `Price: $${productFilter.minPrice || 0} - $${productFilter.maxPrice || "10k"}`,
    });
  }
  if (productFilter.discount) {
    activeChips.push({
      key: "discount",
      label: `Min ${productFilter.discount}% Off`,
    });
  }
  if (productFilter.lowPrice) {
    activeChips.push({
      key: "lowPrice",
      label: "Price: Low to High",
    });
  }
  if (productFilter.highPrice) {
    activeChips.push({
      key: "highPrice",
      label: "Price: High to Low",
    });
  }
  if (productFilter.rating) {
    activeChips.push({
      key: "rating",
      label: "4★ & Above",
    });
  }
  if (
    productFilter.categoryId &&
    Array.isArray(productFilter.categoryId) &&
    productFilter.categoryId.length > 0
  ) {
    activeChips.push({
      key: "categoryId",
      label: `${productFilter.categoryId.length} Categories`,
    });
  }
  if (
    productFilter.brandId &&
    Array.isArray(productFilter.brandId) &&
    productFilter.brandId.length > 0
  ) {
    activeChips.push({
      key: "brandId",
      label: `${productFilter.brandId.length} Brands`,
    });
  }
  if (
    productFilter.colorId &&
    Array.isArray(productFilter.colorId) &&
    productFilter.colorId.length > 0
  ) {
    activeChips.push({
      key: "colorId",
      label: `${productFilter.colorId.length} Colors`,
    });
  }

  const activeCount = activeChips.length;

  return (
    <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 bg-white/95 backdrop-blur-md mb-6 shadow-xs">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Left: Product Count Info */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white px-3.5 py-1 rounded-full text-xs font-black tracking-wide shadow-xs">
            {products?.length || 0} Products
          </div>
          <span className="text-xs font-medium text-gray-500 hidden sm:inline">
            Curated pieces found
          </span>
        </div>

        {/* Right: Controls Group */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile/Tablet Filter Trigger */}
          <button
            onClick={() => dispatch(setOpen(true))}
            className="lg:hidden h-10 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <FilterOutlined className="text-xs" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex-1 sm:flex-initial">
            <Select
              defaultValue="default"
              className="w-full sm:w-48 h-10 rounded-xl"
              onChange={handleSort}
              suffixIcon={<SortAscendingOutlined className="text-gray-900 text-xs" />}
              options={[
                { value: "default", label: "Recommended" },
                { value: "lowPrice", label: "Price: Low to High" },
                { value: "highPrice", label: "Price: High to Low" },
                { value: "rating", label: "Highest Rated" },
              ]}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex p-1 bg-gray-100 rounded-xl border border-gray-200/60">
            <button
              onClick={() => dispatch(setProductView(false))}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                !global.productView
                  ? "bg-white shadow-xs text-gray-900 font-bold"
                  : "text-gray-400 hover:text-gray-700"
              }`}
              title="Grid View"
            >
              <AppstoreOutlined className="text-base" />
            </button>
            <button
              onClick={() => dispatch(setProductView(true))}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                global.productView
                  ? "bg-white shadow-xs text-gray-900 font-bold"
                  : "text-gray-400 hover:text-gray-700"
              }`}
              title="List View"
            >
              <BarsOutlined className="text-base" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Facet Chips Bar */}
      {activeChips.length > 0 && (
        <div className="flex items-center gap-2 pt-3 mt-3 border-t border-gray-100 flex-wrap animate-in fade-in duration-200">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Active Filters:
          </span>
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/80 transition-all hover:bg-amber-100"
            >
              <span>{chip.label}</span>
              <button
                onClick={() => {
                  if (chip.key === "price") {
                    const updated = { ...productFilter };
                    delete updated.minPrice;
                    delete updated.maxPrice;
                    dispatch(setProductFilter(updated));
                  } else {
                    removeFilterKey(chip.key);
                  }
                }}
                className="text-amber-700 hover:text-rose-600 transition-colors ml-0.5 cursor-pointer"
              >
                <CloseOutlined className="text-[10px]" />
              </button>
            </span>
          ))}

          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline px-2 py-0.5 transition-colors cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Responsive Slide-Over Filter Drawer for Mobile & Tablet */}
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span className="text-sm font-black uppercase tracking-wider text-gray-900">
              Filter Catalog
            </span>
            {activeCount > 0 && (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {activeCount} Active
              </span>
            )}
          </div>
        }
        placement="left"
        width={320}
        open={layout.open}
        onClose={() => dispatch(setOpen(false))}
        className="mobile-filter-drawer"
        styles={{ body: { padding: 0 } }}
      >
        <div className="h-full overflow-y-auto">
          <FilterSidebar />
        </div>
      </Drawer>
    </div>
  );
}
