import { Divider } from "antd";
import dynamic from "next/dynamic";

const CategoryHeader = dynamic(
  () => import("@/components/website/product-filter/FilterHeader")
);
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));
const Header = dynamic(() => import("@/components/website/header/Header"));
const FilterSidebar = dynamic(
  () => import("@/components/website/product-filter/FilterSidebar")
);
const ProductCard = dynamic(
  () => import("@/components/website/product/ProductCard")
);

export default function Products() {
  return (
    <>
      <Header />
      <section className="lg:w-8/12 mx-auto lg:py-5 px-3">
        <div className="grid md:grid-cols-12">
          <div className="md:col-span-2 py-3">
            <FilterSidebar />
          </div>
          <div className="md:col-span-10">
            <CategoryHeader />
            <Divider />
            <ProductCard />
          </div>
        </div>
      </section>
      <WebFooter />
    </>
  );
}
