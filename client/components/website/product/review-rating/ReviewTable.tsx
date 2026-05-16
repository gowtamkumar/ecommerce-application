"use client";
import { reviewDisLike, reviewLike } from "@/lib/apis/review";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { selectProduct } from "@/redux/features/products/productSlice";
import { Rate, Avatar } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { BiDislike, BiLike } from "react-icons/bi";
import { useSelector } from "react-redux";
dayjs.extend(relativeTime);

interface DataType {
  id?: string;
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
    <div className="space-y-8 mt-12 sm:mt-16">
      {reviews && reviews.length > 0 ? (
        reviews.map((review, idx) => {
          const { user, rating, comment, createdAt, like, disLike } = review;

          return (
            <div key={idx} className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 rounded-[2rem] bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 transition-all">
                  
                  {/* User Profile Info */}
                  <div className="flex sm:flex-col items-center sm:items-center gap-4 sm:w-32 flex-shrink-0">
                     <div className="relative">
                        <Avatar 
                          size={64} 
                          src={getImageUrl(user?.image)} 
                          className="border-2 border-white shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-sm" title="Verified Buyer"></div>
                     </div>
                     <div className="text-center sm:text-center">
                        <div className="text-xs font-black text-gray-900 uppercase tracking-tight truncate w-full">{user?.name || "Anonymous"}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Verified</div>
                     </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 space-y-4">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                           <Rate allowHalf value={+rating} disabled className="text-[10px] text-amber-400" />
                           <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">Excellent</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                           {createdAt && dayjs(createdAt).format("MMM D, YYYY")}
                        </span>
                     </div>

                     <p className="text-gray-600 text-sm sm:text-base leading-relaxed italic">
                        "{comment}"
                     </p>

                     {/* Actions */}
                     <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                        <button
                          onClick={() => reviewIncrement(review)}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors py-1 px-3 bg-gray-50 rounded-lg group"
                        >
                          <BiLike size={14} className="group-hover:scale-125 transition-transform" />
                          <span>Helpful ({like || 0})</span>
                        </button>
                        <button
                          onClick={() => reviewDecrement(review)}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors py-1 px-3 bg-gray-50 rounded-lg group"
                        >
                          <BiDislike size={14} className="group-hover:scale-125 transition-transform" />
                          <span>Report ({disLike || 0})</span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )
        })
      ) : (
        <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <BiLike className="text-gray-200" size={32} />
           </div>
           <h4 className="text-lg font-black text-gray-900 mb-2">No reviews yet</h4>
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Be the first to share your experience</p>
        </div>
      )}
    </div>
  );
};

export default ReviewTable;
