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

export default function SmallCard({ categories }: any) {
  const router = useRouter();

  return (
    <>
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
          spaceBetween={5}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={true}
          speed={1000}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          breakpoints={{
            // when window width is >= 640px
            640: {
              // width: 640,
              slidesPerView: 2,
            },
            // when window width is >= 768px
            768: {
              // width: 768,
              slidesPerView: 5,
            },
          }}
        >
          {(categories?.data || []).map((item: any, idx: number) => {
            return (
              <SwiperSlide key={idx}>
                <div className="w-8/12 mx-auto flex text-center items-center justify-center cursor-pointer">
                  <div
                    onClick={() => {
                      router.push(`/products?categoryId=${item.id}&`);
                    }}
                  >
                    <div className="rounded-full border flex justify-center p-5 text-center">
                      <Image
                        alt={item.image}
                        src={
                          item.image
                            ? `${appConfig.baseApiUrl}/uploads/${item.image}`
                            : "/pos_software.png"
                        }
                        loading="lazy"
                        // fill
                        width={70}
                        height={70}
                        // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <p className="hover:underline">{item.name}</p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {/* Custom Previous Button */}
        <button className="custom-prev absolute z-40 top-1/2 -left-6 transform -translate-y-1/2">
          <FaCaretLeft size={40} />
        </button>
        {/* Custom Next Button */}
        <button className="custom-next absolute z-40 top-1/2 -right-5 transform -translate-y-1/2">
          <FaCaretRight size={40} />
        </button>
      </div>
    </>
  );
}
