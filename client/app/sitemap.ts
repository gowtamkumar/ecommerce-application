import appConfig from "@/appConfig";
import { getPublicCategories } from "@/lib/apis/categories";
import { getPublicProducts } from "@/lib/apis/product";

export const dynamic = "force-dynamic";
export default async function sitemap() {
  try {
    const [productsRes, categories] = await Promise.all([
      getPublicProducts({}),
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

    // const resCategories = (categories.data || []).map(
    //   ({ slug }: { slug: string }) => ({
    //     url: escapeXML(`${appConfig.baseUrl}/categories/${slug}`),
    //     lastModified: new Date().toISOString(),
    //   })
    // );

    const staticRoutes = ["/", "/about", "/contact", "/support-and-help"].map(
      (route) => ({
        url: `${appConfig.baseUrl}${route}`,
        lastModified: new Date().toISOString(),
      })
    );

    return [...staticRoutes, ...products];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
