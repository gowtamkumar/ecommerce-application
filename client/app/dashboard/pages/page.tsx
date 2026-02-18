"use client";
import { ActionType } from "@/constants/constants";
import { setAction } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Link from "next/link";
<<<<<<< HEAD
import { useEffect, useState } from "react";
import Loading from "../loading";
import { EditFilled, PlusCircleFilled } from "@ant-design/icons";
import { BsTrash2 } from "react-icons/bs";
import { deletePage, getPages } from "@/lib/apis/page";
import { toast } from "react-toastify";
=======
import { useDispatch } from "react-redux";
>>>>>>> parent of 103296e5 (page builder)

const PageList = dynamic(() => import("@/components/dashboard/page/PageList"), {
  ssr: false,
});

<<<<<<< HEAD
export default function PagesListPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetchAPI("/pages");
      console.log("pages", res);
      
      if (res.success) {
        setPages(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      await deletePage(id);
      toast.success("Page deleted successfully");
      fetchPages();
    } catch (error) {
      console.error("Failed to delete page:", error);
      toast.error("Failed to delete page");
    }
  };

  if (loading) {
    return <Loading />;
  }
=======
export default function PagesPage() {
  const dispatch = useDispatch();
>>>>>>> parent of 103296e5 (page builder)

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
        <Link
          href="/dashboard/pages/new"
          className="group flex items-center gap-2 bg-global-hover text-white px-6 py-3 rounded-full hover:bg-global-hover transition-all duration-300 shadow-lg hover:shadow-global-hover/30 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <PlusOutlined className="text-lg group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-medium">Create Page</span>
        </Link>
      </div>

      {/* Content Section */}
      <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-white/60 shadow-sm overflow-hidden p-6">
        <PageList />
      </div>
    </div>
  );
}
