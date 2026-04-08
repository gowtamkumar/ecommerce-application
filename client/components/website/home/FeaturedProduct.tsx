"use client";
import Card from "@/components/share-component/Card";
import {
  A11y,
  EffectFade,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const FeaturedProduct = ({ products }: any) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade]}
      spaceBetween={16}
      breakpoints={{
        // when window width is >= 320px
        320: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        // when window width is >= 480px
        480: {
          slidesPerView: 3,
          spaceBetween: 12,
        },
        // when window width is >= 640px
        640: {
          slidesPerView: 4,
          spaceBetween: 16,
        },

        // when window width is >= 768px
        768: {
          // width: 768,
          slidesPerView: 5,
        },
      }}
      pagination={{ clickable: true }}
      className="!pb-12 !pt-4 !px-4 -mx-4"
    >
      {products?.map((item: any, index: number) => (
        <SwiperSlide key={index} className="!h-auto flex">
          <Card item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default FeaturedProduct;
