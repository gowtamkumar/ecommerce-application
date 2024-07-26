"use client";
import { Button, Divider, Input, Rate } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addCart,
  decrementCart,
  incrementCart,
} from "@/redux/features/cart/cartSlice";
import Link from "next/link";
import { productDiscountCalculation } from "@/lib/share";
import { setResponse } from "@/redux/features/global/globalSlice";
import { saveWishlist } from "@/lib/apis/wishlist";
import { useSession } from "next-auth/react";
import ModalLogin from "../login/ModalLogin";

const ProductDetails = ({ product, setProduct, productRating }: any) => {
  const [unAuthorize, setUnAuthorize] = useState(false);
  const dispatch = useDispatch();
  const session = useSession();

  const price = product.selectProductVarient?.price;

  let taxAmount = (+price * (product.tax?.value || 0)) / 100;

  async function addToCart(value: any) {
    const price = +value.selectProductVarient.price;
    let taxAmount = (+price * (value?.tax?.value || 0)) / 100;
    dispatch(
      addCart({
        ...value,
        discountA: productDiscountCalculation(value) || 0,
        tax: taxAmount,
        price,
      })
    );
  }

  async function incrementToCart(product: any) {
    dispatch(incrementCart(product));
    setProduct({
      ...product,
      qty: product.qty + 1,
    });
  }

  async function decrementToCart(product: any) {
    dispatch(decrementCart(product));
    setProduct({
      ...product,
      qty: product.qty - 1,
    });
  }

  async function AddToWishlist(productId: number) {
    try {
      const res = await saveWishlist({
        productId: productId,
      });

      // if (res.status === 500) {
      //   dispatch(setResponse({ type: "error", message: res.message }));
      // } else {
      //   dispatch(
      //     setResponse({ type: "success", message: "successfully Added" })
      //   );
      // }
      setTimeout(() => {
        dispatch(setResponse({}));
      }, 2000);
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{product?.name}</h1>
      <h2>
        <Rate
          disabled
          value={
            +(
              (productRating?.totalReview || 0) /
              (product?.reviews?.length || 0)
            )
          }
        />
        {product?.reviews?.length || 0} Ratings
      </h2>
      <h2>
        Brand:
        <Link href={`/brand/${product?.brand?.id}`}>
          {product?.brand?.name}
        </Link>
      </h2>
      <p className="text-gray-700 mb-4">{product?.shortDescription}</p>

      <div className="flex items-center mb-4">
        <span className="text-2xl font-semibold text-blue-600 mr-4">
          ৳{" "}
          {product.discountId
            ? (
                +price +
                +taxAmount -
                productDiscountCalculation(product)
              ).toFixed(2)
            : (+price + +taxAmount || 0).toFixed(2)}
        </span>
        {product?.discountId ? (
          <>
            <span className="line-through text-gray-500">
              ৳ {(+price + +taxAmount || 0).toFixed(2)}
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
            <Button
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
            </Button>
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
        <span className="text-gray-600">Quantity: </span>
        <Button
          onClick={() => decrementToCart(product)}
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
          onClick={() => incrementToCart(product)}
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
          onClick={() => {
            if (session.status === "unauthenticated") {
              setUnAuthorize(true);
            } else {
              addToCart(product);
            }
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add to Cart
        </Button>

        <Button
          size="large"
          type="default"
          onClick={() => {
            if (session.status === "unauthenticated") {
              setUnAuthorize(true);
            } else {
              AddToWishlist(product.id);
            }
          }}
        >
          Add to Wishlist
        </Button>
        {/* {global.response.type && (
          <Alert
            className="p-0 m-0"
            message={`${global.response.message}`}
            type={global.response.type}
          />
        )} */}
      </div>
      <Divider />
      <ModalLogin unAuthorize={unAuthorize} setUnAuthorize={setUnAuthorize} />
    </div>
  );
};

export default ProductDetails;
