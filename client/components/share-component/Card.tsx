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
import { Rate, Tag } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import ModalLogin from "../website/login/ModalLogin";
import AddToCartButton from "./AddToCartButton";

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
    <div className="group relative bg-white rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-gray-50 hover:border-blue-50 hover:shadow-2xl hover:shadow-gray-200 transition-all duration-700 flex flex-col h-full transform hover:-translate-y-2">
      {/* Image Area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Link href={`/products/${item.slug}`} className="block w-full h-full">
          <Image
            src={thumbnailUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 300px"
          />
          {hoverUrl && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
              <Image
                src={hoverUrl}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 300px"
              />
            </div>
          )}
        </Link>

        {/* Floating Discount Tag */}
        {+item.discountValue > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-red-600 text-white px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-wider shadow-lg">
               -{item.discountValue}{item.discountStrategy === "Percentage" ? "%" : selectedCurrency?.symbol}
            </div>
          </div>
        )}

        {/* Action Overlay */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 hidden sm:block">
           <AddToCartButton item={{ ...item, qty: 1 }} className="!h-10 !rounded-xl !text-[10px] !font-black !tracking-widest shadow-xl shadow-blue-200" />
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (session.status === "unauthenticated") {
                dispatch(setUnAuthorize(true));
              } else {
                AddToWishlist(item.id);
              }
            }}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm text-gray-400 rounded-xl flex items-center justify-center shadow-sm hover:text-red-500 hover:scale-110 transition-all"
          >
            <FaRegHeart size={16} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-6 flex flex-col flex-1 bg-white">
        
        {/* Category / Brand (Small tag) */}
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2 truncate">
           {item?.brand?.name || "Premium Collection"}
        </div>

        {/* Title */}
        <h3 className="font-black text-gray-900 text-xs sm:text-sm leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 min-h-[32px] sm:min-h-[40px] mb-3">
          <Link href={`/products/${item.slug}`}>{item.name}</Link>
        </h3>

        {/* Price & Rating */}
        <div className="mt-auto flex flex-col gap-3">
           <div className="flex items-center justify-between">
              <div className="flex flex-col">
                 <span className="text-sm sm:text-lg font-black text-gray-900 tracking-tighter">
                   {formatPrice(item.finalPrice)}
                 </span>
                 {+item?.discountValue > 0 && (
                   <span className="text-[10px] text-gray-300 font-bold line-through">
                     {formatPrice(item.salePrice)}
                   </span>
                 )}
              </div>
              <div className="flex items-center gap-1">
                 <Rate disabled value={+item.avgRating || 0} className="text-[8px] sm:text-[10px] text-amber-400" />
                 <span className="text-[10px] font-bold text-gray-400">({item.reviewsCount || 0})</span>
              </div>
           </div>

           {/* Mobile-Only Cart Button (Icon Style) */}
           <div className="sm:hidden mt-2">
              <AddToCartButton item={{ ...item, qty: 1 }} className="!h-10 !rounded-xl !text-[10px] !font-black" />
           </div>
        </div>
      </div>

      {global.unAuthorize && <ModalLogin />}
    </div>
  );
}
