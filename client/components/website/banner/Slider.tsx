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

const DEFAULT_HEIGHT_CLASS =
  "w-full aspect-[2.5/1] sm:aspect-[2.8/1] md:aspect-[3/1] min-h-[170px]";

export default function Slider({ banners, heightClass, className }: any) {
  // Graceful luxury fallback if no banners exist yet
  const slides =
    banners && banners.length > 0
      ? banners
      : [
          {
            image: "",
            title: "Elevate Your Lifestyle with Curated Essentials",
            description:
              "Discover exceptional craftsmanship, modern aesthetics, and verified authenticity in our latest seasonal release.",
            url: "/products",
          },
        ];

  return (
    <div
      className={`relative group w-full overflow-hidden bg-slate-900 ${
        className || ""
      }`}
    >
      <Swiper
        modules={[Pagination, Navigation, A11y, EffectFade, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletActiveClass:
            "bg-amber-400 opacity-100 w-8 sm:w-10 rounded-full shadow-md shadow-amber-400/50",
          bulletClass:
            "swiper-pagination-bullet bg-white/40 opacity-100 w-2 h-2 mx-1 transition-all duration-300",
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        loop={slides.length > 1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={700}
        className={`w-full ${heightClass || DEFAULT_HEIGHT_CLASS}`}
      >
        {slides.map(
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
            <SwiperSlide key={`${image || "slide"}-${index}`}>
              <div className="relative w-full h-full bg-slate-900">
                {image ? (
                  <Link
                    href={url || "/products"}
                    className="block w-full h-full relative overflow-hidden group/slide cursor-pointer"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover/slide:scale-[1.02]"
                      style={{
                        backgroundImage: `url(${getUploadImageUrl(image)})`,
                      }}
                    />
                  </Link>
                ) : (
                  <div className="relative w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/40 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                    <div className="max-w-2xl space-y-3 md:space-y-4">
                      {title && (
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                          {title}
                        </h2>
                      )}
                      {description && (
                        <p className="text-xs sm:text-sm text-white/80 line-clamp-2">
                          {description}
                        </p>
                      )}
                      <div className="pt-2">
                        <Link
                          href={url || "/products"}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-global-primary hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all duration-300"
                        >
                          <span>Shop now</span>
                          <ArrowRightOutlined className="text-xs" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ),
        )}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              className="swiper-button-prev-custom absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/15 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
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
              className="swiper-button-next-custom absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/15 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </Swiper>
    </div>
  );
}
