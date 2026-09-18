import appConfig from "@/appConfig";
import { getPublicCategories } from "@/lib/apis/categories";
import { getDiscounts } from "@/lib/apis/discount";
import { getPosts } from "@/lib/apis/posts";
import { getPublicProducts } from "@/lib/apis/product";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

function asList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

/**
 * Dynamic sitemap — URLs must match live App Router paths.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (appConfig.baseUrl || "https://ecommerce.com").replace(
    /\/$/,
    ""
  );
  const currentDate = new Date();

  try {
    const [productsRes, discountsRes, categoriesRes, postsRes] =
      await Promise.all([
        getPublicProducts({ perPage: 500, page: 1 }),
        getDiscounts(),
        getPublicCategories(),
        getPosts({ perPage: 200, page: 1 }),
      ]);

    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/offers`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.7,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: `${baseUrl}/support-and-help`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.4,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms-conditions`,
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 0.3,
      },
      {
        url: `${baseUrl}/shipping-policy`,
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 0.3,
      },
    ];

    const products: MetadataRoute.Sitemap = asList(productsRes?.data)
      .filter((product: any) => product?.slug)
      .map((product: any) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: product.updatedAt
          ? new Date(product.updatedAt)
          : currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    const discounts: MetadataRoute.Sitemap = asList(discountsRes?.data)
      .filter((discount: any) => discount?.slug)
      .map((discount: any) => ({
        url: `${baseUrl}/offers/${discount.slug}`,
        lastModified: discount.updatedAt
          ? new Date(discount.updatedAt)
          : currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    const categories: MetadataRoute.Sitemap = asList(categoriesRes?.data)
      .filter((category: any) => category?.slug)
      .map((category: any) => ({
        // Pretty URL; page redirects to filtered products listing
        url: `${baseUrl}/categories/${category.slug}`,
        lastModified: category.updatedAt
          ? new Date(category.updatedAt)
          : currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.65,
      }));

    const posts: MetadataRoute.Sitemap = asList(postsRes?.data)
      .filter((post: any) => post?.slug)
      .map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));

    return [
      ...staticRoutes,
      ...products,
      ...discounts,
      ...categories,
      ...posts,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];
  }
}
