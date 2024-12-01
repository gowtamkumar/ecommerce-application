import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import "./heroSectionSlider.css";

const ProductImageGallery = ({ images }: any) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null) as any;

  return (
    <>
      <div className="relative w-full">
        <Swiper
          loop={true}
          spaceBetween={10}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper2"
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
        >
          <SwiperSlide>
            <Image
              height={400}
              width={400}
              loading="lazy"
              src="https://dev.ecomfixr.com/wp-content/uploads/2024/11/unique_point.png"
              alt="unique_point"
            />
          </SwiperSlide>

          <SwiperSlide>
            <Image
              height={400}
              width={400}
              loading="lazy"
              src="https://dev.ecomfixr.com/wp-content/uploads/2024/11/product_comp.png"
              alt="unique_point"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              height={400}
              width={400}
              loading="lazy"
              src="https://dev.ecomfixr.com/wp-content/uploads/2024/11/product_image2.png"
              alt="unique_point"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              height={400}
              width={400}
              loading="lazy"
              src="https://dev.ecomfixr.com/wp-content/uploads/2024/11/product_image2.png"
              alt="unique_point"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              height={400}
              width={400}
              loading="lazy"
              src="https://dev.ecomfixr.com/wp-content/uploads/2024/11/product_image3.png"
              alt="unique_point"
            />
          </SwiperSlide>
        </Swiper>

        {/* Custom Previous Button */}
        <button className="custom-prev absolute z-40 top-1/2 -left-6 transform -translate-y-1/2">
          <FaCaretLeft size={40} className="text-bioxin-primary" />
        </button>

        {/* Custom Next Button */}
        <button className="custom-next absolute z-40 top-1/2 -right-5 transform -translate-y-1/2">
          <FaCaretRight size={40} className="text-bioxin-primary" />
        </button>
      </div>

      {/* ======= */}
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Image
            fill
            loading="lazy"
            src="https://dev.ecomfixr.com/wp-content/uploads/2024/11/unique_point.png"
            alt="unique_point"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Image
            fill
            loading="lazy"
            src="https://dev.ecomfixr.com/wp-content/uploads/2024/11/product_comp.png"
            alt="unique_point"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            fill
            loading="lazy"
            src="https://dev.ecomfixr.com/wp-content/uploads/2024/11/product_image2.png"
            alt="unique_point"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            fill
            loading="lazy"
            src="https://dev.ecomfixr.com/wp-content/uploads/2024/11/product_image2.png"
            alt="unique_point"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            fill
            loading="lazy"
            src="https://dev.ecomfixr.com/wp-content/uploads/2024/11/product_image3.png"
            alt="unique_point"
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default ProductImageGallery;
