"use client";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "antd";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import "swiper/css/navigation";

export default function Slider({ banners }: any) {

  return (
    <div className="container mx-auto bg-[#F6F6F6]">
      <div className="grid md:grid-cols-12 grid-cols-1">
        <div className="md:col-span-9">
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
                  <div className="md:w-10/12 mx-auto md:h-[50vh] md:p-0 p-5">
                    <div className="grid md:grid-cols-2 grid-cols-1 items-center text-center">
                      <div className="md:order-1 order-2 text-center md:text-start">
                        <h1 className="md:text-4xl text-2xl font-bold">
                          {title}
                        </h1>
                        <p className="my-4">{description}</p>
                        <Button size="large" type="primary">
                          <Link href={`${url ? url : "/shop"}`}>Shop Now</Link>
                        </Button>
                      </div>
                      <div className="bg-slate-600 md:order-2 order-1">
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
                          className="w-full md:h-[50vh] h-[30vh] "
                        />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
        <div className="md:col-span-3 bg-black">right</div>
      </div>
    </div>
  );
}
