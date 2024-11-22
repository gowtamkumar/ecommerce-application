import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import dynamic from "next/dynamic";
import React from "react";
const Cart = dynamic(() => import("@/components/website/cart/Index"));

export default function page() {
  return <>
    <Header />
    <Cart />;
    <WebFooter />
  </>
}
