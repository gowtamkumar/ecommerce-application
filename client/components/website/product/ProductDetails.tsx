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
import { CheckOutlined, ShoppingCartOutlined, HeartFilled } from "@ant-design/icons";
import { Button, Rate, Tag, Divider } from "antd";
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      {/* LEFT: GALLERY SECTION */}
      <div className="col-span-1 lg:col-span-7 sticky top-28">
        <div className="relative group">
           <ProductImageGallery images={images} />
           
           {/* Floating Discount Tag */}
           {+discountValue > 0 && (
             <div className="absolute top-6 left-6 z-30">
               <div className="bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm shadow-xl shadow-red-500/30 animate-bounce">
                  -{discountValue}{discountStrategy === "Percentage" ? "%" : selectedCurrency?.symbol} OFF
               </div>
             </div>
           )}
        </div>
      </div>

      {/* RIGHT: CONTENT SECTION */}
      <div className="col-span-1 lg:col-span-5 flex flex-col space-y-8 py-2">
        
        {/* Brand & Stats Header */}
        <div className="flex items-center justify-between">
           {brand?.name ? (
             <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                {brand.name}
             </div>
           ) : (
             <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                <ShoppingCartOutlined className="text-gray-400" />
             </div>
           )}
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                 <Rate disabled allowHalf value={+averageRating} className="text-amber-400 text-xs" />
                 <span className="text-xs font-black text-gray-900">{averageRating}</span>
              </div>
              <Divider type="vertical" className="bg-gray-200 h-4" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{+reviewsCount || 0} REVIEWS</span>
           </div>
        </div>

        {/* Title Section */}
        <div>
           <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight mb-4">
              {name}
           </h1>
           <div className="flex items-center gap-4">
              {checkStock > 0 ? (
                <Tag color="success" className="rounded-full px-3 py-0.5 border-none font-bold uppercase text-[9px] tracking-widest bg-green-50 text-green-600">IN STOCK</Tag>
              ) : (
                <Tag color="error" className="rounded-full px-3 py-0.5 border-none font-bold uppercase text-[9px] tracking-widest bg-red-50 text-red-600">OUT OF STOCK</Tag>
              )}
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">SKU: {slug?.slice(0, 8).toUpperCase()}</span>
           </div>
        </div>

        {/* Price & Savings */}
        <div className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <div className="relative z-10">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Best Offer Price</div>
              <div className="flex items-end gap-4">
                 <span className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter">
                    {formatPrice(product.finalPrice)}
                 </span>
                 {+discountValue > 0 && (
                    <div className="flex flex-col mb-1.5">
                       <span className="text-lg text-gray-300 line-through font-bold">
                          {formatPrice(salePrice)}
                       </span>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Short Description */}
        <div 
          className="text-gray-500 text-sm sm:text-base leading-relaxed line-clamp-3"
          dangerouslySetInnerHTML={{ __html: shortDescription }}
        />

        {/* Variants - High End Chips */}
        {variant && (
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-xs font-black uppercase tracking-widest text-gray-900">Select Options</span>
                 <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest cursor-pointer hover:underline">Size Guide</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                 {(productVariants || []).map((item: any, idx: number) => {
                    const isSelected = defaultProduct?.id === item.id;
                    return (
                       <button
                         key={idx}
                         disabled={item.stockQty <= 0}
                         onClick={async () => {
                           setSelectVariant({ productVariantId: item.id });
                           dispatch(setProduct({ ...product, defaultProduct: item }));
                           setCheckStock(item.stockQty);
                         }}
                         className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${
                           isSelected 
                             ? "border-gray-900 bg-white shadow-xl shadow-gray-200" 
                             : "border-gray-100 bg-gray-50/50 hover:border-gray-300"
                         } ${item.stockQty <= 0 ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
                       >
                          <div className="flex items-center gap-3">
                             {item?.color?.value && (
                                <div className="w-4 h-4 rounded-full border border-gray-200 shadow-inner" style={{ backgroundColor: item.color.value }} />
                             )}
                             <div>
                                <div className={`text-xs font-black ${isSelected ? "text-gray-900" : "text-gray-500"}`}>{item?.size?.name}</div>
                                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{item?.color?.name}</div>
                             </div>
                          </div>
                          {isSelected && (
                             <div className="absolute top-0 right-0 p-1.5 bg-gray-900 text-white rounded-bl-xl">
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
        <div className="space-y-6 pt-6 border-t border-gray-100">
           <div className="flex flex-col sm:flex-row gap-4">
              {/* Modern Quantity Selector */}
              <div className="flex items-center justify-between p-1 bg-gray-100 rounded-2xl w-full sm:w-44 border border-gray-200">
                 <button
                   onClick={() => setQty((pre) => Math.max(1, pre - 1))}
                   className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-900 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-30"
                   disabled={qty <= 1}
                 >
                   <HiOutlineMinus size={14} />
                 </button>
                 <span className="font-black text-lg text-gray-900 w-8 text-center">{qty}</span>
                 <button
                   onClick={() => setQty((pre) => pre + 1)}
                   className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-900 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-30"
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
                     className="w-full h-12 sm:h-14 rounded-2xl text-sm font-black tracking-widest !bg-gray-900 border-none shadow-xl shadow-gray-200"
                   >
                     CHECKOUT NOW
                   </Button>
                 ) : (
                   <AddToCartButton
                     className="!h-12 sm:!h-14 !rounded-2xl !text-sm !font-black !tracking-widest shadow-xl shadow-blue-200"
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
           <div className="flex items-center justify-between gap-4">
              <button
                className="flex items-center gap-3 group transition-all"
                onClick={() => {
                  if (session.status === "unauthenticated") {
                    dispatch(setUnAuthorize(true));
                  } else {
                    AddToWishlist(id);
                  }
                }}
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:border-red-100 group-hover:bg-red-50/50 transition-all">
                  <CiHeart
                    size={24}
                    className="group-hover:scale-125 group-hover:text-red-500 text-gray-400 transition-all"
                  />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors">Wishlist</span>
              </button>

              <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Share Product</span>
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
        <div className="grid grid-cols-3 gap-4 py-8 border-y border-gray-50">
           <div className="text-center space-y-2">
              <div className="w-10 h-10 mx-auto bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                 <CheckOutlined />
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-900">Genuine Product</div>
           </div>
           <div className="text-center space-y-2">
              <div className="w-10 h-10 mx-auto bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                 <ShoppingCartOutlined />
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-900">Fast Delivery</div>
           </div>
           <div className="text-center space-y-2">
              <div className="w-10 h-10 mx-auto bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                 <CiHeart />
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-900">7 Days Return</div>
           </div>
        </div>

        <ModalLogin />
      </div>
    </div>
  );
};

export default ProductDetails;
