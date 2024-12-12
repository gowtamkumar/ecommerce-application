"use client";
import React from "react";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "@/redux/features/cart/cartSlice";
import { discountTaxCalculationFun } from "@/lib/share/discountTaxCalculationFun";

export default function AddToCartButton({ item }: any) {
  console.log("🚀 ~ AddToCartButton:", item)
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  async function addToCart(newDataa: any) {
  const value = {...newDataa}

    if (value.defaultProduct) {
      const defaultProduct = {
        discount: value.discount,
        salePrice: value.defaultProduct.salePrice,
        tax: value.tax.value,
      };
      const res = await discountTaxCalculationFun(defaultProduct);
      value.disAmount = res.disAmount;
      value.taxAmount = res.taxAmount;
      value.productVariantId = value.defaultProduct.id;
      value.purchasePrice = value.defaultProduct.purchasePrice;
      value.salePrice = value.defaultProduct.salePrice;
      value.size = value.defaultProduct.size;
    }

    const newData = {
      id: value.id,
      name: value.name,
      productVariantId: value.productVariantId,
      color: value.color,
      size: value.size,
      purchasePrice: value.purchasePrice,
      price: value.salePrice,
      taxAmount: value.taxAmount,
      disAmount: value.disAmount,
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
    <>
      {/* {global.loading.productId === item.id && (
        <div className="flex gap-1 justify-center py-2">
          <FaCheckCircle size={22} /> Added to cart
        </div>
      )} */}

      <Button
        className="w-full"
        onClick={() => addToCart(item)}
        style={{ fontFamily: "unset" }}
        disabled={global.loading.productId === item.id}
        loading={global.loading.productId === item.id}
      >
        Add To Cart adgsdfg
      </Button>
    </>
  );
}
