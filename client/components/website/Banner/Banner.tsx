import React from "react";
import Sidebar from "./Sidebar";
import AntCarousel from "./Carousel";
import { GetCategories } from "@/lib/apis/categories";

export default async function Banner() {
  const categories = await GetCategories();
  return (
    <>
      <div className="flex gap-2">
        <div className="w-1/6">
          <Sidebar categories={categories.data} />
        </div>
        <div className="w-5/6 justify-center items-center">
          <AntCarousel />
        </div>
      </div>
    </>
  );
}
