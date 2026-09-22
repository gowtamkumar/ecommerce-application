import appConfig from "@/appConfig";
import { resolveBannerGroups } from "@/components/website/banner/bannerGroups";
import CategoryTab from "@/components/website/home/CategoryTab";
import CustomerReviews from "@/components/website/home/CustomerReviews";
import FlashDealSection from "@/components/website/home/FlashDealSection";
import NewsletterSection from "@/components/website/home/NewsletterSection";
import TrustBar from "@/components/website/home/TrustBar";
import { getDiscounts } from "@/lib/apis/discount";
import { getHome } from "@/lib/apis/home";
import { getSettings } from "@/lib/apis/setting";
import { getImageUrl } from "@/lib/utils/imageUrl";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";

const CategoryCard = dynamic(
  () => import("@/components/website/home/CategoryCard")
);
const BannerSection = dynamic(
  () => import("@/components/website/banner/BannerSection")
);
const PromoBanners = dynamic(
  () => import("@/components/website/banner/PromoBanners")
);
const FeaturedProduct = dynamic(
  () => import("@/components/website/home/FeaturedProduct")
);
const BlogTab = dynamic(() => import("@/components/website/home/BlogSection"));

export async function generateMetadata(): Promise<Metadata> {
  const settingRes = await getSettings();
  const setting = settingRes?.data || {};
  const seo = setting.seo || {};
  const siteName = setting.siteName || "Store";
  const baseUrl = (appConfig.baseUrl || "").replace(/\/$/, "");
  const title = seo.metaTitle || siteName;
  const description =
    seo.metaDescription ||
    setting.description ||
    `Shop quality products at ${siteName}.`;

  return {
    title: { absolute: title },
    description,
    keywords: seo.metaKeywords || undefined,
    alternates: {
      canonical: baseUrl || undefined,
    },
    openGraph: {
      title,
      description,
      url: baseUrl || undefined,
      type: "website",
      siteName,
      images: seo.metaImage ? [getImageUrl(seo.metaImage)] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: seo.metaImage ? [getImageUrl(seo.metaImage)] : [],
    },
    robots: { index: true, follow: true },
  };
}

const SectionHeader = ({
  title,
  subtitle,
  eyebrow,
  link,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  link?: string;
}) => (
  <div className="mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 w-full border-b border-gray-100 pb-5">
    <div className="space-y-2">
      {eyebrow && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[11px] font-bold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>{eyebrow}</span>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl leading-relaxed">
          {subtitle}
        </p>
      ) : null}
    </div>

    {link && (
      <Link
        href={link}
        className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-global-primary bg-gray-50 hover:bg-amber-50 px-4 py-2 rounded-full border border-gray-200/80 hover:border-amber-300 transition-all cursor-pointer shrink-0"
      >
        <span>View all</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    )}
  </div>
);

