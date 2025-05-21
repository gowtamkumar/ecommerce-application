import appConfig from "@/appConfig";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
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
