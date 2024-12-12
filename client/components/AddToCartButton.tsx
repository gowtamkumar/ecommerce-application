"use client";
import React from "react";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "@/redux/features/cart/cartSlice";
import { FaCheckCircle } from "react-icons/fa";
import { discountTaxCalculationFun } from "@/lib/share/discountTaxCalculationFun";

export default function AddToCartButton({ item }: any) {
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  function addToCart(value: any) {
    console.log("🚀 ~ value:", value);

    // const res = discountTaxCalculationFun(value);

    

    try {
      dispatch(setLoading({ productId: value.id }));
      dispatch(
        addCart({
          ...value,
          qty: 1,
        })
      );
      setTimeout(() => {
        dispatch(setLoading({}));
      }, 1000);
    } catch (err: any) {
      dispatch(setLoading({}));
    }
  }

  return (
    <>
      {global.loading.productId === item.id && (
        <div className="flex gap-1 justify-center py-2">
          <FaCheckCircle size={22} /> Added to cart
        </div>
      )}

      <Button
        className="w-full"
        onClick={() => addToCart(item)}
        style={{ fontFamily: "unset" }}
        disabled={global.loading.productId === item.id}
        loading={global.loading.productId === item.id}
      >
        Add To Cart
      </Button>
    </>
  );
}
