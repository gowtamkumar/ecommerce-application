import appConfig from "@/appConfig";
import { BreadcrumbSchema } from "@/components/seo";
import { getPosts } from "@/lib/apis/posts";
import { getSettings } from "@/lib/apis/setting";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const Index = dynamic(() => import("@/components/website/blog/Index"));

export async function generateMetadata(): Promise<Metadata> {
  const settingRes = await getSettings();
  const siteName = settingRes?.data?.siteName || "Store";
  const baseUrl = (appConfig.baseUrl || "").replace(/\/$/, "");

  return {
    title: "Blog",
    description: `Read the latest articles, tips, and updates from ${siteName}.`,
    alternates: { canonical: `${baseUrl}/blog` },
    openGraph: {
      title: `Blog | ${siteName}`,
      description: `Stories and updates from ${siteName}.`,
      url: `${baseUrl}/blog`,
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

import Breadcrumb from "@/components/share-component/Breadcrumb";

export default async function BlogPage(props: {
  searchParams: Promise<any>;
}) {
  const searchParams = await props.searchParams;
  const posts = await getPosts(searchParams);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />
      <Index posts={posts} searchParams={searchParams} />
    </>
  );
}
