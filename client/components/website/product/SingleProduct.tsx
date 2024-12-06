"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductImageGallery from "./ProductImageGallery";
import ProductDetails from "./ProductDetails";
import { Spin } from "antd";
import RatingProduct from "./RatingProducts";
import DescriptionProduct from "./DescriptionProduct";
import { getProduct } from "@/lib/apis/product";
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
      const { productVariants } = newProduct.data;

      if (newProduct?.success) {
        const findVariantProduct = productVariants.find(
          (item: { default: boolean }) => item.default
        );
        setProduct({
          ...newProduct.data,
          qty: 1,
          defaultProduct: findVariantProduct,
        });

        if (findVariantProduct.id) {
          const productVariant = await getProductVariant({
            id: findVariantProduct.id,
          });
          setCheckStock(productVariant.data.stockQty);
        }

        const categoryIds = newProduct.data.productCategories
          .map((item: { categoryId: number }) => item.categoryId)
          .join(",");

        dispatch(setProductFilter({ categoryId: categoryIds }));
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
      <div className="grid grid-cols-1 md:grid-cols-12 pt-4">
        <div className="col-span-6">
          <ProductImageGallery images={product.images} thumbnailImage={product.thumbnailImage} />
        </div>

        <div className="col-span-6">
          <ProductDetails
            product={product}
            setProduct={setProduct}
            productRating={productRating}
            checkStock={checkStock}
            setCheckStock={setCheckStock}
          />
        </div>
      </div>
      <div className="grid grid-cols-1">
        {product.reviews && (
          <RatingProduct product={product} productRating={productRating} />
        )}
      </div>

      <div></div>

      <ReviewTable reviews={product.reviews} />
      <DescriptionProduct product={product} />
      <section className="py-5">
        <ProductCard />
      </section>
      <div>


      </div>
      {/* <RelatedProducts relatedProducts={relatedProducts} /> */}
    </div>
  );
}
