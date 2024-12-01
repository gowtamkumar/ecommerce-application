"use client";
import React, { useState } from "react";
import { Button } from "antd";
import Link from "next/link";
import appConfig from "@/appConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  A11y,
  Autoplay,
  EffectFade,
  FreeMode,
  Navigation,
  Pagination,
  Scrollbar,
  Thumbs,
} from "swiper/modules";
import "./heroSectionSlider.css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import Image from "next/image";
import { FaCaretRight } from "react-icons/fa6";
import { FaCaretLeft } from "react-icons/fa";

export default function Slider({ banners }: any) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null) as any;
  return (
    <>
      <div className="relative w-full">
        <Swiper
          modules={[
            Navigation,
            Pagination,
            Scrollbar,
            A11y,
            EffectFade,
            Autoplay,
          ]}
          thumbs={{ swiper: thumbsSwiper }}
          spaceBetween={5}
          slidesPerView={1}
          pagination
          autoplay={true}
          speed={1000}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
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
                        alt={image}
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
        <button className="custom-prev absolute z-40 top-1/2 -left-6 transform -translate-y-1/2">
          <FaCaretLeft size={40} className="text-bioxin-primary" />
        </button>

        {/* Custom Next Button */}
        <button className="custom-next absolute z-40 top-1/2 -right-5 transform -translate-y-1/2">
          {/* <span className="triangle-right-c"></span> */}
          <FaCaretRight size={40} className="text-bioxin-primary" />
        </button>
      </div>

      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {banners?.map(
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
            idx: number
          ) => (
            <SwiperSlide key={idx}>
              <Image
                fill
                loading="lazy"
                src={
                  image
                    ? `${appConfig.apiUrl}/uploads/${image}`
                    : "/pos_software.png"
                }
                alt="unique_point"
              />
            </SwiperSlide>
          )
        )}
      </Swiper>
    </>
  );
}
