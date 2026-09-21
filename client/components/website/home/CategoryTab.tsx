"use client";

import { useState } from "react";
import { FiGrid } from "react-icons/fi";
import CategoryProduct from "./CategoryProduct";

interface CategoryTabProps {
  categories?: any[];
}

export default function CategoryTab({ categories: initialCategories }: CategoryTabProps) {
  const categories = initialCategories || [];

  const [activeKey, setActiveKey] = useState<string | undefined>(
    categories.length > 0 ? categories[0].id.toString() : undefined
  );

  if (!categories.length) return null;

  return (
    <div className="space-y-6">
      {/* Luxury Pill Selectors */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((item: any) => {
          const isSelected = activeKey === item.id.toString();
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveKey(item.id.toString())}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? "bg-gray-900 text-white shadow-md shadow-gray-900/15"
                  : "bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 border border-gray-200/80"
              }`}
            >
              <FiGrid
                className={`w-3.5 h-3.5 transition-colors ${
                  isSelected ? "text-amber-400" : "text-gray-400"
                }`}
              />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {activeKey && (
        <div className="pt-2">
          <CategoryProduct id={activeKey} />
        </div>
      )}
    </div>
  );
}
