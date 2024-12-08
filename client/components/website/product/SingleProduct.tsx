"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { Spin } from "antd";
import RatingProduct from "./RatingProducts";
import ProductDescription from "./ProductDescription";
import {
  selectGlobal,
  setLoading,
  setProductFilter,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { getProductVariant } from "@/lib/apis/product-variant";
import { errorNotification } from "@/lib/utils/notification";
import { getProductBySlug } from "@/lib/apis/public/product";
import ReviewTable from "./review-rating/ReviewTable";
import ProductCard from "./ProductCard";

export default function SingleProduct() {
  const [product, setProduct] = useState({} as any);
  const [checkStock, setCheckStock] = useState(0);
  const { slug } = useParams();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  useEffect(() => {
    fetchProductData();
  }, [dispatch, slug]);

  const fetchProductData = async () => {
    dispatch(setLoading({ loading: true }));

    try {
      const newProduct = await getProductBySlug(slug?.toString() as any);
      const { productVariants, stockQty } = newProduct.data;

      if (newProduct?.success) {
        const findVariantProduct = productVariants.find(
          (item: { default: boolean }) => item.default
        );
        setProduct({
          ...newProduct.data,
          qty: 1,
          defaultProduct: findVariantProduct,
        });

        setCheckStock(findVariantProduct.stockQty);

        // if (findVariantProduct.id) {
        //   const productVariant = await getProductVariant({
        //     id: findVariantProduct.id,
        //   });
        //   setCheckStock(productVariant.data.stockQty);
        // }

        // const categoryIds = newProduct.data.productCategories
        //   .map((item: { categoryId: number }) => item.categoryId)
        //   .join(",");

        // dispatch(setProductFilter({ categoryId: categoryIds }));
      }
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

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

  if (global.loading.loading) {
    return (
      <div className="text-center">
        <Spin />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <ProductDetails
        product={product}
        setProduct={setProduct}
        productRating={productRating}
        checkStock={checkStock}
        setCheckStock={setCheckStock}
      />

      {product.reviews && (
        <RatingProduct product={product} productRating={productRating} />
      )}

      <ReviewTable reviews={product.reviews} />
      <ProductDescription product={product} />
      <section className="py-5">
        <h3 className="text-lg font-bold mb-4">Related Product</h3>
        <ProductCard />
      </section>

      {/* <RelatedProducts relatedProducts={relatedProducts} /> */}
    </div>
  );
}
