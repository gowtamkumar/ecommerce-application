"use client";
import Link from "next/link";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

export default function Offer() {
  return (
    <div className="container mx-auto">
      <Swiper
        modules={[Navigation, Scrollbar]}
        spaceBetween={5}
        slidesPerView={3}
        navigation
        // pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log("slide change")}
      >
        {[{}, {}, {}].map((item: any, idx: number) => {
          return (
            <SwiperSlide key={idx}>
              <div className="relative gap-2">
                <img src="/image-box-12.jpg" className="h-auto w-full" alt="" />
                <div className="absolute p-10 flex items-center bottom-0 left-0 top-0 bg-local w-full backdrop-blur-sm bg-white/5">
                  <div className="w-full text-white">
                    <h2>30% Off</h2>
                    <div className=" text-center">
                      <Link href="/">
                        <div className="flex justify-center items-center">
                          <span className="px-2 text-6xl font-bold">
                            Shop Now
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
