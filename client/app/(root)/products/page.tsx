import ModalLogin from "@/components/website/login/ModalLogin";
import dynamic from "next/dynamic";

const CategoryHeader = dynamic(
  () => import("@/components/website/sidebar-filter/FilterHeader")
);
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));
const Header = dynamic(() => import("@/components/website/header/Header"));
const ProductCard = dynamic(
  () => import("@/components/website/product/ProductCard")
);
const FilterSidebar = dynamic(
  () => import("@/components/website/sidebar-filter/Index")
);
const ScrollToCart = dynamic(() => import("@/components/website/ScrollToCart"));

export default function Products() {
  return (
    <>
      <Header />
      <section className="container mx-auto lg:py-5 px-3">
        <div className="grid md:grid-cols-12 gap-4">

          <div className="md:col-span-2 py-3">
            <FilterSidebar />
          </div>
          <div className="md:col-span-10">
            <CategoryHeader />
            <ProductCard />
          </div>
        </div>
      </section>
      <ScrollToCart />
    
      <WebFooter />
    </>
  );
}
