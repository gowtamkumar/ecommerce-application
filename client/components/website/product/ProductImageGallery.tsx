import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import "./heroSectionSlider.css";

const ProductImageGallery = ({ images }: any) => {
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
          <SwiperSlide>
            <Image
              height={400}
              width={400}
              className="object-cover"
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
