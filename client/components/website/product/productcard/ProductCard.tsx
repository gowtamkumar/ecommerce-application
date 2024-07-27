import React from "react";
import ProductCardDetails from "./ProductCardDetails";
import { getPublicProducts } from "@/lib/apis/product";

export default async function ProductCard() {
  const products = await getPublicProducts();
  return <ProductCardDetails products={products} />;
}
