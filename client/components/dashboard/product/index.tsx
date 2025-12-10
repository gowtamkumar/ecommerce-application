"use client";
import { Spin } from "antd";
import dynamic from "next/dynamic";

// export const metadata: Metadata = {
//   title: 'Product list',
//   description: 'Product list',
// };

const ProductList = dynamic(
  () => import("@/components/dashboard/product/ProductList"),
  { loading: () => <Spin /> }
);

export default function Product() {
  return (
    <div className="container bg-white p-3">
      <ProductList />,
    </div>
  );
}
