import appConfig from "@/appConfig";
import Subscribe from "@/components/website/footer/Subscribe";
import CategoryTab from "@/components/website/home/CategoryTab";
import ScrollToCart from "@/components/website/ScrollToCart";
import { getHome } from "@/lib/apis/home";
import { Button } from "antd";
import dynamic from "next/dynamic";
import Link from "next/link";
import Favicon from "./(root)/Favicon";
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));
const CategoryCard = dynamic(
  () => import("@/components/website/home/CategoryCard")
);
const SellerAds = dynamic(() => import("@/components/website/home/SellerAds"));
const Slider = dynamic(() => import("@/components/website/banner/Slider"));
const FeaturedProduct = dynamic(
  () => import("@/components/website/home/FeaturedProduct")
);
const HeaderDiscount = dynamic(
  () => import("@/components/website/banner/HeaderDiscount")
);

// const MoreDiscover = dynamic(
//   () => import("@/components/website/home/MoreDiscover")
// );
const Header = dynamic(() => import("@/components/website/header/Header"));

export default async function Home() {
  const home = await getHome();
  const { banners, categories, products, topSellingProducts } = home.data || {};

  return (
    <>
      <header>
        <Header />
        <div className="container mx-auto py-4">
          <div className="grid md:grid-cols-12 grid-cols-1 gap-2">
            <Slider
              banners={banners?.filter(
                (item: { type: string }) => item.type === "Slider"
              )}
            />
            <HeaderDiscount
              discounts={banners?.filter(
                (item: { type: string }) => item.type === "Slider Right"
              )}
            />
          </div>
        </div>
      </header>

      <main>
        {/* all category show */}
        {categories && <CategoryCard categories={categories} />}
        {banners.length > 0 && (
          <section className="container mx-auto grid md:grid-cols-3 gap-8 py-3">
            {banners
              ?.filter((item: { type: string }) => item.type === "Banner")
              .map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-cover bg-center rounded-lg h-56 flex flex-col justify-center items-start text-white p-4 text-start"
                  style={{
                    backgroundImage: `url(${appConfig.baseApiUrl}/uploads/${item.image})`,
                  }}
                >
                  <h3 className="text-xl font-bold text-black">{item.title}</h3>
                  <p className="text-sm mb-2 text-black">{item.description}</p>
                  <Link className="bottom-auto" href={`/offers${item.url}`}>
                    <Button type="primary">Shop Now</Button>
                  </Link>
                </div>
              ))}
          </section>
        )}

        {/* Featured Products */}
        {products?.data && (
          <section className="container mx-auto">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Featured Products</h2>
              <Link href={"/products"} className="hover:underline">
                View all
              </Link>
            </div>
            <FeaturedProduct products={products?.data} />
          </section>
        )}

        {/* Featured Products */}
        <section className="container mx-auto">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Category Products</h2>
            <Link href={"/products"} className="hover:underline">
              View all
            </Link>
          </div>
          <CategoryTab />
        </section>

        {/* Top Selling Product */}
        {topSellingProducts?.length > 0 && (
          <section className="container mx-auto py-5">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Top Selling Products</h2>
              <Link href={"/products"} className="hover:underline">
                View all
              </Link>
            </div>
            <FeaturedProduct products={topSellingProducts} />
          </section>
        )}
        {/* product banner */}
        {banners.length > 0 && (
          <SellerAds
            banners={(banners || []).filter(
              (item: { type: string }) => item.type === "Footer"
            )}
          />
        )}

        {/* More discount */}
        {/* {discounts && (
          <section className="md:py-5 p-3 text-center bg-[#F6F6F6]">
            <Discount discounts={discounts} />
          </section>
        )} */}

        {/* More Discover */}
        {/* <MoreDiscover /> */}
        {/* <section className="relative bg-[url('/newsletter.jpg')] bg-cover bg-center bg-no-repeat text-white py-20 px-6 md:px-12">
          <div className="absolute inset-0 z-0" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay in the loop!
            </h2>
            <p className="text-base md:text-lg mb-8 text-gray-200">
              Subscribe to our newsletter and never miss exclusive offers,
              updates, and more.
            </p>

            <Subscribe />
          </div>
        </section> */}
      </main>
      <ScrollToCart />
      <WebFooter />
    </>
  );
}
