import Header from "@/components/website/Header/Header";
import CheckoutPage from "@/components/website/Home/CheckOutPage";
import React from "react";

export default function CheckOut() {
  return (
    <>
      <Header />
      <div className="lg:w-8/12 mx-auto">
        <CheckoutPage />
      </div>
    </>
  );
}
