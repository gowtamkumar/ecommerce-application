import appConfig from "@/appConfig";
import Subscribe from "@/components/website/footer/Subscribe";
import Header from "@/components/website/header/Header";
import CategoryTab from "@/components/website/home/CategoryTab";
import ScrollToCart from "@/components/website/ScrollToCart";
import { getPublicCategories } from "@/lib/apis/categories";
import { getHome } from "@/lib/apis/home";
import { getPosts } from "@/lib/apis/posts";
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
  const [home, publicCategories, posts] = await Promise.all([
    getHome({ page: 1, perPage: 16, featured: true, isNewArrival: true }),
    getPublicCategories(),
    getPosts(),
  ]);

  const { banners, categories, products, topSellingProducts } = home.data || {};

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
        <div className="h-1 w-20 bg-black mt-2 rounded-full"></div>
      </div>
      {link && (
        <Link
          href={link}
          className="group flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500 hover:text-black transition-colors duration-300"
        >
          View All Collection
          <span className="block h-[1px] w-4 bg-gray-400 transition-all duration-300 group-hover:w-8 group-hover:bg-black"></span>
        </Link>
      )}
    </div>
  );

  return (
    <>
      <header className="relative z-50">
        <Header />
        <div className="w-full">
          {sliderBanners?.length > 0 && <Slider banners={sliderBanners} />}
        </div>
      </header>

      <main className="bg-white">
        {/* Categories Section - Clean white background */}
        {categories && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader title="Shop by Category" link="/categories" />
              <CategoryCard categories={categories} />
            </div>
          </section>
        )}

        {/* Featured Products - Subtle gray background for separation */}
        {products?.data && (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader title="Featured Collections" link="/products" />
              <FeaturedProduct products={featuredProducts} />
            </div>
          </section>
        )}

        {/* Flash Sale / Offers */}
        {HomeBanners?.length > 0 && (
          <section className="py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <PromoBanners banners={HomeBanners} />
            </div>
          </section>
        )}

        {/* Top Selling - White background */}
        {topSellingProducts?.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader title="Best Sellers" link="/products" />
              <FeaturedProduct products={topSellingProducts} />
            </div>
          </section>
        )}

        {/* New Arrivals - Gray background */}
        {products?.data && (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader title="New Arrivals" link="/products" />
              <FeaturedProduct products={isNewArrivalProducts} />
            </div>
          </section>
        )}

        {/* Category Products */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title="Browse by Category" link="/products" />
            <CategoryTab categories={publicCategories?.data || []} />
          </div>
        </section>

        {/* Footer Banner */}
        {FooterBanners?.length > 0 && (
          <section className="py-10 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <SellerAds banners={FooterBanners} />
            </div>
          </section>
        )}

        {/* Blog / Tips Section - Slight accent background */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title="Latest from our Blog" link="/blog" />
            <BlogTab posts={posts?.data?.slice(0, 3) || []} />
          </div>
        </section>

        {/* Subscribe */}
        <section className="relative bg-[url('/newsletter.jpg')] bg-cover bg-center bg-no-repeat text-white py-20 px-6 md:px-12">
          <div className="absolute inset-0 z-0" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay in the loop!
            </h2>
            <p className="text-base md:text-lg mb-8 text-gray-200">
              Subscribe to our newsletter and never miss exclusive offers,
              updates, and more.
            </p>

            <Subscribe />
          </div>
        </section>
      </main>

      <ScrollToCart />
      <WebFooter />
    </>
  );
}
