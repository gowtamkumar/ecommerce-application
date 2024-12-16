import Discount from "@/components/website/home/Discount";
import { getHomeApi } from "@/lib/apis/public/home";
import dynamic from "next/dynamic";
import Link from "next/link";

const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));
const CategoryCard = dynamic(
  () => import("@/components/website/home/Category")
);
const SellerAds = dynamic(() => import("@/components/website/home/SellerAds"));
const Slider = dynamic(() => import("@/components/website/banner/Slider"));
const FeaturedProduct = dynamic(
  () => import("@/components/website/home/FeaturedProduct")
);
const HeaderDiscount = dynamic(
  () => import("@/components/website/banner/HeaderDiscount")
);

const MoreDiscover = dynamic(
  () => import("@/components/website/home/MoreDiscover")
);
const Header = dynamic(() => import("@/components/website/header/Header"));

export default async function Home() {
  const home = await getHomeApi();
  const { banners, discounts, categories, products, topSellingProduct } = home.data;
  return (
    <>
      <header>
        <Header />
        <div className="container mx-auto">
          <div className="grid md:grid-cols-12 grid-cols-1">
            <Slider banners={banners} />
            <HeaderDiscount discounts={discounts} />
          </div>
        </div>
      </header>

      <main>
        {/* all category show */}
        <CategoryCard categories={categories} />

        {/* Top Selling Product */}
        <FeaturedProduct products={products}  />

        {/* product banner */}
        <SellerAds
          banners={(banners || []).filter(
            (item: { type: string }) => item.type === "Middle"
          )}
        />

        {/* Featured Products */}
        <FeaturedProduct products={products} />

        {/* More discount */}
        <section className="md:py-5 p-3 text-center bg-[#F6F6F6]">
          <Discount discounts={discounts} />
        </section>

        {/* More Discover */}
        <MoreDiscover />
      </main>
      <WebFooter />
    </>
  );
}
