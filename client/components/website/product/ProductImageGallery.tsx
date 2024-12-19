import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import "./heroSectionSlider.css";
import appConfig from "@/appConfig";

const ProductImageGallery = ({ images }: { images: string[] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null) as any;

  // Ensure a minimum number of slides for the loop
  const enhancedImages = images?.length < 3 ? [...images, ...images] : images;

  return (
    <div>
      <div>
        <Swiper
          loop={enhancedImages?.length >= 3}
          spaceBetween={10}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
        >
          {(enhancedImages || []).map((item: string, idx: number) => {
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
          loop={enhancedImages?.length >= 3}
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
          {(enhancedImages || []).map((item: string, idx: number) => {
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
        {/* Custom Previous and Next Buttons */}
        <button className="custom-prev">
          <CiSquareChevRight size={40} />
        </button>
        <button className="custom-next">
          <CiSquareChevLeft size={40} />
        </button>
      </div>
    </div>
  );
};

export default ProductImageGallery;
