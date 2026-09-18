"use client";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function PromoBanners({ banners }: { banners: any[] }) {
  if (!banners?.length) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {banners.map((item: any, index: number) => (
          <Link
            key={index}
            href={item.url ? `/offers${item.url}` : "/products"}
            className="group relative h-[300px] sm:h-[340px] rounded-xl overflow-hidden block"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{
                backgroundImage: `url(${getUploadImageUrl(item.image)})`,
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex flex-col items-start gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white leading-snug">
                  {item.title}
                </h3>
                {item.description ? (
                  <p className="mt-1.5 text-sm text-white/80 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                ) : null}
              </div>

              <span className="inline-flex items-center gap-2 text-sm font-semibold text-white border-b border-white/40 pb-0.5 group-hover:border-global-primary group-hover:text-global-primary transition-colors duration-300">
                Shop now
                <ArrowRightOutlined className="text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
