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
  "h-[60vh] min-h-[440px] max-h-[640px] md:h-[72vh] md:max-h-[720px]";

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
        speed={900}
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
            index: number
          ) => (
            <SwiperSlide key={`${image || "slide"}-${index}`}>
              <div className="relative w-full h-full bg-slate-900">
                {image ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center scale-100 transition-transform duration-[12s] ease-out group-hover:scale-[1.03]"
                    style={{
                      backgroundImage: `url(${getUploadImageUrl(image)})`,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/40" />
                )}

                {/* Sophisticated Multi-Stage Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                <div className="relative z-10 h-full container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col justify-end items-start pb-20 sm:pb-24 lg:pb-28">
                  <div className="max-w-2xl space-y-4 md:space-y-5">
                    {/* Eyebrow Chip */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span>Curated Season Collection</span>
                    </div>

                    {index === 0 ? (
                      <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white leading-[1.08] tracking-tight break-words drop-shadow-md">
                        {title}
                      </h1>
                    ) : (
                      <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white leading-[1.08] tracking-tight break-words drop-shadow-md">
                        {title}
                      </h2>
                    )}

                    {description ? (
                      <p className="text-sm sm:text-base md:text-lg text-slate-200 font-normal max-w-xl leading-relaxed">
                        {description}
                      </p>
                    ) : null}

                    <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-3.5">
                      <Link
                        href={url || "/products"}
                        className="inline-flex items-center gap-2.5 h-12 md:h-13 px-7 md:px-8 rounded-full bg-global-primary hover:bg-amber-600 text-white text-sm md:text-base font-bold shadow-lg shadow-amber-500/25 ring-1 ring-white/20 hover:shadow-xl hover:shadow-amber-500/35 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <span>Explore Collection</span>
                        <ArrowRightOutlined className="text-xs" />
                      </Link>

                      <Link
                        href="/products?featured=true"
                        className="inline-flex items-center gap-2 h-12 md:h-13 px-6 md:px-7 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white text-sm md:text-base font-semibold hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <span>Featured Drops</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
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