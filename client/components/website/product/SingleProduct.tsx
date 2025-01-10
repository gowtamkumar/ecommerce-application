/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { Spin } from "antd";
import RatingProduct from "./RatingProducts";
import ProductDescription from "./ProductDescription";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { errorNotification } from "@/lib/utils/notification";
import { getProductBySlug } from "@/lib/apis/product";
import ReviewTable from "./review-rating/ReviewTable";
import ProductCard from "./ProductCard";
import {
  selectProduct,
  setProduct,
} from "@/redux/features/products/productSlice";

export default function SingleProduct() {
  const { slug } = useParams();
  const [checkStock, setCheckStock] = useState(0);
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const products = useSelector(selectProduct);
  const { product } = products;

  useEffect(() => {
    fetchProductData();
  }, [dispatch, slug]);

  const fetchProductData = async () => {
    dispatch(setLoading({ loading: true }));

    try {
      const newProduct = await getProductBySlug(slug?.toString() as any);
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

        setCheckStock(defaultProduct.stockQty);

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
        productRating={productRating}
        checkStock={checkStock}
        setCheckStock={setCheckStock}
      />

      {product.reviews && <RatingProduct productRating={productRating} />}

      <ReviewTable />
      <ProductDescription />
      <section className="py-5">
        <h3 className="text-lg font-bold mb-4">Related Product</h3>
        <ProductCard />
      </section>

      {/* <RelatedProducts relatedProducts={relatedProducts} /> */}
    </div>
  );
}
