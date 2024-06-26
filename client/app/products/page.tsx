
import WebFooter from "@/components/website/Footer";
import Header from "@/components/website/Header";
import ProductCard from "@/components/website/Home/ProductCard";
import { getProducts } from "@/lib/apis/product";
import React, { Suspense } from "react";

export default async function Products() {
  const result = await getProducts();

  return (
    <div className="container mx-auto">
      <Header />
      <section className="mb-8">
        {/* <h2 className="text-2xl font-semibold mb-4">Featured Products</h2> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Suspense fallback={"loading... products"}>
            <ProductCard products={result} />
          </Suspense>
        </div>
      </section>
      <WebFooter />
    </div>
  );
}
