"use client";

import Breadcrumb from "@/components/share-component/Breadcrumb";
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
const NewReview = dynamic(() => import("./review-rating/NewReview"), {
  ssr: false,
});
const RatingProduct = dynamic(() => import("./RatingProducts"), {
  ssr: false,
});
const ProductDescription = dynamic(() => import("./ProductDescription"), {
  ssr: false,
});
const ProductDetails = dynamic(() => import("./ProductDetails"), {
  ssr: false,
});
const RelatedProducts = dynamic(() => import("./RelatedProducts"), {
  ssr: false,
});

export default function SingleProduct({
  slug,
  initialProduct,
}: {
  slug: string;
  initialProduct?: any;
}) {
  const [selectVariant, setSelectVariant] = useState<any>({});
  const [checkStock, setCheckStock] = useState(0);
  const dispatch = useDispatch();
  const products = useSelector(selectProduct);
  const product = products?.product || initialProduct;

  const fetchProductData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));

    try {
      const newProduct = await getProductBySlug({
        slug: slug?.toString(),
        productVariantId: selectVariant.productVariantId,
      });

      if (newProduct?.success && newProduct.data) {
        const { productVariants, variant } = newProduct.data;

        const findVariantProduct = productVariants?.find(
          (item: { default: boolean }) => item.default
        );

        const defaultProduct = variant
          ? findVariantProduct
          : productVariants?.[0];

        dispatch(
          setProduct({
            ...newProduct.data,
            qty: 1,
            defaultProduct,
          })
        );

        setCheckStock(
          defaultProduct?.stockQty ?? newProduct.data.stockQty ?? 0
        );
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
      curr: { rating: string | number }
    ) => {
      const r = Number(curr.rating);
      return {
        totalReview: +pre.totalReview + r,
        rating1: r === 1 ? +pre.rating1 + 1 : pre.rating1,
        rating2: r === 2 ? +pre.rating2 + 1 : pre.rating2,
        rating3: r === 3 ? +pre.rating3 + 1 : pre.rating3,
        rating4: r === 4 ? +pre.rating4 + 1 : pre.rating4,
        rating5: r === 5 ? +pre.rating5 + 1 : pre.rating5,
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
  ) || {
    totalReview: 0,
    rating1: 0,
    rating2: 0,
    rating3: 0,
    rating4: 0,
    rating5: 0,
  };

  const primaryCategory =
    product?.productCategories?.[0]?.category || product?.category;

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* Global Breadcrumb */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            ...(primaryCategory?.name
              ? [
                  {
                    label: primaryCategory.name,
                    href: `/products?categoryId=${primaryCategory.id}`,
                  },
                ]
              : []),
            { label: product?.name || "Product Details" },
          ]}
          variant="clean"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Main Product Hero Section */}
        <div className="mb-14 sm:mb-20">
          <ProductDetails
            setSelectVariant={setSelectVariant}
            productRating={productRating}
            checkStock={checkStock}
            setCheckStock={setCheckStock}
          />
        </div>

        {/* Product Description, Specs & Info */}
        <div className="max-w-5xl mx-auto space-y-16">
          <div id="description">
            <ProductDescription />
          </div>

          <div id="reviews" className="scroll-mt-24">
            <RatingProduct productRating={productRating} />
            <ReviewTable />
          </div>
        </div>

        {/* Curated Related Products */}
        <RelatedProducts
          categoryId={primaryCategory?.id}
          categoryName={primaryCategory?.name}
          currentProductId={product?.id}
        />
      </div>

      {/* Review Submission Modal */}
      <NewReview />
    </div>
  );
}
