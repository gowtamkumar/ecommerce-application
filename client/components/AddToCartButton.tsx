"use client";
import React from "react";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addCart, replaceCart } from "@/redux/features/cart/cartSlice";
import { discountTaxCalculationFun } from "@/lib/utils/discountTaxCalculationFun";
import { getCartByUser, getCartLists, saveCart } from "@/lib/apis/cart";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";

type Product = {
  id: number;
  name: string;
  color: any;
  thumbnailImage: string;
  // defaultProduct?: {
  //   id: string;
  //   unitPrice: number;
  //   purchasePrice: number;
  //   size: any;
  // };
  discount?: number;
  tax?: { value: number };
};

export default function AddToCartButton({ item }: { item: any }) {
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  async function addToCart(values: any) {
    const newData = {
      productId: values.id,
      ...values,
      qty: 1,
    };

    const cartResponse = await saveCart(newData);
    if (cartResponse.success) {
      successNotification({ message: cartResponse.message });
    }

    if (!cartResponse.success) {
      errorNotification({ message: cartResponse.message });
    }

    const getCartList = await getCartLists();

    try {
      dispatch(setLoading({ productId: newData.id }));
      dispatch(replaceCart(getCartList.data));
      setTimeout(() => {
        dispatch(setLoading({}));
      }, 1000);
    } catch (err: any) {
      dispatch(setLoading({}));
    }
  }

  return (
    <Button
      className="w-full"
      onClick={() => addToCart(item)}
      style={{ fontFamily: "unset" }}
      disabled={global.loading.productId === item.id}
      loading={global.loading.productId === item.id}
    >
      Add To Cart
    </Button>
  );
}
