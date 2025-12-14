"use client";
import { ActionType } from "@/constants/constants";
import { setAction } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";

const PageList = dynamic(() => import("@/components/dashboard/page/PageList"), { ssr: false });

export default function PagesPage() {
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Pages
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your custom pages and content
          </p>
        </div>
        <button
          onClick={() =>
            dispatch(
              setAction({
                page: true,
                type: ActionType.CREATE,
              })
            )
          }
          className="group flex items-center gap-2 bg-global-primary text-white px-6 py-3 rounded-full hover:bg-global-primary/90 transition-all duration-300 shadow-lg hover:shadow-global-primary/30 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <PlusOutlined className="text-lg group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-medium">Create Page</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-white/60 shadow-sm overflow-hidden p-6">
        <PageList />
      </div>
    </div>
  );
}
