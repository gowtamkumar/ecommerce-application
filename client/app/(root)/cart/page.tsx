import dynamic from "next/dynamic";
import React from "react";
const Cart = dynamic(() => import("@/components/website/cart/Index"));

export default function page() {
  return <Cart />;
}
