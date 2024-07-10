"use client";
import { Button, Divider, Input, Rate } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import {
  addCart,
  decrementCart,
  incrementCart,
} from "@/redux/features/cart/cartSlice";
import Link from "next/link";
import ProductActions from "./ProductActions";

const ProductDetails = ({ product, setProduct }: any) => {
  const dispatch = useDispatch();

  function discountCalculation(value: {
    selectProductVarient: { regularPrice: string | number };
    discount: { discountType: string; value: number };
  }) {
    const regularPrice = +value.selectProductVarient?.regularPrice;
    const discount = value.discount;
    const dis =
      discount?.discountType === "Percentage"
        ? (regularPrice * (discount.value || 0)) / 100
        : +discount?.value;
    return dis;
  }

  return (
    <div className="p-4 ">
      <h1 className="text-2xl font-bold mb-2">{product?.name}</h1>
      <h2>
        <Rate allowHalf defaultValue={2.5} />
        37 Ratings
      </h2>
      <h2>
        Brand:
        <Link href={`/brand/${product?.brand?.id}`}>
          {product?.brand?.name}
        </Link>
      </h2>
      <p className="text-gray-700 mb-4">{product?.description}</p>

      <div className="flex items-center mb-4">
        <span className="text-2xl font-semibold text-blue-600 mr-4">
          ৳{" "}
          {product.discountId
            ? (
                +product.selectProductVarient?.regularPrice -
                discountCalculation(product)
              ).toFixed(2)
            : (+product.selectProductVarient?.regularPrice || 0).toFixed(2)}
        </span>
        {product?.discountId ? (
          <>
            <span className="line-through text-gray-500">
              ৳ {(+product.selectProductVarient?.regularPrice || 0).toFixed(2)}
            </span>
            <span className="text-green-600 ml-2">
              - {product?.discount?.value}
              {product?.discount?.discountType === "Percentage" ? "%" : "BDT"}
            </span>
          </>
        ) : null}
      </div>
      <Divider />
      {product?.productVariants?.length && (
        <div className="mb-4">
          <span className="text-gray-600">Color Family: </span>
          {product?.productVariants?.map((item: any, idx: number) => (
            <button
              key={idx}
              onClick={() =>
                setProduct({
                  ...product,
                  selectProductVarient: item,
                })
              }
              style={{ backgroundColor: `${item.color?.color}` }}
              className="mr-2 px-2 py-1 rounded bg-gray-200 text-white hover:bg-gray-300 focus:outline-none"
            >
              {item.color?.name}
            </button>
          ))}
        </div>
      )}

      {product?.productVariants?.length && (
        <div className="mb-4">
          <span className="text-gray-600">Size </span>
          {product?.productVariants?.map((item: any, idx: number) => (
            <Button
              key={idx}
              onClick={() =>
                setProduct({
                  ...product,
                  selectProductVarient: item,
                })
              }
              className="mr-2 px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none"
            >
              {item.size?.name}
            </Button>
          ))}
        </div>
      )}

      {/* product Action section */}
      {/* <ProductActions  /> */}
      <div className="w-60 flex items-center mb-4">
        <span className="text-gray-600"> Quantity: </span>
        <Button
          onClick={() => {
            dispatch(decrementCart(product));
            setProduct({
              ...product,
              qty: product.qty - 1,
            });
          }}
          className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300 focus:outline-none"
        >
          -
        </Button>
        <Input
          type="number"
          value={product.qty}
          readOnly
          className="w-12 text-center border-t border-b border-gray-300"
        />
        <Button
          onClick={() => {
            dispatch(incrementCart(product));
            setProduct({
              ...product,
              qty: product.qty + 1,
            });
          }}
          className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300 focus:outline-none"
        >
          +
        </Button>
      </div>

      <Divider />
      <div className="flex gap-x-5">
        <Button
          type="primary"
          size="large"
          onClick={() => dispatch(addCart(product))}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add to Cart
        </Button>
        <Button size="large" type="default">
          Add to Wishlist
        </Button>
      </div>
      <Divider />
    </div>
  );
};

export default ProductDetails;
