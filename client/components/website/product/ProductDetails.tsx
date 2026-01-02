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
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-global-text text-global-bg text-xs font-bold uppercase tracking-widest shadow-lg shadow-global-text/20">
                <span className="w-1.5 h-1.5 rounded-full bg-global-primary" />
                {brand.name}
              </span>
            )}
            {checkStock > 0 ? (
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-global-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-global-primary"></span>
                </span>
                <span className="text-global-primary font-bold text-sm tracking-wide">
                  In Stock
                </span>
              </div>
            ) : (
              <span className="text-global-primary font-bold text-sm tracking-wide bg-global-primary/10 px-3 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Title - Gradient Typography */}
          <h1 className="relative text-4xl lg:text-5xl font-black mb-4 leading-[1.1] tracking-tight text-global-text z-10">
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
                    <span className="text-xl text-global-text/40 line-through font-semibold">
                      {formatPrice(salePrice)}
                    </span>
                    <span className="text-xs font-bold text-global-button-text bg-global-primary px-2 py-0.5 rounded uppercase tracking-wide">
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
            className="relative prose prose-sm text-global-text/70 mb-10 leading-loose z-10"
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
                        className={`group relative flex items-center gap-3 pl-3 pr-5 py-3 border-2 rounded-global-button-radius transition-all duration-300 min-w-[150px]
                          ${isSelected
                            ? "border-global-button-primary bg-global-button-primary/5 shadow-lg shadow-global-button-primary/10 ring-1 ring-global-button-primary"
                            : "border-global-header-text/5 bg-global-bg hover:border-global-button-primary/30 hover:shadow-md"
                          }`}
                      >
                        {item?.color?.value ? (
                          <div
                            className={`p-1 rounded-full border ${isSelected
                              ? "border-global-button-primary/30"
                              : "border-global-header-text/5"
                              }`}
                          >
                            <div
                              className="w-5 h-5 rounded-full shadow-sm"
                              style={{ backgroundColor: item.color.value }}
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-global-header-text/5 flex items-center justify-center font-bold text-xs text-global-header-text/40">
                            ?
                          </div>
                        )}

                        <div className="flex flex-col items-start">
                          <span
                            className={`font-bold text-sm ${isSelected ? "text-global-primary" : "text-global-text/80"
                              }`}
                          >
                            {item?.size?.name}
                          </span>
                          <span className="text-[10px] font-semibold text-global-text/40 uppercase tracking-wider">
                            {item?.color?.name}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-global-button-primary text-global-button-text rounded-full p-1 shadow-md shadow-global-button-primary/20">
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
              <div className="flex items-center justify-between px-2 py-1 bg-global-header-text/5 rounded-full w-full sm:w-40 border border-transparent hover:border-global-header-text/10 transition-colors">
                <button
                  onClick={() => setQty((pre) => Math.max(1, pre - 1))}
                  disabled={qty <= 1}
                  className="w-10 h-10 flex items-center justify-center bg-global-bg rounded-full shadow-sm text-global-text hover:text-global-primary hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  <HiOutlineMinus size={16} />
                </button>
                <span className="font-bold text-xl text-global-text">{qty}</span>
                <button
                  onClick={() => setQty((pre) => pre + 1)}
                  disabled={qty >= checkStock}
                  className="w-10 h-10 flex items-center justify-center bg-global-bg rounded-full shadow-sm text-global-text hover:text-global-primary hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
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
                    className="w-full h-full text-lg font-bold rounded-[var(--button-border-radius)] flex items-center justify-center gap-2 !bg-global-button-primary hover:!bg-global-button-hover !text-global-button-text"
                  >
                    <span className="tracking-wide">CHECKOUT NOW</span>
                  </Button>
                ) : (
                  <div className="w-full h-full">
                    <AddToCartButton
                      className="!h-full !rounded-[var(--button-border-radius)] !text-lg !font-bold flex items-center justify-center gap-3"
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
                className="flex items-center gap-2.5 text-sm font-bold text-global-text/60 hover:text-global-primary transition-all group py-2"
                onClick={() => {
                  if (session.status === "unauthenticated") {
                    dispatch(setUnAuthorize(true));
                  } else {
                    AddToWishlist(id);
                  }
                }}
              >
                <div className="w-10 h-10 rounded-full bg-global-primary/10 flex items-center justify-center group-hover:bg-global-primary/20 transition-colors">
                  <CiHeart
                    size={22}
                    className="group-hover:scale-110 text-global-primary transition-transform"
                  />
                </div>
                <span>Add to Wishlist</span>
              </button>

              <div className="flex items-center gap-3 bg-global-header-text/5 px-4 py-2 rounded-full">
                <span className="text-xs font-bold text-global-text/40 uppercase tracking-wider">
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
