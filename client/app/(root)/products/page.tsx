import appConfig from "@/appConfig";
import { BreadcrumbSchema } from "@/components/seo";
import ProductsPageClient from "@/components/website/product/ProductsPageClient";
import { getSettings } from "@/lib/apis/setting";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settingRes = await getSettings();
  const siteName = settingRes?.data?.siteName || "Store";
  const baseUrl = (appConfig.baseUrl || "").replace(/\/$/, "");

  return {
    title: "All Products",
    description: `Browse the full product catalog at ${siteName}. Find featured items, new arrivals, and best sellers.`,
    alternates: {
      canonical: `${baseUrl}/products`,
    },
    openGraph: {
      title: `All Products | ${siteName}`,
      description: `Shop the complete collection from ${siteName}.`,
      url: `${baseUrl}/products`,
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

export default function ProductsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
        ]}
      />
      <ProductsPageClient />
    </>
  );
}
