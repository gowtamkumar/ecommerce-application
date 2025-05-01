"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  EffectFade,
  Autoplay,
} from "swiper/modules";
import appConfig from "@/appConfig";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";

export default function CategoryCard({ categories }: any) {
  const router = useRouter();

  return (
    <section>
      <div className="container mx-auto">
        <h2 className="text-xl text-center font-semibold ">Shop by Category</h2>
        <div className="relative w-full">
          <Swiper
            modules={[
              Navigation,
              Autoplay,
              Pagination,
              Scrollbar,
              A11y,
              EffectFade,
            ]}
            spaceBetween={6}
            slidesPerView={1}
            pagination={{ clickable: true }}
            // autoplay={true}
            // speed={1000}
            // navigation={{
            //   nextEl: ".custom-next",
            //   prevEl: ".custom-prev",
            // }}
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
          >
            {(categories || []).map((item: any, idx: number) => {
              return (
                <SwiperSlide key={idx}>
                  <div
                    className="flex flex-col py-5 gap-2 items-center justify-center mx-auto bg-gray-100  text-center cursor-pointer rounded-lg"
                    onClick={() => {
                      router.push(`/products?categoryId=${item.id}&`);
                    }}
                  >
                    <Image
                      alt={item.name || "image"}
                      src={`${appConfig.baseApiUrl}/uploads/${item.image}`}
                      loading="lazy"
                      width={70}
                      height={70}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    <p className="hover:underline mt-1">{item.name}</p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          {/* Custom Previous Button */}
          {/* <button className="custom-prev absolute z-40 top-1/2 -left-6 transform -translate-y-1/2">
            <CiCircleChevLeft size={30} />
          </button>
          <button className="custom-next absolute z-40 top-1/2 -right-5 transform -translate-y-1/2">
            <CiCircleChevRight size={30} />
          </button> */}
        </div>
      </div>
    </section>
  );
}
