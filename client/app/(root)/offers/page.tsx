import appConfig from "@/appConfig";
import ScrollToCart from "@/components/share-component/ScrollToCart";
import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import { getDiscounts } from "@/lib/apis/discount";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { Empty } from "antd";
import Link from "next/link";

export async function generateMetadata() {
  const discountsRes = await getDiscounts({
    scope: "Global,Products,Brand,Category",
  });

  const discounts = discountsRes.data;

  const baseUrl = appConfig.baseUrl;

  // Fallback if API doesn't return expected data
  if (!Array.isArray(discounts) || discounts.length === 0) {
    return {
      metadataBase: new URL(`${baseUrl}`),
      title: "Ecommerce Discounts",
      description: "Check out our latest discounts and offers.",
      keywords: "discounts, deals, offers",
      robots: "index, follow",
    };
  }

  // Optional: Map discounts to keywords or description
  const discountNames = discounts.map((d: any) => d.name).join(", ");
  const topDescription = `Discover amazing offers: ${discountNames}`;

  return {
    metadataBase: new URL(`${baseUrl}`),
    title: "Latest Discounts & Deals",
    description: topDescription,
    keywords: discountNames,
    robots: "index, follow",
    openGraph: {
      title: "Best Ecommerce Offers",
      description: topDescription,
      url: `${baseUrl}/offers`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Top Discounts Available",
      description: topDescription,
    },
  };
}

export default async function Offers() {
  const offers = await getDiscounts({
    scope: "Global,Products,Brand,Category",
  });

  return (
    <>
      <Header />

      {/* Premium Offers Container */}
      <div className="min-h-screen relative overflow-hidden bg-global-header-bg">
        {/* Subtle Theme-aware Background Elements */}
        <div className="absolute inset-0 bg-global-primary/5 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--global-primary)_0%,_transparent_70%)] opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--global-hover)_0%,_transparent_70%)] opacity-10"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Premium Header Section */}
          <div className="container mx-auto px-4 pt-12 pb-16">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="px-6 py-2 bg-global-primary text-global-button-text text-sm font-semibold rounded-full shadow-lg">
                  🎉 Exclusive Offers
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-global-header-text leading-tight">
                Latest Discounts & Deals
              </h1>
              <p className="text-xl text-global-header-text/60 max-w-2xl mx-auto">
                Discover amazing offers and save big on your favorite products
              </p>
            </div>

            {offers?.data?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {offers?.data?.map((item: any, index: number) => (
                  <Link
                    key={index}
                    href={`/offers/${item.slug}`}
                    className="group"
                  >
                    <div className="relative h-80 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                      {/* Background Image */}
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${getImageUrl(item.image)})`,
                        }}
                      >
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      </div>

                      {/* Glassmorphism Card Overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 backdrop-blur-sm bg-black/40"></div>
                      </div>

                      {/* Theme Border on Hover */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[2px] bg-global-primary/50">
                        <div className="w-full h-full rounded-2xl bg-transparent"></div>
                      </div>

                      {/* Glow Effect on Hover */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-2xl shadow-global-primary/30"></div>

                      {/* Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        {/* Discount Badge */}
                        {item.discountPercent && (
                          <div className="absolute top-6 right-6">
                            <div className="bg-global-primary text-global-button-text px-4 py-2 rounded-full font-bold text-lg shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                              {item.discountPercent}% OFF
                            </div>
                          </div>
                        )}

                        {/* Scope Badge */}
                        <div className="mb-3">
                          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30">
                            {item.scope || 'Special Offer'}
                          </span>
                        </div>

                        {/* Offer Name */}
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 transform transition-transform duration-300 group-hover:translate-x-1 drop-shadow-md">
                          {item.name
                        }</h3>

                        {/* Description if available */}
                        {item.description && (
                          <p className="text-white/90 text-sm line-clamp-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            {item.description}
                          </p>
                        )}

                        {/* CTA Arrow */}
                        <div className="flex items-center text-white font-semibold">
                          <span className="mr-2 transform transition-transform duration-300 group-hover:translate-x-2">
                            View Offer
                          </span>
                          <svg
                            className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="mb-8 inline-block p-8 bg-global-header-bg/40 backdrop-blur-lg rounded-3xl border border-global-header-text/10 shadow-xl">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <span className="text-global-header-text/60 text-lg">
                          No offers available at the moment. Check back soon!
                        </span>
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ScrollToCart />
      <WebFooter />

      {/* <style jsx global>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
      `}</style> */}
    </>
  );
}
