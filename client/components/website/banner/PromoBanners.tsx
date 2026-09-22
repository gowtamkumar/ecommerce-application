"use client";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import Link from "next/link";

export default function PromoBanners({ banners }: { banners: any[] }) {
  if (!banners?.length) return null;

  const count = banners.length;
  const gridClass =
    count === 1
      ? "grid grid-cols-1"
      : count === 2
        ? "grid grid-cols-1 md:grid-cols-2"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const cardAspect =
    count === 1
      ? "aspect-[2.8/1] sm:aspect-[3/1]"
      : count === 2
        ? "aspect-[2.5/1] sm:aspect-[2.7/1]"
        : "aspect-[2.3/1] sm:aspect-[2.5/1] lg:aspect-[2.7/1]";

  return (
    <div className="w-full">
      <div className={`${gridClass} gap-4 lg:gap-5 xl:gap-6`}>
        {banners.map((item: any, index: number) => (
          <Link
            key={index}
            href={item.url ? `/offers${item.url}` : "/products"}
            className={`group relative ${cardAspect} rounded-2xl overflow-hidden block ring-1 ring-black/5 shadow-sm hover:shadow-lg transition-all duration-300`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              style={{
                backgroundImage: `url(${getUploadImageUrl(item.image)})`,
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
