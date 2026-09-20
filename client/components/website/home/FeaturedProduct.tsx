"use client";
import Card from "@/components/share-component/Card";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const FeaturedProduct = ({ products }: any) => {
  if (!products?.length) return null;

  return (
    <div className="relative group/products">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 12 },
          640: { slidesPerView: 3, spaceBetween: 16 },
          768: { slidesPerView: 4, spaceBetween: 16 },
          1024: { slidesPerView: 5, spaceBetween: 20 },
        }}
        navigation={{
          nextEl: ".fp-next",
          prevEl: ".fp-prev",
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: "bg-global-primary opacity-100 w-5 rounded-full",
          bulletClass:
            "swiper-pagination-bullet bg-gray-300 opacity-100 w-2 h-2 mx-1 transition-all duration-300",
        }}
        className="pb-12 pt-1"
      >
        {products.map((item: any, index: number) => (
          <SwiperSlide key={item.id || index} className="h-auto flex">
            <Card item={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        aria-label="Previous products"
        className="fp-prev absolute left-0 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-800 shadow-sm hidden md:flex items-center justify-center -ml-2 opacity-0 group-hover/products:opacity-100 transition-opacity hover:border-global-primary hover:text-global-primary"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rotate-180">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next products"
        className="fp-next absolute right-0 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-800 shadow-sm hidden md:flex items-center justify-center -mr-2 opacity-0 group-hover/products:opacity-100 transition-opacity hover:border-global-primary hover:text-global-primary"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default FeaturedProduct;
