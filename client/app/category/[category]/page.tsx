import React from "react";
import Header from "@/components/website/header/Header";
import FilterSidebar from "@/components/website/product-filter/FilterSidebar";
import CategoryHeader from "@/components/website/product-filter/FilterHeader";
import { Divider } from "antd";
import ProductCard from "@/components/website/product/ProductCard";
import WebFooter from "@/components/website/footer/Footer";

export default function SingleCategory() {
  return (
    <>
      <Header />
      <section className="container mx-auto">
        <div className="grid grid-cols-12">
          <div className="col-span-2">
            <FilterSidebar />
          </div>
          <div className="col-span-10 p-3">
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
