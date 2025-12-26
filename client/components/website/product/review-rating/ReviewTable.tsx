"use client";
import { reviewDisLike, reviewLike } from "@/lib/apis/review";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { selectProduct } from "@/redux/features/products/productSlice";
import { Rate } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { BiDislike, BiLike } from "react-icons/bi";
import { useSelector } from "react-redux";
dayjs.extend(relativeTime);

interface DataType {
  key: string;
  product: any;
  rating: number;
  comment: string;
  status: string;
  user?: { name?: string; image?: string };
  createdAt?: string;
  like?: number;
  disLike?: number;
}

const ReviewTable = () => {
  const products = useSelector(selectProduct);
  const { reviews }: { reviews: DataType[] } = products.product;

  async function reviewIncrement(value: any) {
    try {
      await reviewLike({ id: value.id });
    } catch (error) {
      console.log(error);
    }
  }

  async function reviewDecrement(value: any) {
    try {
      await reviewDisLike({ id: value.id });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="space-y-6 mt-8">
      {reviews && reviews.length > 0 ? (
        reviews.map((review, idx) => {
          const { user, rating, comment, createdAt, like, disLike } = review;
          console.log(review);

          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">

                  <Image
                    src={getImageUrl(user?.image)}
                    alt="User"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 font-global-primary-fontfamily">
                    {user?.name || "Anonymous"}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {createdAt && dayjs(createdAt).fromNow()}
                  </span>
                </div>

                <Rate allowHalf value={+rating} disabled className="text-sm text-global-primary" />

                <p className="text-gray-600 leading-relaxed text-sm font-global-secondary-fontfamily">
                  {comment}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={() => reviewIncrement(review)}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-green-600 transition-colors"
                  >
                    <BiLike size={16} />
                    <span>Helpful ({like || 0})</span>
                  </button>
                  <button
                    onClick={() => reviewDecrement(review)}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <BiDislike size={16} />
                    <span>({disLike || 0})</span>
                  </button>
                </div>
              </div>
            </div>
          )

        }
        )
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        </div>
      )}
    </div>
  );
};

export default ReviewTable;
