"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

export default function Pagination({ meta }: { meta: any }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!meta || meta.totalPage <= 1) return null;

  const currentPage = Number(meta.page) || 1;
  const totalPages = meta.totalPage;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex space-x-2">
        {/* Previous Button */}
        <Link
          href={createPageURL(currentPage - 1)}
          className={`px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 ${
            currentPage <= 1 ? "pointer-events-none opacity-50" : ""
          }`}
          aria-disabled={currentPage <= 1}
        >
          Previous
        </Link>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;
          return (
            <Link
              key={page}
              href={createPageURL(page)}
              className={`px-3 py-2 rounded-md border ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </Link>
          );
        })}

        {/* Next Button */}
        <Link
          href={createPageURL(currentPage + 1)}
          className={`px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 ${
            currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
          }`}
          aria-disabled={currentPage >= totalPages}
        >
          Next
        </Link>
      </nav>
    </div>
  );
}
