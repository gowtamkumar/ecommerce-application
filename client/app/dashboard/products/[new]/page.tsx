import AddProduct from "@/components/dashboard/product/AddProduct";
import { getBrands } from "@/lib/apis/brand";
import { getAllCategories } from "@/lib/apis/categories";
import { getColors } from "@/lib/apis/color";
import { getFilterDiscounts } from "@/lib/apis/discount";
import { getSizes } from "@/lib/apis/size";
import { getTaxs } from "@/lib/apis/tax";
import { getUnits } from "@/lib/apis/unit";
import React from "react";

export default async function page() {
  return (
    <div className="container mx-auto p-2">
      <AddProduct />
    </div>
  );
}
