"use client";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import Image from "next/image";
import { useState } from "react";
import { CiSquareChevRight } from "react-icons/ci";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./heroSectionSlider.css";

const ProductImageGallery = ({ images }: { images: string }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null) as any;
  const newimages = images?.split(",");

  return (
    <div className="w-full space-y-4">
      <div className="relative group rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
        <Swiper
          loop={newimages?.length >= 3}
          spaceBetween={0}
          className="h-[500px] w-full"
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          navigation={{
            nextEl: ".gallery-next",
            prevEl: ".gallery-prev",
          }}
        >
          {(newimages || []).map((item: string, idx: number) => {
            const image = getUploadImageUrl(item, "/pos_software.png");
            return (
              <SwiperSlide key={idx} className="bg-white flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Zoom>
                    <Image
                      src={image}
                      alt={item}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-4"
                      {...(idx === 0 ? { priority: true } : { loading: "lazy" })}
                    />
                  </Zoom>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Navigation */}
        <button className="gallery-prev absolute top-1/2 left-4 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-gray-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 disabled:opacity-0">
          <CiSquareChevRight className="rotate-180" size={24} />
        </button>
        <button className="gallery-next absolute top-1/2 right-4 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-gray-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 disabled:opacity-0">
          <CiSquareChevRight size={24} />
        </button>
      </div>

      <div className="relative px-2">
        <Swiper
          onSwiper={(swiper) => setThumbsSwiper(swiper)}
          loop={false}
          spaceBetween={16}
          slidesPerView={5}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="h-24 w-full thumbs-swiper"
          breakpoints={{
            320: { slidesPerView: 4, spaceBetween: 10 },
            640: { slidesPerView: 5, spaceBetween: 16 }
          }}
        >
          {(newimages || []).map((item: string, idx: number) => {
            const image = getUploadImageUrl(item, "/default-placeholder.png");
            return (
              <SwiperSlide key={idx} className="cursor-pointer rounded-xl overflow-hidden border-2 border-transparent transition-all !h-24 bg-gray-50">
                <div className="relative w-full h-full">
                  <Image
                    alt={item}
                    fill
                    sizes="100px"
                    className="object-cover"
                    src={image}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductImageGallery;
