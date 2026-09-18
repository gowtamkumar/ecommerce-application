"use client";
import { Skeleton } from "antd";
import dynamic from "next/dynamic";

const ProductList = dynamic(
  () => import("@/components/dashboard/product/ProductList"),
  {
    loading: () => (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <Skeleton active paragraph={{ rows: 2 }} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} active paragraph={{ rows: 1 }} />
          ))}
        </div>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    ),
  }
);

export default function Product() {
  return (
    <div className="container p-4 sm:p-6">
      <ProductList />
    </div>
  );
}
