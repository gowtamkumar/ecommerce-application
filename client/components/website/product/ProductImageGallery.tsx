import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import "./heroSectionSlider.css";
import appConfig from "@/appConfig";

const ProductImageGallery = ({ images }: { images: string }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null) as any;
  const newimages = images?.split(",")

  return (
    <div className="w-full">
      <Swiper
        loop={newimages?.length >= 3}
        spaceBetween={10}
        className="h-[50vh] w-full"
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {(newimages || []).map((item: string, idx: number) => {
          return (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-[50vh]">
                <Image
                  src={
                    item
                      ? `${appConfig.baseApiUrl}/uploads/${item}`
                      : "/pos_software.png"
                  }
                  alt={item}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  {...(idx === 0 ? { priority: true } : { loading: "lazy" })}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="relative">
        <Swiper
          onSwiper={(swiper) => setThumbsSwiper(swiper)}
          loop={newimages?.length >= 3}
          direction="horizontal"
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="h-[10vh] w-full"
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
        >
          {(newimages || []).map((item: string, idx: number) => {
            return (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-[10vh] cursor-pointer">
                  <Image
                    alt={item}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    {...(idx === 0 ? { priority: true } : { loading: "lazy" })}
                    src={
                      item
                        ? `${appConfig.baseApiUrl}/uploads/${item}`
                        : "/default-placeholder.png"
                    }
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      {/* Custom Previous and Next Buttons */}
      <button className="custom-prev">
        <CiSquareChevRight size={40} />
      </button>
      <button className="custom-next">
        <CiSquareChevLeft size={40} />
      </button>
    </div>
  );
};

export default ProductImageGallery;
