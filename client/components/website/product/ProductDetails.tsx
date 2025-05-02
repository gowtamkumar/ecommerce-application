"use client";
import { Button, Divider, message, Rate } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productDiscountCalculation } from "@/lib/utils";
import { setResponse } from "@/redux/features/global/globalSlice";
import { saveWishlist } from "@/lib/apis/wishlist";
import { useSession } from "next-auth/react";
import ModalLogin from "../login/ModalLogin";
import AddToCartButton from "@/components/AddToCartButton";
import {
  decrementCart,
  incrementCart,
  selectCart,
} from "@/redux/features/cart/cartSlice";
import { FaFacebook, FaLinkedin, FaPinterest } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { TfiPencil } from "react-icons/tfi";
import { FaXTwitter } from "react-icons/fa6";
import ProductImageGallery from "./ProductImageGallery";
import {
  selectProduct,
  setProduct,
} from "@/redux/features/products/productSlice";
import { useRouter } from "next/navigation";
import ProductShare from "./ProductShare";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";

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

const ProductDetails = ({ productRating, checkStock, setCheckStock }: any) => {
  const [unAuthorize, setUnAuthorize] = useState(false);
  const dispatch = useDispatch();
  const session = useSession();
  const route = useRouter();

  const products = useSelector(selectProduct);
  const cart = useSelector(selectCart);

  const { product } = products;

  const {
    id,
    name,
    defaultProduct,
    reviews,
    reviewsCount,
    brand,
    salePrice,
    discountValue,
    discountStrategy,
    variant,
    productVariants,
    images,
    shortDescription,
  } = products.product;

  console.log("defaultProduct", defaultProduct);

  async function AddToWishlist(productId: number) {
    try {
      const res = await saveWishlist({
        productId,
      });

      if (res.success) {
        successNotification({ message: "succes" });
        // message.success(`${res.message}`);
      }

      if (!res.success) {
        message.info("This is a normal message");
        // message.success(res.message);
      }
      message.info("This is a normal message");
      setTimeout(() => {
        dispatch(setResponse({}));
      }, 2000);
    } catch (error) {
      console.log("error", error);
    }
  }

  // function stockCheckingAndPurchaseLimit(
  //   product: { limitPurchaseQty: number; qty: number },
  //   checkStock: number
  // ): boolean {
  //   if (product.limitPurchaseQty && product.limitPurchaseQty <= product.qty) {
  //     return true;
  //   }
  //   if (checkStock <= product.qty) {
  //     return true;
  //   }
  //   return false;
  // }

  const findProduct = cart.carts.cartList?.find(
    ({ productId }: { productId: number }) => productId === product.id
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 py-5 leading-10">
      <div className="col-span-6">
        <ProductImageGallery images={images} />
      </div>
      <div className="col-span-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="md:text-xl md:font-bold mb-2 font-semibold text-lg">
              {name}
            </h1>
            <Rate
              disabled
              value={
                +((productRating?.totalReview || 0) / (reviews?.length || 0))
              }
            />
            <span className="mx-2">Reviews ({+reviewsCount || 0})</span>
          </div>
          <div>{brand?.name && <h2>Brand: {brand.name}</h2>}</div>
        </div>

        <div>
          <p className="text-2xl font-semibold text-blue-600 mr-4">
            {product.finalPrice}
          </p>

          {+discountValue > 0 && (
            <div className="text-xs">
              <span className="line-through text-gray-500">৳ {salePrice}</span>
              <span className="text-red-600 ml-2">
                - {discountValue}
                {discountStrategy === "Percentage" ? "%" : "BDT"}
              </span>
            </div>
          )}
        </div>

        <div
          className="text-gray-700 mb-4 leading-6"
          dangerouslySetInnerHTML={{
            __html: shortDescription,
          }}
        />

        {variant && (
          <div className="mb-4">
            <span>Size: </span>
            {(productVariants || []).map((item: any, idx: number) => (
              <Button
                key={idx}
                onClick={async () => {
                  dispatch(
                    setProduct({
                      ...product,
                      defaultProduct: item,
                    })
                  );
                  setCheckStock(item.stockQty);
                }}
                className={`mr-2 px-2 py-1 focus:outline-none  ${defaultProduct.id === item.id ? "!bg-gray-200" : ""
                  }`}
              >
                {item?.size?.name} {item?.color?.name}
              </Button>
            ))}
          </div>
        )}
        <p>In stock {checkStock} Items</p>

        {/* product Action section */}
        <div className="flex items-center gap-2 mb-4">
          {findProduct ? (
            <div>
              <Button
                className="w-full"
                onClick={() => route.push("/checkout")}
                style={{ fontFamily: "unset" }}
              >
                Go To Cart
              </Button>
            </div>
          ) : (
            <div>
              <AddToCartButton
                item={{ ...product, productVariantId: defaultProduct?.id }}
              />
            </div>
          )}
          <span
            className="cursor-pointer flex items-center gap-1"
            onClick={() => {
              if (session.status === "unauthenticated") {
                setUnAuthorize(true);
              } else {
                AddToWishlist(id);
              }
            }}
          >
            <CiHeart /> Add Wishlist
          </span>
        </div>
        <Divider />
        <div className="flex gap-4 items-center">
          <div>Share:</div>
          <ProductShare />
        </div>
        <ModalLogin unAuthorize={unAuthorize} setUnAuthorize={setUnAuthorize} />
      </div>
    </div>
  );
};

export default ProductDetails;
