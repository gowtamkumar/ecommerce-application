"use client";

import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiGrid } from "react-icons/fi";
import { A11y, Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function CategoryCard({ categories }: any) {
  if (!categories || !categories.length) return null;

  return (
    <div className="w-full relative group/cat">
      <Swiper
        modules={[Navigation, Autoplay, A11y]}
        spaceBetween={16}
        slidesPerView={2.2}
        navigation={{
          nextEl: ".cat-next",
          prevEl: ".cat-prev",
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          480: { slidesPerView: 3.2, spaceBetween: 16 },
          640: { slidesPerView: 4.2, spaceBetween: 20 },
          768: { slidesPerView: 5.2, spaceBetween: 20 },
          1024: { slidesPerView: 6.2, spaceBetween: 24 },
          1280: { slidesPerView: 7.2, spaceBetween: 24 },
        }}
        className="py-3"
      >
        {categories.map((item: any, idx: number) => {
          const catImage = item.image ? getUploadImageUrl(item.image) : "";
          const linkUrl = item.slug
            ? `/categories/${item.slug}`
            : `/products?categoryId=${item.id}`;

          return (
            <SwiperSlide key={item.id || idx}>
              <Link
                href={linkUrl}
                className="group flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-gray-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer"
              >
                {/* Image / Icon container */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center ring-1 ring-gray-100 group-hover:ring-amber-400/40 transition-all duration-300">
                  {catImage ? (
                    <Image
                      alt={item.name || "category"}
                      src={catImage}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 96px, 112px"
                    />
                  ) : (
                    <FiGrid className="w-8 h-8 text-gray-300 group-hover:text-amber-500 transition-colors" />
                  )}

                  {/* Subtle Gradient Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Category Title */}
                <span className="mt-3 text-xs sm:text-sm font-bold text-gray-800 group-hover:text-global-primary text-center line-clamp-1 w-full px-1 transition-colors">
                  {item.name}
                </span>

                <span className="mt-0.5 text-[11px] text-gray-400 group-hover:text-amber-600 font-medium inline-flex items-center gap-1 transition-colors">
                  <span>Explore</span>
                  <FiArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Modern Chevrons */}
      <button
        type="button"
        aria-label="Previous categories"
        className="cat-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-800 shadow-md hidden md:flex items-center justify-center -ml-3 opacity-0 group-hover/cat:opacity-100 transition-all hover:bg-amber-500 hover:text-white hover:border-amber-500 cursor-pointer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          className="rotate-180"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next categories"
        className="cat-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-800 shadow-md hidden md:flex items-center justify-center -mr-3 opacity-0 group-hover/cat:opacity-100 transition-all hover:bg-amber-500 hover:text-white hover:border-amber-500 cursor-pointer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
