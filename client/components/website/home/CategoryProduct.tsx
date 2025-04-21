"use client";
import React, { useEffect, useState } from "react";
import { getPublicProducts } from "@/lib/apis/product";

export default function CategoryProduct({ id }: { id: string }) {
  console.log("id", id);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [id]);


  const fetchProducts = async () => {
    try {
      const products = await getPublicProducts({
        categoryId: id.toString(),
      });
      setProducts(products?.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };
  console.log("products", products);

  return <div>CategoryProduct</div>;
}
