"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductImageGallery from "./ProductImageGallery";
import ProductDetails from "./ProductDetails";
import RelatedProducts from "./RelatedProducts";
import { Breadcrumb } from "antd";
import RatingProduct from "./RatingProducts";
import DescriptionProduct from "./DescriptionProduct";
import { getProduct } from "@/lib/apis/product";

export default function SingleProduct() {
  const [product, setProduct] = useState({} as any);
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const newProduct = await getProduct(id.toString());
      setProduct({
        ...newProduct?.data,
        qty: 1,
        selectProductVarient: newProduct?.data?.productVariants[0],
      });
    })();
  }, [id]);

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
          <ProductDetails product={product} setProduct={setProduct} />
        </div>
        <div className="bg-slate-400">
          We can show any thing
          {/* <DeliveryInfo delivery={products.delivery} /> */}
        </div>
      </div>
      <RatingProduct />
      <DescriptionProduct product={product} />
      <section className="py-5">
        <RelatedProducts products={[products]} />
      </section>
    </div>
  );
}
