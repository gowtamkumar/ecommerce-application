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
    <div className="group relative bg-global-bg border border-global-header-text/5 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-global-primary/10 transition-all duration-500 flex flex-col h-full">
      {/* Image Area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Link href={`/products/${item.slug}`} className="block w-full h-full">
          <Image
            src={thumbnailUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Hover Image */}
          {hoverUrl && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-white">
              <Image
                src={hoverUrl}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {+item.discountAmount > 0 && (
             <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-global-bg/90 backdrop-blur text-global-primary shadow-sm border border-global-primary/10">
               -{item.discountValue}{item.discountStrategy === "Percentage" ? "%" : selectedCurrency?.symbol}
             </span>
          )}
        </div>

        {/* Floating Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 ease-out z-20">
            <button
              className="w-10 h-10 bg-global-header-bg/80 backdrop-blur text-global-header-text rounded-full flex items-center justify-center shadow-sm hover:bg-global-primary hover:text-global-button-text transition-all duration-300 transform hover:scale-110"
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
              <FaRegHeart size={16} />
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Ratings */}
        <div className="flex items-center gap-2 mb-2">
            <Rate disabled value={+item.avgRating || 0} className="text-xs text-global-primary" style={{ fontSize: 12 }} />
            <span className="text-xs text-global-text/40 font-bold">({item.reviewsCount || 0})</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-global-text text-base leading-snug mb-3 line-clamp-2 min-h-[2.75rem] group-hover:text-global-primary transition-colors">
          <Link href={`/products/${item.slug}`}>
            {item.name}
          </Link>
        </h3>

        {/* Price & Cart */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-global-text tracking-tight">{formatPrice(item.finalPrice)}</span>
             {+item?.discountValue > 0 && (
                <span className="text-sm text-global-text/40 line-through decoration-global-text/20">{formatPrice(item.salePrice)}</span>
              )}
          </div>
          
           <div className="w-full">
            <AddToCartButton item={{ ...item, qty: 1 }} />
           </div>
        </div>
      </div>

      {global.unAuthorize && <ModalLogin />}
    </div>
  );
}
