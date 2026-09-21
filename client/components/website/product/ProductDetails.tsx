"use client";

import appConfig from "@/appConfig";
import AddToCartButton from "@/components/share-component/AddToCartButton";
import { useCurrency } from "@/context/CurrencyContext";
import { getCartLists, saveCart } from "@/lib/apis/cart";
import { saveWishlist } from "@/lib/apis/wishlist";
import { getImageUrl } from "@/lib/utils/imageUrl";
import {
    errorNotification,
    successNotification,
} from "@/lib/utils/notification";
import { replaceCart, selectCart } from "@/redux/features/cart/cartSlice";
import {
    setResponse,
    setUnAuthorize,
} from "@/redux/features/global/globalSlice";
import {
    selectProduct,
    setProduct,
} from "@/redux/features/products/productSlice";
import { Modal, Rate } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import {
    FiCheck,
    FiChevronRight,
    FiHeart,
    FiLock,
    FiRotateCcw,
    FiShield,
    FiTruck,
    FiZap,
} from "react-icons/fi";
import { HiOutlineMinus } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import ProductImageGallery from "./ProductImageGallery";
import Share from "./Share";

export interface ProductVariant {
  id: number;
  price: number;
  purchasePrice: number;
  sizeId: number;
  size: { name: string };
  color?: { name: string; value?: string };
  stockQty: number;
  default: boolean;
}

interface ProductDetailsProps {
  setSelectVariant: (v: any) => void;
  productRating: any;
  checkStock: number;
  setCheckStock: (stock: number) => void;
}

