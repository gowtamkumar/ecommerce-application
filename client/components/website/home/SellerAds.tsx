"use client";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const SellerAds = ({ banners }: any) => {
  if (!banners?.length) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-global-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-global-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          slidesPerView={1}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          speed={1000}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          pagination={{
            clickable: true,
            bulletActiveClass: "!bg-white !opacity-100 !w-8 !rounded-full",
            bulletClass: "swiper-pagination-bullet !bg-white/20 !opacity-100 !w-2.5 !h-2.5 !transition-all !duration-300"
          }}
          className="!pb-12"
        >
          {banners.map((item: any, idx: number) => (
            <SwiperSlide key={idx}>
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[450px]">
                {/* Content Side */}
                <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                  <div className="space-y-6 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-medium text-gray-300 uppercase tracking-widest">
                        Limited Edition
                      </span>
                    </div>

                    <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl">
                      {item.title}
                    </h2>

                    <p className="text-lg text-gray-400 leading-relaxed font-light border-l-2 border-white/10 pl-6">
                      {item.description}
                    </p>
                  </div>

                  <Link href="/products">
                    <Button
                      type="primary"
                      size="large"
                      className="!h-14 !px-12 !text-lg !font-medium !bg-global-hover !text-white !border-none !rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:!bg-global-hover hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
                    >
                      Explore Now <ArrowRightOutlined />
                    </Button>
                  </Link>
                </div>

                {/* Image Side */}
                <div className="order-1 lg:order-2 relative flex justify-center items-center group">
                  <div className="relative w-full max-w-md aspect-square">
                    {/* Glowing Ring */}
                    <div className="absolute inset-0 border border-white/10 rounded-full scale-90 animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-0 border border-white/5 rounded-full scale-110 animate-[spin_15s_linear_infinite_reverse]" />

                    {/* Center Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-global-primary/30 to-global-secondary/30 rounded-full blur-3xl group-hover:blur-[100px] transition-all duration-700" />

                    {/* Image */}
                    <div className="relative h-full w-full transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
                      <Image
                        src={getUploadImageUrl(item.image, "/pos_software.png")}
                        alt={item.title || "Banner Image"}
                        fill
                        className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={idx === 0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SellerAds;
