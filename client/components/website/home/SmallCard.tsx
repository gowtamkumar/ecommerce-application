"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

export default function SmallCard({ categories }: any) {
  const router = useRouter();

  return (
    <Swiper
      spaceBetween={5}
      slidesPerView={6}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {(categories?.data || []).map((item: any, idx: number) => {
        return (
          <SwiperSlide key={idx}>
            <div className="mx-auto p-2 flex text-center items-center justify-center border cursor-pointer">
              <div
                onClick={() => {
                  router.push(`/products?categoryId=${item.id}&`);
                }}
              >
                <Image
                  src={
                    item.image
                      ? `http://localhost:3900/uploads/${item.image}`
                      : "/pos_software.png"
                  }
                  alt={item.image}
                  loading="lazy"
                  // fill
                  width={60}
                  height={60}
                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <p>{item.name}</p>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
