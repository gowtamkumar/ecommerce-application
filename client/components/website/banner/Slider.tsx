"use client";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "antd";
import { Navigation } from "swiper/modules";
import Link from "next/link";

export default function Slider({ banners }: any) {
  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "500px",
    color: "black",
    backgroundColor: "red",
    lineHeight: "400px",
    textAlign: "center",
    background: "black",
  };
  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={5}
      slidesPerView={1}
      navigation

    // pagination={{ clickable: true }}
    // scrollbar={{ draggable: true }}
    // onSwiper={(swiper) => console.log(swiper)}
    // onSlideChange={() => console.log("slide change")}
    >
      {banners.data?.map(
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
            <div className="clear-both ">
              <div className="relative  font-mono">
                <Image
                  style={contentStyle}
                  src={
                    image
                      ? `http://localhost:3900/uploads/${image}`
                      : "/pos_software.png"
                  }
                  alt={image}
                  loading="lazy"
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="w-full h-auto"
                />
                <div className="absolute p-10 flex items-center bottom-0 left-0 top-0 bg-local w-1/3 backdrop-blur-sm bg-white/5 ">
                  <div>
                    <h1 className="text-4xl">{title}</h1>
                    <p className="my-4">{description}</p>
                    <Button size="large" type="primary">
                      <Link href={`${url ? url : "/shop"}`}> Shop Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        )
      )}
    </Swiper>
  );
}
