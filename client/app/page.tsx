import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import React from "react";
import Category from "@/components/website/home/Category";
import ProductCard from "@/components/website/product/ProductCard";
import SellerAds from "@/components/website/home/SellerAds";
import Discount from "@/components/website/home/Discount";
import Link from "next/link";
import { getBanners } from "@/lib/apis/banner";
import Slider from "@/components/website/banner/Slider";
import {getFilterDiscounts } from "@/lib/apis/discount";
export default async function Home() {
  const banners = await getBanners();
  const discounts = await getFilterDiscounts({ type: "Discount" });
  return (
    <>
      <header>
        <Header />
        <Slider
          banners={(banners.data || []).filter(
            (item: { type: string }) => item.type === "Slider"
          )}
        />
      </header>

      <main>
        {/* all category show */}
        <section className="md:py-7 p-3 bg-[#F6F6F6] border-t-2">
          <h2 className="text-xl pb-8 text-center font-semibold ">
            Shop by Category
          </h2>
          <Category />
        </section>

        {/* <section className="py-5 bg-[#F6F6F6]">
          <SellerAds />
        </section> */}
        {/* Popular products */}
        <section className="md:py-5 p-3 md:w-8/12 mx-auto">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold pb-8">Best Seller</h2>
            <Link href={"/products"} className="hover:underline text-xl">
              View all
            </Link>
          </div>
          <ProductCard />
        </section>

        {/* product banner */}
        <section className="py-10 text-center bg-[#F6F6F6]">
          <SellerAds
            banners={(banners.data || []).filter(
              (item: { type: string }) => item.type === "Middle"
            )}
          />
        </section>
        {/* Featured Products */}
        <section className="md:w-8/12 mx-auto md:py-5 p-3">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold pb-8">Featured Products</h2>
            <Link href={"/products"} className="hover:underline">
              View all
            </Link>
          </div>
          <ProductCard />
        </section>

        {/* More Discover */}
        <section className="md:py-5 p-3 text-center bg-[#F6F6F6]">
          <Discount discounts={discounts} />
        </section>
        {/* More Discover */}
        {/* <section className="w-8/12 mx-auto py-5 text-center">
          <div className="py-5">
            <h2 className="text-xl font-semibold pb-4">More to Discover</h2>
            <p>
              Our bundles were designed to conveniently package your tanning
              essentials while saving you money.
            </p>
          </div>
          <MoreDiscover />
        </section> */}
      </main>

      <WebFooter />
    </>
  );
}
