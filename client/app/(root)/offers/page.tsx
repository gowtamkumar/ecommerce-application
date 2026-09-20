import appConfig from "@/appConfig";
import OffersPageClient from "@/components/website/offers/OffersPageClient";
import { getDiscounts } from "@/lib/apis/discount";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = appConfig.baseUrl;
  const discountsRes = await getDiscounts({
    scope: "Global,Product,Products,Brand,Category",
    status: "Active",
    endDate: new Date().toISOString(),
  });

  const discounts = discountsRes?.data;

  if (!Array.isArray(discounts) || discounts.length === 0) {
    return {
      metadataBase: baseUrl ? new URL(`${baseUrl}`) : undefined,
      title: "Special Offers & Discounts | Exclusive Deals",
      description: "Discover the latest discounts, seasonal promotions, and deals.",
      keywords: "discounts, deals, offers, promotions, sales",
      robots: { index: true, follow: true },
      alternates: { canonical: `${baseUrl}/offers` },
    };
  }

  const discountNames = discounts
    .slice(0, 5)
    .map((d: any) => d.name)
    .join(", ");
  const topDescription = `Discover exclusive promotional discounts and deals: ${discountNames}`;

  return {
    metadataBase: baseUrl ? new URL(`${baseUrl}`) : undefined,
    title: "Exclusive Offers & Discounts | Limited Time Deals",
    description: topDescription.slice(0, 160),
    keywords: discountNames,
    robots: { index: true, follow: true },
    alternates: { canonical: `${baseUrl}/offers` },
    openGraph: {
      title: "Exclusive Offers & Discounts",
      description: topDescription.slice(0, 160),
      url: `${baseUrl}/offers`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Exclusive Offers & Discounts",
      description: topDescription.slice(0, 160),
    },
  };
}

export default async function OffersPage() {
  const offers = await getDiscounts({
    scope: "Global,Product,Products,Brand,Category",
    status: "Active",
    endDate: new Date().toISOString(),
  });

  return <OffersPageClient initialOffers={offers?.data || []} />;
}
