import Discount from "@/components/website/home/Discount";
import { getHomeApi } from "@/lib/apis/home";
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
  console.log("home", home);
  
  const { banners, discounts, categories, products, topSellingProduct } =
    home.data || {};
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
        {categories && <CategoryCard categories={categories} />}

        {/* Featured Products */}
        {products && (
          <section className="md:w-8/12 mx-auto md:py-5 p-3">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold pb-8">Featured Products</h2>
              <Link href={"/products"} className="hover:underline">
                View all
              </Link>
            </div>
            <FeaturedProduct products={products} />
          </section>
        )}

        {/* Top Selling Product */}
        {/* <section className="md:w-8/12 mx-auto md:py-5 p-3">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold pb-8">Top Selling Products</h2>
            <Link href={"/products"} className="hover:underline">
              View all
            </Link>
          </div>
          <FeaturedProduct products={topSellingProduct} />
        </section> */}
        {/* product banner */}
        {banners && (
          <SellerAds
            banners={(banners || []).filter(
              (item: { type: string }) => item.type === "Middle"
            )}
          />
        )}

        {/* Featured Products */}
        {products && (
          <section className="md:w-8/12 mx-auto md:py-5 p-3">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold pb-8">Featured Products</h2>
              <Link href={"/products"} className="hover:underline">
                View all
              </Link>
            </div>
            <FeaturedProduct products={products} />
          </section>
        )}

        {/* More discount */}
        {discounts && (
          <section className="md:py-5 p-3 text-center bg-[#F6F6F6]">
            <Discount discounts={discounts} />
          </section>
        )}

        {/* More Discover */}
        <MoreDiscover />
      </main>
      <WebFooter />
    </>
  );
}
