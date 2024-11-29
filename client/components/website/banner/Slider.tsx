"use client";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "antd";
import {
  A11y,
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import Link from "next/link";
import appConfig from "@/appConfig";

export default function Slider({ banners }: any) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade, Autoplay]}
      spaceBetween={5}
      slidesPerView={1}
      pagination
      autoplay={true}
      speed={1000}
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
            <div className="mx-auto md:h-[57vh] md:p-0 p-5">
              <div className="grid md:grid-cols-2 grid-cols-1 items-center text-center">
                <div className="md:order-1 order-2 text-center md:text-start">
                  <h1 className="md:text-4xl text-2xl font-bold">
                    {title.slice(0, 50)}
                  </h1>
                  <p className="my-3 font-medium">
                    {description.slice(0, 100)}
                  </p>
                  <Button type="primary">
                    <Link href={`${url ? url : "/shop"}`}>Shop Now</Link>
                  </Button>
                </div>
                <div className="bg-slate-600 md:order-2 order-1">
                  <Image
                    src={
                      image
                        ? `${appConfig.apiUrl}/uploads/${image}`
                        : "/pos_software.png"
                    }
                    alt={title}
                    loading="lazy"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="w-full md:h-[57vh] h-[30vh] "
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        )
      )}
    </Swiper>
  );
}
