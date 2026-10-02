import appConfig from "@/appConfig";
import LandingPageClient from "@/components/website/landing/LandingPageClient";
import { getLandingProductData } from "@/lib/apis/landing";
import { getProductBySlug } from "@/lib/apis/product";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { stripHtml } from "@/lib/utils/seo";
import type { Metadata } from "next";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = (appConfig.baseUrl || "").replace(/\/$/, "");

  let product: any = null;
  const landingRes = await getLandingProductData(slug);
  if (landingRes?.success && landingRes?.data?.product) {
    product = landingRes.data.product;
  } else {
    const productRes = await getProductBySlug({ slug });
    product = productRes?.data;
  }

  if (!product) {
    return {
      title: "স্পেশাল অফার - পণ্য পাওয়া যায়নি",
      description: "অনুরোধকৃত পণ্যটি খুঁজে পাওয়া যায়নি।",
      robots: { index: false, follow: false },
    };
  }

  const name = product.name || "স্পেশাল অফার";
  const description =
    stripHtml(product.shortDescription || product.description)?.slice(0, 160) ||
    `${name} কিনুন ক্যাশ অন ডেলিভারিতে সারা বাংলাদেশে দ্রুত হোম ডেলিভারি সহ।`;
  const canonicalUrl = `${baseUrl}/landing/${slug}`;
  const image = getImageUrl(product.thumbnailImage);

  return {
    metadataBase: baseUrl ? new URL(baseUrl) : undefined,
    title: `${name} - বিশেষ মূল্যছাড় ও ক্যাশ অন ডেলিভারি`,
    description,
    keywords: [name, product.brand?.name, "Facebook Ads", "Cash on Delivery", "Online Shopping Bangladesh"]
      .filter(Boolean)
      .join(", "),
    robots: { index: true, follow: true },
    openGraph: {
      title: `${name} | বিশেষ মূল্যছাড় অফার`,
      description,
      url: canonicalUrl,
      type: "website",
      images: image ? [{ url: image, width: 800, height: 800, alt: name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function LandingPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">অফার পাওয়া যায়নি</h1>
          <p className="text-gray-500 text-sm">পণ্যটি খুঁজে পাওয়া যায়নি।</p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 rounded-xl bg-global-primary hover:bg-global-hover text-white font-bold text-sm transition-all"
          >
            হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  // Fetch product data from dedicated landing endpoint
  const landingRes = await getLandingProductData(slug);
  let productData = landingRes?.data?.product;
  let deliveryCharges = landingRes?.data?.deliveryCharges || {
    insideDhaka: 60,
    outsideDhaka: 120,
  };
  let deliverySettings = landingRes?.data?.deliverySettings;
  let storeSetting = landingRes?.data?.storeSetting;

  // Fallback to general product endpoint if landing product endpoint is unavailable
  if (!productData) {
    const productRes = await getProductBySlug({ slug });
    productData = productRes?.data;
  }

  if (!productData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-global-primary/10 text-global-primary flex items-center justify-center mx-auto text-2xl font-black">
            !
          </div>
          <h1 className="text-2xl font-black text-gray-900">
            অফারটি বর্তমানে অনুপলব্ধ
          </h1>
          <p className="text-gray-500 text-sm">
            আপনি যে পণ্যের অফারটি খুঁজছেন তা বর্তমানে স্টকে শেষ হয়ে গেছে অথবা লিংকটি পরিবর্তিত হয়েছে।
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-2xl bg-global-primary hover:bg-global-hover text-white font-bold text-sm shadow-md transition-all"
          >
            আমাদের অন্যান্য কালেকশন দেখুন
          </Link>
        </div>
      </div>
    );
  }

  return (
    <LandingPageClient
      product={productData}
      deliveryCharges={deliveryCharges}
      freeDeliveryMinQty={
        deliverySettings?.freeDeliveryMinQty !== undefined
          ? deliverySettings.freeDeliveryMinQty
          : 2
      }
      freeDeliveryMinAmount={deliverySettings?.freeDeliveryMinAmount ?? null}
      storeSetting={storeSetting}
    />
  );
}
