"use client";
import { getProductBySlug } from "@/lib/apis/product";
import { errorNotification } from "@/lib/utils/notification";
import { setLoading } from "@/redux/features/global/globalSlice";
import {
  selectProduct,
  setProduct,
} from "@/redux/features/products/productSlice";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ReviewTable = dynamic(() => import("./review-rating/ReviewTable"), {
  ssr: false,
});
const ProductCard = dynamic(() => import("./ProductCard"), { ssr: false });
const RatingProduct = dynamic(() => import("./RatingProducts"), { ssr: false });
const ProductDescription = dynamic(() => import("./ProductDescription"), {
  ssr: false,
});
const ProductDetails = dynamic(() => import("./ProductDetails"), {
  ssr: false,
});

export default function SingleProduct({ slug }: { slug: string }) {
  const [selectVariant, setSelectVariant] = useState<any>({});
  const [checkStock, setCheckStock] = useState(0);
  const dispatch = useDispatch();
  const products = useSelector(selectProduct);
  const { product } = products;

  const fetchProductData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));

    try {
      const newProduct = await getProductBySlug({
        slug: slug?.toString(),
        productVariantId: selectVariant.productVariantId,
      });
      const { productVariants, variant } = newProduct.data;

      if (newProduct?.success) {
        const findVariantProduct = productVariants.find(
          (item: { default: boolean }) => item.default
        );

        const defaultProduct = variant
          ? findVariantProduct
          : productVariants[0];

        dispatch(
          setProduct({
            ...newProduct.data,
            qty: 1,
            defaultProduct,
          })
        );

        setCheckStock(defaultProduct?.stockQty || 0);
      }
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch, slug, selectVariant]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const productRating = product?.reviews?.reduce(
    (
      pre: {
        totalReview: number;
        rating1: number;
        rating2: number;
        rating3: number;
        rating4: number;
        rating5: number;
      },
      curr: { rating: string }
    ) => {
      return {
        totalReview: +pre.totalReview + +curr.rating,
        rating1: +curr.rating === 1 ? +pre.rating1 + 1 : pre.rating1,
        rating2: +curr.rating === 2 ? +pre.rating2 + 1 : pre.rating2,
        rating3: +curr.rating === 3 ? +pre.rating3 + 1 : pre.rating3,
        rating4: +curr.rating === 4 ? +pre.rating4 + 1 : pre.rating4,
        rating5: +curr.rating === 5 ? +pre.rating5 + 1 : pre.rating5,
      };
    },
    {
      totalReview: 0,
      rating1: 0,
      rating2: 0,
      rating3: 0,
      rating4: 0,
      rating5: 0,
    }
  );


  return (
    <div className="bg-[#FDFDFD]">
       {/* Breadcrumb / Top Nav Placeholder */}
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
             <span className="hover:text-gray-900 cursor-pointer">Home</span>
             <span>/</span>
             <span className="hover:text-gray-900 cursor-pointer">Shop</span>
             <span>/</span>
             <span className="text-gray-900">Product Detail</span>
          </div>
       </div>

       <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Main Product Hero Section */}
          <div className="mb-20 sm:mb-28">
            <ProductDetails
              setSelectVariant={setSelectVariant}
              productRating={productRating}
              checkStock={checkStock}
              setCheckStock={setCheckStock}
            />
          </div>

          {/* Product Description & Info */}
          <div className="max-w-5xl mx-auto space-y-20">
            <div id="description">
              <ProductDescription />
            </div>
            
            <div id="reviews" className="scroll-mt-24">
               {product.reviews && <RatingProduct productRating={productRating} />}
               <ReviewTable />
            </div>
          </div>

          {/* Related Products */}
          <section className="mt-32 pt-20 border-t border-gray-100">
             <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-12">
                <div>
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Discovery</h3>
                   <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">You Might Also Like</h2>
                </div>
                <div className="hidden sm:block pb-2">
                   <div className="h-0.5 w-24 bg-gray-900"></div>
                </div>
             </div>
             <ProductCard />
          </section>
       </div>
    </div>
  );
}
