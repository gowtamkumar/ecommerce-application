import appConfig from '@/appConfig';
import { getImageUrl } from '@/lib/utils/imageUrl';
import StructuredData from './StructuredData';

interface ProductOffer {
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Discontinued';
  validFrom?: string;
  priceValidUntil?: string;
  url?: string;
}

interface ProductReview {
  author: string;
  datePublished: string;
  reviewRating: {
    ratingValue: number;
    bestRating?: number;
  };
  reviewBody?: string;
}

interface ProductSchemaProps {
  name: string;
  description: string;
  image?: string | string[];
  sku?: string;
  brand?: string;
  offers: ProductOffer;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
  };
  reviews?: ProductReview[];
}

/**
 * ProductSchema Component
 * Generates Product structured data for rich snippets with pricing, availability, and reviews
 * Enables product rich results in Google search
 */
export default function ProductSchema({
  name,
  description,
  image,
  sku,
  brand = 'ecommerce',
  offers,
  aggregateRating,
  reviews,
}: ProductSchemaProps) {
  const baseUrl = appConfig.baseUrl || 'https://ecommerce.com';
  
  // Handle image URLs
  const imageUrls = Array.isArray(image) 
    ? image.map(img => getImageUrl(img, `${baseUrl}/default-product.jpg`))
    : [getImageUrl(image, `${baseUrl}/default-product.jpg`)];

  const productData: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: imageUrls,
    ...(sku && { sku }),
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      price: offers.price.toFixed(2),
      priceCurrency: offers.currency || 'USD',
      availability: `https://schema.org/${offers.availability || 'InStock'}`,
      url: offers.url || baseUrl,
      ...(offers.validFrom && { priceValidFrom: offers.validFrom }),
      ...(offers.priceValidUntil && { priceValidUntil: offers.priceValidUntil }),
    },
  };

  // Add aggregate rating if available
  if (aggregateRating) {
    productData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: aggregateRating.bestRating || 5,
    };
  }

  // Add reviews if available
  if (reviews && reviews.length > 0) {
    productData.review = reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.datePublished,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.reviewRating.ratingValue,
        bestRating: review.reviewRating.bestRating || 5,
      },
      ...(review.reviewBody && { reviewBody: review.reviewBody }),
    }));
  }

  return <StructuredData data={productData} />;
}
