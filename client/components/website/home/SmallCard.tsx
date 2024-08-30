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
      spaceBetween={50}
      slidesPerView={4}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {(categories?.data || []).map((item: any, idx: number) => {
        return (
          <SwiperSlide key={idx}>
            <div className="mx-auto text-center hover:shadow-xl cursor-pointer p-3">
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
                  width={100}
                  height={100}
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
