import Header from "@/components/website/header/Header";
import CheckoutPage from "@/components/website/checkout/CheckoutPage";
import React from "react";
import WebFooter from "@/components/website/Footer";

export default function CheckOut() {
  return (
    <>
      <Header />
      <div className="bg-gray-100">
        <CheckoutPage />
      </div>
      <WebFooter/>
    </>
  );
}
