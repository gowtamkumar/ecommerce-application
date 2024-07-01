"use client";
import React from "react";
import { useParams } from "next/navigation";
import ProductImageGallery from "./ProductImageGallery";
import ProductDetails from "./ProductDetails";
import RelatedProducts from "./RelatedProducts";
import DeliveryInfo from "./DeliveryInfo";
import { Breadcrumb, Divider, Rate } from "antd";
import RatingProduct from "./RatingProducts";
import DescriptionProduct from "./DescriptionProduct";

export default function SingleProduct() {
  const product = {
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
          <ProductImageGallery images={product.images} />
        </div>
        <div className="col-span-2">
          <ProductDetails product={product} />
        </div>
        <div>
          <DeliveryInfo delivery={product.delivery} />
        </div>
      </div>
      <RatingProduct />
      <RelatedProducts products={[product]} />
      <DescriptionProduct />
    </div>
  );
}
