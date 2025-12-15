"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function PostSearchSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("searchTerm", searchTerm);
    } else {
      params.delete("searchTerm");
    }
    // Reset page to 1 on new search
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Search</h3>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-600"
          >
            🔍
          </button>
        </div>
      </form>
    </div>
  );
}
