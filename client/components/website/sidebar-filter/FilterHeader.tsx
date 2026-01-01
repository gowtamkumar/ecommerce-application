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
  FilterOutlined
} from "@ant-design/icons";
import { Badge, Button, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import FilterSidebar from "./FilterSidebar";


export default function FilterHeader() {
  const global = useSelector(selectGlobal);
  const layout = useSelector(selectLayout);
  const { products } = useSelector(selectProduct);
  const dispatch = useDispatch();

  const handleSort = (value: any) => {
    if (value === "lowPrice") {
      dispatch(
        setProductFilter({
          ...global.productFilter,
          lowPrice: true,
          highPrice: false,
        })
      );
    } else {
      dispatch(
        setProductFilter({
          ...global.productFilter,
          lowPrice: false,
          highPrice: true,
        })
      );
    }
  };

  return (
    <div className="mb-5">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">

          {/* Left: Results Count */}
          <div className="flex items-center gap-2">
            <Badge
              count={products?.length || 0}
              showZero
              style={{ backgroundColor: 'var(--global-primary)' }}
              className="[&_.ant-badge-count]:px-2 [&_.ant-badge-count]:h-6 [&_.ant-badge-count]:leading-6"
            />
            <span className="text-gray-600 font-medium">Products</span>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-4 flex-wrap">

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Sort:</span>
              <Select
                defaultValue="default"
                style={{ width: 160 }}
                onChange={(value) => handleSort(value)}
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'lowPrice', label: 'Price: Low to High' },
                  { value: 'highPrice', label: 'Price: High to Low' },
                ]}
              />
            </div>

            {/* Mobile: Filter Button */}
            {global.mobile ? (
              <Button
                icon={<FilterOutlined />}
                onClick={() => dispatch(setOpen(true))}
                className="flex items-center gap-1"
              >
                Filters
              </Button>
            ) : (
              /* Desktop: View Toggle */
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">View:</span>
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => dispatch(setProductView(false))}
                    className={`p-2 transition-colors ${!global.productView
                      ? 'bg-global-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    title="List View"
                  >
                    <BarsOutlined className="text-base" />
                  </button>
                  <button
                    onClick={() => dispatch(setProductView(true))}
                    className={`p-2 border-l border-gray-300 transition-colors ${global.productView
                      ? 'bg-global-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    title="Grid View"
                  >
                    <AppstoreOutlined className="text-base" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <Modal
        title="Filters"
        open={layout.open}
        onCancel={() => dispatch(setOpen(false))}
        footer={null}
        width={400}
      >
        <FilterSidebar />
      </Modal>
    </div>
  );
}
