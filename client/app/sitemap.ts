import appConfig from "@/appConfig";
import { getPublicCategories } from "@/lib/apis/categories";
import { getDiscounts } from "@/lib/apis/discount";
import { getPublicProducts } from "@/lib/apis/product";

export const dynamic = "force-dynamic";
export default async function sitemap() {
  try {
    const [productsRes, discountsRes, categoriesRes] = await Promise.all([
      getPublicProducts({}),
      getDiscounts(),
      getPublicCategories(),
    ]);

    function escapeXML(str: string): string {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/'/g, "&apos;")
        .replace(/"/g, "&quot;");
    }

    const products = (productsRes.data || []).map(
      ({ slug }: { slug: string }) => ({
        url: escapeXML(`${appConfig.baseUrl}/product/${slug}`),
        lastModified: new Date().toISOString(),
      })
    );

    const discounts = (discountsRes.data || []).map(
      ({ slug }: { slug: string }) => ({
        url: escapeXML(`${appConfig.baseUrl}/offers/${slug}`),
        lastModified: new Date().toISOString(),
      })
    );

    const categories = (categoriesRes.data || []).map(
      ({ id }: { id: string | number }) => ({
        url: escapeXML(`${appConfig.baseUrl}/products?categoryId=${id}`),
        lastModified: new Date().toISOString(),
      })
    );

    const staticRoutes = ["/", "/about", "/contact", "/support-and-help"].map(
      (route) => ({
        url: `${appConfig.baseUrl}${route}`,
        lastModified: new Date().toISOString(),
      })
    );

    return [...staticRoutes, ...products, ...discounts, ...categories];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
