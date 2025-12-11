import appConfig from "@/appConfig";
import { getPublicCategories } from "@/lib/apis/categories";
import { getDiscounts } from "@/lib/apis/discount";
import { getPublicProducts } from "@/lib/apis/product";
import type { MetadataRoute } from 'next';

export const dynamic = "force-dynamic";

/**
 * Dynamic Sitemap Generation
 * Generates sitemap.xml for search engines with proper priorities and change frequencies
 * Automatically includes all products, discounts, categories, and static pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = appConfig.baseUrl || 'https://ecommerce.com';
  const currentDate = new Date();

  try {
    const [productsRes, discountsRes, categoriesRes] = await Promise.all([
      getPublicProducts({}),
      getDiscounts(),
      getPublicCategories(),
    ]);

    // Static pages with SEO priorities
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/support-and-help`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.4,
      },
    ];

    // Dynamic product pages
    const products: MetadataRoute.Sitemap = (productsRes.data || []).map(
      (product: any) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    );

    // Discount/offer pages
    const discounts: MetadataRoute.Sitemap = (discountsRes.data || []).map(
      (discount: any) => ({
        url: `${baseUrl}/offers/${discount.slug}`,
        lastModified: discount.updatedAt ? new Date(discount.updatedAt) : currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })
    );

    // Category pages
    const categories: MetadataRoute.Sitemap = (categoriesRes.data || []).map(
      (category: any) => ({
        url: `${baseUrl}/products?categoryId=${category.id}`,
        lastModified: category.updatedAt ? new Date(category.updatedAt) : currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })
    );

    return [...staticRoutes, ...products, ...discounts, ...categories];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    
    // Return basic sitemap on error
    return [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}

