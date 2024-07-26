"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Rate } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { addCart } from "@/redux/features/cart/cartSlice";
import { productDiscountCalculation } from "@/lib/share";

export default function MyWishlist({ user }: any) {
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  async function addToCart(value: any) {
    const price = +value.selectProductVarient.price;
    let taxAmount = (+price * (value?.tax?.value || 0)) / 100;
    dispatch(
      addCart({
        ...value,
        discountA: productDiscountCalculation(value) || 0,
        tax: taxAmount,
        price,
        qty: 1,
      })
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {(user.wishlists || []).map((item: any, idx: any) => {
        // console.log("🚀 ~ item:", item.product.reviews.length);
        // need to calculation review

        let price = +item.product.productVariants[0]?.price;
        let discount = item.product?.discount;

        let taxAmount = (+price * (+item?.product?.tax?.value || 0)) / 100;

        let disAmount =
          discount?.discountType === "Percentage"
            ? ((price + taxAmount) * (discount.value || 0)) / 100
            : +discount?.value;

        return (
          <div className="bg-white rounded-lg shadow-md p-4" key={item.id}>
            <Link href={`/products/${item.id}`}>
              <Image
                width={150}
                height={150}
                src="/product-01.jpg"
                alt="Category Image"
                className="w-full h-40 object-cover mb-4"
              />
              <h3 className="text-sm font-semibold mb-2">
                {item.product.name.slice(0, 70)}
              </h3>
              <p className="text-gray-500 mb-2">
                ৳
                {item?.product.discountId
                  ? (price + taxAmount - (disAmount || 0)).toFixed(2)
                  : (price + taxAmount).toFixed(2)}
              </p>

              {item?.product.discountId ? (
                <>
                  <span className="line-through text-gray-500">
                    ৳ {(+price + +taxAmount || 0).toFixed(2)}
                  </span>
                  <span className="text-green-600 ml-2">
                    -{item?.product.discount?.value}
                    {item?.product.discount?.discountType === "Percentage"
                      ? "%"
                      : "BDT"}
                  </span>
                </>
              ) : null}
              <span className="flex gap-1 items-center">
                <Rate className="text-sm" disabled defaultValue={2.5} />(
                {item.product?.reviews?.length})
              </span>
            </Link>
            <Button
              type="primary"
              size="large"
              onClick={() =>
                addToCart({
                  ...item.product,
                  selectProductVarient: item.product.productVariants[0],
                })
              }
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add to Cart
            </Button>
          </div>
        );
      })}
    </div>
  );
}
