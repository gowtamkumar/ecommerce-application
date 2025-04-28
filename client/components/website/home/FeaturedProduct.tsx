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
        // when window width is >= 320px
        320: {
          slidesPerView: 2,
          spaceBetween: 5,
        },
        // when window width is >= 480px
        480: {
          slidesPerView: 3,
          spaceBetween: 5,
        },
        // when window width is >= 640px
        640: {
          slidesPerView: 4,
          spaceBetween: 5,
        },

        // when window width is >= 768px
        768: {
          // width: 768,
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
