"use client";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/features/global/globalSlice";
import { useEffect } from "react";
import { getShippingCharges } from "@/lib/apis/shipping-charge";
import { getCartLists } from "@/lib/apis/cart";
import { replaceCart } from "@/redux/features/cart/cartSlice";
import dynamic from "next/dynamic";
import {
  setCheckoutFormData,
  setShippingAddress,
  setShippingCharge,
} from "@/redux/features/checkout/checkoutSlice";
import ApplyCoupon from "./ApplyCoupon";
import { getUserShippingAddresses } from "@/lib/apis/shipping-address";
import { ShoppingOutlined, ArrowLeftOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

const CheckoutSummary = dynamic(() => import("./CheckoutSummary"), {
  ssr: false,
});
const OrderSummary = dynamic(() => import("./OrderSummary"), { ssr: false });
const PaymentMethod = dynamic(() => import("./PaymentMethod"), { ssr: false });
const CheckoutShippingAddress = dynamic(
  () => import("./CheckoutShippingAddress"),
  { ssr: false }
);

export default function CheckoutPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      const shippingAddress = await getUserShippingAddresses();

      const activeShippingAddress = shippingAddress.data?.find(
        (item: { status: boolean }) => item.status
      );

      if (activeShippingAddress?.districtId) {
        const getShippingCharge = await getShippingCharges({
          districtId: activeShippingAddress.districtId,
        });

        dispatch(
          setShippingCharge(
            getShippingCharge.data?.length ? getShippingCharge.data[0] : {}
          )
        );

        const cartData = await getCartLists({ districtId: activeShippingAddress.districtId });
        if (cartData.success) {
           dispatch(replaceCart(cartData.data));
        }
      }

      dispatch(setShippingAddress(shippingAddress.data));
      dispatch(
        setCheckoutFormData({
          paymentMethod: "Cash",
          shippingAddressId: activeShippingAddress?.id,
        })
      );
    }
    fetchData();
    return () => {
      dispatch(setLoading({ save: false }));
      dispatch(setShippingCharge({}));
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Checkout Header */}
      <div className="bg-gray-900 py-10 sm:py-16 mb-8 sm:mb-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-10 -mr-32 -mt-32"></div>
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 flex items-center justify-center gap-4">
               Secure Checkout
            </h1>
            <div className="flex items-center justify-center gap-6 text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500">
               <div className="flex items-center gap-2 text-blue-400">
                  <span className="w-6 h-6 rounded-full border border-blue-400 flex items-center justify-center">1</span>
                  <span>Review</span>
               </div>
               <div className="w-12 h-[1px] bg-gray-800"></div>
               <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full border border-gray-800 flex items-center justify-center">2</span>
                  <span>Payment</span>
               </div>
               <div className="w-12 h-[1px] bg-gray-800"></div>
               <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full border border-gray-800 flex items-center justify-center">3</span>
                  <span>Done</span>
               </div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* LEFT: PROGRESSIVE STEPS */}
          <div className="flex-1 space-y-10">
            
            {/* Step 1: Shipping */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black">01</div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">Shipping Destination</h2>
               </div>
               <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100">
                  <CheckoutShippingAddress />
               </div>
            </section>

            {/* Step 2: Items Review */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black">02</div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">Review Order</h2>
               </div>
               <div className="rounded-[2rem] bg-white border border-gray-100 overflow-hidden shadow-sm">
                  <OrderSummary />
               </div>
            </section>

            {/* Step 3: Payment */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black">03</div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">Payment Strategy</h2>
               </div>
               <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100">
                  <PaymentMethod />
               </div>
            </section>

            <div className="pt-10 flex items-center justify-between border-t border-gray-100">
               <Link href="/products" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
                  <ArrowLeftOutlined />
                  <span>Return to Gallery</span>
               </Link>
               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <SafetyCertificateOutlined className="text-blue-500" />
                  <span>256-Bit SSL Encrypted</span>
               </div>
            </div>
          </div>

          {/* RIGHT: FLOATING SUMMARY */}
          <aside className="lg:w-[420px] shrink-0">
            <div className="sticky top-28 space-y-6">
               <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border-2 border-gray-900 shadow-2xl shadow-gray-200 relative overflow-hidden">
                  {/* Decorative Background Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-900/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  
                  <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tighter">Order Summary</h2>
                  
                  <div className="space-y-6">
                     <CheckoutSummary />
                     
                     <div className="pt-8 border-t border-gray-100">
                        <ApplyCoupon />
                     </div>
                  </div>
               </div>

               {/* Trust Badges */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                     <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Guaranteed</div>
                     <div className="text-xs font-bold text-gray-900 italic">Safe Delivery</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                     <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Authentic</div>
                     <div className="text-xs font-bold text-gray-900 italic">Genuine Items</div>
                  </div>
               </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
