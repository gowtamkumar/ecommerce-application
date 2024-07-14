import Header from "@/components/website/header/Header";
import CheckoutPage from "@/components/website/checkout/CheckoutPage";
import { getMe } from "@/lib/apis/user";
import React from "react";
import { useRouter } from "next/router";

export default async function CheckOut() {
  const user = await getMe();
  console.log("🚀 ~ user:", user)
  // shippingAddress={user.data?.shippingAddress}
  return (
    <>
      <Header />
      <div className="bg-gray-100">
        <CheckoutPage  />
      </div>
    </>
  );
}
