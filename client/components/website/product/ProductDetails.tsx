"use client";
import { Button, Divider, Input, Rate } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { productDiscountCalculation } from "@/lib/utils";
import { setResponse } from "@/redux/features/global/globalSlice";
import { saveWishlist } from "@/lib/apis/wishlist";
import { useSession } from "next-auth/react";
import ModalLogin from "../login/ModalLogin";
import { getProductVariant } from "@/lib/apis/product-variant";
import { saveCart } from "@/lib/apis/cart";
import AddToCartButton from "@/components/AddToCartButton";
import { decrementCart, incrementCart } from "@/redux/features/cart/cartSlice";
import { FaFacebook } from "react-icons/fa";

const ProductDetails = ({
  product,
  setProduct,
  productRating,
  checkStock,
  setCheckStock,
}: any) => {
  const [unAuthorize, setUnAuthorize] = useState(false);
  const dispatch = useDispatch();
  const session = useSession();
  const price = product.defaultProduct?.salePrice;
  let taxAmount = (+price * (product.tax?.value || 0)) / 100;

  function handleIncrementCart(item: any) {
    dispatch(incrementCart(item));
  }

  function handleDecrementCart(item: any) {
    dispatch(decrementCart(item));
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

  function stockCheckingAndPurchaseLimit(
    product: { limitPurchaseQty: number; qty: number },
    checkStock: number
  ): boolean {
    if (product.limitPurchaseQty && product.limitPurchaseQty <= product.qty) {
      return true;
    }
    if (checkStock <= product.qty) {
      return true;
    }
    return false;
  }

  return (
    <div className="p-4">
      <h1 className="md:text-2xl md:font-bold mb-2 font-semibold text-lg">
        {product?.name}
      </h1>
      <Rate
        disabled
        value={
          +((productRating?.totalReview || 0) / (product?.reviews?.length || 0))
        }
      />
      {product?.reviews?.length || 0} Ratings
      {product?.brand?.name && (
        <h2>
          Brand: {product.brand.name}
          {/* <Link href={`/brand/${product?.brand?.id}`}>
          </Link> */}
        </h2>
      )}
      <p className="text-gray-700 mb-4">{product.shortDescription}</p>
      <div className="md:flex-row items-center mb-4">
        <div className="flex justify-around">
          <span className="text-2xl font-semibold text-blue-600 mr-4">
            ৳{" "}
            {product?.discountId
              ? (
                  +price +
                  +taxAmount -
                  productDiscountCalculation(product)
                ).toFixed(2)
              : (+price + +taxAmount || 0).toFixed(2)}
          </span>

          {checkStock > 0 ? (
            <div className="text-green-500 mx-3">In Stock</div>
          ) : (
            <div className="text-red-500 mx-3">Out of Stock</div>
          )}
        </div>

        {product?.discountId ? (
          <div className="flex justify-around">
            <span className="line-through text-gray-500">
              ৳ {(+price + +taxAmount || 0).toFixed(2)}
            </span>
            <span className="text-red-600 ml-2">
              - {product?.discount?.value}
              {product?.discount?.discountType === "Percentage" ? "%" : "BDT"}
            </span>
          </div>
        ) : null}
      </div>
      <Divider />
      {product?.variant && (
        <div className="mb-4">
          <span className="text-gray-600">Color: </span>
          {product.productVariants.map((item: any, idx: number) => (
            <Button
              key={idx}
              onClick={async () => {
                setProduct({
                  ...product,
                  selectProductVariant: item,
                });

                if (product.productVariants[0].id) {
                  const productVariant = await getProductVariant({
                    id: product.productVariants[0].id,
                  });
                  setCheckStock(productVariant.data.stockQty);
                }
              }}
              className="mr-2 px-2 py-1 rounded text-white hover:bg-gray-300 focus:outline-none"
            >
              {item?.color?.name}
            </Button>
          ))}
        </div>
      )}
      {product.variant && (
        <div className="mb-4">
          <span>Size </span>
          {product?.productVariants.map((item: any, idx: number) => (
            <Button
              key={idx}
              onClick={async () => {
                setProduct({
                  ...product,
                  selectProductVariant: item,
                });
                if (product.productVariants[0].id) {
                  const productVariant = await getProductVariant({
                    id: product.productVariants[0].id,
                  });
                  setCheckStock(productVariant.data.stockQty);
                }
              }}
              className="mr-2 text-white px-2 py-1 bg-gray-200 hover:bg-gray-300 focus:outline-none"
            >
              {item?.size?.name}
            </Button>
          ))}
        </div>
      )}
      {/* product Action section */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600">Quantity: </span>
        <div className="flex">
          <Button
            onClick={() => handleDecrementCart(product)}
            disabled={product.qty <= 1}
            className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300 focus:outline-none"
          >
            -
          </Button>
          <Input
            type="number"
            value={product.qty}
            min={1}
            readOnly
            className="w-12 text-center border-t border-b border-gray-300"
          />
          <Button
            onClick={() => handleIncrementCart(product)}
            className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300 focus:outline-none"
            disabled={stockCheckingAndPurchaseLimit(product, checkStock)}
          >
            +
          </Button>
        </div>

        <div>
          <AddToCartButton item={product} />
        </div>
      </div>
      <Button
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
      <Divider />
      <div>SKU: {product.slug}</div>
      <div className="flex gap-4 items-center justify-center">
        <p>Share: </p>
        <div className="flex">
          <FaFacebook />
          <FaFacebook />
          <FaFacebook />
          <FaFacebook />
        </div>
      </div>
      <ModalLogin unAuthorize={unAuthorize} setUnAuthorize={setUnAuthorize} />
    </div>
  );
};

export default ProductDetails;
