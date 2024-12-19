"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  A11y,
  EffectFade,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import Card from "@/components/Card";

const FeaturedProduct = ({ products }: any) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade]}
      spaceBetween={5}
      breakpoints={{
        // when window width is >= 640px
        640: {
          // width: 640,
          slidesPerView: 1,
        },
        // when window width is >= 768px
        768: {
          // width: 768,
          slidesPerView: 4,
        },
      }}
      pagination
    >
      {products?.map((item: any) => (
        <SwiperSlide key={item.id}>
          <Card item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default FeaturedProduct;
