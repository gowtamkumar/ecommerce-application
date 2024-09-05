import CategoryHeader from "@/components/website/product-filter/FilterHeader";
import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import ProductCard from "@/components/website/product/ProductCard";
import { Divider } from "antd";
import React from "react";
import FilterSidebar from "@/components/website/product-filter/FilterSidebar";

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
