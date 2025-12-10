"use client";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/features/global/globalSlice";
import { useEffect } from "react";
import { getShippingCharges } from "@/lib/apis/shipping-charge";
import dynamic from "next/dynamic";
import {
  setCheckoutFormData,
  setShippingAddress,
  setShippingCharge,
} from "@/redux/features/checkout/checkoutSlice";
import ApplyCoupon from "./ApplyCoupon";
import { getUserShippingAddresses } from "@/lib/apis/shipping-address";

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

      if (activeShippingAddress?.divisionId) {
        const getShippingCharge = await getShippingCharges({
          divisionId: activeShippingAddress.divisionId,
        });

        dispatch(
          setShippingCharge(
            getShippingCharge.data?.length ? getShippingCharge.data[0] : {}
          )
        );
      }

      dispatch(setShippingAddress(shippingAddress.data));
      dispatch(
        setCheckoutFormData({
          paymentMethod: "Cash",
          shippingAddressId: activeShippingAddress?.id, //need to logic implements
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
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Order Details */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Shipping Information</h2>
              </div>
              <div className="p-6">
                 <CheckoutShippingAddress />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
              </div>
              <div className="p-6">
                <PaymentMethod />
              </div>
            </div>

             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Order Items</h2>
              </div>
              <div className="p-0">
                <OrderSummary />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                <CheckoutSummary />
                <div className="mt-6 pt-6 border-t border-gray-100">
                   <ApplyCoupon />
                </div>
              </div>
              
              <div className="text-center">
                <Link 
                  href="/products" 
                  className="inline-flex items-center text-gray-500 hover:text-gray-800 transition-colors font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
