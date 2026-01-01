"use client";
import { Button } from "antd";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import {
  A11y,
  Autoplay,
  EffectFade,
  Pagination,
  Navigation,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ArrowRightOutlined } from "@ant-design/icons";

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
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                {/* Content Container */}
                <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex flex-col justify-center items-start">
                  <div className="max-w-3xl space-y-6 animate-fade-up">
                    <h1 className="text-4xl md:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                      {title}
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-200 font-light max-w-2xl leading-relaxed drop-shadow-md">
                      {description}
                    </p>
                    
                    <div className="pt-4">
                      <Link href={url || "/products"}>
                        <Button
                          type="primary"
                          size="large"
                          className="!h-14 !px-10 !text-lg !font-medium !bg-global-primary !text-white !border-none hover:!bg-global-hover hover:!text-white transition-all duration-300 flex items-center gap-2 group/btn shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                          Shop Now
                          <ArrowRightOutlined className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
        <div className="swiper-button-next-custom absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </Swiper>
    </div>
  );
}