export default function ProductDetails({
  setSelectVariant,
  productRating,
  checkStock,
  setCheckStock,
}: ProductDetailsProps) {
  const [qty, setQty] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const dispatch = useDispatch();
  const session = useSession();
  const router = useRouter();

  const products = useSelector(selectProduct);
  const cart = useSelector(selectCart);

  const { product } = products;
  const { formatPrice, selectedCurrency } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      // Reveal sticky purchase bar when scrolled past 400px
      if (window.scrollY > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    id,
    slug,
    name,
    defaultProduct,
    reviews,
    reviewsCount,
    brand,
    salePrice,
    unitPrice,
    finalPrice,
    discountValue,
    discountStrategy,
    variant,
    productVariants,
    images,
    shortDescription,
    productCategories,
  } = product || {};

  const findProduct = cart?.carts?.cartList?.find(
    ({ productId }: { productId: number }) => productId === id
  );

  const primaryCategory =
    productCategories?.[0]?.category || product?.category;

  async function handleWishlist() {
    if (session.status === "unauthenticated") {
      dispatch(setUnAuthorize(true));
      return;
    }

    try {
      const res = await saveWishlist({ productId: id });
      if (res.success) {
        setIsWishlisted(true);
        successNotification({ message: res.message || "Added to wishlist" });
      } else {
        errorNotification({ message: res.message || "Could not update wishlist" });
      }
      setTimeout(() => {
        dispatch(setResponse({}));
      }, 2000);
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  }

  async function handleBuyNow() {
    if (session.status === "unauthenticated") {
      dispatch(setUnAuthorize(true));
      return;
    }

    if (findProduct) {
      router.push("/checkout");
      return;
    }

    const itemData = {
      ...product,
      productId: id,
      productVariantId: defaultProduct?.id,
      qty,
    };

    setBuyNowLoading(true);
    try {
      const cartResponse = await saveCart(itemData);
      if (cartResponse?.success) {
        const getCartList = await getCartLists();
        dispatch(replaceCart(getCartList.data));
        router.push("/checkout");
      } else {
        errorNotification({
          message: cartResponse?.message || "Failed to prepare checkout",
        });
      }
    } catch (err: any) {
      errorNotification({
        message: err?.message || "Error proceeding to checkout",
      });
    } finally {
      setBuyNowLoading(false);
    }
  }

  const averageRating =
    reviews?.length > 0
      ? (Number(productRating?.totalReview || 0) / reviews.length).toFixed(1)
      : product?.avgRating
      ? Number(product.avgRating).toFixed(1)
      : "5.0";

  const totalReviewsDisplay = Number(reviewsCount || reviews?.length || 0);

  // Price calculations
  const effectiveFinalPrice = Number(finalPrice || unitPrice || 0);
  const effectiveOriginalPrice = Number(salePrice || unitPrice || effectiveFinalPrice);
  const calculatedSavings =
    effectiveOriginalPrice > effectiveFinalPrice
      ? effectiveOriginalPrice - effectiveFinalPrice
      : 0;

  const discountPercentDisplay =
    +discountValue > 0
      ? discountStrategy === "Percentage"
        ? `${discountValue}%`
        : formatPrice(discountValue)
      : calculatedSavings > 0 && effectiveOriginalPrice > 0
      ? `${Math.round((calculatedSavings / effectiveOriginalPrice) * 100)}%`
      : null;

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* LEFT: GALLERY SECTION */}
        <div className="col-span-1 lg:col-span-7 sticky top-28">
          <div className="relative group">
            <ProductImageGallery images={images} />

            {/* Floating Discount Pill */}
            {discountPercentDisplay && (
              <div className="absolute top-5 left-5 z-30 pointer-events-none">
                <div className="inline-flex items-center gap-1.5 bg-rose-600 text-white px-3.5 py-1.5 rounded-full font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30">
                  <FiZap className="w-3.5 h-3.5" />
                  <span>Save {discountPercentDisplay}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: EXECUTIVE PURCHASING MODULE */}
        <div className="col-span-1 lg:col-span-5 flex flex-col space-y-6">
          {/* Top Brand Pill & Smooth Review Anchor */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            {brand?.name ? (
              <Link
                href={`/brand/${brand.slug || brand.name.toLowerCase()}`}
                className="group inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-slate-950 transition-all"
              >
                <span>{brand.name}</span>
                <FiChevronRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : primaryCategory?.name ? (
              <Link
                href={`/products?categoryId=${primaryCategory.id}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
              >
                {primaryCategory.name}
              </Link>
            ) : (
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Premium Collection
              </span>
            )}

            {/* Review Score */}
            <a
              href="#reviews"
              className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-amber-600 transition-colors cursor-pointer"
            >
              <Rate
                disabled
                allowHalf
                value={+averageRating}
                className="text-amber-500 text-xs"
              />
              <span className="font-black text-slate-900">{averageRating}</span>
              <span className="text-slate-400 font-medium">
                ({totalReviewsDisplay} {totalReviewsDisplay === 1 ? "review" : "reviews"})
              </span>
            </a>
          </div>

          {/* Product Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-3">
              {name}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Live Inventory Status */}
              {checkStock > 5 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock ({checkStock} units available)
                </span>
              ) : checkStock > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  Low Stock — Only {checkStock} left
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  Currently Out of Stock
                </span>
              )}
              {slug && (
                <span className="text-xs text-slate-400 font-mono tracking-wider">
                  SKU: {slug.slice(0, 10).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Executive Pricing Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white shadow-xl shadow-slate-950/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  {formatPrice(effectiveFinalPrice)}
                </span>
                {effectiveOriginalPrice > effectiveFinalPrice && (
                  <span className="text-base sm:text-lg text-slate-400 line-through font-semibold">
                    {formatPrice(effectiveOriginalPrice)}
                  </span>
                )}
                {calculatedSavings > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider">
                    Save {formatPrice(calculatedSavings)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
                <FiCheck className="text-amber-400 w-3.5 h-3.5" />
                <span>All taxes included</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400 font-medium">Free express shipping eligible</span>
              </div>
            </div>
          </div>

          {/* Short Description */}
          {shortDescription && (
            <div
              className="text-slate-600 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: shortDescription }}
            />
          )}

          {/* Variants Selection */}
          {variant && productVariants && productVariants.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Select Specification / Variant
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 underline uppercase tracking-wider cursor-pointer"
                >
                  Size Guide
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {productVariants.map((item: any, idx: number) => {
                  const isSelected = defaultProduct?.id === item.id;
                  const isSoldOut = item.stockQty <= 0;
                  const variantLabel =
                    item?.size?.name ||
                    item?.color?.name ||
                    item?.name ||
                    `Option ${idx + 1}`;

                  return (
                    <button
                      key={item.id || idx}
                      disabled={isSoldOut}
                      onClick={() => {
                        setSelectVariant({ productVariantId: item.id });
                        dispatch(
                          setProduct({
                            ...product,
                            defaultProduct: item,
                          })
                        );
                        setCheckStock(item.stockQty);
                      }}
                      className={`relative p-3 rounded-2xl border-2 transition-all duration-200 text-left overflow-hidden cursor-pointer ${
                        isSelected
                          ? "border-slate-900 bg-amber-50/40 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      } ${isSoldOut ? "opacity-40 grayscale cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        {item?.color?.color && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                            style={{ backgroundColor: item.color.color }}
                          />
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-black text-slate-900 truncate">
                            {variantLabel}
                          </div>
                          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            {isSoldOut ? "Sold Out" : `${item.stockQty} in stock`}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-0 right-0 p-1 bg-slate-900 text-white rounded-bl-lg">
                          <FiCheck className="text-[10px]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Dual High-Impact Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center justify-between p-1 bg-slate-100 rounded-2xl w-full sm:w-36 border border-slate-200">
                <button
                  onClick={() => setQty((pre) => Math.max(1, pre - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-xs text-slate-800 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30 cursor-pointer"
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <HiOutlineMinus size={14} />
                </button>
                <span className="font-black text-base text-slate-900 w-8 text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((pre) => pre + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-xs text-slate-800 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30 cursor-pointer"
                  disabled={qty >= checkStock}
                  aria-label="Increase quantity"
                >
                  <AiOutlinePlus size={14} />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <div className="flex-1">
                <AddToCartButton
                  className="h-12 sm:h-12 rounded-2xl text-xs font-black uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white border-none shadow-md shadow-slate-900/15"
                  item={{
                    ...product,
                    productVariantId: defaultProduct?.id,
                    qty,
                  }}
                />
              </div>

              {/* High Conversion "Buy Now" CTA */}
              <div className="flex-1">
                <button
                  onClick={handleBuyNow}
                  disabled={buyNowLoading || checkStock <= 0}
                  className="w-full h-12 rounded-2xl text-xs font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 border-none shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiZap className="w-4 h-4" />
                  <span>{buyNowLoading ? "Preparing..." : "Buy Now"}</span>
                </button>
              </div>
            </div>

            {/* Wishlist & Share Bar */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <button
                onClick={handleWishlist}
                className="inline-flex items-center gap-2 group text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                    isWishlisted
                      ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm"
                      : "bg-white border-slate-200 text-slate-400 group-hover:border-rose-200 group-hover:text-rose-600 group-hover:bg-rose-50"
                  }`}
                >
                  <FiHeart
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isWishlisted ? "fill-current" : ""
                    }`}
                  />
                </div>
                <span>{isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Share
                  value={{
                    url: `${appConfig.publicUrl}/products/${slug}`,
                    name: name,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Assurance & Value Guarantees Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center justify-center shrink-0">
                <FiTruck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 leading-snug">
                  Express Delivery
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Ships in 24–48 hours with live tracking
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 flex items-center justify-center shrink-0">
                <FiShield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 leading-snug">
                  100% Authentic
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Direct from certified distributors
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center shrink-0">
                <FiRotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 leading-snug">
                  30-Day Easy Returns
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Prepaid return labels & instant refund
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80">
              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center shrink-0">
                <FiLock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 leading-snug">
                  Secure Checkout
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Bank-grade 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Size Guide Modal */}
      <Modal
        open={isSizeGuideOpen}
        onCancel={() => setIsSizeGuideOpen(false)}
        footer={null}
        width={620}
        title={
          <div className="text-base font-black text-slate-900 tracking-tight">
            Universal Size & Measurement Guide
          </div>
        }
      >
        <div className="py-4 space-y-4">
          <p className="text-xs text-slate-500">
            Measurements are given in inches. For the most comfortable fit, measure around the fullest part of your body.
          </p>
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-900 uppercase font-black tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Chest (in)</th>
                  <th className="px-4 py-3">Length (in)</th>
                  <th className="px-4 py-3">Sleeve (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-bold text-slate-900">S (Small)</td>
                  <td className="px-4 py-2.5">36 - 38</td>
                  <td className="px-4 py-2.5">27</td>
                  <td className="px-4 py-2.5">33</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-bold text-slate-900">M (Medium)</td>
                  <td className="px-4 py-2.5">39 - 41</td>
                  <td className="px-4 py-2.5">28</td>
                  <td className="px-4 py-2.5">34</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-bold text-slate-900">L (Large)</td>
                  <td className="px-4 py-2.5">42 - 44</td>
                  <td className="px-4 py-2.5">29</td>
                  <td className="px-4 py-2.5">35</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-bold text-slate-900">XL</td>
                  <td className="px-4 py-2.5">45 - 47</td>
                  <td className="px-4 py-2.5">30</td>
                  <td className="px-4 py-2.5">36</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-bold text-slate-900">XXL</td>
                  <td className="px-4 py-2.5">48 - 50</td>
                  <td className="px-4 py-2.5">31</td>
                  <td className="px-4 py-2.5">37</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 font-medium">
            💡 <strong>Styling Tip:</strong> If you are in between sizes, we recommend sizing up for a relaxed fit.
          </div>
        </div>
      </Modal>

      {/* Floating Sticky Purchase Bar (Mobile & Desktop) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 shadow-2xl transition-all duration-300 ${
          showStickyBar
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              <Image
                src={getImageUrl(defaultProduct?.thumbnailImage || product?.thumbnailImage)}
                alt={name || "Product"}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate leading-tight">
                {name}
              </h4>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  {formatPrice(effectiveFinalPrice)}
                </span>
                {effectiveOriginalPrice > effectiveFinalPrice && (
                  <span className="text-[11px] text-slate-400 line-through">
                    {formatPrice(effectiveOriginalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleBuyNow}
              disabled={buyNowLoading || checkStock <= 0}
              className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FiZap className="w-3.5 h-3.5" />
              <span>{findProduct ? "Checkout" : "Buy Now"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
