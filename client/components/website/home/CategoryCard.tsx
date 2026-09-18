"use client";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import Image from "next/image";
import Link from "next/link";
import { A11y, Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function CategoryCard({ categories }: any) {
  return (
    <div className="w-full relative group/cat">
      <Swiper
        modules={[Navigation, Autoplay, A11y]}
        spaceBetween={16}
        slidesPerView={2.4}
        navigation={{
          nextEl: ".cat-next",
          prevEl: ".cat-prev",
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          480: { slidesPerView: 3.2, spaceBetween: 16 },
          640: { slidesPerView: 4.2, spaceBetween: 20 },
          768: { slidesPerView: 5.5, spaceBetween: 24 },
          1024: { slidesPerView: 7, spaceBetween: 28 },
          1280: { slidesPerView: 8, spaceBetween: 28 },
        }}
        className="!py-2"
      >
        {(categories || []).map((item: any, idx: number) => (
          <SwiperSlide key={item.id || idx}>
            <Link
              href={`/products?categoryId=${item.id}`}
              className="flex flex-col items-center justify-center group"
            >
              <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden bg-gray-50 ring-1 ring-gray-200/80 group-hover:ring-global-primary/40 transition-all duration-300 group-hover:shadow-md">
                <Image
                  alt={item.name || "category"}
                  src={getUploadImageUrl(item.image)}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 80px, 112px"
                />
              </div>
              <p className="mt-3 text-xs md:text-sm font-medium text-gray-700 group-hover:text-global-primary text-center line-clamp-2 w-full px-1 transition-colors duration-300">
                {item.name}
              </p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        aria-label="Previous categories"
        className="cat-prev absolute left-0 top-[40%] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm hidden md:flex items-center justify-center opacity-0 group-hover/cat:opacity-100 transition-opacity hover:border-global-primary hover:text-global-primary"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rotate-180">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next categories"
        className="cat-next absolute right-0 top-[40%] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm hidden md:flex items-center justify-center opacity-0 group-hover/cat:opacity-100 transition-opacity hover:border-global-primary hover:text-global-primary"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
