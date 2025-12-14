import appConfig from "@/appConfig";
import Card from "@/components/share-component/Card";
import PremiumEmpty from "@/components/share-component/PremiumEmpty";
import ScrollToCart from "@/components/share-component/ScrollToCart";
import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import { getDiscountBySlug } from "@/lib/apis/discount";
import { getPublicProducts } from "@/lib/apis/product";
import { getImageUrl } from "@/lib/utils/imageUrl";


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log("generateMetadata", slug);

  const discountRes = await getDiscountBySlug(slug);
  const discount = discountRes?.data;
  const baseUrl = appConfig.baseUrl;
  if (!discount) {
    return {
      metadataBase: new URL(`${baseUrl}`),
      title: "Discount Not Found",
      description: "Sorry, the requested discount offer does not exist.",
      keywords: "discount, not found, offer",
      robots: "noindex, nofollow",
    };
  }
  const { name, description, image, tags } = discount;
  const canonicalUrl = `${baseUrl}/discounts/${slug}`;
  const imageUrl = image ? `${appConfig.baseApiUrl}/uploads/${image}` : null;
  return {
    metadataBase: new URL(`${baseUrl}`),
    title: `Offer: ${name}`,
    description: description || "Check out this special discount offer.",
    keywords: tags ? tags.join(", ") : name,
    robots: "index, follow",
    openGraph: {
      title: name,
      description: description,
      url: canonicalUrl,
      type: "website",
      images: imageUrl
        ? [{ url: imageUrl, width: 800, height: 600, alt: name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: { canonical: canonicalUrl },
    additionalMetaTags: [
      { name: "author", content: "ecommerce" },
      { name: "canonical", content: canonicalUrl },
    ],
  };
}


export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log("slug", slug);
  const discount = await getDiscountBySlug(slug);


  let products: any[] = [];
  if (discount.success) {
    const productsRes = await getPublicProducts({ discountSlug: slug });
    products = productsRes.data || [];
  }

  const offer = discount?.data;

  return (
    <>
      <Header />

      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 animate-gradient-shift"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-blue-100/20"></div>

        <div className="relative z-10">
          {discount.success && offer ? (
            <>
              {/* Premium Hero Section */}
              <div className="relative py-16 md:py-24">
                {/* Hero Background Image with Overlay */}
                {offer.image && (
                  <div className="absolute inset-0">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${getImageUrl(offer.image)})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-transparent"></div>
                    </div>
                  </div>
                )}

                <div className="container mx-auto px-4 relative z-10">
                  <div className="max-w-4xl mx-auto text-center">
                    {/* Discount Badge */}
                    {offer.discountStrategy === "Percentage" ? (
                      <div className="mb-6 inline-block">
                        <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-3xl md:text-4xl shadow-2xl animate-pulse">
                          {+offer.value}% OFF
                        </div>
                      </div>
                    ) :
                      offer.discountStrategy === "fixed" && (
                        <div className="mb-6 inline-block">
                          <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-3xl md:text-4xl shadow-2xl animate-pulse">
                            {+offer.value} OFF
                          </div>
                        </div>
                      )
                    }

                    {/* Offer Name */}
                    <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight ${offer.image ? 'text-white drop-shadow-2xl' : 'bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent'}`}>
                      {offer.name}
                    </h1>

                    {/* Description */}
                    {offer.description && (
                      <p className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto ${offer.image ? 'text-white/95 drop-shadow-lg' : 'text-gray-700'}`}>
                        {offer.description}
                      </p>
                    )}

                    {/* Offer Details Card */}
                    <div className="inline-block backdrop-blur-xl bg-white/20 border border-white/40 rounded-2xl p-6 shadow-2xl">
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                        {/* Scope */}
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span className="text-white font-semibold">{offer.scope}</span>
                        </div>

                        {/* Valid Until */}
                        {offer.endDate && (
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-white font-semibold">
                              Valid until {new Date(offer.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <section className="container mx-auto px-4 pb-16">
                {products.length > 0 ? (
                  <>
                    {/* Section Header */}
                    <div className="text-center my-12">
                      <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                        Featured Products
                      </h2>
                      <p className="text-gray-600 text-lg">
                        Discover amazing products available with this exclusive offer
                      </p>
                    </div>

                    {/* Products Grid */}
                    <div className="backdrop-blur-xl bg-white/30 border border-white/50 rounded-3xl p-6 md:p-8 shadow-1xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {products.map((item: any) => (
                          <div
                            key={item.id}
                            className="group  transition-all duration-300 hover:z-10"
                          >
                            <div className="rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                              <Card item={item} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center py-20">
                    <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl p-12 shadow-2xl max-w-md">
                      <PremiumEmpty description="No products available under this offer." />
                    </div>
                  </div>
                )}
              </section>
            </>
          ) : (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
              <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl p-12 shadow-2xl max-w-md w-full">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    Offer Expired
                  </h2>
                </div>
                <PremiumEmpty description="This offer has expired. Please check our other amazing deals!" />
              </div>
            </div>
          )}
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

