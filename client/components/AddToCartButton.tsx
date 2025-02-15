"use client";
import React from "react";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "@/redux/features/cart/cartSlice";
import { discountTaxCalculationFun } from "@/lib/utils/discountTaxCalculationFun";

type Product = {
  id: number;
  name: string;
  color: any;
  thumbnailImage: string;
  defaultProduct?: {
    id: string;
    unitPrice: number;
    purchasePrice: number;
    size: any;
  };
  discount?: number;
  tax?: { value: number };
};

export default function AddToCartButton({ item }: { item: Product }) {
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  async function addToCart(values: any) {
    const value = { ...values };

    if (value.defaultProduct) {
      const { unitPrice, purchasePrice, size, id } = value.defaultProduct;
      const defaultProduct = {
        discount: value.discount,
        unitPrice,
        tax: value.tax?.value,
      };

      const { discountAmount, taxAmount } = await discountTaxCalculationFun(
        defaultProduct
      );

      Object.assign(value, {
        discountAmount,
        taxAmount,
        productVariantId: id,
        purchasePrice,
        unitPrice,
        size,
      });
    }

    const newData = {
      productId: value.id,
      id: value.id,
      name: value.name,
      productVariantId: value.productVariantId,
      color: value?.color,
      colorId: value?.colorId,
      size: value?.size,
      sizeId: value?.size?.id,
      purchasePrice: Number(value.purchasePrice) || 0,
      unitPrice: Number(value.unitPrice) || 0,
      taxAmount: Number(value.taxAmount) || 0,
      discountAmount: Number(value.discountAmount) || 0,
      thumbnailImage: value.thumbnailImage,
      qty: 1,
    };

    try {
      dispatch(setLoading({ productId: value.id }));
      dispatch(addCart(newData));
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
