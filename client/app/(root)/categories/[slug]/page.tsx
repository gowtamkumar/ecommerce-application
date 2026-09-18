import appConfig from "@/appConfig";
import { getPublicCategories } from "@/lib/apis/categories";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

async function findCategory(slug: string) {
  const res = await getPublicCategories();
  const list = Array.isArray(res?.data) ? res.data : [];
  return list.find(
    (cat: any) => cat.slug === slug || String(cat.id) === slug
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await findCategory(slug);
  const baseUrl = (appConfig.baseUrl || "").replace(/\/$/, "");

  if (!category) {
    return {
      title: "Category Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = category.name;
  const description =
    category.description ||
    `Shop ${category.name} products. Browse the full collection.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/products?categoryId=${category.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/categories/${category.slug || slug}`,
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Pretty category URLs resolve to the product listing filter.
 */
export default async function CategorySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await findCategory(slug);

  if (!category) notFound();

  redirect(`/products?categoryId=${category.id}`);
}
