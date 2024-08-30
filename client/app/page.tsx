import Banner from "@/components/website/banner/Banner";
import CategoryCard from "@/components/website/home/CategoryCard";
import WebFooter from "@/components/website/Footer";
import Header from "@/components/website/header/Header";
import React from "react";
import Category from "@/components/website/home/Category";
import ProductCard from "@/components/website/product/ProductCard";
export default function Home() {
  return (
    <>
      <header>
        <Header />
        <Banner />
      </header>

      <main className="lg:w-8/12  mx-auto ">
        {/* all category show */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Shop by Category</h2>
          <Category />
        </section>

        {/* Popular products */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Popular Products</h2>
          <ProductCard />
        </section>

        {/* Featured Products */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
          <ProductCard />
        </section>

        {/* Categories */}
        <CategoryCard />
        {/* Banners */}
        {/* <section className="mb-8">
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
      </section> */}
      </main>

      <WebFooter />
    </>
  );
}
