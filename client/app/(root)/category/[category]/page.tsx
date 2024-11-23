import { Divider } from "antd";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/website/header/Header"));
const FilterSidebar = dynamic(
  () => import("@/components/website/product-filter/FilterSidebar")
);
const CategoryHeader = dynamic(
  () => import("@/components/website/product-filter/FilterHeader")
);
const ProductCard = dynamic(
  () => import("@/components/website/product/ProductCard")
);
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));

export default function SingleCategory() {
  return (
    <>
      <Header />
      <section className="container mx-auto">
        <div className="grid grid-cols-12">
          <div className="col-span-2">
            <FilterSidebar />
          </div>
          <div className="col-span-10 p-3">
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
