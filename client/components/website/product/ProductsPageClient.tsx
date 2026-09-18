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

export default function ProductsPageClient() {
  return (
    <main className="bg-white min-h-screen">
      <div className="bg-gray-900 py-10 sm:py-16 mb-8 sm:mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-global-primary/30 rounded-full blur-[100px] opacity-40 -mr-32 -mt-32" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight mb-4 text-center sm:text-left">
            Explore Collections
          </h1>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gray-400 justify-center sm:justify-start"
          >
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <span className="text-gray-700">/</span>
            <span className="text-global-primary">All Products</span>
          </nav>
        </div>
      </div>

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