export default async function Home() {
  const [home, discountsRes] = await Promise.all([
    getHome({ page: 1, perPage: 16, featured: true, isNewArrival: true }),
    getDiscounts({ status: "Active" }),
  ]);

  const activeDiscounts = discountsRes?.data && Array.isArray(discountsRes.data) ? discountsRes.data : [];

  const { banners, posts, categories, products, topSellingProducts } =
    home?.data || {};

  const HomeBanners =
    banners?.filter((item: { type: string }) => item.type === "Banner") || [];

  const featuredProducts = products?.data?.filter(
    (item: { featured: boolean }) => item.featured
  );

  const isNewArrivalProducts = products?.data?.filter(
    (item: { isNewArrival: boolean }) => item.isNewArrival
  );

  const homePageData = home?.data?.homePage;
  const sectionsConfig = homePageData?.sections || [];
  const bannerLayout = homePageData?.bannerLayout || "slider";
  const { usedPromoIds } = resolveBannerGroups(banners || [], bannerLayout);

  const sectionMap: Record<string, () => React.ReactNode> = {
    slider: () => (
      <div className="w-full relative z-0">
        <BannerSection banners={banners || []} layout={bannerLayout} />
      </div>
    ),
    trust_bar: () => <TrustBar />,
    categories: () =>
      categories?.length > 0 ? (
        <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Shop by Department"
              subtitle="Explore curated collections organized for effortless discovery"
              eyebrow="CATEGORIES"
              link="/categories"
            />
            <CategoryCard categories={categories} />
          </div>
        </section>
      ) : null,
    featured_products: () =>
      featuredProducts?.length > 0 ? (
        <section className="py-12 sm:py-16 bg-slate-50/60 border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Featured Collections"
              subtitle="Handcrafted pieces engineered for quality, longevity, and comfort"
              eyebrow="CURATED DROPS"
              link="/products?featured=true"
            />
            <FeaturedProduct products={featuredProducts} />
          </div>
        </section>
      ) : null,
    flash_deal: () => <FlashDealSection initialDiscounts={activeDiscounts} />,
    promo_banners: () => {
      const availableBanners = HomeBanners.filter(
        (item: any) => !usedPromoIds.has(item.id)
      );
      return availableBanners?.length > 0 ? (
        <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Promotions & Spotlights"
              subtitle="Exclusive opportunities curated for our community"
              eyebrow="SPECIAL OFFERS"
              link="/offers"
            />
            <PromoBanners banners={availableBanners} />
          </div>
        </section>
      ) : null;
    },
    top_selling: () =>
      topSellingProducts?.length > 0 ? (
        <section className="py-12 sm:py-16 bg-slate-50/60 border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Community Best Sellers"
              subtitle="The most-requested essentials loved and reviewed by our customers"
              eyebrow="TOP RATED"
              link="/products"
            />
            <FeaturedProduct products={topSellingProducts} />
          </div>
        </section>
      ) : null,
    new_arrivals: () =>
      isNewArrivalProducts?.length > 0 ? (
        <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Fresh Season Arrivals"
              subtitle="Brand new releases just delivered to the storefront"
              eyebrow="JUST LANDED"
              link="/products?isNewArrival=true"
            />
            <FeaturedProduct products={isNewArrivalProducts} />
          </div>
        </section>
      ) : null,
    category_tabs: () =>
      categories?.length > 0 ? (
        <section className="py-12 sm:py-16 bg-slate-50/60 border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Explore by Category"
              subtitle="Filter catalog pieces across your favorite departments"
              eyebrow="CATALOG EXPLORER"
              link="/products"
            />
            <CategoryTab categories={categories} />
          </div>
        </section>
      ) : null,
    reviews: () => <CustomerReviews />,
    blog: () =>
      posts?.length > 0 ? (
        <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="From the Journal"
              subtitle="Stories, design philosophies, and seasonal style insights"
              eyebrow="EDITORIAL"
              link="/blog"
            />
            <BlogTab posts={posts} />
          </div>
        </section>
      ) : null,
    newsletter: () => <NewsletterSection />,
  };

  // Compose all sections gracefully
  const defaultSections = [
    "slider",
    "trust_bar",
    "categories",
    "featured_products",
    "flash_deal",
    "promo_banners",
    "top_selling",
    "new_arrivals",
    "category_tabs",
    "reviews",
    "blog",
    "newsletter",
  ];

  let orderedSections = defaultSections;
  if (sectionsConfig && sectionsConfig.length > 0) {
    const customList = [...sectionsConfig]
      .filter((s: any) => s.status !== false)
      .sort((a: any, b: any) => (a.sequence || 0) - (b.sequence || 0))
      .map((s: any) => s.slug);

    // Merge essential luxury enhancements if absent
    if (!customList.includes("trust_bar")) customList.splice(1, 0, "trust_bar");
    if (!customList.includes("flash_deal")) {
      const idx = customList.indexOf("featured_products");
      customList.splice(idx !== -1 ? idx + 1 : 2, 0, "flash_deal");
    }
    if (!customList.includes("reviews")) customList.push("reviews");
    if (!customList.includes("newsletter")) customList.push("newsletter");

    orderedSections = customList;
  }

  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
      {orderedSections.map((slug) => (
        <div key={slug}>{sectionMap[slug] ? sectionMap[slug]() : null}</div>
      ))}
    </main>
  );
}
