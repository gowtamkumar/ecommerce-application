"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductImageGallery from "./ProductImageGallery";
import ProductDetails from "./ProductDetails";
import RelatedProducts from "./RelatedProducts";
import { Breadcrumb, Spin } from "antd";
import RatingProduct from "./RatingProducts";
import DescriptionProduct from "./DescriptionProduct";
import { getProduct } from "@/lib/apis/product";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import ReviewTable from "./review-rating/ReviewTable";

export default function SingleProduct() {
  const [product, setProduct] = useState({} as any);
  const { id } = useParams();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  useEffect(() => {
    dispatch(setLoading({ loading: true }));
    (async () => {
      const newProduct = await getProduct(id.toString());
      setProduct({
        ...newProduct?.data,
        qty: 1,
        selectProductVarient: newProduct?.data?.productVariants[0],
      });
      dispatch(setLoading({ loading: false }));
    })();
  }, [dispatch, global.action, id]);


  const productRating =
    product?.reviews?.reduce(
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



  const products = {
    name: "New LED Watch",
    description: "A stylish watch available in multiple colors.",
    price: 199,
    originalPrice: 580,
    discount: 66,
    colors: ["Black", "Red", "Blue", "Orange"],
    images: ["/images/watch1.jpg", "/images/watch2.jpg"],
    ratings: 37,
    seller: {
      name: "AltasawuQ",
      rating: 68,
      onTime: 86,
      response: 46,
    },
    delivery: {
      price: 120,
      estimatedDate: "6 Jul - 10 Jul",
    },
  };

  if (global.loading.loading) {
    return (
      <div className="text-center">
        <Spin />
      </div>
    );
  }

  return (
    <div className="lg:w-8/12 mx-auto">
      <div className="py-2">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: "Home",
            },
            {
              title: "Application Center",
              href: "",
            },
            {
              title: "Application List",
              href: "",
            },
            {
              title: "An Application",
            },
          ]}
        />
      </div>
      <div className=" bg-white  grid grid-cols-1 md:grid-cols-4">
        <div className="col-span-1">
          <ProductImageGallery images={products.images} />
        </div>
        <div className="col-span-2">
          <ProductDetails product={product} setProduct={setProduct}  productRating={productRating}/>
        </div>
        <div className="bg-slate-400">
          We can show any thing
          {/* <DeliveryInfo delivery={products.delivery} /> */}
        </div>
      </div>
      {product.reviews && <RatingProduct product={product}  productRating={productRating}/>}
      <ReviewTable reviews={product.reviews} />
      <DescriptionProduct product={product} />
      <section className="py-5">
        <RelatedProducts products={[products]} />
      </section>
    </div>
  );
}
