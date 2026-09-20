"use client";
import Breadcrumb from "@/components/share-component/Breadcrumb";
import { useCurrency } from "@/context/CurrencyContext";
import { getCartLists } from "@/lib/apis/cart";
import { getUserShippingAddresses } from "@/lib/apis/shipping-address";
import { getShippingCharges } from "@/lib/apis/shipping-charge";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { errorNotification } from "@/lib/utils/notification";
import { replaceCart, selectCart } from "@/redux/features/cart/cartSlice";
import {
    selectCheckout,
    setCheckoutFormData,
    setShippingAddress,
    setShippingCharge,
} from "@/redux/features/checkout/checkoutSlice";
import { setLoading } from "@/redux/features/global/globalSlice";
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    CheckCircleFilled,
    CheckOutlined,
    EditOutlined,
    EnvironmentOutlined,
    LockOutlined,
    SafetyCertificateOutlined
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApplyCoupon from "./ApplyCoupon";

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
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const dispatch = useDispatch();
  const checkout = useSelector(selectCheckout);
  const cart = useSelector(selectCart);
  const { formatPrice } = useCurrency();

  const { shippingAddress, checkoutFormData } = checkout || {};
  const cartList = cart?.carts?.cartList || [];
  const cartSummary = cart?.carts?.cartSummary || {};

  const selectedAddress = shippingAddress?.find(
    (item: any) => item.id === checkoutFormData?.shippingAddressId
  );

  useEffect(() => {
    async function fetchData() {
      const addressRes = await getUserShippingAddresses();

      const activeShippingAddress = addressRes.data?.find(
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

        const cartData = await getCartLists({
          districtId: activeShippingAddress.districtId,
        });
        if (cartData.success) {
          dispatch(replaceCart(cartData.data));
        }
      }

      dispatch(setShippingAddress(addressRes.data || []));
      dispatch(
        setCheckoutFormData({
          paymentMethod: "Cash",
          shippingAddressId: activeShippingAddress?.id,
          termsAndConditions: false,
        })
      );
    }

    fetchData();
    return () => {
      dispatch(setLoading({ save: false }));
      dispatch(setShippingCharge({}));
    };
  }, [dispatch]);

  const handleStep1Continue = () => {
    if (!checkoutFormData?.shippingAddressId) {
      errorNotification({ message: "Please select or create a shipping address first." });
      return;
    }
    setActiveStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep2Continue = () => {
    if (!cartList || cartList.length === 0) {
      errorNotification({ message: "Your cart is empty. Please add items to checkout." });
      return;
    }
    setActiveStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Global Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shopping Cart", href: "/products" },
          { label: "Checkout" },
        ]}
        className="mb-0 bg-white/70"
      />

      {/* Refined Luxury Checkout Header & Stepper */}
      <div className="bg-white border-b border-gray-200/70 shadow-2xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          
          {/* Top Row: Page Title + Trust Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-11 h-11 rounded-2xl bg-global-primary/10 text-global-primary flex items-center justify-center text-xl shadow-xs shrink-0">
                <LockOutlined />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2 justify-center sm:justify-start">
                  <span>Secure Checkout</span>
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Fast, encrypted & protected purchase
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
                <SafetyCertificateOutlined className="text-emerald-600 text-sm" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200/80 px-3.5 py-1.5 rounded-full">
                <CheckCircleFilled className="text-emerald-500 text-xs" />
                <span>Money-Back Guarantee</span>
              </div>
            </div>
          </div>

          {/* Stepper Card */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="grid grid-cols-3 relative">
              
              {/* Connector Bar Background */}
              <div className="absolute top-5 left-[16.6%] right-[16.6%] h-[3px] bg-gray-100 rounded-full overflow-hidden">
                {/* Active fill */}
                <div 
                  className="h-full bg-linear-to-r from-global-primary to-global-hover rounded-full transition-all duration-500"
                  style={{
                    width: activeStep === 1 ? "0%" : activeStep === 2 ? "50%" : "100%",
                  }}
                />
              </div>

              {/* Step 1 */}
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="flex flex-col items-center text-center group cursor-pointer relative z-10 transition-all focus:outline-hidden"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    activeStep === 1
                      ? "bg-global-primary text-white ring-4 ring-global-primary/20 shadow-md shadow-global-primary/30 scale-105"
                      : activeStep > 1
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                      : "bg-white text-gray-400 border-2 border-gray-200 group-hover:border-gray-300"
                  }`}
                >
                  {activeStep > 1 ? <CheckOutlined className="text-xs" /> : "1"}
                </div>
                <div className="mt-2.5 space-y-0.5">
                  <span
                    className={`text-xs font-black uppercase tracking-wider block transition-colors ${
                      activeStep === 1
                        ? "text-global-primary"
                        : activeStep > 1
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    Shipping
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium hidden sm:block">
                    Destination
                  </span>
                </div>
              </button>

              {/* Step 2 */}
              <button
                type="button"
                onClick={() => {
                  if (checkoutFormData?.shippingAddressId) setActiveStep(2);
                }}
                disabled={!checkoutFormData?.shippingAddressId}
                className={`flex flex-col items-center text-center relative z-10 transition-all focus:outline-hidden ${
                  checkoutFormData?.shippingAddressId
                    ? "cursor-pointer group"
                    : "cursor-not-allowed opacity-60"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    activeStep === 2
                      ? "bg-global-primary text-white ring-4 ring-global-primary/20 shadow-md shadow-global-primary/30 scale-105"
                      : activeStep > 2
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                      : "bg-white text-gray-400 border-2 border-gray-200 group-hover:border-gray-300"
                  }`}
                >
                  {activeStep > 2 ? <CheckOutlined className="text-xs" /> : "2"}
                </div>
                <div className="mt-2.5 space-y-0.5">
                  <span
                    className={`text-xs font-black uppercase tracking-wider block transition-colors ${
                      activeStep === 2
                        ? "text-global-primary"
                        : activeStep > 2
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    Review
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium hidden sm:block">
                    {cartList.length} {cartList.length === 1 ? "Item" : "Items"}
                  </span>
                </div>
              </button>

              {/* Step 3 */}
              <button
                type="button"
                onClick={() => {
                  if (checkoutFormData?.shippingAddressId && cartList.length > 0) setActiveStep(3);
                }}
                disabled={!checkoutFormData?.shippingAddressId || cartList.length === 0}
                className={`flex flex-col items-center text-center relative z-10 transition-all focus:outline-hidden ${
                  checkoutFormData?.shippingAddressId && cartList.length > 0
                    ? "cursor-pointer group"
                    : "cursor-not-allowed opacity-60"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    activeStep === 3
                      ? "bg-global-primary text-white ring-4 ring-global-primary/20 shadow-md shadow-global-primary/30 scale-105"
                      : "bg-white text-gray-400 border-2 border-gray-200 group-hover:border-gray-300"
                  }`}
                >
                  3
                </div>
                <div className="mt-2.5 space-y-0.5">
                  <span
                    className={`text-xs font-black uppercase tracking-wider block transition-colors ${
                      activeStep === 3
                        ? "text-global-primary"
                        : "text-gray-400"
                    }`}
                  >
                    Payment
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium hidden sm:block">
                    Confirm & Pay
                  </span>
                </div>
              </button>

            </div>
          </div>

        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: PROGRESSIVE DISCLOSURE STEPS */}
          <div className="flex-1 w-full space-y-6">
            
            {/* ================= STEP 1: SHIPPING ADDRESS ================= */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all">
              {/* Step Header */}
              <div
                onClick={() => {
                  if (activeStep > 1) setActiveStep(1);
                }}
                className={`p-6 sm:p-7 flex items-center justify-between transition-colors ${
                  activeStep > 1 ? "cursor-pointer hover:bg-gray-50/70" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${
                      activeStep === 1
                        ? "bg-global-primary text-white shadow-md shadow-global-primary/20"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {activeStep > 1 ? <CheckCircleFilled className="text-lg" /> : "01"}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-wide">
                      Shipping Destination
                    </h2>
                    <p className="text-xs text-gray-400 font-medium">
                      Select where you want your products delivered
                    </p>
                  </div>
                </div>

                {activeStep > 1 && (
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-xs font-bold text-global-primary hover:text-global-hover flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-global-primary/10 transition-colors uppercase tracking-wider"
                  >
                    <EditOutlined />
                    <span>Change</span>
                  </button>
                )}
              </div>

              {/* Step 1 Expanded Content */}
              {activeStep === 1 && (
                <div className="p-6 sm:p-7 pt-0 border-t border-gray-100 space-y-6 animate-in fade-in duration-300">
                  <div className="pt-4">
                    <CheckoutShippingAddress />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleStep1Continue}
                      className="px-8 py-3.5 rounded-2xl bg-global-primary hover:bg-global-hover text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-global-primary/20 hover:shadow-global-primary/30 transition-all active:scale-[0.98]"
                    >
                      <span>Continue to Order Review</span>
                      <ArrowRightOutlined className="text-xs" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 1 Compact Summary (when completed) */}
              {activeStep > 1 && selectedAddress && (
                <div className="px-6 sm:px-7 pb-6 pt-0 border-t border-gray-100">
                  <div className="mt-4 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-global-primary shrink-0">
                      <EnvironmentOutlined className="text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-gray-900 truncate">
                          {selectedAddress.name}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-global-primary/10 text-global-primary">
                          {selectedAddress.type || "Default"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {selectedAddress.address}
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        Contact: {selectedAddress.phoneNo}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ================= STEP 2: REVIEW ORDER ITEMS ================= */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all">
              {/* Step Header */}
              <div
                onClick={() => {
                  if (activeStep > 2) setActiveStep(2);
                }}
                className={`p-6 sm:p-7 flex items-center justify-between transition-colors ${
                  activeStep > 2 ? "cursor-pointer hover:bg-gray-50/70" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${
                      activeStep === 2
                        ? "bg-global-primary text-white shadow-md shadow-global-primary/20"
                        : activeStep > 2
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {activeStep > 2 ? <CheckCircleFilled className="text-lg" /> : "02"}
                  </div>
                  <div>
                    <h2
                      className={`text-base sm:text-lg font-black uppercase tracking-wide ${
                        activeStep >= 2 ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      Review Order Items
                    </h2>
                    <p className="text-xs text-gray-400 font-medium">
                      {activeStep < 2
                        ? "Complete shipping destination first"
                        : `${cartList.length} items in your bag`}
                    </p>
                  </div>
                </div>

                {activeStep > 2 && (
                  <button
                    onClick={() => setActiveStep(2)}
                    className="text-xs font-bold text-global-primary hover:text-global-hover flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-global-primary/10 transition-colors uppercase tracking-wider"
                  >
                    <EditOutlined />
                    <span>Edit Items</span>
                  </button>
                )}
              </div>

              {/* Step 2 Expanded Content */}
              {activeStep === 2 && (
                <div className="p-6 sm:p-7 pt-0 border-t border-gray-100 space-y-6 animate-in fade-in duration-300">
                  <div className="pt-4">
                    <OrderSummary />
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-2 px-4 py-2 rounded-xl transition-colors uppercase tracking-wider"
                    >
                      <ArrowLeftOutlined className="text-xs" />
                      <span>Back to Shipping</span>
                    </button>
                    <button
                      onClick={handleStep2Continue}
                      className="px-8 py-3.5 rounded-2xl bg-global-primary hover:bg-global-hover text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-global-primary/20 hover:shadow-global-primary/30 transition-all active:scale-[0.98]"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRightOutlined className="text-xs" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 Compact Summary (when completed) */}
              {activeStep > 2 && cartList.length > 0 && (
                <div className="px-6 sm:px-7 pb-6 pt-0 border-t border-gray-100">
                  <div className="mt-4 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3 overflow-hidden">
                        {cartList.slice(0, 4).map((item: any, i: number) => (
                          <div
                            key={i}
                            className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-white bg-gray-100 shadow-xs shrink-0"
                          >
                            <Image
                              src={getImageUrl(item.thumbnailImage)}
                              fill
                              alt={item.name}
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="text-xs font-black text-gray-900">
                          {cartSummary?.totalQty || cartList.length} items reviewed
                        </div>
                        <div className="text-[11px] text-gray-400 font-semibold">
                          Subtotal: {formatPrice(cartSummary?.grandTotal || 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ================= STEP 3: PAYMENT STRATEGY ================= */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all">
              {/* Step Header */}
              <div className="p-6 sm:p-7 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${
                      activeStep === 3
                        ? "bg-global-primary text-white shadow-md shadow-global-primary/20"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    03
                  </div>
                  <div>
                    <h2
                      className={`text-base sm:text-lg font-black uppercase tracking-wide ${
                        activeStep === 3 ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      Payment Method
                    </h2>
                    <p className="text-xs text-gray-400 font-medium">
                      {activeStep === 3
                        ? "Choose your preferred payment method & accept terms"
                        : "Review your items to select payment"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 Expanded Content */}
              {activeStep === 3 && (
                <div className="p-6 sm:p-7 pt-0 border-t border-gray-100 space-y-6 animate-in fade-in duration-300">
                  <div className="pt-4">
                    <PaymentMethod />
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-2 px-4 py-2 rounded-xl transition-colors uppercase tracking-wider"
                    >
                      <ArrowLeftOutlined className="text-xs" />
                      <span>Back to Review Items</span>
                    </button>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <LockOutlined className="text-global-primary" />
                      <span>Review summary to finalize</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation Links */}
            <div className="pt-6 flex items-center justify-between border-t border-gray-200/60">
              <Link
                href="/products"
                className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-global-primary transition-colors"
              >
                <ArrowLeftOutlined />
                <span>Return to Shopping</span>
              </Link>
              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <SafetyCertificateOutlined className="text-global-primary text-xs" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FLOATING ORDER SUMMARY */}
          <aside className="lg:w-[420px] w-full shrink-0">
            <div className="sticky top-28 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-global-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">
                  Order Summary
                </h2>

                <div className="space-y-6 relative z-10">
                  <CheckoutSummary
                    activeStep={activeStep}
                    onStepChange={(step) => {
                      setActiveStep(step);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />

                  <div className="pt-6 border-t border-gray-100">
                    <ApplyCoupon />
                  </div>
                </div>
              </div>

              {/* Trust & Guarantee Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs text-center">
                  <div className="text-[10px] font-black uppercase tracking-widest text-global-primary mb-1">
                    Free Return
                  </div>
                  <div className="text-xs font-bold text-gray-800">30-Day Policy</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs text-center">
                  <div className="text-[10px] font-black uppercase tracking-widest text-global-primary mb-1">
                    Authentic
                  </div>
                  <div className="text-xs font-bold text-gray-800">100% Genuine Items</div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

