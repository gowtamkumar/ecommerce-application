import Product from "@/components/dashboard/product";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product list",
  description: "This is a Product list.",
};

export default function page() {
  return <Product />;
}
