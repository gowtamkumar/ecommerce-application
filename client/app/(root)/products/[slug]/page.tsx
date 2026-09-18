import {
  BreadcrumbSchema,
  ProductSchema,
} from "@/components/seo";
import { stripHtml } from "@/lib/utils/seo";
import { getProductBySlug } from "@/lib/apis/product";
import { getImageUrl } from "@/lib/utils/imageUrl";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import appConfig from "@/appConfig";
const SingleProduct = dynamic(
  () => import("@/components/website/product/SingleProduct")
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const product = await getProductBySlug({ slug });
  const baseUrl = (appConfig.baseUrl || "").replace(/\/$/, "");

  if (!product?.data) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const data = product.data;
  const name = data.name || "Product";
  const description =
    stripHtml(data.description)?.slice(0, 160) ||
    `Buy ${name} online.`;
  const canonicalUrl = `${baseUrl}/products/${slug}`;
  const image = getImageUrl(data.thumbnailImage);

  return {
    metadataBase: baseUrl ? new URL(baseUrl) : undefined,
    title: name,
    description,
    keywords: [name, data.brand?.name, ...(data.tags || [])]
      .filter(Boolean)
      .join(", "),
    robots: { index: true, follow: true },
    openGraph: {
      title: name,
      description,
      url: canonicalUrl,
      type: "website",
      images: image
        ? [{ url: image, width: 800, height: 600, alt: name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  if (!slug) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-500">
            The product you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  const productRes = await getProductBySlug({ slug });
  const product = productRes?.data;
  const baseUrl = (appConfig.baseUrl || "").replace(/\/$/, "");
  const canonicalUrl = `${baseUrl}/products/${slug}`;

  const defaultVariant =
    product?.productVariants?.find((v: any) => v.isDefault) ||
    product?.productVariants?.[0];

  const images = [
    getImageUrl(product?.thumbnailImage),
    ...(typeof product?.images === "string"
      ? product.images
          .split(",")
          .filter(Boolean)
          .map((img: string) => getImageUrl(img.trim()))
      : []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {product && (
        <>
          <ProductSchema
            name={product.name}
            description={product.description}
            image={images}
            url={canonicalUrl}
            sku={defaultVariant?.sku || product.sku}
            brand={product.brand?.name}
            price={product.finalPrice}
            currency="BDT"
            stockQty={
              defaultVariant?.stockQty ?? product.stockQty ?? product.qty
            }
            ratingValue={product.avgRating || product.rating}
            reviewCount={
              product.reviewsCount || product.reviews?.length || 0
            }
            reviews={product.reviews || []}
          />
          <BreadcrumbSchema
            items={[
              { name: "Home", url: "/" },
              { name: "Products", url: "/products" },
              { name: product.name, url: `/products/${slug}` },
            ]}
          />
        </>
      )}
      <SingleProduct slug={slug} />
    </div>
  );
}
