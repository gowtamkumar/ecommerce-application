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
  const isOutOfStock = item?.stockQty !== undefined && item?.stockQty <= 0;
  const isLowStock =
    item?.stockQty !== undefined && item?.stockQty > 0 && item?.stockQty <= 5;
  const isNewArrival = item?.isNewArrival || item?.isFeatured;

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-200/60 transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50">
        <Link href={`/products/${item.slug}`} className="block w-full h-full">
          <Image
            src={thumbnailUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {hoverUrl && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out">
              <Image
                src={hoverUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          )}
        </Link>

        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
          {discountVal > 0 && (
            <span className="bg-rose-600 text-white px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wide">
              -{item.discountValue}
              {item.discountStrategy === "Percentage"
                ? "%"
                : selectedCurrency?.symbol}{" "}
              OFF
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-900/90 text-white px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wide">
              Out of Stock
            </span>
          )}
          {!isOutOfStock && isLowStock && (
            <span className="bg-amber-500 text-white px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wide">
              Only {item.stockQty} Left
            </span>
          )}
          {!discountVal && isNewArrival && (
            <span className="bg-gray-900 text-white px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wide">
              New
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5 z-20">
          <button
            onClick={handleWishlist}
            disabled={isWishlistLoading}
            aria-label="Add to wishlist"
            className="w-8 h-8 bg-white/95 text-gray-500 hover:text-rose-600 rounded-full flex items-center justify-center shadow-sm hover:shadow border border-gray-100 transition-all duration-200"
          >
            {isWishlisted ? (
              <FaHeart className="text-rose-600 text-sm" />
            ) : (
              <FaRegHeart className="text-sm" />
            )}
          </button>
        </div>

        <div className="absolute bottom-2.5 left-2.5 right-2.5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20 hidden sm:block">
          <AddToCartButton
            item={{ ...item, qty: 1 }}
            className="!h-10 !rounded-lg !text-[11px] !font-semibold !tracking-wide !bg-gray-900 hover:!bg-black shadow-md"
          />
        </div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1 bg-white justify-between">
        <div>
          <div className="type-overline text-gray-400 mb-1 truncate">
            {item?.brand?.name || "Brand"}
          </div>

          <h3 className="type-body text-gray-900 group-hover:text-global-primary transition-colors duration-200 line-clamp-2 min-h-[2.5rem] mb-2 !font-medium">
            <Link href={`/products/${item.slug}`}>{item.name}</Link>
          </h3>
        </div>

        <div className="mt-1 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="type-body text-gray-900 tracking-tight !font-semibold !mb-0">
                {formatPrice(item.finalPrice)}
              </span>
              {discountVal > 0 && (
                <span className="type-caption text-gray-400 line-through !mb-0">
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
              <span className="type-caption text-gray-400 !mb-0">
                ({item.reviewsCount || 0})
              </span>
            </div>
          </div>

          <div className="sm:hidden pt-0.5">
            <AddToCartButton
              item={{ ...item, qty: 1 }}
              className="!h-9 !rounded-lg !text-[10px] !font-semibold !bg-gray-900 hover:!bg-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
