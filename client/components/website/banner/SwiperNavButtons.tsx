"use client";
import { Button } from "antd";
import React from "react";
import { useSwiper } from "swiper/react";

export const SwiperNavButtons = () => {
  const swiper = useSwiper();

  return (
    <div className="flex gap-1 py-1">
      <Button size="small" onClick={() => swiper.slidePrev()}>
        Prev
      </Button>
      <Button size="small" onClick={() => swiper.slideNext()}>
        Next
      </Button>
    </div>
  );
};
