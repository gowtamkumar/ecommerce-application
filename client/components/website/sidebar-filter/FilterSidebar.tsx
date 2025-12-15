"use client";
import { getBrands } from "@/lib/apis/brand";
import { getPublicCategories } from "@/lib/apis/categories";
import { getColors } from "@/lib/apis/color";
import { setProductFilter } from "@/redux/features/global/globalSlice";
import { setOpen } from "@/redux/features/layout/layoutSlice";
import {
  CaretRightOutlined,
  CheckOutlined,
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

const { Panel } = Collapse;

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
    components: {
      Collapse: {
        headerPadding: '14px 0',
        contentPadding: '12px 0',
        headerBg: 'transparent',
      },
    },
  };

  return (
    <aside className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col sticky top-4">

      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={filterClear}
          className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <ConfigProvider theme={collapseTheme}>
          <Collapse
            defaultActiveKey={['price', 'category', 'brand', 'color']}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined
                rotate={isActive ? 90 : 0}
                className="text-xs text-gray-500"
              />
            )}
            ghost
            bordered={false}
          >
            {/* Price Range */}
            <Panel
              header={<span className="font-medium text-gray-800">Price Range</span>}
              key="price"
              className="border-b border-gray-100"
            >
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
                    className="flex-1"
                    controls={false}
                    prefix="$"
                  />
                  <span className="text-gray-400">—</span>
                  <InputNumber
                    placeholder="Max"
                    value={filterData.maxPrice}
                    onChange={(val) => handleChange(val, "maxPrice")}
                    className="flex-1"
                    controls={false}
                    prefix="$"
                  />
                </div>
              </div>
            </Panel>

            {/* Categories */}
            <Panel
              header={<span className="font-medium text-gray-800">Category</span>}
              key="category"
              className="border-b border-gray-100"
            >
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors"
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
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </label>
                ))}
              </div>
            </Panel>

            {/* Brands */}
            <Panel
              header={<span className="font-medium text-gray-800">Brand</span>}
              key="brand"
              className="border-b border-gray-100"
            >
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {brands.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors"
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
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </label>
                ))}
              </div>
            </Panel>

            {/* Colors */}
            <Panel
              header={<span className="font-medium text-gray-800">Color</span>}
              key="color"
              className="border-b border-gray-100"
            >
              <div className="grid grid-cols-5 gap-3">
                {colors.map((item) => {
                  const isSelected = filterData.colorId?.includes(item.id.toString());
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col items-center gap-1"
                    >
                      <button
                        onClick={() => handleColorSelect(item.id.toString())}
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${isSelected
                          ? 'border-gray-900 shadow-md'
                          : 'border-gray-300 hover:border-gray-400'
                          }`}
                        style={{ backgroundColor: item.color }}
                        title={item.name}
                      >
                        {isSelected && (
                          <CheckOutlined
                            className={`text-xs ${['white', '#ffffff', '#fff'].includes(item.color.toLowerCase())
                              ? 'text-gray-900'
                              : 'text-white'
                              }`}
                          />
                        )}
                      </button>
                      <span className="text-[10px] text-gray-600 text-center leading-tight">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Panel>

            {/* Discount */}
            <Panel
              header={<span className="font-medium text-gray-800">Discount</span>}
              key="discount"
            >
              <Slider
                min={0}
                max={100}
                marks={{
                  0: '0%',
                  25: '25%',
                  50: '50%',
                  75: '75%',
                  100: '100%',
                }}
                value={filterData.discount || 0}
                onChange={(value) => handleChange(value, "discount")}
              />
            </Panel>
          </Collapse>
        </ConfigProvider>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          type="primary"
          block
          size="large"
          onClick={handleFilter}
          className="h-11 font-medium"
        >
          Apply Filters
          {filterCount > 0 && (
            <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-semibold">
              {filterCount}
            </span>
          )}
        </Button>
      </div>
    </aside>
  );
}
