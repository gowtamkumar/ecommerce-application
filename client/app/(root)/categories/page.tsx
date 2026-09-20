import appConfig from "@/appConfig";
import { BreadcrumbSchema } from "@/components/seo";
import Caregory from "@/components/website/categories/Caregory";
import { getPublicCategories } from "@/lib/apis/categories";
import { getSettings } from "@/lib/apis/setting";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const [categoriesRes, settingRes] = await Promise.all([
    getPublicCategories(),
    getSettings(),
  ]);
  const categories = categoriesRes?.data;
  const siteName = settingRes?.data?.siteName || "Store";
  const baseUrl = (appConfig.baseUrl || "").replace(/\/$/, "");

  if (!Array.isArray(categories) || categories.length === 0) {
    return {
      title: "Categories",
      description: `Explore product categories at ${siteName}.`,
      robots: { index: true, follow: true },
      alternates: { canonical: `${baseUrl}/categories` },
    };
  }

  const categoryNames = categories.map((cat: any) => cat.name).join(", ");
  const topDescription = `Shop by category at ${siteName}: ${categoryNames}`;

  return {
    title: "Shop by Category",
    description: topDescription.slice(0, 160),
    keywords: categoryNames,
    robots: { index: true, follow: true },
    alternates: { canonical: `${baseUrl}/categories` },
    openGraph: {
      title: `Categories | ${siteName}`,
      description: topDescription.slice(0, 160),
      url: `${baseUrl}/categories`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `Categories | ${siteName}`,
      description: topDescription.slice(0, 160),
    },
  };
}

import PageBanner from "@/components/share-component/PageBanner";

export default async function Categories() {
  const categories = await getPublicCategories();

  return (
    <div>
      <PageBanner
        title="All Categories"
        subtitle="Explore our catalog across multiple categories and collections"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Categories" },
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Categories", url: "/categories" },
        ]}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Caregory categories={categories.data} />
      </div>
    </div>
  );
}
