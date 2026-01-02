import React from "react";

export default function PostTagSection({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <a
          key={index}
          href="#"
          className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full hover:bg-[color-mix(in_srgb,var(--primary-hover),transparent_90%)] hover:text-global-hover transition-colors border border-transparent hover:border-[color-mix(in_srgb,var(--primary-hover),transparent_80%)]"
        >
          #{tag}
        </a>
      ))}
    </div>
  );
}
