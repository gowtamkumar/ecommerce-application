"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Scrollbar,
  Autoplay,
  Pagination,
} from "swiper/modules";
import Image from "next/image";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";

export default function HeaderDiscount({ discounts }: any) {
  const router = useRouter();

  return (
    <div className="md:col-span-3">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, Autoplay]}
        slidesPerView={1}
        autoplay={true}
        speed={500}
        pagination
      >
        {(discounts || []).map((item: any, idx: number) => {
          return (
            <SwiperSlide key={idx}>
              <div className="relative gap-3">
                <Image
                  alt={item.type}
                  src={getUploadImageUrl(item.image, "/image-box-12.jpg")}
                  loading="lazy"
                  width={0}
                  height={0}
                  className="md:h-[57vh] md:w-[60vw] rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute flex items-center justify-center bottom-0 left-0 top-0 w-full text-white">
                  <div className="flex flex-col items-center justify-center">
                    <h2 className="font-bold text-1xl">{item?.title}</h2>
                    <p>{item?.description}</p>
                    <div className="text-center">
                      <div className="flex justify-center items-center">
                        <Button
                          className="px-2 text-5xl font-bold"
                          onClick={() => {
                            router.push(`/offers${item?.url}`);
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
      </Swiper>
    </div>
  );
}
