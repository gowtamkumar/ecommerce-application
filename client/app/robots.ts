import appConfig from "@/appConfig";
import { getSettings } from "@/lib/apis/setting";
import type { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settingRes = await getSettings();
  const seo = settingRes?.data?.seo || {};

  // If robotsTxt is provided in settings, we can return it as a raw string if Next allowed, 
  // but MetadataRoute.Robots expects a structured object.
  // For simplicity, if robotsTxt is provided, we can parse it if it follows a simple format, 
  // but better to just return the default if not provided and maybe just the 'disallow' list.
  
  // Actually, let's keep it simple for now as MetadataRoute.Robots is structured.
  // If we wanted full control, we would use a route handler for /robots.txt.
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/cookie-policy",
        "/privacy-policy",
        "/profile",
        "/cart",
        "/checkout",
      ],
    },
    sitemap: `${appConfig.baseUrl}/sitemap.xml`,
  };
}
