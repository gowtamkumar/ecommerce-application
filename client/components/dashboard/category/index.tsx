"use client";
import { ActionType } from "@/constants/constants";
import { setAction } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";

const AddCategory = dynamic(() => import('@/components/dashboard/category/AddCategory'), { ssr: false })
const CategoryList = dynamic(() => import('@/components/dashboard/category/CategoryList'), { ssr: false })

export default function Category() {
  const dispatch = useDispatch();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-global-primary-fontfamily">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Organize your products with categories and sub-categories</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="!bg-black hover:!bg-gray-800 !rounded-xl !h-10 !px-6 !font-medium shadow-sm transition-all"
          onClick={() =>
            dispatch(
              setAction({
                type: ActionType.CREATE,
              })
            )
          }
        >
          Add Category
        </Button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <CategoryList />
      </div>

      <AddCategory />
    </div>
  );
}
