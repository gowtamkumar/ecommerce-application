"use client";
import React from "react";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "@/redux/features/cart/cartSlice";

export default function AddToCartButton({ product }: any) {
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  function addToCart(product: any) {
    try {
      dispatch(setLoading({ productId: product.id }));
      dispatch(
        addCart({
          ...product,
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
    <Button
      // className="antd-btn"
      onClick={() => addToCart(product)}
      style={{ fontFamily: "unset" }}
      disabled={global.loading.productId === product.id}
      loading={global.loading.productId === product.id}
    >
      Add To Cart
    </Button>
  );
}
