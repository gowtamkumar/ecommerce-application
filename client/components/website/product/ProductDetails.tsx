"use client";
import AddToCartButton from "@/components/AddToCartButton";
import { useCurrency } from "@/context/CurrencyContext";
import { saveWishlist } from "@/lib/apis/wishlist";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import { selectCart } from "@/redux/features/cart/cartSlice";
import {
  setResponse,
  setUnAuthorize,
} from "@/redux/features/global/globalSlice";
import {
  selectProduct,
  setProduct,
} from "@/redux/features/products/productSlice";
import { Button, Rate } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import { HiOutlineMinus } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import ModalLogin from "../login/ModalLogin";
import ProductImageGallery from "./ProductImageGallery";
import ProductShare from "./ProductShare";
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
  setSelectVariant,
  productRating,
  checkStock,
  setCheckStock,
}: any) => {
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const session = useSession();
  const route = useRouter();

  const products = useSelector(selectProduct);
  const cart = useSelector(selectCart);

  const { product } = products;
  const { formatPrice, selectedCurrency } = useCurrency();

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

  async function AddToWishlist(productId: number) {
    try {
      const res = await saveWishlist({
        productId,
      });

      if (res.success) {
        successNotification({ message: res.message });
      }

      if (!res.success) {
        errorNotification({ message: res.message });
      }

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

  const findProduct = cart.carts?.cartList?.find(
    ({ productId }: { productId: number }) => productId === product.id
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
      <div className="col-span-1 md:col-span-6 lg:col-span-7">
        <ProductImageGallery images={images} />
      </div>
      <div className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col h-full">
        <div className="flex-1">
          {/* Header Section */}
          <div className="border-b border-gray-100 pb-6 mb-6">
            {brand?.name && (
              <h2 className="text-sm font-semibold tracking-wider text-gray-500 uppercase mb-2 font-global-secondary-fontfamily">
                {brand.name}
              </h2>
            )}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-global-primary-fontfamily leading-tight">
              {name}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Rate
                  disabled
                  allowHalf
                  defaultValue={0}
                  value={
                    +((productRating?.totalReview || 0) / (reviews?.length || 0))
                  }
                  className="text-global-primary text-sm"
                />
                <span className="text-gray-500 text-sm ml-2">
                  ({+reviewsCount || 0} reviews)
                </span>
              </div>
              {checkStock > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">In Stock</span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Price Section */}
          <div className="mb-8">
            <div className="flex items-baseline gap-4">
              <p className="text-4xl font-bold text-gray-900 font-global-primary-fontfamily">
                {formatPrice(product.finalPrice)}
              </p>
              {+discountValue > 0 && (
                <div className="flex flex-col">
                  <span className="line-through text-gray-400 text-lg">{formatPrice(salePrice)}</span>
                  <span className="text-red-500 text-sm font-medium">
                    Save {discountValue}{discountStrategy === "Percentage" ? "%" : selectedCurrency?.symbol}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            className="prose prose-sm text-gray-600 mb-8 leading-relaxed font-global-secondary-fontfamily"
            dangerouslySetInnerHTML={{
              __html: shortDescription,
            }}
          />

          {/* Variants Section */}
          {variant && (
            <div className="space-y-6 mb-8">
              <div>
                <span className="block text-sm font-semibold text-gray-900 mb-3">Select Variant</span>
                <div className="flex flex-wrap gap-3">
                  {(productVariants || []).map((item: any, idx: number) => {
                    const isSelected = defaultProduct?.id === item.id;
                    return (
                      <button
                        key={idx}
                        onClick={async () => {
                          setSelectVariant({ productVariantId: item.id });
                          dispatch(
                            setProduct({
                              ...product,
                              defaultProduct: item,
                            })
                          );
                          setCheckStock(item.stockQty);
                        }}
                        className={`group relative flex items-center justify-between min-w-[80px] px-4 py-3 border rounded-xl transition-all duration-200
                          ${isSelected
                            ? "border-black bg-black text-white ring-1 ring-black ring-offset-1"
                            : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-medium text-sm">{item?.size?.name}</span>
                          <span className={`text-xs ${isSelected ? "text-gray-300" : "text-gray-500"}`}>{item?.color?.name}</span>
                        </div>
                        {item?.color?.value && (
                          <div
                            className={`w-3 h-3 rounded-full border ${isSelected ? "border-white" : "border-gray-200"}`}
                            style={{ backgroundColor: item.color.value }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Action Section */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex items-stretch gap-4">
              {/* Quantity */}
              <div className="flex items-center justify-between px-4 py-2 border border-gray-200 rounded-xl w-32 bg-gray-50">
                <button
                  onClick={() => setQty((pre) => Math.max(1, pre - 1))}
                  disabled={qty <= 1}
                  className="p-2 hover:text-black text-gray-500 disabled:opacity-30 transition-colors"
                >
                  <HiOutlineMinus size={16} />
                </button>
                <span className="font-semibold text-lg w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty((pre) => pre + 1)}
                  disabled={qty >= checkStock}
                  className="p-2 hover:text-black text-gray-500 disabled:opacity-30 transition-colors"
                >
                  <AiOutlinePlus size={16} />
                </button>
              </div>

              {/* Cart Button */}
              <div className="flex-1">
                {findProduct ? (
                  <Button
                    className="w-full h-full text-base font-semibold rounded-xl"
                    type="primary"
                    onClick={() => route.push("/checkout")}
                    style={{ fontFamily: "unset", height: "100%" }}
                  >
                    Proceed to Checkout
                  </Button>
                ) : (
                  <AddToCartButton
                    className="w-full !h-full !rounded-xl !text-base !font-semibold !bg-black !text-white hover:!bg-gray-800 transition-colors py-0 flex items-center justify-center gap-2"
                    item={{ ...product, productVariantId: defaultProduct?.id, qty }}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                onClick={() => {
                  if (session.status === "unauthenticated") {
                    dispatch(setUnAuthorize(true));
                  } else {
                    AddToWishlist(id);
                  }
                }}
              >
                <CiHeart size={20} />
                <span>Add to Wishlist</span>
              </button>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Share:</span>
                <ProductShare />
              </div>
            </div>
          </div>
        </div>

        <ModalLogin />
      </div>
    </div>
  );
};

export default ProductDetails;
