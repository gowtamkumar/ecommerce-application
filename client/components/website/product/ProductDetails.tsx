"use client";
import appConfig from "@/appConfig";
import AddToCartButton from "@/components/share-component/AddToCartButton";
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
import { CheckOutlined } from "@ant-design/icons";
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
import Share from "./Share";

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
    slug,
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

  const findProduct = cart.carts?.cartList?.find(
    ({ productId }: { productId: number }) => productId === product.id
  );

  const averageRating =
    reviews?.length > 0
      ? (Number(productRating?.totalReview) / reviews.length).toFixed(1)
      : "0.0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start font-sans">
      {/* Gallery Section */}
      <div className="col-span-1 md:col-span-6 lg:col-span-7 sticky top-24">
        <ProductImageGallery images={images} />
      </div>

      {/* Details Section - "More Design" Premium Style */}
      <div className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col">
        <div className="relative bg-white rounded-3xl p-6 lg:p-8 shadow-xl shadow-indigo-500/5 border border-white ring-1 ring-gray-100 overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-b from-indigo-50/50 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          {/* Brand & Stock Status */}
          <div className="relative flex items-center justify-between mb-6 z-10">
            {brand?.name && (
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-gray-900/20">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                {brand.name}
              </span>
            )}
            {checkStock > 0 ? (
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-700 font-bold text-sm tracking-wide">
                  In Stock
                </span>
              </div>
            ) : (
              <span className="text-rose-600 font-bold text-sm tracking-wide bg-rose-50 px-3 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Title - Gradient Typography */}
          <h1 className="relative text-4xl lg:text-5xl font-black mb-4 leading-[1.1] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 z-10">
            {name}
          </h1>

          {/* Ratings */}
          <div className="relative flex items-center gap-4 mb-8 pb-8 border-b border-gray-100 z-10">
            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <Rate
                disabled
                allowHalf
                defaultValue={0}
                value={+averageRating}
                className="text-amber-400 text-sm"
              />
              <span className="text-gray-900 font-bold text-sm pt-0.5">
                {averageRating}
              </span>
            </div>
            <span className="text-gray-400 text-sm font-medium">
              Based on{" "}
              <strong className="text-gray-900">
                {+reviewsCount || 0} reviews
              </strong>
            </span>
          </div>

          {/* Price - Vibrant & Big */}
          <div className="relative mb-10 z-10">
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-3 flex-wrap">
                <span className="text-5xl lg:text-6xl font-black text-global-primary tracking-tighter leading-none">
                  {formatPrice(product.finalPrice)}
                </span>
                {+discountValue > 0 && (
                  <div className="flex flex-col mb-1.5">
                    <span className="text-xl text-gray-400 line-through font-semibold">
                      {formatPrice(salePrice)}
                    </span>
                    <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded uppercase tracking-wide">
                      Save {discountValue}
                      {discountStrategy === "Percentage"
                        ? "%"
                        : selectedCurrency?.symbol}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Short Description */}
          <div
            className="relative prose prose-sm text-gray-600 mb-10 leading-loose z-10"
            dangerouslySetInnerHTML={{
              __html: shortDescription,
            }}
          />

          {/* Variants */}
          {variant && (
            <div className="relative space-y-6 mb-10 z-10">
              <div className="space-y-4">
                <span className="text-sm font-extrabold text-gray-900 uppercase tracking-widest">
                  Select Variant
                </span>
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
                        className={`group relative flex items-center gap-3 pl-3 pr-5 py-3 border-2 rounded-2xl transition-all duration-300 min-w-[150px]
                          ${isSelected
                            ? "border-global-primary bg-global-primary/5 shadow-lg shadow-global-primary/10 ring-1 ring-global-primary"
                            : "border-gray-100 bg-white hover:border-global-primary/30 hover:shadow-md"
                          }`}
                      >
                        {item?.color?.value ? (
                          <div
                            className={`p-1 rounded-full border ${isSelected
                              ? "border-indigo-200"
                              : "border-gray-100"
                              }`}
                          >
                            <div
                              className="w-5 h-5 rounded-full shadow-sm"
                              style={{ backgroundColor: item.color.value }}
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-500">
                            ?
                          </div>
                        )}

                        <div className="flex flex-col items-start">
                          <span
                            className={`font-bold text-sm ${isSelected ? "text-global-primary" : "text-gray-700"
                              }`}
                          >
                            {item?.size?.name}
                          </span>
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            {item?.color?.name}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-global-primary text-white rounded-full p-1 shadow-md shadow-global-primary/20">
                            <CheckOutlined className="text-xs" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="relative space-y-6 pt-8 border-t border-gray-100 z-10">
            <div className="flex flex-col sm:flex-row gap-4 h-[60px]">
              {/* Quantity - Pill Style */}
              <div className="flex items-center justify-between px-2 py-1 bg-gray-100 rounded-full w-full sm:w-40 border border-transparent hover:border-gray-300 transition-colors">
                <button
                  onClick={() => setQty((pre) => Math.max(1, pre - 1))}
                  disabled={qty <= 1}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-700 hover:text-black hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  <HiOutlineMinus size={16} />
                </button>
                <span className="font-bold text-xl text-gray-900">{qty}</span>
                <button
                  onClick={() => setQty((pre) => pre + 1)}
                  disabled={qty >= checkStock}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-700 hover:text-black hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  <AiOutlinePlus size={16} />
                </button>
              </div>

              {/* Add to Cart / Checkout - "More Design" Gradient */}
              <div className="flex-1 h-full">
                {findProduct ? (
                  <Button
                    type="primary"
                    onClick={() => route.push("/checkout")}
                    className="w-full h-full text-lg font-bold rounded-full flex items-center justify-center gap-2"
                  >
                    <span className="tracking-wide">CHECKOUT NOW</span>
                  </Button>
                ) : (
                  <div className="w-full h-full">
                    <AddToCartButton
                      className="!h-full !rounded-full !text-lg !font-bold flex items-center justify-center gap-3"
                      item={{
                        ...product,
                        productVariantId: defaultProduct?.id,
                        qty,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                className="flex items-center gap-2.5 text-sm font-bold text-gray-500 hover:text-rose-500 transition-all group py-2"
                onClick={() => {
                  if (session.status === "unauthenticated") {
                    dispatch(setUnAuthorize(true));
                  } else {
                    AddToWishlist(id);
                  }
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-rose-50 transition-colors">
                  <CiHeart
                    size={22}
                    className="group-hover:scale-110 transition-transform"
                  />
                </div>
                <span>Add to Wishlist</span>
              </button>

              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Share
                </span>
                <Share
                  value={{
                    url: `${appConfig.publicUrl}/product/${slug}`,
                    name: name,
                  }}
                />
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
