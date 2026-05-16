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
  FilterOutlined,
  SortAscendingOutlined
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
    <div className="py-4 border-b border-gray-100 mb-6 bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        
        {/* Left: Product Info */}
        <div className="flex items-center gap-4">
           <div className="bg-gray-900 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {products?.length || 0} Results
           </div>
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Showing global collection</span>
        </div>

        {/* Right: Controls Group */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
           
           {/* Sort with Icon */}
           <div className="flex-1 sm:flex-initial relative group">
              <Select
                defaultValue="default"
                className="w-full sm:w-48 h-10 premium-select"
                onChange={(value) => handleSort(value)}
                suffixIcon={<SortAscendingOutlined className="text-gray-900" />}
                options={[
                  { value: 'default', label: 'Recommended' },
                  { value: 'lowPrice', label: 'Price: Low-High' },
                  { value: 'highPrice', label: 'Price: High-Low' },
                ]}
              />
           </div>

           {/* View Toggle - Only on Desktop */}
           {!global.mobile && (
              <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100">
                <button
                  onClick={() => dispatch(setProductView(true))}
                  className={`p-2 rounded-lg transition-all ${global.productView ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-900'}`}
                >
                  <AppstoreOutlined className="text-lg" />
                </button>
                <button
                  onClick={() => dispatch(setProductView(false))}
                  className={`p-2 rounded-lg transition-all ${!global.productView ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-900'}`}
                >
                  <BarsOutlined className="text-lg" />
                </button>
              </div>
           )}

           {/* Mobile: Filter Modal Trigger */}
           {global.mobile && (
              <button
                onClick={() => dispatch(setOpen(true))}
                className="h-10 px-6 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <FilterOutlined />
                <span>Filters</span>
              </button>
           )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <Modal
        title={<span className="text-xs font-black uppercase tracking-widest">Apply Filters</span>}
        open={layout.open}
        onCancel={() => dispatch(setOpen(false))}
        footer={null}
        width={400}
        className="premium-modal"
        styles={{ body: { padding: 0 } }}
      >
        <div className="max-h-[80vh] overflow-y-auto">
           <FilterSidebar />
        </div>
      </Modal>
    </div>
  );
}
