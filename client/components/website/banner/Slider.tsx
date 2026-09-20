"use client";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
    A11y,
    Autoplay,
    EffectFade,
    Navigation,
    Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const DEFAULT_HEIGHT_CLASS = "h-[55vh] min-h-105 max-h-160 md:h-[70vh] md:max-h-180";

export default function Slider({ banners, heightClass, className }: any) {
  if (!banners?.length) return null;

  return (
    <div
      className={`relative group w-full overflow-hidden bg-gray-100 ${className || ""}`}
    >
      <Swiper
        modules={[Pagination, Navigation, A11y, EffectFade, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletActiveClass: "bg-white opacity-100 w-7 rounded-full",
          bulletClass:
            "swiper-pagination-bullet bg-white/40 opacity-100 w-2 h-2 mx-1 transition-all duration-300",
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        loop
        effect="fade"
        speed={900}
        className={`w-full ${
          heightClass || DEFAULT_HEIGHT_CLASS
        }`}
      >
        {banners.map(
          (
            {
              image,
              title,
              description,
              url,
            }: {
              image: string;
              title: string;
              description: string;
              url: string;
            },
            index: number,
          ) => (
            <SwiperSlide key={`${image}-${index}`}>
              <div className="relative w-full h-full">
                <div
                  className="absolute inset-0 bg-cover bg-center scale-100 transition-transform duration-[12s] ease-out group-hover:scale-[1.03]"
                  style={{
                    backgroundImage: `url(${getUploadImageUrl(image)})`,
                  }}
                />

                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/45 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="relative z-10 h-full container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col justify-end items-start pb-16 md:pb-20 lg:pb-24">
                  <div className="max-w-2xl space-y-4 md:space-y-5">
                    {index === 0 ? (
                      <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-semibold text-white leading-[1.1] tracking-tight break-words drop-shadow-sm">
                        {title}
                      </h1>
                    ) : (
                      <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-semibold text-white leading-[1.1] tracking-tight break-words drop-shadow-sm">
                        {title}
                      </h2>
                    )}
                    {description ? (
                      <p className="text-sm sm:text-base md:text-lg text-white/85 font-normal max-w-xl leading-relaxed">
                        {description}
                      </p>
                    ) : null}

                    <div className="pt-1.5 md:pt-2">
                      <Link
                        href={url || "/products"}
                        className="inline-flex items-center gap-2.5 h-11 md:h-12 px-6 md:px-7 rounded-full bg-global-primary text-white text-sm md:text-base font-semibold shadow-lg shadow-black/25 ring-1 ring-white/20 hover:brightness-110 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Shop Collection
                        <ArrowRightOutlined className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ),
        )}

        <button
          type="button"
          aria-label="Previous slide"
          className="swiper-button-prev-custom absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/90 text-gray-900 flex items-center justify-center cursor-pointer hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md ring-1 ring-black/5"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="rotate-180"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          className="swiper-button-next-custom absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/90 text-gray-900 flex items-center justify-center cursor-pointer hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md ring-1 ring-black/5"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </Swiper>
    </div>
  );
}