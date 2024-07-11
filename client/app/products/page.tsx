import CategoryHeader from "@/components/website/category/CategoryHeader";
import CategorySidebar from "@/components/website/category/CategorySidebar";
import WebFooter from "@/components/website/Footer";
import Header from "@/components/website/Header/Header";
import ProductCard from "@/components/website/Product/ProductCard/ProductCard";
import { getProducts } from "@/lib/apis/product";
import { Divider } from "antd";
import React from "react";

export default async function Products() {
  const result = await getProducts();
  return (
    <>
      <Header />
      <section className="lg:w-8/12 mx-auto">
        <div className="grid grid-cols-6">
          <div className="col-span-1">
            <CategorySidebar />
          </div>
          <div className="col-span-5">
            <CategoryHeader />
            <Divider />
            <ProductCard/>
          </div>
        </div>
      </section>
      <WebFooter/>
    </>
  );
}
