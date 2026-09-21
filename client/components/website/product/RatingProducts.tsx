"use client";

import { ActionType } from "@/constants/constants";
import { setProductRating, setUnAuthorize } from "@/redux/features/global/globalSlice";
import { selectProduct } from "@/redux/features/products/productSlice";
import { Rate } from "antd";
import { useSession } from "next-auth/react";
import { FiEdit3, FiStar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

interface ProductRating {
  totalReview: number;
  rating1: number;
  rating2: number;
  rating3: number;
  rating4: number;
  rating5: number;
}

export default function RatingProduct({
  productRating,
}: {
  productRating: ProductRating;
}) {
  const dispatch = useDispatch();
  const session = useSession();
  const products = useSelector(selectProduct);
  const { reviews, avgRating, id, name } = products?.product || {};
  const { totalReview, rating1, rating2, rating3, rating4, rating5 } =
    productRating || {};

  const reviewCount = reviews?.length || 0;
  const averageRating =
    reviewCount > 0
      ? (Number(totalReview || 0) / reviewCount).toFixed(1)
      : avgRating
      ? Number(avgRating).toFixed(1)
      : "5.0";

  const handleWriteReview = () => {
    if (session.status === "unauthenticated") {
      dispatch(setUnAuthorize(true));
      return;
    }

    dispatch(
      setProductRating({
        type: ActionType.CREATE,
        payload: {
          productId: id,
          product: { name },
        },
      })
    );
  };

  return (
    <div className="mt-16 sm:mt-24 p-6 sm:p-10 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-100/50">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start">
        {/* Overall Score */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <FiStar className="w-3.5 h-3.5 fill-amber-400" />
            <span>Customer Rating</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tight">
              {averageRating}
            </span>
            <span className="text-xl font-bold text-slate-300">/ 5.0</span>
          </div>

          <div className="space-y-2">
            <Rate
              allowHalf
              value={+averageRating}
              disabled
              className="text-amber-400 text-lg"
            />
            <p className="text-xs font-semibold text-slate-400">
              Based on {reviewCount} verified {reviewCount === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleWriteReview}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10 transition-all cursor-pointer"
            >
              <FiEdit3 className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="flex-1 w-full space-y-3.5">
          {[
            { star: 5, count: rating5, label: "5 Stars" },
            { star: 4, count: rating4, label: "4 Stars" },
            { star: 3, count: rating3, label: "3 Stars" },
            { star: 2, count: rating2, label: "2 Stars" },
            { star: 1, count: rating1, label: "1 Star" },
          ].map((item) => {
            const total = reviewCount || 1;
            const percent =
              reviewCount > 0 ? (Number(item.count || 0) / total) * 100 : 0;

            return (
              <div key={item.star} className="flex items-center gap-3.5 group">
                <span className="w-16 text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                  {item.label}
                </span>

                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="w-10 text-right text-xs font-bold text-slate-500">
                  {Math.round(percent)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
