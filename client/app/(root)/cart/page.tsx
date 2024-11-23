import dynamic from "next/dynamic";
import React from "react";
const Cart = dynamic(() => import("@/components/website/cart/Index"));
const Header = dynamic(() => import("@/components/website/header/Header"));
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));

export default function page() {
  return (
    <>
      <Header />
      <Cart />;
      <WebFooter />
    </>
  );
}
