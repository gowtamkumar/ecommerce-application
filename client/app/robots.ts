import appConfig from "@/appConfig";
import type { MetadataRoute } from "next";

/**
 * Single source of truth for crawler rules (do not keep a conflicting public/robots.txt).
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = (appConfig.baseUrl || "https://ecommerce.com").replace(
    /\/$/,
    ""
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/profile/",
          "/checkout",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password/",
          "/sslcommerz/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
