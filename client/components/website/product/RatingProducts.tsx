"use client";
import { selectProduct } from "@/redux/features/products/productSlice";
import { Rate } from "antd";
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

  return (
    <div className="mt-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-2xl font-bold mb-8 font-global-primary-fontfamily">Ratings & Reviews</h3>
      <div className="flex flex-col md:flex-row gap-12 items-center">
        {/* Score Column */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start min-w-[200px]">
          <div className="text-6xl font-extrabold text-gray-900 mb-2 font-global-primary-fontfamily">
            {((totalReview || 0) / (reviews?.length || 0) || 0).toFixed(1)}
          </div>
          <Rate
            allowHalf
            value={(totalReview || 0) / (reviews?.length || 0) || 0}
            disabled
            className="text-global-primary text-xl mb-2"
          />
          <p className="text-gray-500 font-medium">{reviews?.length || 0} Ratings</p>
        </div>

        {/* Distribution Column */}
        <div className="flex-1 w-full space-y-3">
          {[
            { star: 5, count: rating5 },
            { star: 4, count: rating4 },
            { star: 3, count: rating3 },
            { star: 2, count: rating2 },
            { star: 1, count: rating1 },
          ].map((item) => {
            const total = reviews?.length || 1;
            const percent = (item.count / total) * 100;
            return (
              <div key={item.star} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-12 flex-shrink-0 text-sm font-medium text-gray-600">
                  <span>{item.star}</span>
                  <span className="text-global-primary">★</span>
                </div>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-global-primary rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="w-8 text-right text-sm text-gray-400">
                  {item.count}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingProduct;
