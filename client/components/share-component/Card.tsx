"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { saveWishlist } from "@/lib/apis/wishlist";
import { getProductImageUrls } from "@/lib/utils/imageUrl";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  selectGlobal,
  setUnAuthorize,
} from "@/redux/features/global/globalSlice";
import { Rate } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import ModalLogin from "../website/login/ModalLogin";
import AddToCartButton from "./AddToCartButton";
interface CardItems {
  id: number;
  name: string;
  hoverImage: string;
  discountAmount: number;
  taxAmount: number;
  thumbnailImage: string;
  unitPrice: string | number;
  discountId: number;
  averageRating: string;
  reviewsCount: string;
  discountValue: string;
  discountStrategy: string;
  slug: string;
  color: any;
  defaultProduct?: {
    id: string;
    unitPrice: number;
    purchasePrice: number;
    size: any;
  };
}

export default function Card({ item }: { item: any }) {
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const session = useSession();
  const { formatPrice, selectedCurrency } = useCurrency();

  async function AddToWishlist(productId: number) {
    try {
      const res = await saveWishlist({
        productId,
      });

      if (res.success) {
        successNotification({ message: res.message });
      }

      if (!res.success) {
        errorNotification({ message: res.message });
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const { thumbnailUrl, hoverUrl } = getProductImageUrls(
    item?.thumbnailImage,
    item?.hoverImage
  );

  return (
    <div className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-global-primary/30 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full transform hover:-translate-y-1.5">
      {/* Image Area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50/50 mix-blend-multiply dark:mix-blend-normal">
        <Link href={`/products/${item.slug}`} className="block w-full h-full relative z-0">
          <Image
            src={thumbnailUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Hover Image */}
          {hoverUrl && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-white">
              <Image
                src={hoverUrl}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          {/* Subtle bottom gradient to ensure overlay items contrast nicely */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {+item.discountAmount > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-black/90 backdrop-blur-md text-global-primary shadow-sm tracking-wider">
              SAVE {item.discountValue}
              {item.discountStrategy === "Percentage"
                ? "%"
                : selectedCurrency?.symbol}
            </span>
          )}
        </div>

        {/* Floating Actions - Slides in smoothly from Right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out z-30">
          <button
            className="w-9 h-9 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-global-primary/30 hover:bg-global-primary hover:text-white transition-all duration-300 transform hover:scale-110 hover:rotate-12"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (session.status === "unauthenticated") {
                dispatch(setUnAuthorize(true));
              } else {
                AddToWishlist(item.id);
              }
            }}
            title="Add to Wishlist"
          >
            <FaRegHeart size={15} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 relative bg-white dark:bg-transparent z-10 transition-colors duration-300">
        
        {/* Title */}
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base leading-snug group-hover:text-global-primary transition-colors duration-300 line-clamp-2 min-h-[44px] mb-2">
          <Link href={`/products/${item.slug}`}>{item.name}</Link>
        </h3>

        {/* Ratings */}
        <div className="flex items-center gap-2 mb-3">
          <Rate
            disabled
            value={+item.avgRating || 0}
            className="text-xs text-yellow-400"
            style={{ fontSize: 12 }}
          />
          <span className="text-[11px] text-gray-500 font-medium">
            ({item.reviewsCount || 0})
          </span>
        </div>

        {/* Price & Cart */}
        <div className="mt-auto flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {formatPrice(item.finalPrice)}
            </span>
            {+item?.discountValue > 0 && (
              <span className="text-xs sm:text-sm text-gray-400 font-medium line-through decoration-gray-300">
                {formatPrice(item.salePrice)}
              </span>
            )}
          </div>

          <div className="w-full transform transition-all duration-300 group-hover:-translate-y-1">
            <AddToCartButton item={{ ...item, qty: 1 }} />
          </div>
        </div>
      </div>

      {global.unAuthorize && <ModalLogin />}
    </div>
  );
}
