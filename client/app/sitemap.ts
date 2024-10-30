import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: `http://localhost:3000/`, lastModified: new Date() },
    { url: `http://localhost:3000/about`, lastModified: new Date() },
  ];
}
