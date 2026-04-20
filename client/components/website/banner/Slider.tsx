"use client";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
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

export default function Slider({ banners }: any) {
  if (!banners?.length) return null;

  return (
    <div className="relative group w-full overflow-hidden">
      <Swiper
        modules={[Pagination, Navigation, A11y, EffectFade, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletActiveClass: "!bg-white !opacity-100 !w-8 !rounded-full",
          bulletClass:
            "swiper-pagination-bullet !bg-white/50 !opacity-100 !w-2.5 !h-2.5 !transition-all !duration-300",
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        effect="fade"
        speed={1000}
        className="w-full h-[65vh] md:h-[750px]"
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
            index: number
          ) => (
            <SwiperSlide key={`${image}-${index}`}>
              <div className="relative w-full h-full">
                {/* Background Image with Zoom Effect */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-linear transform scale-100 hover:scale-105"
                  style={{
                    backgroundImage: `url(${getUploadImageUrl(image)})`,
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Content Container */}
                <div className="relative z-10 h-full container mx-auto px-4 md:px-8 lg:px-12 flex flex-col justify-center items-start">
                  <div className="max-w-3xl space-y-6 animate-fade-up">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold !text-white leading-[1.1] tracking-tighter drop-shadow-2xl">
                      {title}
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-200 font-medium max-w-2xl leading-relaxed drop-shadow-lg opacity-90">
                      {description}
                    </p>

                    <div className="pt-6">
                      <Link href={url || "/products"}>
                        <Button
                          type="primary"
                          size="large"
                          className="!h-14 !px-10 !text-base md:!text-lg !font-semibold flex items-center gap-3 group/btn !bg-white/10 !border !border-white/20 !text-white hover:!bg-white hover:!text-black !backdrop-blur-md !rounded-full transition-all duration-500 hover:!scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.2)]"
                        >
                          Shop Collection
                          <ArrowRightOutlined className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        )}

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev-custom absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </div>
        <div className="swiper-button-next-custom absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </div>
      </Swiper>
    </div>
  );
}
