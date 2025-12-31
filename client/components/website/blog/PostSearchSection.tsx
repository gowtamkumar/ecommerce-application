"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

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
    <form onSubmit={handleSearch} className="relative group">
      <input
        type="text"
        className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl pl-5 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder-gray-400"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
      >
        <FaSearch />
      </button>
    </form>
  );
}
