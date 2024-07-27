import CategoryHeader from "@/components/website/category/CategoryHeader";
import CategorySidebar from "@/components/website/category/CategorySidebar";
import WebFooter from "@/components/website/Footer";
import Header from "@/components/website/header/Header";
import ProductCard from "@/components/website/product/ProductCard";
import { getProducts } from "@/lib/apis/product";
import { Divider } from "antd";
import { useParams } from "next/navigation";
import React from "react";

export default function SingleCategory() {
  // const params = useParams();
  // console.log("🚀 ~ params:", params)

  return (
    <>
      <Header />
      <section className="lg:w-8/12 mx-auto">
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <CategorySidebar />
          </div>
          <div className="col-span-9">
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
