"use client";
import appConfig from "@/appConfig";
import AddToCartButton from "@/components/share-component/AddToCartButton";
import { useCurrency } from "@/context/CurrencyContext";
import { saveWishlist } from "@/lib/apis/wishlist";
import { getImageUrl } from "@/lib/utils/imageUrl";
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
import { CheckOutlined, SafetyCertificateOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Divider, Rate } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
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
  const [showStickyBar, setShowStickyBar] = useState(false);
  const dispatch = useDispatch();
  const session = useSession();
  const route = useRouter();

  const products = useSelector(selectProduct);
  const cart = useSelector(selectCart);

  const { product } = products;
  const { formatPrice, selectedCurrency } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      // Reveal sticky mobile action bar when scrolled past 320px
      if (window.scrollY > 320) {
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
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* LEFT: GALLERY SECTION */}
        <div className="col-span-1 lg:col-span-7 sticky top-28">
          <div className="relative group">
            <ProductImageGallery images={images} />
            
            {/* Floating Discount Tag */}
            {+discountValue > 0 && (
              <div className="absolute top-6 left-6 z-30">
                <div className="bg-rose-600 text-white px-3.5 py-1.5 rounded-full font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30">
                  -{discountValue}{discountStrategy === "Percentage" ? "%" : selectedCurrency?.symbol} OFF
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: CONTENT SECTION */}
        <div className="col-span-1 lg:col-span-5 flex flex-col space-y-7 py-2">
          
          {/* Brand & Stats Header */}
          <div className="flex items-center justify-between">
            {brand?.name ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                {brand.name}
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                <ShoppingCartOutlined className="text-gray-400" />
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Rate disabled allowHalf value={+averageRating} className="text-amber-400 text-xs" />
                <span className="text-xs font-black text-gray-900">{averageRating}</span>
              </div>
              <Divider type="vertical" className="bg-gray-200 h-3.5" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{+reviewsCount || 0} REVIEWS</span>
            </div>
          </div>

          {/* Title Section */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight tracking-tight mb-3">
              {name}
            </h1>
            <div className="flex items-center gap-3">
              {checkStock > 5 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  In Stock
                </span>
              ) : checkStock > 0 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/60">
                  Only {checkStock} Left
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/60">
                  Out of Stock
                </span>
              )}
              <span className="text-[11px] text-gray-400 font-semibold tracking-wide">
                SKU: {slug?.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Price & Savings */}
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="relative z-10">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Special Price</div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                  {formatPrice(product.finalPrice)}
                </span>
                {+discountValue > 0 && (
                  <span className="text-base text-gray-400 line-through font-semibold">
                    {formatPrice(salePrice)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Short Description */}
          {shortDescription && (
            <div 
              className="text-gray-600 text-sm leading-relaxed line-clamp-3"
              dangerouslySetInnerHTML={{ __html: shortDescription }}
            />
          )}

          {/* Variants - High End Chips */}
          {variant && (
            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-gray-900">Select Variant</span>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider cursor-pointer hover:underline">Size Guide</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(productVariants || []).map((item: any, idx: number) => {
                  const isSelected = defaultProduct?.id === item.id;
                  const isSoldOut = item.stockQty <= 0;
                  return (
                    <button
                      key={idx}
                      disabled={isSoldOut}
                      onClick={async () => {
                        setSelectVariant({ productVariantId: item.id });
                        dispatch(setProduct({ ...product, defaultProduct: item }));
                        setCheckStock(item.stockQty);
                      }}
                      className={`relative p-3.5 rounded-2xl border-2 transition-all duration-200 text-left overflow-hidden ${
                        isSelected 
                          ? "border-gray-900 bg-white shadow-md shadow-gray-200" 
                          : "border-gray-100 bg-gray-50/70 hover:border-gray-300"
                      } ${isSoldOut ? "opacity-40 grayscale cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item?.color?.value && (
                          <div className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-inner shrink-0" style={{ backgroundColor: item.color.value }} />
                        )}
                        <div className="min-w-0">
                          <div className={`text-xs font-black truncate ${isSelected ? "text-gray-900" : "text-gray-600"}`}>
                            {item?.size?.name}
                          </div>
                          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider truncate">
                            {isSoldOut ? "Sold Out" : item?.color?.name || "Standard"}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-0 right-0 p-1 bg-gray-900 text-white rounded-bl-lg">
                          <CheckOutlined className="text-[8px]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add to Cart Footer */}
          <div className="space-y-5 pt-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Modern Quantity Selector */}
              <div className="flex items-center justify-between p-1 bg-gray-100 rounded-2xl w-full sm:w-40 border border-gray-200/80">
                <button
                  onClick={() => setQty((pre) => Math.max(1, pre - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-xs text-gray-900 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-30"
                  disabled={qty <= 1}
                >
                  <HiOutlineMinus size={14} />
                </button>
                <span className="font-black text-base text-gray-900 w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty((pre) => pre + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-xs text-gray-900 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-30"
                  disabled={qty >= checkStock}
                >
                  <AiOutlinePlus size={14} />
                </button>
              </div>

              {/* Main Action Button */}
              <div className="flex-1">
                {findProduct ? (
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => route.push("/checkout")}
                    className="w-full h-12 sm:h-14 rounded-2xl text-xs font-black uppercase tracking-widest !bg-global-button-primary hover:!bg-global-button-hover !text-global-button-text border-none shadow-xl shadow-global-button-primary/20"
                  >
                    Proceed to Checkout
                  </Button>
                ) : (
                  <AddToCartButton
                    className="!h-12 sm:!h-14 !rounded-2xl !text-xs !font-semibold !tracking-wide shadow-xl shadow-global-button-primary/20"
                    item={{
                      ...product,
                      productVariantId: defaultProduct?.id,
                      qty,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Wishlist & Share */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                className="flex items-center gap-2.5 group transition-all"
                onClick={() => {
                  if (session.status === "unauthenticated") {
                    dispatch(setUnAuthorize(true));
                  } else {
                    AddToWishlist(id);
                  }
                }}
              >
                <div className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-xs group-hover:border-rose-100 group-hover:bg-rose-50/50 transition-all">
                  <CiHeart
                    size={22}
                    className="group-hover:scale-125 group-hover:text-rose-500 text-gray-400 transition-all"
                  />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-900 transition-colors">
                  Save to Wishlist
                </span>
              </button>

              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Share</span>
                <Share
                  value={{
                    url: `${appConfig.publicUrl}/products/${slug}`,
                    name: name,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Benefits Badges */}
          <div className="grid grid-cols-3 gap-3 py-6 border-y border-gray-100">
            <div className="text-center space-y-1.5">
              <div className="w-9 h-9 mx-auto bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                <SafetyCertificateOutlined className="text-sm" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-wider text-gray-800">100% Genuine</div>
            </div>
            <div className="text-center space-y-1.5">
              <div className="w-9 h-9 mx-auto bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                <ShoppingCartOutlined className="text-sm" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-wider text-gray-800">Express Delivery</div>
            </div>
            <div className="text-center space-y-1.5">
              <div className="w-9 h-9 mx-auto bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                <CheckOutlined className="text-sm" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-wider text-gray-800">7 Days Return</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Action Bar (appears when scrolled past buy button on mobile) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 p-3 shadow-2xl transition-all duration-300 lg:hidden ${
          showStickyBar ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
              <Image
                src={getImageUrl(defaultProduct?.thumbnailImage || product.thumbnailImage)}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-gray-900 truncate leading-tight">
                {name}
              </h4>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-sm font-black text-gray-900 tracking-tight">
                  {formatPrice(product.finalPrice)}
                </span>
                {+discountValue > 0 && (
                  <span className="text-[10px] text-gray-400 line-through">
                    {formatPrice(salePrice)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 w-36">
            {findProduct ? (
              <Button
                type="primary"
                onClick={() => route.push("/checkout")}
                className="w-full !h-11 !rounded-xl !text-xs !font-semibold !tracking-wide !bg-global-button-primary hover:!bg-global-button-hover !text-global-button-text border-none shadow-md shadow-global-button-primary/20"
              >
                Checkout
              </Button>
            ) : (
              <AddToCartButton
                className="!h-11 !rounded-xl !text-xs !font-semibold !tracking-wide shadow-md shadow-global-button-primary/20"
                item={{
                  ...product,
                  productVariantId: defaultProduct?.id,
                  qty,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
