import Caregory from "@/components/website/categories/Caregory";
import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import { getPublicCategories } from "@/lib/apis/categories";
import React from "react";

export default async function Categories() {
  const categories = await getPublicCategories();

  return (
    <>
      <Header />
      <div className="py-10">
        <Caregory categories={categories.data} />
      </div>
      <WebFooter />
    </>
  );
}
