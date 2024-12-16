import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import "./heroSectionSlider.css";
import appConfig from "@/appConfig";

const ProductImageGallery = ({ images }: { images: string[] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null) as any;

  return (
    <div>
      <div>
        <Swiper
          loop={true}
          spaceBetween={10}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
        >
          {(images || []).map((item: string, idx: number) => {
            return (
              <SwiperSlide key={idx}>
                <Image
                  height={400}
                  width={400}
                  className="object-cover"
                  loading="lazy"
                  src={
                    item
                      ? `${appConfig.apiUrl}/uploads/${item}`
                      : "/pos_software.png"
                  }
                  alt={item}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div>
        <Swiper
          onSwiper={(swiper) => setThumbsSwiper(swiper)}
          loop={true}
          direction="horizontal"
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="h-[10vh]"
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
        >
          {(images || []).map((item: string, idx: number) => {
            return (
              <SwiperSlide key={idx}>
                <Image
                  height={200}
                  width={200}
                  loading="lazy"
                  src={
                    item
                      ? `${appConfig.apiUrl}/uploads/${item}`
                      : "/pos_software.png"
                  }
                  alt={item}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
        {/* Custom Previous Button */}
        {/* <div className="flex justify-between"> */}
        <button className="custom-prev">
          <CiSquareChevRight size={40} />
        </button>
        {/* Custom Next Button */}
        <button className="custom-next">
          <CiSquareChevLeft size={40} />
        </button>
        {/* </div> */}
      </div>
    </div>
  );
};

export default ProductImageGallery;
