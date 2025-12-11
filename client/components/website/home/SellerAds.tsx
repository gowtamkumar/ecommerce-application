"use client";
import { Button } from "antd";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";

const SellerAds = ({ banners }: any) => {
  return (
    <section className="py-10 mt-10 text-center bg-[#F6F6F6]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        autoplay={true}
        speed={500}
        pagination={{ clickable: true, type: "bullets", dynamicBullets: true }}
      >
        {(banners || []).map((item: any, idx: number) => {
          return (
            <SwiperSlide key={idx}>
              <div className="md:w-8/12 mx-auto grid md:min-h-[40vh] md:grid-cols-12 items-center gap-5">
                <div className="col-span-12 lg:col-span-6 lg:text-start text-center order-2 md:order-1">
                  <h1 className="md:text-4xl text-2xl font-bold">
                    {item.title}
                  </h1>
                  <p className="my-3 font-medium">{item.description}</p>
                  <Button size="large" type="primary">
                    <Link href="/products"> Shop Now</Link>
                  </Button>
                </div>
                <div className="col-span-12 flex justify-center lg:col-span-6 order-1  md:order-1">
                  <div className="relative md:my-20 my-10 md:w-[25vw] md:h-[50vh] w-[75vw] h-[30vh] items-center rounded-xl bg-red-300">
                    <div className="absolute md:w-[25vw] md:h-[50vh] w-[75vw] h-[30vh] top-[-35] right-[-30] rounded-xl bg-white">
                      <Image
                        src={getUploadImageUrl(item.image, "/pos_software.png")}
                        alt={item.image}
                        loading="lazy"
                        width="0"
                        height="0"
                        sizes="100vw"
                        className="w-auto h-auto rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default SellerAds;
