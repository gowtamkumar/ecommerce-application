"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { deleteCart, getCartLists } from "@/lib/apis/cart";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { replaceCart, selectCart } from "@/redux/features/cart/cartSlice";
import { selectGlobal, setDrawarCart } from "@/redux/features/global/globalSlice";
import { Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export default function ViewCart() {
  const cart = useSelector(selectCart);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const router = useRouter();
  const { formatPrice } = useCurrency();

  const handleRemove = async (item: any) => {
    const cartId = item.id;
    const removeDartData = await deleteCart(cartId);
    if (removeDartData.success) {
      const getCartList = await getCartLists();
      dispatch(replaceCart(getCartList.data || []));
    }
  };

  const cartList = cart?.carts?.cartList || [];
  const subTotal = cart?.carts?.cartSummary?.subTotal || 0;

  // Get free shipping threshold from settings (fallback to 5000 if not set)
  const freeShippingThreshold = global.setting?.orderFreeShippingAmount || 5000;
  const progress = Math.min((subTotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - subTotal;

  if (cartList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6 animate-in fade-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-global-primary/10 rounded-full blur-xl opacity-50"></div>
          <div className="w-28 h-28 bg-white/80 backdrop-blur-sm rounded-full border border-white/50 shadow-xl flex items-center justify-center relative z-10">
            <FiShoppingBag className="h-10 w-10 text-global-primary/40" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Your bag is empty</h3>
          <p className="text-gray-500 text-sm mt-2 max-w-[200px] mx-auto leading-relaxed">
            Looks like you haven't added anything to your bag yet.
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          className="h-10 px-8 rounded-full font-medium"
          onClick={() => router.push("/shop")} // Assuming /shop exists, or keep empty if handled by drawer close logic
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    // <ConfigProvider
    //   theme={{
    //     token: {
    //       colorPrimary: '#000000',
    //     },
    //   }}
    // >
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Free Shipping Bar */}
      <div className="px-6 py-4 bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center text-xs font-medium mb-2">
          <span className="text-gray-900">

            {progress === 100 ? "You've unlocked free shipping!" : `Spend ${formatPrice(remainingForFreeShipping)} more for free shipping`}
          </span>
          <span className="text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-global-primary h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {cartList.map((item: any, index: number) => (
          <div
            key={item.id}
            className="group relative flex gap-4 p-3 bg-white border border-transparent hover:border-gray-200 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-gray-100/50"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Product Image */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={getUploadImageUrl(item.thumbnailImage)}
                alt={item.name}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="96px"
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between py-1">
              <div className="flex justify-between items-start gap-3">
                <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
                  <a href={`/product/${item.slug || '#'}`} className="hover:text-gray-600 transition-colors">
                    {item.name}
                  </a>
                </h3>
                <button
                  onClick={() => handleRemove(item)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2 rounded-full hover:bg-red-50"
                  aria-label="Remove item"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

              <div className="flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600">
                    Qty: {item.qty}
                  </span>
                  {/* Unit price could go here if needed */}
                </div>
                <p className="text-base font-semibold text-gray-900 tracking-tight">
                  {formatPrice(item.subTotal)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 space-y-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] z-20">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-500">Subtotal</p>
            <p className="font-semibold text-gray-900">
              {formatPrice(subTotal)}
            </p>
          </div>
          {/* Can add styling/discount breakdown here */}
        </div>

        <Button
          size="large"
          type="primary"
          className="w-full h-14 rounded-2xl text-base font-medium flex items-center justify-center gap-2 group"
          onClick={() => {
            dispatch(setDrawarCart(false))
            router.push("/checkout")
          }
          }
        >
          <span>Proceed to Checkout</span>
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Button>
        {/* 
          <p className="text-[10px] mt-2 text-gray-400 text-center font-medium uppercase tracking-wider">
            Secure Checkout
          </p> */}
      </div>
    </div>
    // </ConfigProvider>
  );
}
