"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Scrollbar,
  A11y,
  Autoplay,
  Pagination,
} from "swiper/modules";
import Image from "next/image";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import { setProductFilter } from "@/redux/features/global/globalSlice";
import { useRouter } from "next/navigation";
import { SwiperNavButtons } from "./SwiperNavButtons";

export default function HeaderDiscount({ discounts }: any) {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="container mx-auto">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, Autoplay]}
        // spaceBetween={5}
        slidesPerView={1}
        autoplay={true}
        speed={500}
        pagination={{ clickable: true, type: "bullets", dynamicBullets: true }}
        // navigation
        // pagination={{ clickable: true, dynamicBullets: true }}

        // pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log("slide change")}
      >
        {(discounts.data || []).map((item: any, idx: number) => {
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
                <div className="absolute flex items-center justify-center bottom-0 left-0 top-0 w-full text-white">
                  <div className="flex flex-col items-center justify-center">
                    <h4 className="text-3xl font-bold"> Discount</h4>
                    <h2 className="font-bold text-1xl">{item.value}% Off</h2>
                    <div className="text-center">
                      <div className="flex justify-center items-center">
                        <Button
                          className="px-2 text-5xl font-bold"
                          onClick={() => {
                            dispatch(
                              setProductFilter({ discount: item.value })
                            );
                            router.push("/products");
                          }}
                        >
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
        {/* <SwiperNavButtons /> */}
      </Swiper>
    </div>
  );
}
