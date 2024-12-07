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
import { FaFacebook, FaLinkedin, FaPinterest } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { TfiPencil } from "react-icons/tfi";
import { FaXTwitter } from "react-icons/fa6";
import ProductImageGallery from "./ProductImageGallery";

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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 py-5 leading-10">
      <div className="col-span-6">
        <ProductImageGallery
          images={product.images}
          thumbnailImage={product.thumbnailImage}
        />
      </div>
      <div className="col-span-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="md:text-2xl md:font-bold mb-2 font-semibold text-lg">
              {product?.name}
            </h1>
            <Rate
              disabled
              value={
                +(
                  (productRating?.totalReview || 0) /
                  (product?.reviews?.length || 0)
                )
              }
            />
            <span className="mx-2">
              Reviews ({product?.reviews?.length || 0})
            </span>
          </div>
          <div>
            {product?.brand?.name && <h2>Brand: {product.brand.name}</h2>}
          </div>
        </div>

        <div>
          <p className="text-2xl font-semibold text-blue-600 mr-4">
            {/* price + taxAmount + product discount */}৳{" "}
            {product?.discountId ? (+444).toFixed(2) : (+222 || 0).toFixed(2)}
            {/* +price + +taxAmount  */}
          </p>

          {product?.discountId ? (
            <>
              <span className="line-through text-gray-500">
                {/* ৳ {(+price + +taxAmount || 0).toFixed(2)} */}৳{" "}
                {(+33 || 0).toFixed(2)}
              </span>
              <span className="text-red-600 ml-2">
                - {product?.discount?.value}
                {product?.discount?.discountType === "Percentage" ? "%" : "BDT"}
              </span>
            </>
          ) : null}
        </div>

        <div
          className="text-gray-700 mb-4 leading-6"
          dangerouslySetInnerHTML={{
            __html:
              product.shortDescription 
          }}
        />

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
            <span>Size: </span>
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
        <p>In stock 420 Items</p>

        {/* product Action section */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            <Button
              onClick={() => handleDecrementCart(product)}
              disabled={product.qty <= 1}
              className="bg-gray-200 hover:bg-gray-300 focus:outline-none"
            >
              -
            </Button>
            <Button type="default" className="w-12 text-center border-gray-300">
              {product.qty}
            </Button>
            <Button
              onClick={() => handleIncrementCart(product)}
              className="bg-gray-200 hover:bg-gray-300 focus:outline-none"
              disabled={stockCheckingAndPurchaseLimit(product, checkStock)}
            >
              +
            </Button>
          </div>
          <div>
            <AddToCartButton item={product} />
          </div>
          <Button className="px-2 py-1 bg-gray-200 hover:bg-gray-300 focus:outline-none">
            BUY NOW
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <span
            className="cursor-pointer flex items-center gap-1"
            onClick={() => {
              if (session.status === "unauthenticated") {
                setUnAuthorize(true);
              } else {
                AddToWishlist(product.id);
              }
            }}
          >
            <CiHeart /> Add to Wishlist
          </span>
          <span
            onClick={() => console.log("dsasfd")}
            className="flex items-center gap-1"
          >
            <TfiPencil />
            Size Guide
          </span>
        </div>
        <Divider />
        <div>
          SKU: <span className="text-gray-500">{product.slug}</span>
        </div>
        <div className="flex gap-4 items-center">
          <div>Share:</div>
          <div className="flex gap-3">
            <FaFacebook size={22} />
            <FaXTwitter size={22} />
            <FaPinterest size={22} />
            <FaLinkedin size={22} />
          </div>
        </div>
        <ModalLogin unAuthorize={unAuthorize} setUnAuthorize={setUnAuthorize} />
      </div>
    </div>
  );
};

export default ProductDetails;
