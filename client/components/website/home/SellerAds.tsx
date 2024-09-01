"use client";
import React from "react";
import { Button } from "antd";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import Image from "next/image";

const SellerAds = ({ banners }: any) => {
  return (
    <div className="container mx-auto">
      <Swiper
        modules={[Navigation, Scrollbar]}
        // spaceBetween={5}
        slidesPerView={1}
        // navigation
        // pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log("slide change")}
      >
        {(banners || []).map((item: any, idx: number) => {
          return (
            <SwiperSlide key={idx}>
              <div className="mx-auto grid min-h-[40vh] grid-cols-12 items-center gap-5">
                <div className="col-span-12 lg:col-span-6 lg:text-start text-center">
                  <h1 className="text-xl font-bold">{item.title}</h1>
                  <p className="my-3 text-xl font-medium">{item.description}</p>
                  <Button size="large" type="primary">
                    <Link href="/products"> Shop Now</Link>
                  </Button>
                </div>
                <div className="col-span-12 overflow-hidden  lg:col-span-6">
                  <div className="flex h-[40vh] w-auto items-center rounded-full bg-red-300/5 ">
                    <Image
                      src={
                        item.image
                          ? `http://localhost:3900/uploads/${item.image}`
                          : "/pos_software.png"
                      }
                      alt={item.image}
                      loading="lazy"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
    // <div className="w-8/12 mx-auto grid min-h-[40vh] grid-cols-12 items-center gap-5">
    //   <div className="col-span-12 lg:col-span-6 lg:text-start text-center">
    //     <h1 className="text-xl font-bold">Sell your Proudct</h1>
    //     <p className="my-3 text-xl font-medium">
    //       Easily create an advert for your Proudct and reach millions of
    //       potential buyers per month
    //     </p>
    //     <Button size="large" type="primary">
    //       <Link href="/products"> Shop Now</Link>
    //     </Button>
    //   </div>
    //   <div className="col-span-12 overflow-hidden  lg:col-span-6">
    //     <div className="flex h-[40vh] w-auto items-center rounded-full bg-red-300/5 ">
    //       <img src="/image-box-12.jpg" className="h-auto w-full" alt="" />
    //     </div>
    //   </div>
    // </div>
  );
};

export default SellerAds;
