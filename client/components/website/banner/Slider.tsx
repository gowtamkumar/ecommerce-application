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
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import Image from "next/image";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";

export default function Slider({ banners }: any) {
  return (
    <div className="md:col-span-9">
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
          loop
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
                <div className="md:h-[57vh] md:w-[60vw] mx-auto md:p-0 p-5 flex items-center">
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

        <button className="hero-prev absolute z-[5] top-1/2 -left-0 transform -translate-y-1/2">
          <CiCircleChevLeft size={30} />
        </button>

        {/* Custom Next Button */}
        <button className="hero-next absolute z-[5] top-1/2 -right-0 transform -translate-y-1/2">
          <CiCircleChevRight size={30} />
        </button>
      </div>
    </div>
  );
}
