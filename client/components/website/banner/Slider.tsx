"use client";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "antd";
import { Navigation } from "swiper/modules";
import Link from "next/link";

export default function Slider({ banners }: any) {
  // const contentStyle: React.CSSProperties = {
  //   margin: 0,
  //   height: "400px",
  //   color: "black",
  //   backgroundColor: "red",
  //   lineHeight: "400px",
  //   textAlign: "center",
  //   background: "black",
  // };
  return (
    <div className="container mx-auto bg-[#F6F6F6]">
      <div className="grid grid-cols-12">
        <div className="col-span-9">
          <Swiper
            modules={[Navigation]}
            spaceBetween={5}
            slidesPerView={1}
            navigation
            autoplay
          // navigation={{
          //   prevEl: '.prev',
          //   nextEl: '.next',
          // }}
          // wrapperTag="ul"
          // scrollbar={{ draggable: true }}
          // onSwiper={(swiper) => console.log(swiper)}
          // onSlideChange={() => console.log("slide change")}
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
                  <div className="w-10/12 mx-auto h-[50vh]">
                    <div className="grid grid-cols-2 items-center">
                      <div className="">
                        <h1 className="text-4xl">{title}</h1>
                        <p className="my-4">{description}</p>
                        <Button size="large" type="primary">
                          <Link href={`${url ? url : "/shop"}`}>Shop Now</Link>
                        </Button>
                      </div>

                      <Image
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
                        className="w-full h-[50vh]"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
        <div className="col-span-3 bg-black">right</div>
      </div>
    </div>
  );
}
