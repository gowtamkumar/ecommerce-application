"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { saveWishlist } from "@/lib/apis/wishlist";
import { getProductImageUrls } from "@/lib/utils/imageUrl";
import {
    errorNotification,
    successNotification,
} from "@/lib/utils/notification";
import { setUnAuthorize } from "@/redux/features/global/globalSlice";
import { Rate } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import AddToCartButton from "./AddToCartButton";

export default function Card({ item }: { item: any }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
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
        errorNotification({
          message: res.message || "Failed to update wishlist",
        });
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
  const isOutOfStock =
    item?.stockQty !== undefined && item?.stockQty <= 0;
  const isLowStock =
    item?.stockQty !== undefined &&
    item?.stockQty > 0 &&
    item?.stockQty <= 5;
  const isNewArrival = item?.isNewArrival || item?.isFeatured;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col h-full">
      {/* ── Image Area ── */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Link href={`/products/${item.slug}`} className="block w-full h-full">
          {/* Thumbnail */}
          <Image
            src={thumbnailUrl}
            alt={item.name}
            fill
            className={`object-cover transition-all duration-700 ease-out group-hover:scale-[1.06] ${
              isOutOfStock ? "opacity-50 grayscale-[20%]" : ""
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Hover Image */}
          {hoverUrl && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out">
              <Image
                src={hoverUrl}
                alt={item.name}
                fill
                className={`object-cover ${isOutOfStock ? "opacity-50 grayscale-[20%]" : ""}`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          )}

          {/* Bottom gradient overlay for badge legibility */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </Link>

        {/* Status Badges — top-left stack */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
          {discountVal > 0 && (
            <span className="bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wide shadow-sm">
              -{item.discountValue}
              {item.discountStrategy === "Percentage"
                ? "%"
                : selectedCurrency?.symbol}{" "}
              OFF
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-900/90 text-white px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wide shadow-sm">
              Out of Stock
            </span>
          )}
          {!isOutOfStock && isLowStock && (
            <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wide shadow-sm">
              Only {item.stockQty} Left
            </span>
          )}
          {isNewArrival && !isOutOfStock && (
            <span className="bg-global-primary text-white px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wide shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Wishlist button — top-right */}
        <button
          onClick={handleWishlist}
          disabled={isWishlistLoading}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2.5 right-2.5 z-20 w-9 h-9 bg-white/95 backdrop-blur-xs rounded-full flex items-center justify-center shadow-sm border border-gray-100/80 transition-all duration-200 hover:scale-110 hover:shadow-md cursor-pointer"
        >
          {isWishlisted ? (
            <FaHeart className="text-rose-500 text-sm" />
          ) : (
            <FaRegHeart className="text-gray-500 hover:text-rose-500 text-sm transition-colors" />
          )}
        </button>



      </div>

      {/* ── Info Area ── */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
        {/* Brand pill */}
        <div className="flex items-center gap-1.5">
          {item?.brand?.name && (
            <span className="inline-block bg-gray-100 text-gray-500 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full truncate max-w-[120px]">
              {item.brand.name}
            </span>
          )}
        </div>

        {/* Product name */}
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-200 line-clamp-2 min-h-[2.5rem] leading-snug">
          <Link href={`/products/${item.slug}`}>{item.name}</Link>
        </h3>

        {/* Rating row */}
        <div className="flex items-center gap-1.5">
          <Rate
            disabled
            value={Number(item.avgRating) || 0}
            className="text-[11px] text-amber-400"
          />
          <span className="text-[10px] font-medium text-gray-400 leading-none">
            ({item.reviewsCount || 0})
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-1.5 flex-wrap mt-auto pt-1">
          <span className="text-sm sm:text-[15px] font-bold text-gray-900 tracking-tight">
            {formatPrice(item.finalPrice)}
          </span>
          {discountVal > 0 && (
            <span className="text-[11px] text-gray-400 line-through font-medium">
              {formatPrice(item.salePrice)}
            </span>
          )}
          {discountVal > 0 && (
            <span className="text-[10px] font-bold text-rose-600 ml-auto">
              -{item.discountValue}
              {item.discountStrategy === "Percentage"
                ? "%"
                : selectedCurrency?.symbol}
            </span>
          )}
        </div>

        {/* Add to Cart — always visible at card bottom */}
        <div className="mt-1">
          <AddToCartButton
            item={{ ...item, qty: 1 }}
            className="h-9 sm:h-10 rounded-xl text-[11px] sm:text-xs font-semibold tracking-wide"
          />
        </div>
      </div>
    </div>
  );
}
