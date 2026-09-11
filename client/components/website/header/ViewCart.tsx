"use client";
import { useCurrency } from "@/context/CurrencyContext";
import {
    deleteCart,
    getCartLists,
    incrementDecrementCart,
} from "@/lib/apis/cart";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { errorNotification } from "@/lib/utils/notification";
import {
    decrementCart,
    incrementCart,
    replaceCart,
    selectCart,
} from "@/redux/features/cart/cartSlice";
import {
    selectGlobal,
    setDrawarCart,
} from "@/redux/features/global/globalSlice";
import {
    ArrowRightOutlined,
    DeleteOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { HiOutlineMinus } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

export default function ViewCart() {
  const cart = useSelector(selectCart);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const debouncedSyncRef = useRef<any>(null);

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    debouncedSyncRef.current = debounce(async (item: any) => {
      const res = await incrementDecrementCart(item);
      if (!res?.success) {
        errorNotification({ message: res?.message || "Failed to update quantity" });
      }
      const getCartList = await getCartLists();
      if (getCartList?.success) {
        dispatch(replaceCart(getCartList.data || []));
      }
    }, 400);
  }, [dispatch]);

  const handleRemove = async (item: any) => {
    const cartId = item.id;
    const removeDartData = await deleteCart(cartId);
    if (removeDartData.success) {
      const getCartList = await getCartLists();
      dispatch(replaceCart(getCartList.data || []));
    }
  };

  const handleIncrementDecrement = (item: any, type: "Increment" | "Decrement") => {
    if (type === "Decrement" && item.qty <= 1) {
      handleRemove(item);
      return;
    }
    const updatedPayload = { ...item, type };
    if (type === "Decrement") {
      dispatch(decrementCart(updatedPayload));
    } else {
      dispatch(incrementCart(updatedPayload));
    }
    if (debouncedSyncRef.current) {
      debouncedSyncRef.current(updatedPayload);
    }
  };

  const cartList = cart?.carts?.cartList || [];
  const subTotal = cart?.carts?.cartSummary?.subTotal || 0;

  const freeShippingThreshold = global.setting?.orderFreeShippingAmount || 5000;
  const progress = Math.min((subTotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subTotal);

  if (cartList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-gradient-to-tr from-gray-100 to-gray-50 rounded-full flex items-center justify-center border border-gray-200/80 shadow-inner">
          <ShoppingCartOutlined className="text-4xl text-gray-300" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-gray-900">Your Cart is Empty</h3>
          <p className="text-xs text-gray-500 max-w-[220px] mx-auto leading-relaxed">
            Looks like you haven't added anything to your cart yet.
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          className="h-11 px-8 rounded-xl font-bold text-xs uppercase tracking-wider !bg-gray-900 hover:!bg-black !border-none shadow-md shadow-gray-200"
          onClick={() => {
            dispatch(setDrawarCart(false));
            router.push("/products");
          }}
        >
          Start Exploring
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Free Shipping Gamification Bar */}
      <div
        className={`px-6 py-4 border-b transition-colors duration-500 ${
          progress === 100
            ? "bg-emerald-50/80 border-emerald-100"
            : "bg-gray-50/70 border-gray-100"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5">
            {progress === 100 ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>🎉 Free Shipping Unlocked!</span>
              </span>
            ) : (
              <span className="text-xs font-medium text-gray-600">
                Add <strong className="text-gray-900 font-bold">{formatPrice(remainingForFreeShipping)}</strong> more for <strong>Free Shipping</strong>
              </span>
            )}
          </div>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              progress === 100
                ? "bg-emerald-100 text-emerald-800"
                : "bg-gray-200/80 text-gray-700"
            }`}
          >
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200/70 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              progress === 100
                ? "bg-gradient-to-r from-emerald-500 to-green-400"
                : "bg-gradient-to-r from-global-primary to-amber-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-grow overflow-y-auto px-5 py-4 space-y-3">
        {cartList.map((item: any, index: number) => (
          <div
            key={item.id}
            className="group relative flex gap-3.5 p-3.5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Thumbnail */}
            <div className="relative h-20 w-18 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
              <Image
                src={getUploadImageUrl(item.thumbnailImage)}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="80px"
              />
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-between min-w-0">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2">
                    {item.name}
                  </h3>
                  <button
                    onClick={() => handleRemove(item)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1 -mt-1 -mr-1"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <DeleteOutlined className="text-sm" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {item?.size?.name && (
                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      Size: {item.size.name}
                    </span>
                  )}
                  {item?.color?.name && (
                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      Color: {item.color.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper & Price */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100/80">
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50/80 p-0.5 shadow-sm">
                  <button
                    onClick={() => handleIncrementDecrement(item, "Decrement")}
                    className="w-6 h-6 rounded flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <HiOutlineMinus className="w-2.5 h-2.5" />
                  </button>
                  <span className="w-7 text-center text-xs font-bold text-gray-900 select-none">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => handleIncrementDecrement(item, "Increment")}
                    className="w-6 h-6 rounded flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <AiOutlinePlus className="w-2.5 h-2.5" />
                  </button>
                </div>
                <div className="text-sm font-black text-gray-900 tracking-tight">
                  {formatPrice(item.subTotal)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer Footer */}
      <div className="p-6 bg-gray-50/90 border-t border-gray-100 space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Subtotal ({cartList.length} {cartList.length === 1 ? "item" : "items"})
            </span>
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              {formatPrice(subTotal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>Taxes & shipping calculated at checkout</span>
            {progress === 100 && (
              <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-wider">
                Free Shipping
              </span>
            )}
          </div>
        </div>

        <Button
          size="large"
          type="primary"
          className="w-full h-13 rounded-xl text-xs font-bold uppercase tracking-wider !bg-gray-900 hover:!bg-black border-none shadow-lg shadow-gray-300/40 flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.01]"
          onClick={() => {
            dispatch(setDrawarCart(false));
            router.push("/checkout");
          }}
        >
          <span>Begin Checkout</span>
          <ArrowRightOutlined className="text-xs" />
        </Button>
      </div>
    </div>
  );
}
