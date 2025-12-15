import { getPublicCategories } from "@/lib/apis/categories";
import Link from "next/link";
import React from "react";

export default async function PostCategorySection({ searchParams }: { searchParams: any }) {
  const categories = await getPublicCategories();
  const activeCategory = searchParams?.categoryId;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Categories</h3>
      <ul className="space-y-2">
        <li>
             <Link
              href="/blog"
              className={`block hover:text-blue-600 hover:underline ${!activeCategory ? "text-blue-600 font-medium" : "text-gray-700"}`}
            >
              All
            </Link>
        </li>
        {(categories.data || []).map((category: any) => {
          const params = new URLSearchParams(searchParams);
          params.set("categoryId", category.id);
          // Reset page when changing category
          params.set("page", "1");
          
          return (
            <li key={category.id}>
              <Link
                href={`?${params.toString()}`}
                className={`block hover:text-blue-600 hover:underline ${activeCategory === category.id ? "text-blue-600 font-medium" : "text-gray-700"}`}
              >
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
