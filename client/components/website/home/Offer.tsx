"use client";
import Link from "next/link";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import Image from "next/image";
import { Button } from "antd";

export default function Offer() {
  return (
    <div className="container mx-auto">
      <Swiper
        modules={[Navigation, Scrollbar]}
        spaceBetween={5}
        // slidesPerView={3}
        navigation
        breakpoints={{
          // when window width is >= 640px
          640: {
            width: 640,
            slidesPerView: 1,
          },
          // when window width is >= 768px
          768: {
            width: 768,
            slidesPerView: 2,
          },
        }}
        // pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log("slide change")}
      >
        {[{}, {}, {}].map((item: any, idx: number) => {
          return (
            <SwiperSlide key={idx}>
              <div className="relative gap-3">
                <Image
                  src={
                    item.image
                      ? `http://localhost:3900/uploads/${item.image}`
                      : "/image-box-12.jpg"
                  }
                  alt={item.image}
                  loading="lazy"
                  // fill
                  width={0}
                  height={0}
                  className="h-[500px] w-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute p-10 flex items-center bottom-0 left-0 top-0 w-full text-white">
                  <div className="w-full">
                    <h4 className="text-6xl font-bold"> Discount</h4>
                    <h2 className="font-bold text-2xl">30% Off</h2>
                    <div className="text-center">
                      <div className="flex justify-center items-center">
                        <Button className="px-2 text-5xl font-bold">
                          Shop Now
                        </Button>
                      </div>
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
