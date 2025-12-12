import appConfig from "@/appConfig";
import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import ScrollToCart from "@/components/website/ScrollToCart";
import { getDiscounts } from "@/lib/apis/discount";
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
      <div>
        {offers?.data?.length > 0 ? (
          <section className="container mx-auto grid md:grid-cols-4 gap-8 py-3">
            {offers?.data?.map((item: any, index: number) => (
              <Link
                key={index}
                className="bottom-auto"
                href={`/offers/${item.slug}`}
              >
                <div
                  className="bg-cover  bg-center rounded-lg h-56 flex flex-col justify-center items-start text-white p-4 text-start"
                  style={{
                    backgroundImage: `url(${appConfig.baseApiUrl}/uploads/${item.image})`,
                  }}
                ></div>
              </Link>
            ))}
          </section>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>

      <ScrollToCart />
      <WebFooter />
    </>
  );
}
