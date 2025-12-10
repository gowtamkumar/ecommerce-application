import ProductDetails from "@/components/dashboard/product/ProductDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Product Details',
  description: 'View product details',
};

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <ProductDetails productId={id} />;
}
