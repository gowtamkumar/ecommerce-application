import appConfig from "@/appConfig";
import CategoryTab from "@/components/website/home/CategoryTab";
import ScrollToCart from "@/components/website/ScrollToCart";
import { getHome } from "@/lib/apis/home";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { Button } from "antd";
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
const FeaturedProduct = dynamic(
  () => import("@/components/website/home/FeaturedProduct")
);
const Header = dynamic(() => import("@/components/website/header/Header"));

// ============================================================================
// SEO METADATA CONFIGURATION
// ============================================================================

/**
 * Generates dynamic metadata for the home page
 * Fetches SEO data from backend settings or uses fallback defaults
 */
export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome();
  const homePageData = home.data?.homePage;

  // Fallback metadata when no configuration is available
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

  // Extract metadata from backend settings
  const {
    metaTitle = "ecommerce - Premium Products",
    metaDescription = "Discover premium products at ecommerce",
    metaImage,
    metaKeywords = [],
  } = homePageData;

  // Construct URLs (ensure they're always defined strings)
  const canonicalUrl = appConfig.baseUrl || "https://ecommerce.com";
  const imageUrl = getImageUrl(metaImage, `${canonicalUrl}/og-image.jpg`);

  // Build complete metadata object
  return {
    metadataBase: new URL(canonicalUrl),

    // Primary metadata
    title: `${metaTitle} - Premium Skincare Products & Solutions - Buy Now | ecommerce`,
    description: metaDescription,
    keywords: Array.isArray(metaKeywords) ? metaKeywords : [],

    // SEO directives
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

    // Open Graph (Facebook, LinkedIn, etc.)
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

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [imageUrl],
      creator: "@ecommerce",
      site: "@ecommerce",
    },

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Additional meta tags
    authors: [{ name: "ecommerce" }],
    creator: "ecommerce",
    publisher: "ecommerce",

    // Theme and manifest
    // themeColor: [
    //   { media: "(prefers-color-scheme: light)", color: "#ff6600" },
    //   { media: "(prefers-color-scheme: dark)", color: "#ff6600" },
    // ],

    // Verification (add your actual verification codes)
    // verification: {
    //   google: "your-google-verification-code",
    //   yandex: "your-yandex-verification-code",
    //   yahoo: "your-yahoo-verification-code",
    // },
  };
}

export default async function Home() {
  const home = await getHome();
  const { banners, categories, products, topSellingProducts } = home.data || {};

  const sliderBanners =
    banners?.filter((item: { type: string }) => item.type === "Slider") || [];
  const discounts =
    banners?.filter((item: { type: string }) => item.type === "Slider Right") ||
    [];

  return (
    <>
      <header>
        <Header />
        <div className="w-full">
          {sliderBanners?.length > 0 && <Slider banners={sliderBanners} />}
        </div>
      </header>

      <main>
        {/* all category show */}
        {categories && (
          <div className="container mx-auto py-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Shop by Category</h2>
              <Link href={"/categories"} className="hover:underline">
                View all
              </Link>
            </div>
            <CategoryCard categories={categories} />
          </div>
        )}
        {banners?.length > 0 && (
          <section className="container mx-auto grid md:grid-cols-3 gap-8 py-3">
            {banners
              ?.filter((item: { type: string }) => item.type === "Banner")
              .map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-cover bg-center rounded-lg h-56 flex flex-col justify-center items-start text-white p-4 text-start"
                  style={{
                    backgroundImage: `url(${appConfig.baseApiUrl}/uploads/${item.image})`,
                  }}
                >
                  <h3 className="text-xl font-bold text-black">{item.title}</h3>
                  <p className="text-sm mb-2 text-black">{item.description}</p>
                  <Link className="bottom-auto" href={`/offers${item.url}`}>
                    <Button type="primary">Shop Now</Button>
                  </Link>
                </div>
              ))}
          </section>
        )}

        {/* Featured Products */}
        {products?.data && (
          <section className="container mx-auto">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Featured Products</h2>
              <Link href={"/products"} className="hover:underline">
                View all
              </Link>
            </div>
            <FeaturedProduct products={products?.data} />
          </section>
        )}

        {/* Featured Products */}
        <section className="container mx-auto">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Category Products</h2>
            <Link href={"/products"} className="hover:underline">
              View all
            </Link>
          </div>
          <CategoryTab />
        </section>

        {/* Top Selling Product */}
        {topSellingProducts?.length > 0 && (
          <section className="container mx-auto py-5">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Top Selling Products</h2>
              <Link href={"/products"} className="hover:underline">
                View all
              </Link>
            </div>
            <FeaturedProduct products={topSellingProducts} />
          </section>
        )}
        {/* product banner */}
        {banners?.length > 0 && (
          <SellerAds
            banners={(banners || []).filter(
              (item: { type: string }) => item.type === "Footer"
            )}
          />
        )}

        {/* More discount */}
        {/* {discounts && (
          <section className="md:py-5 p-3 text-center bg-[#F6F6F6]">
            <Discount discounts={discounts} />
          </section>
        )} */}

        {/* More Discover */}
        {/* <MoreDiscover /> */}
        {/* <section className="relative bg-[url('/newsletter.jpg')] bg-cover bg-center bg-no-repeat text-white py-20 px-6 md:px-12">
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
        </section> */}
      </main>
      <ScrollToCart />
      <WebFooter />
    </>
  );
}
