"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

export default function SmallCard({ categories }: any) {
  const router = useRouter();

  return (
    <Swiper
      modules={[Navigation, Scrollbar]}
      spaceBetween={5}
      slidesPerView={6}
      navigation

      // pagination={{ clickable: true }}
      // scrollbar={{ draggable: true }}
      // onSwiper={(swiper) => console.log(swiper)}
      // onSlideChange={() => console.log("slide change")}
    >
      {(categories?.data || []).map((item: any, idx: number) => {
        return (
          <SwiperSlide key={idx}>
            <div className="mx-auto flex text-center items-center justify-center cursor-pointer">
              <div
                onClick={() => {
                  router.push(`/products?categoryId=${item.id}&`);
                }}
                className="justify-items-center"
              >
                <div className=" rounded-full border flex justify-center p-6 text-center">
                  <Image
                    src={
                      item.image
                        ? `http://localhost:3900/uploads/${item.image}`
                        : "/pos_software.png"
                    }
                    alt={item.image}
                    loading="lazy"
                    // fill
                    width={80}
                    height={80}

                    // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <p className="hover:underline">{item.name}</p>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
