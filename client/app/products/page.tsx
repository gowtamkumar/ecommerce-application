import CategoryHeader from "@/components/website/product-filter/FilterHeader";
import WebFooter from "@/components/website/Footer";
import Header from "@/components/website/header/Header";
import ProductCard from "@/components/website/product/ProductCard";
import { Divider } from "antd";
import React from "react";
import FilterSidebar from "@/components/website/product-filter/FilterSidebar";

export default function Products() {
  return (
    <>
      <Header />
      <section className="w-8/12 mx-auto">
        <div className="grid grid-cols-12">
          <div className="col-span-2 p-3">
            <FilterSidebar />
          </div>
          <div className="col-span-10">
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
