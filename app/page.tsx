import Banner from "@/components/website/Banner/Banner";
import CategoryCard from "@/components/website/Home/CategoryCard";
import WebFooter from "@/components/website/Footer";
import Header from "@/components/website/Header";
import ProductCard from "@/components/website/ProductCard";
import Image from "next/image";
import React from "react";
export default function Home() {
  return (
    <div className="container mx-auto">
      <Header />
      <Banner />

      {/* Featured Products */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        {/* Display featured products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Product Cards */}
          {/* Example Product Card: */}
          {/* <div className="bg-white rounded-lg shadow-md p-4">
            <Image
              // placeholder="blur"
              width={150}
              height={150}
              src="/product-01.jpg"
              alt="Category Image"
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">Product Name</h3>
            <p className="text-gray-500 mb-2">$20.00</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add to Cart
            </button>
            
          </div> */}

          {[2, 4, 7, 8].map((item, idx) => (
            <ProductCard
              key={idx}
              imageUrl={""}
              productName={"product "}
              price={200}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Shop by Category</h2>
        {/* Display categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Example Category Card: */}
          {[2, 4, 7, 8].map((item, idx) => (
            <CategoryCard key={idx} imageUrl={""} categoryName={"T-shirt"} />
          ))}
        </div>
      </section>

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
