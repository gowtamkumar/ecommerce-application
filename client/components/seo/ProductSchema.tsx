import { stripHtml } from "@/lib/utils/seo";
import StructuredData from "./StructuredData";

interface ProductSchemaProps {
  name: string;
  description?: string;
  image?: string | string[];
  url: string;
  sku?: string;
  brand?: string;
  price: number | string;
  currency?: string;
  stockQty?: number;
  ratingValue?: number | string;
  reviewCount?: number;
  reviews?: Array<{
    comment?: string;
    rating?: number | string;
    createdAt?: string;
    user?: { name?: string };
  }>;
}

/**
 * Valid Product JSON-LD for Google rich results.
 */
export default function ProductSchema({
  name,
  description,
  image,
  url,
  sku,
  brand,
  price,
  currency = "BDT",
  stockQty,
  ratingValue,
  reviewCount,
  reviews = [],
}: ProductSchemaProps) {
  const numericPrice = Number(price) || 0;
  const qty = stockQty === undefined ? undefined : Number(stockQty);
  const availability =
    qty === undefined
      ? "https://schema.org/InStock"
      : qty > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock";

  const images = Array.isArray(image)
    ? image.filter(Boolean)
    : image
      ? [image]
      : [];

  const validReviews = (reviews || []).filter(
    (r) => r?.comment && Number(r?.rating) > 0
  );

  const rating = Number(ratingValue) || 0;
  const count = reviewCount ?? validReviews.length;

  const productData: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: stripHtml(description) || name,
    ...(images.length > 0 && { image: images }),
    ...(sku && { sku }),
    ...(brand && {
      brand: {
        "@type": "Brand",
        name: brand,
      },
    }),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: currency,
      price: numericPrice.toFixed(2),
      availability,
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  if (count > 0 && rating > 0) {
    productData.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      reviewCount: count,
      bestRating: "5",
      worstRating: "1",
    };
  }

  if (validReviews.length > 0) {
    productData.review = validReviews.slice(0, 10).map((item) => ({
      "@type": "Review",
      reviewBody: item.comment,
      author: {
        "@type": "Person",
        name: item?.user?.name || "Customer",
      },
      datePublished: item.createdAt,
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(item.rating),
        bestRating: "5",
      },
    }));
  }

  return <StructuredData data={productData} />;
}
