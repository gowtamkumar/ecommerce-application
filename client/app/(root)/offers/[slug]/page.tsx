import appConfig from "@/appConfig";
import Card from "@/components/Card";
import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import ScrollToCart from "@/components/website/ScrollToCart";
import { getDiscountBySlug } from "@/lib/apis/discount";
import { getPublicProducts } from "@/lib/apis/product";
import { Empty } from "antd";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const discountRes = await getDiscountBySlug(slug);
  const discount = discountRes?.data;

  const baseUrl = appConfig.baseUrl;

  if (!discount) {
    return {
      metadataBase: new URL(`${baseUrl}`),
      title: "Discount Not Found",
      description: "Sorry, the requested discount offer does not exist.",
      keywords: "discount, not found, offer",
      robots: "noindex, nofollow",
    };
  }

  const { name, description, image, tags } = discount;

  const canonicalUrl = `${baseUrl}/discounts/${slug}`;
  const imageUrl = image ? `${appConfig.baseApiUrl}/uploads/${image}` : null;

  return {
    metadataBase: new URL(`${baseUrl}`),
    title: `Offer: ${name}`,
    description: description || "Check out this special discount offer.",
    keywords: tags ? tags.join(", ") : name,
    robots: "index, follow",
    openGraph: {
      title: name,
      description: description,
      url: canonicalUrl,
      type: "website",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 800,
              height: 600,
              alt: name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    additionalMetaTags: [
      {
        name: "author",
        content: "ecommerce",
      },
      {
        name: "canonical",
        content: canonicalUrl,
      },
    ],
  };
}

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
