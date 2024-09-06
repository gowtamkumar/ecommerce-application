"use client";
import { getPublicProducts } from "@/lib/apis/product";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import {
  selectProduct,
  setProducts,
} from "@/redux/features/products/productSlice";
import { Rate } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  A11y,
  EffectFade,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import { SwiperNavButtons } from "../banner/SwiperNavButtons";
// import { GlobalState, Product, ProductVariant, Review } from "@/types"; // Import appropriate types from your types file

const ProductFeatured = () => {
  const [products, setProducts] = useState([]);
  console.log("🚀 ~ products:", products);
  const global = useSelector(selectGlobal);
  // const { products } = useSelector(selectProduct);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getPublicProducts({});
        setProducts(products?.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
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
          slidesPerView: 5,
        },
      }}
      pagination={{ clickable: true, dynamicBullets: true }}
    >
      {products?.map((item: any) => (
        <SwiperSlide key={item.id}>
          <ProductItem item={item} />
        </SwiperSlide>
      ))}
      <SwiperNavButtons />
    </Swiper>
  );
};

interface ProductItemProps {
  item: any;
}

const ProductItem: React.FC<ProductItemProps> = ({ item }) => {
  const price = +item.productVariants[0]?.price || 0;
  const reviewsCount = +item.reviews.length || 0;
  const discount = item.discount;
  const taxAmount = (+price * (+item?.tax?.value || 0)) / 100;

  const disAmount =
    discount?.discountType === "Percentage"
      ? ((price + taxAmount) * (discount.value || 0)) / 100
      : +discount?.value || 0;

  const productRating =
    item.reviews.reduce((acc: number, review: any) => acc + +review.rating, 0) /
    reviewsCount;
  const stockQty = item.productVariants.reduce(
    (acc: number, variant: any) => acc + +variant.stockQty,
    0
  );
  const image = item.images ? item.images[0] : "/pos_software.png";

  return (
    <div className="bg-white border ">
      <Link href={`/products/${item.id}`} title={item.name}>
        <Image
          src={
            item.images
              ? `http://localhost:3900/uploads/${item.images[0]}`
              : "/pos_software.png"
          }
          alt={item.name}
          loading="lazy"
          width={0}
          height={0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-50 mb-2"
        />
        <div className="p-2 text-sm">
          <h3 className="font-semibold text-sm mb-2">
            {item.name.slice(0, 50)}
          </h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-500 mb-2 text-xs">
              ৳{" "}
              {item?.discountId
                ? (price + taxAmount - disAmount).toFixed(2)
                : (price + taxAmount).toFixed(2)}
            </p>
            <div className={stockQty > 0 ? "text-green-500" : "text-red-500"}>
              <p className="text-xs">
                {" "}
                {stockQty > 0 ? "In Stock" : "Out of Stock"}
              </p>
            </div>
          </div>
          {item?.discountId && (
            <div className="text-xs">
              <span className="line-through text-gray-500 ">
                ৳ {(price + taxAmount).toFixed(2)}
              </span>
              <span className="text-red-600 ml-2">
                -{discount?.value}
                {discount?.discountType === "Percentage" ? "%" : "BDT"}
              </span>
            </div>
          )}
          <span className="flex gap-1 items-center">
            <Rate disabled value={productRating || 0} />({reviewsCount})
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ProductFeatured;
