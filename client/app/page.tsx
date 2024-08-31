import Banner from "@/components/website/banner/Banner";
import WebFooter from "@/components/website/Footer";
import Header from "@/components/website/header/Header";
import React from "react";
import Category from "@/components/website/home/Category";
import ProductCard from "@/components/website/product/ProductCard";
import SellerAds from "@/components/website/home/SellerAds";
import MoreDiscover from "@/components/website/home/MoreDiscover";
import Offer from "@/components/website/home/Offer";
import Link from "next/link";
export default function Home() {
  return (
    <>
      <header>
        <Header />
        <Banner />
      </header>

      <main>
        {/* all category show */}
        <section className="py-20 w- mx-auto">
          <h2 className="text-3xl text-center font-semibold pb-8">
            Shop by Category
          </h2>
          <Category />
        </section>

        <section className="py-20  bg-[#F6F6F6]">
          <SellerAds />
        </section>
        {/* Popular products */}
        <section className="py-20 w- mx-auto">
          <div className="flex justify-between">
            <h2 className="text-3xl font-semibold pb-8">BEST SELLER</h2>
            <Link href={"/products"} className="hover:underline text-2xl">
              View all
            </Link>
          </div>
          <ProductCard />
        </section>

        {/* product banner */}
        <section className="py-20 bg-[#F6F6F6]">
          <SellerAds />
        </section>
        {/* Featured Products */}
        <section className="w- mx-auto py-20">
          <div className="flex justify-between">
            <h2 className="text-3xl font-semibold pb-8">Featured Products</h2>
            <Link href={"/products"} className="hover:underline">
              View all
            </Link>
          </div>
          <ProductCard />
        </section>

        {/* More Discover */}
        <section className="w- mx-auto py-20 text-center">
          <Offer />
        </section>
        {/* More Discover */}
        <section className="w- mx-auto py-20  text-center">
          <div className="py-10">
            <h2 className="text-3xl font-semibold pb-4">More to Discover</h2>
            <p>
              Our bundles were designed to conveniently package your tanning
              essentials while saving you money.
            </p>
          </div>
          <MoreDiscover />
        </section>
      </main>

      <WebFooter />
    </>
  );
}
