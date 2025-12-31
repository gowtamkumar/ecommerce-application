import { getPublicCategories } from "@/lib/apis/categories";
import Link from "next/link";
import React from "react";
import { FaChevronRight } from "react-icons/fa";

export default async function PostCategorySection({ searchParams }: { searchParams: Promise<any> }) {
  const categories = await getPublicCategories();
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams?.categoryId;

  return (
    <ul className="space-y-2">
      <li>
        <Link
          href="/blog"
          className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
            !activeCategory
              ? "bg-blue-50 text-blue-700 font-semibold shadow-sm ring-1 ring-blue-100"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-100"
          }`}
        >
          <span className="flex items-center gap-2">
            All Topics
          </span>
          {!activeCategory && <FaChevronRight className="text-xs" />}
        </Link>
      </li>
      {(categories.data || []).map((category: any) => {
        const params = new URLSearchParams(resolvedParams);
        params.set("categoryId", category.id);
        // Reset page when changing category
        params.set("page", "1");

        const isActive = activeCategory === category.id?.toString();

        return (
          <li key={category.id}>
            <Link
              href={`?${params.toString()}`}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold shadow-sm ring-1 ring-blue-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-100"
              }`}
            >
              <span>{category.name}</span>
              {isActive && <FaChevronRight className="text-xs" />}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
