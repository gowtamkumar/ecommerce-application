"use client";
import appConfig from "@/appConfig";
import { Rate } from "antd";
import Image from "next/image";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";
import { HiViewfinderCircle } from "react-icons/hi2";
import AddToCartButton from "./AddToCartButton";
import { saveWishlist } from "@/lib/apis/wishlist";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import {
  selectGlobal,
  setUnAuthorize,
} from "@/redux/features/global/globalSlice";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
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

  const thumbnailImage = item?.thumbnailImage
    ? `${appConfig.baseApiUrl}/uploads/${item?.thumbnailImage}`
    : "/default-placeholder.png";

  const hoverImage = item?.hoverImage
    ? `${appConfig.baseApiUrl}/uploads/${item?.hoverImage}`
    : "/default-placeholder.png";

  return (
    <div className="rounded-lg bg-gray-100 flex flex-col h-full px-4 py-2">
      {/* Image + Hover */}
      <div className="relative group">
        <Image
          src={thumbnailImage}
          alt={item.name}
          width={1000}
          height={1000}
          className="rounded"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {+item.discountAmount > 0 && (
          <p className="text-xs absolute top-2 left-0 bg-blue-500 rounded-r-lg p-1 text-white z-10">
            Save:৳ {item.discountAmount}
          </p>
        )}

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer bg-fixed flex justify-end items-start">
          <Image
            src={hoverImage}
            alt={item.name}
            width={1000}
            height={1000}
            className="rounded"
          />

          <div className="p-1 absolute z-20 bg-white text-black rounded-lg transform translate-y-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition duration-500 flex flex-col gap-3 items-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button
              className="cursor-pointer"
              onClick={() => {
                if (session.status === "unauthenticated") {
                  dispatch(setUnAuthorize(true));
                } else {
                  AddToWishlist(item.id);
                }
              }}
            >
              <FaRegHeart size={22} />
            </button>
            {/* <button
              className="cursor-pointer"
              onClick={() => {
                if (session.status === "unauthenticated") {
                  dispatch(setUnAuthorize(true));
                } else {
                  AddToWishlist(item.id);
                }
              }}
            >
              <HiViewfinderCircle size={22} />
            </button> */}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-col h-full">
        <div className="flex flex-col h-full">
          <div className="mt-auto">
            <h3 className="font-semibold text-sm mb-2">
              <Link href={`/products/${item.slug}`} className="hover:underline">
                {item.name.slice(0, 50)}
              </Link>
            </h3>

            <div className="flex gap-1 items-center text-xs mb-2">
              <Rate disabled value={+item.avgRating || 0} />
              {item.reviewsCount && item.reviewsCount}
            </div>

            <div className="text-gray-700 text-sm font-medium mb-1">
              ৳ {item.finalPrice}
            </div>

            {+item?.discountValue > 0 && (
              <div className="text-xs mb-2">
                <span className="line-through text-gray-500">
                  ৳ {item.salePrice}
                </span>
                <span className="text-red-600 ml-2">
                  -{item.discountValue}
                  {item.discountStrategy === "Percentage" ? "%" : " BDT"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Push button to bottom */}
        <div className="mt-auto">
          <AddToCartButton item={{ ...item, qty: 1 }} />
        </div>
      </div>

      {global.unAuthorize && <ModalLogin />}
    </div>
  );
}
