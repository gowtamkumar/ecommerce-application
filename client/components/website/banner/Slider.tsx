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
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import Image from "next/image";
import { FaCaretRight } from "react-icons/fa6";
import { FaCaretLeft } from "react-icons/fa";

export default function Slider({ banners }: any) {
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
          spaceBetween={5}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={true}
          speed={1000}
          navigation={{
            nextEl: ".hero-next",
            prevEl: ".hero-prev",
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
                <div className="md:h-[57vh] md:p-0 p-5 flex items-center">
                  <div className="grid md:grid-cols-2 grid-cols-1 items-center text-center">
                    <div className="md:order-1 order-2 text-center md:text-start">
                      <h1 className="md:text-4xl text-2xl font-bold">
                        {title.slice(0, 50)}
                      </h1>
                      <p className="my-3 font-medium">
                        {description?.slice(0, 100)}
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

        <button className="hero-prev absolute z-40 top-1/2 -left-6 transform -translate-y-1/2">
          <FaCaretLeft size={40} className="text-bioxin-primary" />
        </button>

        {/* Custom Next Button */}
        <button className="hero-next absolute z-40 top-1/2 -right-5 transform -translate-y-1/2">
          <FaCaretRight size={40} className="text-bioxin-primary" />
        </button>
      </div>
    </>
  );
}
