
// export const dynamic = "force-dynamic";

// import appConfig from "@/config";
// import { getBrands } from "@/lib/apis/brand";
// import { getCategories } from "@/lib/apis/categories";
// import { getFlashDeals } from "@/lib/apis/flashDeal";
// import { getProducts } from "@/lib/apis/product";
// import { getSkinTypes } from "@/lib/apis/skinType";

// export default async function sitemap() {
//   try {
//     const [productsRes, categories, brandsRes, skinTypeRes, flashDealRes] = await Promise.all([
//       getProducts(),
//       getCategories(),
//       getBrands(),
//       getSkinTypes(),
//       getFlashDeals(),
//     ]);

//     function escapeXML(str: string): string {
//       return str
//         .replace(/&/g, "&amp;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;")
//         .replace(/'/g, "&apos;")
//         .replace(/"/g, "&quot;");
//     }

//     const products = (productsRes.data || []).map(({ slug }: { slug: string }) => ({
//       url: escapeXML(`${appConfig.url}/product/${slug}`),
//       lastModified: new Date().toISOString(),
//     }));

//     const categoriesData = (categories.data || []).map(({ slug }: { slug: string }) => ({
//       url: `${appConfig.url}/category/${slug}`,
//       lastModified: new Date().toISOString(),
//     }));

//     const brandsData = (brandsRes.data.data || []).map(({ slug }: { slug: string }) => ({
//       url: `${appConfig.url}/brand/${slug}`,
//       lastModified: new Date().toISOString(),
//     }));

//     const skinTypes = (skinTypeRes.data.data || []).map(({ type_name }: { type_name: string }) => ({
//       url: `${appConfig.url}/skin-type/${type_name}`,
//       lastModified: new Date().toISOString(),
//     }));

//     const flashDeals = (flashDealRes.data || []).map(({ slug }: { slug: string }) => ({
//       url: `${appConfig.url}/deal/${slug}`,
//       lastModified: new Date().toISOString(),
//     }));

//     const staticRoutes = [
//       "/",
//       "/about",
//       "/contact",
//       "/career",
//       "/activities",
//       "/faq",
//       "/h2cap",
//       "/vitamin-c-shower",
//       "/light-uv-mirror",
//       "/hydrogen-mist",
//       "/uv-sterilization-smart-bottle-t20",
//     ].map((route) => ({
//       url: `${appConfig.url}${route}`,
//       lastModified: new Date().toISOString(),
//     }));

//     return [
//       ...categoriesData,
//       ...brandsData,
//       ...skinTypes,
//       ...flashDeals,
//       ...staticRoutes,
//       ...products,
//     ];
//   } catch (error) {
//     console.error("Error generating sitemap:", error);
//     return [];
//   }
// }
