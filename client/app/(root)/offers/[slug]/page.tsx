import appConfig from "@/appConfig";
import PremiumEmpty from "@/components/PremiumEmpty";
import Card from "@/components/Card";
import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import ScrollToCart from "@/components/website/ScrollToCart";
import { getDiscountBySlug } from "@/lib/apis/discount";
import { getPublicProducts } from "@/lib/apis/product";
import React from "react";

export default async function Offer({ params }: any) {
  const slug = params.slug;
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
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-transparent hover:border-global-primary transition-all duration-300">
              <div className="grid md:grid-cols-5 gap-4">
                {products.map((item: any) => (
                  <div key={item.id} className="group hover:scale-105 hover:shadow-xl transition-transform duration-300">
                    <Card item={item} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <PremiumEmpty description="No products available under this offer." />
          )
        ) : (
          <PremiumEmpty description="This offer has expired." />
        )}
      </section>
      <ScrollToCart />
      <WebFooter />
    </>
  );
}

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
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
        ? [{ url: imageUrl, width: 800, height: 600, alt: name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: { canonical: canonicalUrl },
    additionalMetaTags: [
      { name: "author", content: "ecommerce" },
      { name: "canonical", content: canonicalUrl },
    ],
  };
}
