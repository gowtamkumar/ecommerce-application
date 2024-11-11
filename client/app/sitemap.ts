import appConfig from "@/appConfig";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: `/`, lastModified: new Date() },
    { url: `${appConfig.url}/about`, lastModified: new Date() },
  ];
}
