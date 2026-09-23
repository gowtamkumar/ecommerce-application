import appConfig from "@/appConfig";
import { BreadcrumbSchema } from "@/components/seo";
import Breadcrumb from "@/components/share-component/Breadcrumb";
import CategoriesPageClient from "@/components/website/categories/CategoriesPageClient";
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

export default async function Categories() {
  const categories = await getPublicCategories();

  return (
    <div className="w-full bg-[#fafbfc]">
      <Breadcrumb
        items={[
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
      <CategoriesPageClient categories={categories?.data || []} />
    </div>
  );
}
