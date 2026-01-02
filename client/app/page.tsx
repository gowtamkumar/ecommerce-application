import appConfig from "@/appConfig";
import ScrollToCart from "@/components/share-component/ScrollToCart";
import WhatsAppWidget from "@/components/share-component/WhatsAppWidget";
import Header from "@/components/website/header/Header";
import CategoryTab from "@/components/website/home/CategoryTab";
import { getHome } from "@/lib/apis/home";
import { getImageUrl } from "@/lib/utils/imageUrl";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically loaded components
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));
const CategoryCard = dynamic(
  () => import("@/components/website/home/CategoryCard")
);
const SellerAds = dynamic(() => import("@/components/website/home/SellerAds"));
const Slider = dynamic(() => import("@/components/website/banner/Slider"));
const PromoBanners = dynamic(
  () => import("@/components/website/banner/PromoBanners")
);
const FeaturedProduct = dynamic(
  () => import("@/components/website/home/FeaturedProduct")
);

const BlogTab = dynamic(() => import("@/components/website/home/BlogSection"));

// ============================================================================
// SEO METADATA CONFIGURATION
// ============================================================================

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome({
    page: 1,
    perPage: 10,
    featured: true,
    isNewArrival: true,
  });
  const homePageData = home.data?.homePage;

  if (!homePageData) {
    return {
      metadataBase: new URL(appConfig.baseUrl || "https://ecommerce.com"),
      title: "ecommerce - Premium Products",
      description:
        "Explore ecommerce for high-quality products. We offer a wide range of cosmeceutical products designed to enhance skin health. Shop now for healthier skin!",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const {
    metaTitle = "ecommerce - Premium Products",
    metaDescription = "Discover premium products at ecommerce",
    metaImage,
    metaKeywords = [],
  } = homePageData;

  const canonicalUrl = appConfig.baseUrl || "https://ecommerce.com";
  const imageUrl = getImageUrl(metaImage, `${canonicalUrl}/og-image.jpg`);

  return {
    metadataBase: new URL(canonicalUrl),
    title: `${metaTitle} - Premium Skincare Products & Solutions - Buy Now | ecommerce`,
    description: metaDescription,
    keywords: Array.isArray(metaKeywords) ? metaKeywords : [],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      siteName: "ecommerce",
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: metaTitle,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [imageUrl],
      creator: "@ecommerce",
      site: "@ecommerce",
    },
    alternates: {
      canonical: canonicalUrl,
    },
    authors: [{ name: "ecommerce" }],
    creator: "ecommerce",
    publisher: "ecommerce",
  };
}

export default async function Home() {
  const [home] = await Promise.all([
    getHome({ page: 1, perPage: 16, featured: true, isNewArrival: true }),
  ]);

  const { banners, posts, categories, products, topSellingProducts } = home.data || {};

  const sliderBanners =
    banners?.filter((item: { type: string }) => item.type === "Slider") || [];

  const HomeBanners =
    banners?.filter((item: { type: string }) => item.type === "Banner") || [];

  const FooterBanners = (banners || []).filter(
    (item: { type: string }) => item.type === "Footer"
  );

  const featuredProducts = products?.data?.filter(
    (item: { featured: boolean }) => item.featured
  );

  const isNewArrivalProducts = products?.data?.filter(
    (item: { isNewArrival: boolean }) => item.isNewArrival
  );

  // Common Section Title Component for consistency
  const SectionHeader = ({ title, link }: { title: string; link?: string }) => (
    <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4 border-b border-gray-100 pb-4">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
        <div className="h-1 w-20 bg-global-primary mt-2 rounded-full"></div>
      </div>
      {link && (
        <Link
          href={link}
          className="group flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500 hover:text-global-hover transition-colors duration-300"
        >
          View All Collection
          <span className="block h-[1px] w-4 bg-gray-400 transition-all duration-300 group-hover:w-8 group-hover:bg-global-hover"></span>
        </Link>
      )}
    </div>
  );

  const homePageData = home.data?.homePage;
  const sectionsConfig = homePageData?.sections || [];

  // Define available sections and their render functions
  const sectionMap: Record<string, () => React.ReactNode> = {
    slider: () => (
      sliderBanners?.length > 0 ? (
        <div className="w-full">
          <Slider banners={sliderBanners} />
        </div>
      ) : null
    ),
    categories: () => (
      categories ? (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title="Shop by Category" link="/categories" />
            <CategoryCard categories={categories} />
          </div>
        </section>
      ) : null
    ),
    featured_products: () => (
      products?.data ? (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title="Featured Collections" link="/products" />
            <FeaturedProduct products={featuredProducts} />
          </div>
        </section>
      ) : null
    ),
    promo_banners: () => (
      HomeBanners?.length > 0 ? (
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PromoBanners banners={HomeBanners} />
          </div>
        </section>
      ) : null
    ),
    top_selling: () => (
      topSellingProducts?.length > 0 ? (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title="Best Sellers" link="/products" />
            <FeaturedProduct products={topSellingProducts} />
          </div>
        </section>
      ) : null
    ),
    new_arrivals: () => (
      products?.data ? (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title="New Arrivals" link="/products" />
            <FeaturedProduct products={isNewArrivalProducts} />
          </div>
        </section>
      ) : null
    ),
    category_tabs: () => (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Browse by Category" link="/products" />
          <CategoryTab categories={categories} />
        </div>
      </section>
    ),
    footer_banners: () => (
      FooterBanners?.length > 0 ? (
        <section className="py-10 overflow-hidden bg-gray-50">
          <SellerAds banners={FooterBanners} />
        </section>
      ) : null
    ),
    blog: () => (
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Latest from our Blog" link="/blog" />
          <BlogTab posts={posts || []} />
        </div>
      </section>
    ),
  };

  // Determine the order of sections
  const orderedSections = sectionsConfig.length > 0
    ? [...sectionsConfig]
      .filter((s: any) => s.status !== false)
      .sort((a: any, b: any) => (a.sequence || 0) - (b.sequence || 0))
      .map((s: any) => s.slug)
    : ["slider", "categories", "featured_products", "promo_banners", "top_selling", "new_arrivals", "category_tabs", "footer_banners", "blog"];

  return (
    <>
      <header className="relative z-50">
        <Header />
        {/* Render Slider separately if it's in the header context, but here we handle it in-flow if ordered */}
        {orderedSections.includes("slider") && sectionMap.slider()}
      </header>

      <main className="bg-white">
        {orderedSections
          .filter(slug => slug !== "slider") // Slider is rendered in header
          .map(slug => (
            <div key={slug}>
              {sectionMap[slug] ? sectionMap[slug]() : null}
            </div>
          ))}
      </main>
      <WhatsAppWidget />
      <ScrollToCart />
      <WebFooter />
    </>
  );
}
