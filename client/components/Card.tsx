"use client";
import { saveWishlist } from "@/lib/apis/wishlist";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  selectGlobal,
  setUnAuthorize,
} from "@/redux/features/global/globalSlice";
import { getProductImageUrls } from "@/lib/utils/imageUrl";
import { Rate } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import AddToCartButton from "./AddToCartButton";
import ModalLogin from "./website/login/ModalLogin";
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
    <div className="group relative bg-white rounded-xl border border-gray-100 hover:border-transparent hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Image + Hover */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/products/${item.slug}`}>
          <Image
            src={thumbnailUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Hover Image */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white">
            <Image
              src={hoverUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>

        {/* Badges */}
        {+item.discountAmount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
            -{item.discountValue}{item.discountStrategy === "Percentage" ? "%" : " BDT"}
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute right-2 top-2 flex flex-col gap-2 translate-x-10 group-hover:translate-x-0 transition-transform duration-300 z-20">
          <button
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-black hover:text-white transition-colors"
            onClick={() => {
              if (session.status === "unauthenticated") {
                dispatch(setUnAuthorize(true));
              } else {
                AddToWishlist(item.id);
              }
            }}
          >
            <FaRegHeart size={14} />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-1">
          <div className="flex items-center gap-1 mb-1">
            <Rate disabled value={+item.avgRating || 0} className="text-xs" style={{ fontSize: 12 }} />
            <span className="text-xs text-gray-400">({item.reviewsCount || 0})</span>
          </div>
          <h3 className="font-medium text-gray-900 text-sm leading-snug mb-1 h-10 overflow-hidden">
            <Link href={`/products/${item.slug}`} className="hover:text-black transition-colors">
              {item.name}
            </Link>
          </h3>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              {+item?.discountValue > 0 && (
                <span className="text-xs text-gray-400 line-through">৳ {item.salePrice}</span>
              )}
              <span className="text-base font-bold text-black">৳ {item.finalPrice}</span>
            </div>
          </div>

          <AddToCartButton item={{ ...item, qty: 1 }} />
        </div>
      </div>

      {global.unAuthorize && <ModalLogin />}
    </div>
  );
}
