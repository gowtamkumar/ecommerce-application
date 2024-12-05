"use client";
import { getPublicProducts } from "@/lib/apis/product";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  A11y,
  EffectFade,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import Card from "@/components/Card";
import Link from "next/link";

const FeaturedProduct = ({products}: any) => {
  // const [products, setProducts] = useState([]);
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const products = await getPublicProducts({});
  //       setProducts(products?.data);
  //     } catch (error) {
  //       console.error("Failed to fetch products:", error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  return (
    <section className="md:w-8/12 mx-auto md:py-5 p-3">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold pb-8">Featured Products</h2>
        <Link href={"/products"} className="hover:underline">
          View all
        </Link>
      </div>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade]}
        spaceBetween={5}
        breakpoints={{
          // when window width is >= 640px
          640: {
            // width: 640,
            slidesPerView: 1,
          },
          // when window width is >= 768px
          768: {
            // width: 768,
            slidesPerView: 4,
          },
        }}
        pagination
      >
        {products?.map((item: any) => (
          <SwiperSlide key={item.id}>
            <Card item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default FeaturedProduct;
