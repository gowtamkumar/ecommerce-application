import appConfig from "@/appConfig";
import { getProductBySlug } from "@/lib/apis/product";
import dynamic from "next/dynamic";
const ScrollToCart = dynamic(() => import("@/components/share-component/ScrollToCart"));
const Header = dynamic(() => import("@/components/website/header/Header"));
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));
const SingleProduct = dynamic(
  () => import("@/components/website/product/SingleProduct")
);

interface Product {
  name: string;
  productCategories: any;
  description: string;
  thumbnailImage: string;
  images: any;
  reviews: any[];
  tags: any;
  colors: any;
  brand: any;
  rating: string;
  finalPrice: number | string;
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const product = await getProductBySlug({
    slug,
  });

  const urlGet = appConfig.baseUrl;
  const imageUrl = appConfig.baseApiUrl;

  if (!product || !product.data) {
    return {
      metadataBase: new URL(`${urlGet}`), // Dynamically set base URL
      title: "ecommerce",
      description: "The requested product could not be found.",
      robots: "noindex, nofollow",
    };
  }

  const {
    name,
    description,
    thumbnailImage,
    images,
    reviews,
    rating,
    tags,
    finalPrice,
  } = (product.data as Product) || {};
  const canonicalUrl = `${urlGet}/products/${slug}`;

  // Ensure images URLs are absolute
  const absoluteMetaImgUrl =
    thumbnailImage && `${imageUrl}/uploads/${thumbnailImage}`;

  const absolutePhotosUrls = images
    ?.split(",")
    .map((image: string) => `${imageUrl}/uploads/${image}`);

  const reviewsSchema = reviews?.map((item: any) => ({
    "@type": "Review",
    reviewBody: item.comment,
    author: {
      "@type": "Person",
      name: item?.user?.name ? item?.user?.name : " ",
    },
    datePublished: item.createdAt,
    reviewRating: {
      "@type": "Rating",
      ratingValue: item?.rating,
      bestRating: "5",
    },
  }));

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: name || "Default Product Name",
    description: description || "Default product description",
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: finalPrice || "0.00",
      url: `${appConfig.baseUrl}/products/${slug}`,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating || "0",
      reviewCount: reviews?.length || "0",
    },
    review: reviewsSchema,
  };

  return {
    metadataBase: new URL(urlGet as string), // Ensuring base URL is set correctly for image links
    title: `Buy Now | ${name}`,
    description: description,
    keywords: `${name}, ${tags}`,
    robots: "index, follow",
    openGraph: {
      title: name,
      description: description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: absoluteMetaImgUrl,
          width: 800,
          height: 600,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: description,
      images: absolutePhotosUrls,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    additionalMetaTags: [
      {
        name: "author",
        content: "ecommerce",
      },
      {
        name: "canonical",
        content: canonicalUrl,
      },
    ],
    other: {
      "application/ld+json": JSON.stringify(productSchema),
    },
  };
}

export default async function Product({ params }: { params: Promise<{ slug: string }> }) {


  const slug = (await params).slug;
  console.log("slug", slug);
  if (!slug) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100">
          <h1 className="text-center text-2xl font-bold mt-10">
            Product Not Found
          </h1>
        </div>
        <ScrollToCart />
        <WebFooter />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100">
        <SingleProduct slug={slug} />
      </div>
      <ScrollToCart />
      <WebFooter />
    </>
  );
}
