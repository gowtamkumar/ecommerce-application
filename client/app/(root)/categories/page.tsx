import appConfig from "@/appConfig";
import Caregory from "@/components/website/categories/Caregory";
import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import { getPublicCategories } from "@/lib/apis/categories";
import React, { use } from "react";

export async function generateMetadata() {
  const categoriesRes = await getPublicCategories();
  const categories = categoriesRes?.data;

  const baseUrl = appConfig.baseUrl;

  // Fallback metadata if categories not available
  if (!Array.isArray(categories) || categories.length === 0) {
    return {
      metadataBase: new URL(`${baseUrl}`),
      title: "Ecommerce Categories",
      description: "Explore a wide range of product categories.",
      keywords: "categories, products, shop",
      robots: "index, follow",
    };
  }

  // Extract category names for SEO keywords and description
  const categoryNames = categories.map((cat: any) => cat.name).join(", ");
  const topDescription = `Shop by category: ${categoryNames}`;

  return {
    metadataBase: new URL(`${baseUrl}`),
    title: "Shop by Category",
    description: topDescription,
    keywords: categoryNames,
    robots: "index, follow",
    openGraph: {
      title: "Explore Product Categories",
      description: topDescription,
      url: `${baseUrl}/categories`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Browse Categories",
      description: topDescription,
    },
  };
}

export default async function Categories() {
  const categories = await getPublicCategories();

  return (
    <>
      <Header />
      <div className="py-10">
        <Caregory categories={categories.data} />
      </div>
      <WebFooter />
    </>
  );
}
