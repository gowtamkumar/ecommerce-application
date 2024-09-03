import { getAllCategories } from "@/lib/apis/categories";
import React from "react";

export default async function PostCategorySection() {
  const categories = await getAllCategories();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Categories</h3>
      <ul className="space-y-2">
        {(categories.data || []).map((category: any) => (
          <li key={category.id}>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 hover:underline"
            >
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
