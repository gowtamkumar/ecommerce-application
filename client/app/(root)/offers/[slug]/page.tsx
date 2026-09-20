import appConfig from "@/appConfig";
import OfferDetailView from "@/components/website/offers/OfferDetailView";
import { getDiscountBySlug } from "@/lib/apis/discount";
import { getPublicProducts } from "@/lib/apis/product";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const discountRes = await getDiscountBySlug(slug);
  const discount = discountRes?.data;
  const baseUrl = appConfig.baseUrl;

  if (!discount) {
    return {
      metadataBase: baseUrl ? new URL(`${baseUrl}`) : undefined,
      title: "Discount Not Found",
      description: "Sorry, the requested discount offer does not exist.",
      keywords: "discount, not found, offer",
      robots: "noindex, nofollow",
    };
  }

  const { name, description, image, tags } = discount;
  const canonicalUrl = `${baseUrl}/offers/${slug}`;
  const imageUrl = image ? `${appConfig.baseApiUrl}/uploads/${image}` : null;

  return {
    metadataBase: baseUrl ? new URL(`${baseUrl}`) : undefined,
    title: `${name} | Special Offer`,
    description: description || `Shop ${name} online with exclusive discounts.`,
    keywords: tags ? tags.join(", ") : name,
    robots: { index: true, follow: true },
    openGraph: {
      title: `${name} | Special Offer`,
      description: description,
      url: canonicalUrl,
      type: "website",
      images: imageUrl
        ? [{ url: imageUrl, width: 800, height: 600, alt: name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Special Offer`,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function OfferPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const discount = await getDiscountBySlug(slug);

  let products: any[] = [];
  if (discount?.success) {
    const productsRes = await getPublicProducts({ discountSlug: slug });
    products = productsRes?.data || [];
  }

  return (
    <OfferDetailView
      discount={discount}
      initialProducts={products}
      slug={slug}
    />
  );
}
