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
        640: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 5,
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
