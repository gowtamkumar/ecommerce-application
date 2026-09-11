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
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import AddToCartButton from "./AddToCartButton";

export default function Card({ item }: { item: any }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const session = useSession();
  const { formatPrice, selectedCurrency } = useCurrency();

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (session.status === "unauthenticated") {
      dispatch(setUnAuthorize(true));
      return;
    }

    try {
      setIsWishlistLoading(true);
      const res = await saveWishlist({ productId: item.id });
      if (res.success) {
        setIsWishlisted(!isWishlisted);
        successNotification({ message: res.message || "Updated wishlist" });
      } else {
        errorNotification({ message: res.message || "Failed to update wishlist" });
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setIsWishlistLoading(false);
    }
  }

  const { thumbnailUrl, hoverUrl } = getProductImageUrls(
    item?.thumbnailImage,
    item?.hoverImage
  );

  const discountVal = Number(item?.discountValue || 0);
  const isOutOfStock = item?.stockQty !== undefined && item?.stockQty <= 0;
  const isLowStock = item?.stockQty !== undefined && item?.stockQty > 0 && item?.stockQty <= 5;
  const isNewArrival = item?.isNewArrival || item?.isFeatured;

  return (
    <div className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col h-full">
      {/* 4:5 Aspect Ratio Media Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50/70">
        <Link href={`/products/${item.slug}`} className="block w-full h-full">
          <Image
            src={thumbnailUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {hoverUrl && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out">
              <Image
                src={hoverUrl}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          )}
        </Link>

        {/* Floating Semantic Badge Stack */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {discountVal > 0 && (
            <span className="bg-rose-600 text-white px-2.5 py-1 rounded-full font-black text-[9px] uppercase tracking-wider shadow-sm shadow-rose-600/30">
              -{item.discountValue}
              {item.discountStrategy === "Percentage" ? "%" : selectedCurrency?.symbol} OFF
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-900/90 text-white backdrop-blur-sm px-2.5 py-0.5 rounded-full font-bold text-[8px] uppercase tracking-wider">
              Out of Stock
            </span>
          )}
          {!isOutOfStock && isLowStock && (
            <span className="bg-amber-500 text-white px-2.5 py-0.5 rounded-full font-bold text-[8px] uppercase tracking-wider shadow-xs">
              Only {item.stockQty} Left
            </span>
          )}
          {!discountVal && isNewArrival && (
            <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-bold text-[8px] uppercase tracking-wider">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={handleWishlist}
            disabled={isWishlistLoading}
            aria-label="Add to wishlist"
            className="w-8 h-8 sm:w-9 sm:h-9 bg-white/90 backdrop-blur-md text-gray-500 hover:text-rose-600 rounded-full flex items-center justify-center shadow-xs hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-200 border border-gray-100"
          >
            {isWishlisted ? (
              <FaHeart className="text-rose-600 text-sm animate-pulse" />
            ) : (
              <FaRegHeart className="text-sm" />
            )}
          </button>
        </div>

        {/* Desktop Quick-Action Hover Overlay */}
        <div className="absolute bottom-3 left-3 right-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20 hidden sm:block">
          <AddToCartButton
            item={{ ...item, qty: 1 }}
            className="!h-10 !rounded-xl !text-[11px] !font-black !tracking-wider !bg-gray-900 hover:!bg-black shadow-lg shadow-gray-900/20"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 sm:p-5 flex flex-col flex-1 bg-white justify-between">
        <div>
          {/* Brand / Category Micro-Header */}
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 truncate">
            {item?.brand?.name || "Original Brand"}
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 min-h-[32px] sm:min-h-[38px] mb-2">
            <Link href={`/products/${item.slug}`}>{item.name}</Link>
          </h3>
        </div>

        {/* Price & Rating */}
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-black text-gray-900 tracking-tight">
                {formatPrice(item.finalPrice)}
              </span>
              {discountVal > 0 && (
                <span className="text-[11px] text-gray-400 line-through font-medium">
                  {formatPrice(item.salePrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Rate
                disabled
                value={Number(item.avgRating) || 0}
                className="text-[9px] text-amber-400"
              />
              <span className="text-[10px] font-semibold text-gray-400">
                ({item.reviewsCount || 0})
              </span>
            </div>
          </div>

          {/* Mobile Quick Action Button */}
          <div className="sm:hidden pt-1">
            <AddToCartButton
              item={{ ...item, qty: 1 }}
              className="!h-9 !rounded-xl !text-[10px] !font-bold !bg-gray-900 hover:!bg-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
