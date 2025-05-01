import Card from "@/components/Card";
import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import ScrollToCart from "@/components/website/ScrollToCart";
import { getDiscountBySlug } from "@/lib/apis/discount";
import { getPublicProducts } from "@/lib/apis/product";
import { Empty } from "antd";
import React from "react";

export default async function Offer({ params }: { params: { slug: string } }) {
  // Await params to ensure it's ready
  const { slug } = await params; // This will fix the error

  const discount = await getDiscountBySlug(slug);

  let products: any[] = [];

  if (discount.success) {
    const productsRes = await getPublicProducts({ discountSlug: slug });
    products = productsRes.data || [];
  }

  return (
    <>
      <Header />
      <section className="container mx-auto lg:py-5 px-3">
        {discount.success ? (
          products.length > 0 ? (
            <div className="grid md:grid-cols-5 gap-4">
              {products.map((item: any) => (
                <Card key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Empty
              description="No products available under this offer."
              className="h-screen flex-col flex items-center justify-center"
            />
          )
        ) : (
          <Empty description="This offer has expired." />
        )}
      </section>
      <ScrollToCart />
      <WebFooter />
    </>
  );
}
