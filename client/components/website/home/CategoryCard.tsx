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
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border border-gray-100 group-hover:border-global-primary/50 transition-all duration-300 shadow-sm group-hover:shadow-lg bg-white flex items-center justify-center relative p-2">
                  <Image
                    alt={item.name || "image"}
                    src={getUploadImageUrl(item.image)}
                    fill
                    loading="lazy"
                    className="object-contain p-4 filter group-hover:brightness-110 transition-all duration-500 transform group-hover:scale-110"
                    sizes="(max-width: 768px) 100px, 128px"
                  />
                  <div className="absolute inset-0 rounded-full bg-global-primary/0 group-hover:bg-global-primary/5 transition-colors duration-300 pointer-events-none" />
                </div>
                <p className="mt-4 text-sm md:text-base font-semibold text-global-text group-hover:text-global-primary text-center truncate w-full px-2 transition-colors duration-300">
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
