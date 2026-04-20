"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  EffectFade,
  Autoplay,
} from "swiper/modules";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";

export default function CategoryCard({ categories }: any) {
  const router = useRouter();

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Autoplay, Pagination, Scrollbar, A11y]}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          320: { slidesPerView: 3, spaceBetween: 15 },
          480: { slidesPerView: 4, spaceBetween: 20 },
          640: { slidesPerView: 5, spaceBetween: 25 },
          768: { slidesPerView: 6, spaceBetween: 30 },
          1024: { slidesPerView: 8, spaceBetween: 40 },
        }}
        className="!pb-6 !pt-2"
      >
        {(categories || []).map((item: any, idx: number) => {
          return (
            <SwiperSlide key={idx}>
              <div
                className="flex flex-col items-center justify-center cursor-pointer group"
                onClick={() => {
                  router.push(`/products?categoryId=${item.id}&`);
                }}
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] group-hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.12)] group-hover:scale-105 bg-white dark:bg-gray-800/80 flex items-center justify-center relative p-3">
                  <Image
                    alt={item.name || "image"}
                    src={getUploadImageUrl(item.image)}
                    fill
                    loading="lazy"
                    className="object-contain p-5 filter group-hover:brightness-105 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform group-hover:scale-110 group-hover:-translate-y-1"
                    sizes="(max-width: 768px) 100px, 128px"
                  />
                  <div className="absolute inset-0 rounded-full bg-global-primary/0 group-hover:bg-global-primary/5 transition-colors duration-500 pointer-events-none ring-1 ring-inset ring-gray-900/5 dark:ring-white/10" />
                </div>
                <p className="mt-5 text-sm md:text-base font-semibold text-gray-600 dark:text-gray-300 group-hover:text-global-primary text-center truncate w-full px-2 transition-colors duration-300">
                  {item.name}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
