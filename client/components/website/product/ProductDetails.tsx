"use client";
import { Button, Divider, Rate } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { productDiscountCalculation } from "@/lib/utils";
import { setResponse } from "@/redux/features/global/globalSlice";
import { saveWishlist } from "@/lib/apis/wishlist";
import { useSession } from "next-auth/react";
import ModalLogin from "../login/ModalLogin";
import AddToCartButton from "@/components/AddToCartButton";
import { decrementCart, incrementCart } from "@/redux/features/cart/cartSlice";
import { FaFacebook, FaLinkedin, FaPinterest } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { TfiPencil } from "react-icons/tfi";
import { FaXTwitter } from "react-icons/fa6";
import ProductImageGallery from "./ProductImageGallery";

interface ProductColor {
  colorId: number;
  color: { name: string };
}

export interface ProductVariant {
  id: number;
  price: number;
  purchasePrice: number;
  sizeId: number;
  size: { name: string };
  stockQty: number;
  default: boolean;
}

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

  const {
    name,
    defaultProduct,
    tax,
    reviews,
    brand,
    discountId,
    discount,
    productColors,
    variant,
    productVariants,
    qty,
    slug,
    images,
    thumbnailImage,
    shortDescription,
  } = product;

  const unitPrice = +defaultProduct?.unitPrice;
  let taxAmount = (+unitPrice * (+tax?.value || 0)) / 100;

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
        <ProductImageGallery images={images} />
      </div>
      <div className="col-span-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="md:text-2xl md:font-bold mb-2 font-semibold text-lg">
              {name}
            </h1>
            <Rate
              disabled
              value={
                +((productRating?.totalReview || 0) / (reviews?.length || 0))
              }
            />
            <span className="mx-2">Reviews ({reviews?.length || 0})</span>
          </div>
          <div>{brand?.name && <h2>Brand: {brand.name}</h2>}</div>
        </div>

        <div>
          <p className="text-2xl font-semibold text-blue-600 mr-4">
            {discountId
              ? (
                  unitPrice +
                  +taxAmount -
                  productDiscountCalculation(product)
                ).toFixed(2)
              : (unitPrice + +taxAmount || 0).toFixed(2)}
          </p>

          {discountId && (
            <>
              <span className="line-through text-gray-500">
                ৳ {(unitPrice + +taxAmount || 0).toFixed(2)}
              </span>
              <span className="text-red-600 ml-2">
                - {discount?.value}
                {discount?.discountType === "Percentage" ? "%" : "BDT"}
              </span>
            </>
          )}
        </div>

        <div
          className="text-gray-700 mb-4 leading-6"
          dangerouslySetInnerHTML={{
            __html: shortDescription,
          }}
        />

        {productColors && (
          <div className="mb-4">
            <span className="text-gray-600">Color: </span>
            {(productColors || []).map((item: ProductColor) => (
              <Button
                key={item.colorId}
                onClick={() => {
                  setProduct({
                    ...product,
                    color: item?.color,
                    colorId: item?.colorId,
                  });
                }}
                className={`mr-2 px-2 py-1 focus:outline-none  ${
                  product.colorId === item.colorId ? "!bg-gray-200" : ""
                }`}
              >
                {item?.color?.name}
              </Button>
            ))}
          </div>
        )}

        {variant && (
          <div className="mb-4">
            <span>Size: </span>
            {(productVariants || []).map(
              (item: ProductVariant, idx: number) => (
                <Button
                  key={idx}
                  onClick={async () => {
                    setProduct({
                      ...product,
                      defaultProduct: item,
                    });
                    setCheckStock(item.stockQty);
                  }}
                  className={`mr-2 px-2 py-1 focus:outline-none  ${
                    defaultProduct.id === item.id ? "!bg-gray-200" : ""
                  }`}
                >
                  {item?.size?.name}
                </Button>
              )
            )}
          </div>
        )}
        <p>In stock {checkStock} Items</p>

        {/* product Action section */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            <Button
              onClick={() => handleDecrementCart(product)}
              disabled={qty <= 1}
              className="bg-gray-200 hover:bg-gray-300 focus:outline-none"
            >
              -
            </Button>
            <Button type="default" className="w-12 text-center border-gray-300">
              {qty}
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
          SKU: <span className="text-gray-500">{slug}</span>
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
