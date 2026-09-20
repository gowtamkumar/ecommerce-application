"use client";
import dynamic from "next/dynamic";

const CategoryHeader = dynamic(
  () => import("@/components/website/sidebar-filter/FilterHeader")
);
const ProductCard = dynamic(
  () => import("@/components/website/product/ProductCard")
);
const FilterSidebar = dynamic(
  () => import("@/components/website/sidebar-filter/Index")
);
const ScrollToCart = dynamic(
  () => import("@/components/share-component/ScrollToCart")
);

import Breadcrumb from "@/components/share-component/Breadcrumb";

export default function ProductsPageClient() {
  return (
    <main className="bg-white min-h-screen">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "All Products" },
        ]}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28">
              <FilterSidebar />
            </div>
          </aside>

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
