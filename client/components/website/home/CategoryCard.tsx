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
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="relative w-full">
          <Swiper
            modules={[Navigation, Autoplay, Pagination, Scrollbar, A11y]}
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              320: { slidesPerView: 3, spaceBetween: 10 },
              480: { slidesPerView: 4, spaceBetween: 15 },
              640: { slidesPerView: 5, spaceBetween: 20 },
              768: { slidesPerView: 6, spaceBetween: 20 },
              1024: { slidesPerView: 8, spaceBetween: 20 },
            }}
            className="py-4"
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
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-transparent group-hover:border-global-primary transition-all duration-300 shadow-sm group-hover:shadow-md bg-gray-50 flex items-center justify-center">
                      <Image
                        alt={item.name || "image"}
                        src={getUploadImageUrl(item.image)}
                        loading="lazy"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-700 group-hover:text-global-primary text-center truncate w-full px-2">
                      {item.name}
                    </p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
