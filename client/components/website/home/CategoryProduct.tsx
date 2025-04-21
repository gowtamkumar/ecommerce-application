"use client";
import React, { useEffect, useState } from "react";
import { getPublicProducts } from "@/lib/apis/product";
import Card from "@/components/Card";

export default function CategoryProduct({ id }: { id: string }) {
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

  return (
      <div className='grid gap-1 grid-cols-2 md:grid-cols-5'>
        {products?.map((item: any) => (
          <div key={item.id}>
            <Card item={item} />
          </div>
        ))}
      </div>
  );
}
