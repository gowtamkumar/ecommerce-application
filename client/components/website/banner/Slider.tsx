"use client";
import React from "react";
import { Button } from "antd";
import Link from "next/link";
import appConfig from "@/appConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  A11y,
  Autoplay,
  EffectFade,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

export default function Slider({ banners }: any) {
  return (
    <div className="w-full">
      <Swiper
        modules={[Pagination, Scrollbar, A11y, EffectFade, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        effect="fade"
        speed={1000}
        className="w-full"
      >
        {banners?.map(
          ({
            image,
            title,
            description,
            url,
          }: {
            image: string;
            title: string;
            description: string;
            url: string;
          }) => (
            <SwiperSlide key={image}>
              <div
                className="relative w-full h-[60vh] md:h-[600px] bg-cover bg-center flex items-center justify-center"
                style={{
                  backgroundImage: `url(${appConfig.baseApiUrl}/uploads/${image})`,
                }}
              >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                  <h1 className="text-3xl md:text-6xl font-bold mb-3 md:mb-4 tracking-tight drop-shadow-lg leading-tight">
                    {title}
                  </h1>
                  <p className="text-base md:text-xl mb-6 md:mb-8 font-light text-gray-100 drop-shadow-md max-w-2xl mx-auto line-clamp-2 md:line-clamp-none">
                    {description}
                  </p>
                  <Link href={`${url ? url : "/products"}`}>
                    <Button
                      type="primary"
                      size="large"
                      className="h-10 md:h-12 px-6 md:px-8 text-base md:text-lg font-medium bg-white text-black border-none hover:!bg-gray-200 hover:!text-black transition-all transform hover:scale-105"
                    >
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          )
        )}
      </Swiper>
    </div>
  );
}
