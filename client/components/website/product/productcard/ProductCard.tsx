import React from "react";
import ProductCardDetails from "./ProductCardDetails";
import { getProducts, getPublicProducts } from "@/lib/apis/product";

export default async function ProductCard() {
  const products = await getPublicProducts({} as any);
  return <ProductCardDetails products={products} />;
}
