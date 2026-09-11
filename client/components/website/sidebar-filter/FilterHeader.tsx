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
    SortAscendingOutlined
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
    if (value === "lowPrice") {
      dispatch(
        setProductFilter({
          ...productFilter,
          lowPrice: true,
          highPrice: false,
        })
      );
    } else if (value === "highPrice") {
      dispatch(
        setProductFilter({
          ...productFilter,
          lowPrice: false,
          highPrice: true,
        })
      );
    } else {
      const updated = { ...productFilter };
      delete updated.lowPrice;
      delete updated.highPrice;
      dispatch(setProductFilter(updated));
    }
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
  if (productFilter.categoryId && Array.isArray(productFilter.categoryId) && productFilter.categoryId.length > 0) {
    activeChips.push({
      key: "categoryId",
      label: `${productFilter.categoryId.length} Categories`,
    });
  }
  if (productFilter.brandId && Array.isArray(productFilter.brandId) && productFilter.brandId.length > 0) {
    activeChips.push({
      key: "brandId",
      label: `${productFilter.brandId.length} Brands`,
    });
  }
  if (productFilter.colorId && Array.isArray(productFilter.colorId) && productFilter.colorId.length > 0) {
    activeChips.push({
      key: "colorId",
      label: `${productFilter.colorId.length} Colors`,
    });
  }

  const activeCount = activeChips.length;

  return (
    <div className="py-4 border-b border-gray-100 mb-6 bg-white">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Left: Product Count Info */}
        <div className="flex items-center gap-3">
          <div className="bg-gray-900 text-white px-3.5 py-1 rounded-full text-xs font-black tracking-wide">
            {products?.length || 0} Results
          </div>
          <span className="text-xs font-medium text-gray-400">
            Discover catalog items
          </span>
        </div>

        {/* Right: Controls Group */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile/Tablet Filter Trigger */}
          <button
            onClick={() => dispatch(setOpen(true))}
            className="lg:hidden h-10 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
          >
            <FilterOutlined className="text-xs" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex-1 sm:flex-initial">
            <Select
              defaultValue="default"
              className="w-full sm:w-44 h-10"
              onChange={handleSort}
              suffixIcon={<SortAscendingOutlined className="text-gray-900 text-xs" />}
              options={[
                { value: "default", label: "Recommended" },
                { value: "lowPrice", label: "Price: Low to High" },
                { value: "highPrice", label: "Price: High to Low" },
              ]}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex p-1 bg-gray-100 rounded-xl border border-gray-200/60">
            <button
              onClick={() => dispatch(setProductView(false))}
              className={`p-1.5 rounded-lg transition-all ${
                !global.productView
                  ? "bg-white shadow-xs text-gray-900"
                  : "text-gray-400 hover:text-gray-700"
              }`}
              title="Grid View"
            >
              <AppstoreOutlined className="text-base" />
            </button>
            <button
              onClick={() => dispatch(setProductView(true))}
              className={`p-1.5 rounded-lg transition-all ${
                global.productView
                  ? "bg-white shadow-xs text-gray-900"
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
        <div className="flex items-center gap-2 pt-3 flex-wrap animate-in fade-in duration-200">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Active:
          </span>
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200/80 transition-all hover:bg-gray-200/70"
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
                className="text-gray-400 hover:text-red-500 transition-colors ml-0.5"
              >
                <CloseOutlined className="text-[10px]" />
              </button>
            </span>
          ))}

          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline px-2 py-0.5 transition-colors"
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
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
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
