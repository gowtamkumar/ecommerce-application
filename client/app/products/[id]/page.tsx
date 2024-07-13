import WebFooter from "@/components/website/Footer";
import Header from "@/components/website/header/Header";
import SingleProduct from "@/components/website/Product/SingleProduct";
import { Suspense } from "react";
export default async function Product() {
  return (
    <Suspense fallback={"loadding... for single product"}>
      <Header />
      <div className="min-h-screen bg-gray-100">
        <SingleProduct />
      </div>
      <WebFooter />
    </Suspense>
  );
}
