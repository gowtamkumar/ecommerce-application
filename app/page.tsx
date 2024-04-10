import Banner from "@/components/website/Banner/Banner";
import CategoryCard from "@/components/website/Home/CategoryCard";
import WebFooter from "@/components/website/Footer";
import Header from "@/components/website/Header";
import ProductCard from "@/components/website/Home/ProductCard";
import Image from "next/image";
import React from "react";
import Category from "@/components/website/Home/Category";
import PopularProduct from "@/components/website/Home/PopularProduct";

export default function Home() {
  return (
    <div className="container mx-auto">
      <Header />
      <Banner />

      <section className="mx-auto py-4">
        <div className="flex justify-center p-3 gap-2">
          <div className="border p-2">Safe Payment</div>
          <div className="border p-2">Nationwide Delivery</div>
          <div className="border p-2">Free & Easy Return</div>
          <div className="border p-2">100% Authentic Product</div>
          <div className="border p-2">Fast Delivery</div>
        </div>
      </section>

      {/* all category show */}
      <Category />

      {/* Popular products */}
      <PopularProduct />
      {/* <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Popular Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ProductCard />
        </div>
      </section> */}

      {/* Featured Products */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ProductCard />
        </div>
      </section>

      {/* Categories */}
      <CategoryCard />
      {/* Banners */}
      <section className="mb-8">
        <Image
          width={0}
          height={0}
          src="/banner-1.jpg"
          blurDataURL="/banner-1.jpg"
          placeholder="blur"
          alt="Banner"
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
        />
        <Image
          width={0}
          height={0}
          src="/banner-1.jpg"
          blurDataURL="/banner-1.jpg"
          placeholder="blur"
          alt="Banner"
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
        />
      </section>
      <WebFooter />
    </div>
  );
}
