"use client";
import { selectProduct } from "@/redux/features/products/productSlice";
import { Rate, Progress } from "antd";
import { useSelector } from "react-redux";

interface ProductRating {
  totalReview: number;
  rating1: number;
  rating2: number;
  rating3: number;
  rating4: number;
  rating5: number;
}

const RatingProduct = ({ productRating }: { productRating: ProductRating }) => {
  const products = useSelector(selectProduct);
  const { reviews } = products.product;
  const { totalReview, rating1, rating2, rating3, rating4, rating5 } =
    productRating;

  const averageRating = ((totalReview || 0) / (reviews?.length || 1) || 0).toFixed(1);

  return (
    <div className="mt-16 sm:mt-24 p-6 sm:p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-gray-100/50">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Overall Score */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Customer Reviews</h3>
           <div className="flex items-baseline gap-2">
              <span className="text-7xl sm:text-8xl font-black text-gray-900 tracking-tighter">{averageRating}</span>
              <span className="text-2xl font-bold text-gray-300">/ 5</span>
           </div>
           <div className="space-y-1">
              <Rate
                allowHalf
                value={+averageRating}
                disabled
                className="text-amber-400 text-2xl"
              />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">Based on {reviews?.length || 0} global ratings</p>
           </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-4">
          {[
            { star: 5, count: rating5, label: 'Excellent' },
            { star: 4, count: rating4, label: 'Very Good' },
            { star: 3, count: rating3, label: 'Good' },
            { star: 2, count: rating2, label: 'Fair' },
            { star: 1, count: rating1, label: 'Poor' },
          ].map((item) => {
            const total = reviews?.length || 1;
            const percent = (item.count / total) * 100;
            return (
              <div key={item.star} className="flex items-center gap-4 group">
                <div className="w-16 sm:w-20 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors">
                  {item.label}
                </div>
                <div className="flex-1 h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-[1px]">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all duration-1000 ease-out shadow-sm"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="w-10 text-right text-[10px] font-black text-gray-900">
                  {Math.round(percent)}%
                </div>
              </div>
            )
          })}
        </div>

        {/* Feature Ratings (Optional Placeholder for now) */}
        <div className="hidden xl:flex flex-col justify-center space-y-6 border-l border-gray-50 pl-12">
           <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quality</div>
              <Progress percent={95} size="small" showInfo={false} strokeColor="#111827" />
           </div>
           <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Value</div>
              <Progress percent={88} size="small" showInfo={false} strokeColor="#111827" />
           </div>
           <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery</div>
              <Progress percent={92} size="small" showInfo={false} strokeColor="#111827" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default RatingProduct;
