"use client";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { selectGlobal } from "@/redux/features/global/globalSlice";

const CategoryHeader = dynamic(
  () => import("@/components/website/sidebar-filter/FilterHeader")
);
const ProductCard = dynamic(
  () => import("@/components/website/product/ProductCard")
);
const FilterSidebar = dynamic(
  () => import("@/components/website/sidebar-filter/Index")
);
const ScrollToCart = dynamic(() => import("@/components/share-component/ScrollToCart"));

export default function Products() {
  const global = useSelector(selectGlobal);

  return (
    <main className="bg-white min-h-screen">
      {/* Banner / Header Section */}
      <div className="bg-gray-900 py-10 sm:py-16 mb-8 sm:mb-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32"></div>
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 text-center sm:text-left">
               Explore Collections
            </h1>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 justify-center sm:justify-start">
               <span className="hover:text-white cursor-pointer transition-colors">Home</span>
               <span className="text-gray-700">/</span>
               <span className="text-blue-400">All Products</span>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Left: Sidebar Filters - Sticky and only visible on desktop by default */}
          {!global.mobile && (
            <aside className="w-full lg:w-72 shrink-0">
              <div className="sticky top-28">
                <FilterSidebar />
              </div>
            </aside>
          )}

          {/* Right: Product Listing */}
          <div className="flex-1 min-w-0">
            <div className="sticky top-24 z-30 bg-white/80 backdrop-blur-md pb-4 sm:pb-6">
               <CategoryHeader />
            </div>
            <div className="mt-2">
               <ProductCard />
            </div>
          </div>
        </div>
      </div>
      <ScrollToCart />
    </main>
  );
}
