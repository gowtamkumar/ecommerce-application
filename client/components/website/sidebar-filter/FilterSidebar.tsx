"use client";

import { getBrands } from "@/lib/apis/brand";
import { getPublicCategories } from "@/lib/apis/categories";
import { getColors } from "@/lib/apis/color";
import { setProductFilter } from "@/redux/features/global/globalSlice";
import { setOpen } from "@/redux/features/layout/layoutSlice";
import {
    CaretRightOutlined,
    CheckOutlined,
    FilterOutlined,
} from "@ant-design/icons";
import {
    Button,
    Checkbox,
    Collapse,
    ConfigProvider,
    InputNumber,
    Slider,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./index.css";

interface Category {
  name: string;
  id: number;
}

interface Brands {
  name: string;
  id: number;
}

interface Colors {
  name: string;
  color: string;
  id: number;
}

export default function FilterSidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brands[]>([]);
  const [colors, setColors] = useState<Colors[]>([]);
  const [filterData, setFilter] = useState<any>({});
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoryRes, brandRes, colorRes] = await Promise.all([
        getPublicCategories(),
        getBrands(),
        getColors(),
      ]);
      setCategories(categoryRes.data || []);
      setBrands(brandRes.data || []);
      setColors(colorRes.data || []);
    } catch (error) {
      console.error("Error fetching filter data", error);
    }
  };

  const handleFilter = () => {
    dispatch(setProductFilter(filterData));
    dispatch(setOpen(false));
  };

  const handleChange = (value: any, name: string) => {
    setFilter({ ...filterData, [name]: value });
  };

  const filterClear = () => {
    dispatch(setProductFilter({}));
    setFilter({});
  };

  const handleColorSelect = (colorId: string) => {
    const currentColors = filterData.colorId || [];
    const newColors = currentColors.includes(colorId)
      ? currentColors.filter((id: string) => id !== colorId)
      : [...currentColors, colorId];
    handleChange(newColors, "colorId");
  };

  const filterCount = Object.values(filterData).filter(
    (v) => v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  const collapseTheme = {
    token: {
      colorPrimary: "#f7aa0e",
    },
    components: {
      Collapse: {
        headerPadding: "14px 0",
        contentPadding: "12px 0",
        headerBg: "transparent",
      },
    },
  };

  return (
    <aside className="bg-white rounded-2xl sm:rounded-3xl shadow-xs border border-gray-100/90 h-full flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FilterOutlined className="text-amber-500 text-sm" />
          <h3 className="text-base font-black text-gray-900 tracking-tight">Faceted Filters</h3>
        </div>
        <button
          onClick={filterClear}
          className="text-xs text-amber-600 hover:text-amber-700 font-bold hover:underline transition-colors cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-2">
        <ConfigProvider theme={collapseTheme}>
          <Collapse
            defaultActiveKey={["price", "category", "brand", "color"]}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined
                rotate={isActive ? 90 : 0}
                className="text-xs text-gray-400"
              />
            )}
            ghost
            bordered={false}
            items={[
              {
                key: "price",
                label: <span className="font-bold text-xs uppercase tracking-wider text-gray-800">Price Range</span>,
                className: "border-b border-gray-100",
                children: (
                  <div className="space-y-4">
                    <Slider
                      range
                      min={0}
                      max={10000}
                      step={10}
                      value={[filterData.minPrice || 0, filterData.maxPrice || 10000]}
                      onChange={(val) => {
                        handleChange(val[0], "minPrice");
                        handleChange(val[1], "maxPrice");
                      }}
                      className="mb-2"
                    />
                    <div className="flex items-center gap-2">
                      <InputNumber
                        placeholder="Min"
                        value={filterData.minPrice}
                        onChange={(val) => handleChange(val, "minPrice")}
                        className="flex-1 rounded-xl"
                        controls={false}
                        prefix="$"
                      />
                      <span className="text-gray-300 font-bold">—</span>
                      <InputNumber
                        placeholder="Max"
                        value={filterData.maxPrice}
                        onChange={(val) => handleChange(val, "maxPrice")}
                        className="flex-1 rounded-xl"
                        controls={false}
                        prefix="$"
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: "category",
                label: <span className="font-bold text-xs uppercase tracking-wider text-gray-800">Department</span>,
                className: "border-b border-gray-100",
                children: (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {categories.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-2.5 cursor-pointer hover:bg-amber-500/[0.04] p-2 rounded-xl transition-colors"
                      >
                        <Checkbox
                          checked={filterData.categoryId?.includes(item.id.toString())}
                          onChange={(e) => {
                            const current = filterData.categoryId || [];
                            const val = item.id.toString();
                            const next = e.target.checked
                              ? [...current, val]
                              : current.filter((v: string) => v !== val);
                            handleChange(next, "categoryId");
                          }}
                        />
                        <span className="text-xs sm:text-sm font-semibold text-gray-700">{item.name}</span>
                      </label>
                    ))}
                  </div>
                ),
              },
              {
                key: "brand",
                label: <span className="font-bold text-xs uppercase tracking-wider text-gray-800">Brands</span>,
                className: "border-b border-gray-100",
                children: (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {brands.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-2.5 cursor-pointer hover:bg-amber-500/[0.04] p-2 rounded-xl transition-colors"
                      >
                        <Checkbox
                          checked={filterData.brandId?.includes(item.id.toString())}
                          onChange={(e) => {
                            const current = filterData.brandId || [];
                            const val = item.id.toString();
                            const next = e.target.checked
                              ? [...current, val]
                              : current.filter((v: string) => v !== val);
                            handleChange(next, "brandId");
                          }}
                        />
                        <span className="text-xs sm:text-sm font-semibold text-gray-700">{item.name}</span>
                      </label>
                    ))}
                  </div>
                ),
              },
              {
                key: "color",
                label: <span className="font-bold text-xs uppercase tracking-wider text-gray-800">Color Palette</span>,
                className: "border-b border-gray-100",
                children: (
                  <div className="grid grid-cols-5 gap-2.5 pt-1">
                    {colors.map((item) => {
                      const isSelected = filterData.colorId?.includes(item.id.toString());
                      return (
                        <div
                          key={item.id}
                          className="flex flex-col items-center gap-1"
                        >
                          <button
                            type="button"
                            onClick={() => handleColorSelect(item.id.toString())}
                            className={`w-9 h-9 rounded-full border-2 transition-all duration-200 flex items-center justify-center cursor-pointer ${
                              isSelected
                                ? "border-amber-500 shadow-md scale-105"
                                : "border-gray-200 hover:border-gray-400"
                            }`}
                            style={{ backgroundColor: item.color }}
                            title={item.name}
                          >
                            {isSelected && (
                              <CheckOutlined
                                className={`text-xs ${
                                  ["white", "#ffffff", "#fff"].includes(item.color.toLowerCase())
                                    ? "text-gray-900"
                                    : "text-white drop-shadow-md"
                                }`}
                              />
                            )}
                          </button>
                          <span className="text-[10px] text-gray-500 font-medium text-center truncate w-full">
                            {item.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ),
              },
              {
                key: "discount",
                label: <span className="font-bold text-xs uppercase tracking-wider text-gray-800">Minimum Discount</span>,
                children: (
                  <div className="pt-2">
                    <Slider
                      min={0}
                      max={100}
                      marks={{
                        0: "0%",
                        25: "25%",
                        50: "50%",
                        75: "75%",
                      }}
                      value={filterData.discount || 0}
                      onChange={(value) => handleChange(value, "discount")}
                    />
                  </div>
                ),
              },
            ]}
          />
        </ConfigProvider>
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-gray-100">
        <Button
          type="primary"
          block
          size="large"
          onClick={handleFilter}
          className="h-12 rounded-xl font-bold bg-global-primary hover:bg-amber-600 border-none shadow-md shadow-amber-500/20 text-white"
        >
          Apply Filters
          {filterCount > 0 && (
            <span className="ml-2 bg-white text-slate-900 px-2 py-0.5 rounded-full text-xs font-black">
              {filterCount}
            </span>
          )}
        </Button>
      </div>
    </aside>
  );
}
