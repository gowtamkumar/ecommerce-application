"use client";
import React, { useEffect, useState } from "react";
import { getPublicProducts } from "@/lib/apis/product";
import Card from "@/components/Card";
import { Empty, Spin } from "antd";

export default function CategoryProduct({ id }: { id: string }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProducts();
  }, [id]);

  const fetchProducts = async () => {
    try {
      const products = await getPublicProducts({
        categoryId: id.toString(),
        perPage: 12,
        page: 1,
      });
      setProducts(products?.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spin />
      </div>
    );
  }

  return (
    <div className="grid gap-1 justify-center  grid-cols-2 md:grid-cols-5">
      {products.length > 0 ? (
        products.map((item: any) => (
          <div key={item.id} className="!h-auto">
            <Card item={item} />
          </div>
        ))
      ) : (
        <div className="col-span-full flex justify-center items-center min-h-[200px]">
          <Empty />
        </div>
      )}
    </div>
  );
}
