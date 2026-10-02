"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { trackInitiateCheckout } from "@/lib/analytics/metaPixel";
import { submitLandingOrder } from "@/lib/apis/landing";
import { getImageUrl } from "@/lib/utils/imageUrl";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiCheck,
  FiCreditCard,
  FiDollarSign,
  FiLock,
  FiMapPin,
  FiPhone,
  FiShield,
  FiShoppingBag,
  FiTruck,
  FiUser,
} from "react-icons/fi";

interface LandingOrderFormProps {
  product: any;
  variants: any[];
  selectedVariant: any;
  onSelectVariant: (v: any) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  deliveryCharges: {
    insideDhaka: number;
    outsideDhaka: number;
  };
  utmData?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
  };
  onOrderSuccess: (orderData: any) => void;
}

export default function LandingOrderForm({
  product,
  variants,
  selectedVariant,
  onSelectVariant,
  quantity,
  onQuantityChange,
  deliveryCharges,
  utmData,
  onOrderSuccess,
}: LandingOrderFormProps) {
  const { formatPrice } = useCurrency();

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryZone, setDeliveryZone] = useState<"inside_dhaka" | "outside_dhaka">("inside_dhaka");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "SSLCOMMERZ">("Cash");
  const [note, setNote] = useState("");

  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Track InitiateCheckout on first interaction with the order form
  const handleFormInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      trackInitiateCheckout({
        content_name: product?.name,
        content_ids: [selectedVariant?.id || product?.id],
        value: Number(selectedVariant?.price || product?.finalPrice || 0) * quantity,
        currency: "BDT",
        num_items: quantity,
      });
    }
  };

  // Pricing calculations
  const unitPrice = Number(selectedVariant?.price || product?.finalPrice || product?.unitPrice || 0);
  const subTotal = unitPrice * quantity;

  // Free delivery for 2 or more pieces
  const isFreeDelivery = quantity >= 2;
  const standardShipping =
    deliveryZone === "inside_dhaka"
      ? deliveryCharges.insideDhaka || 60
      : deliveryCharges.outsideDhaka || 120;

  const effectiveShippingCharge = isFreeDelivery ? 0 : standardShipping;
  const grandTotal = subTotal + effectiveShippingCharge;

  // Extract unique sizes and colors from variants
  const sizeOptions = Array.from(
    new Map(
      variants
        .filter((v) => v.size?.name || v.sizeName)
        .map((v) => [v.size?.name || v.sizeName, v]),
    ).values(),
  );

  const colorOptions = Array.from(
    new Map(
      variants
        .filter((v) => v.color?.name || v.colorName)
        .map((v) => [v.color?.name || v.colorName, v]),
    ).values(),
  );

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate name
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage("অনুগ্রহ করে আপনার সঠিক নাম লিখুন।");
      return;
    }

    // Validate Bangladeshi phone number (11 digits, starts with 01)
    const cleanPhone = phoneNo.replace(/\D/g, "");
    if (!/^01\d{9}$/.test(cleanPhone)) {
      setErrorMessage("অনুগ্রহ করে ১১ ডিজিটের সঠিক মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)");
      return;
    }

    // Validate delivery address
    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      setErrorMessage("অনুগ্রহ করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন (বাসা নং, রোড নং, এলাকা, জেলা)।");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        phoneNo: cleanPhone,
        deliveryAddress: deliveryAddress.trim(),
        deliveryZone,
        shippingCharge: effectiveShippingCharge,
        subTotal,
        grandTotal,
        paymentMethod,
        note: note.trim() || undefined,
        utmSource: utmData?.utmSource,
        utmMedium: utmData?.utmMedium,
        utmCampaign: utmData?.utmCampaign,
        utmContent: utmData?.utmContent,
        orderItems: [
          {
            productId: product.id,
            productVariantId: selectedVariant?.id || variants[0]?.id || product.id,
            qty: quantity,
            unitPrice: unitPrice,
            purchasePrice: Number(selectedVariant?.purchasePrice || 0),
            discountedUnitPrice: unitPrice,
            subTotal: subTotal,
            taxAmount: 0,
          },
        ],
      };

      const result = await submitLandingOrder(orderPayload);

      if (result.success && result.data) {
        onOrderSuccess(result.data);
      } else {
        setErrorMessage(
          result.message || "অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা সরাসরি কল করুন।",
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে একটু পর চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="order-form"
      className="w-full bg-white rounded-3xl border-2 border-global-primary shadow-xl overflow-hidden scroll-mt-24"
    >
      {/* Form Header Banner */}
      <div className="bg-global-primary p-5 sm:p-7 text-white text-center space-y-1">
        <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider mb-1">
          ক্যাশ অন ডেলিভারি (Cash on Delivery)
        </span>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black">
          অর্ডারটি কনফার্ম করতে নিচের ফর্মটি পূরণ করুন
        </h2>
        <p className="text-white/85 text-xs sm:text-sm">
          পণ্য হাতে পেয়ে দেখে টাকা পরিশোধ করার সুবিধা
        </p>
      </div>

      <form
        onSubmit={handleSubmitOrder}
        onFocus={handleFormInteraction}
        className="p-5 sm:p-8 space-y-6"
      >
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold flex items-center gap-2 animate-shake">
            <FiAlertCircle className="text-xl shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: ITEM & VARIANT SUMMARY */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0">
              <Image
                src={getImageUrl(product?.thumbnailImage)}
                alt={product?.name || "Product"}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-black text-gray-900 text-sm sm:text-base leading-snug line-clamp-1">
                {product?.name}
              </h3>
              <div className="text-global-primary font-extrabold text-sm sm:text-base">
                {formatPrice(unitPrice)}
              </div>
            </div>
          </div>

          {/* Size Selector */}
          {sizeOptions.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-gray-200">
              <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                সাইজ নির্বাচন করুন:
              </label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((v) => {
                  const sizeName = v.size?.name || v.sizeName;
                  const isSelected =
                    (selectedVariant?.size?.name || selectedVariant?.sizeName) === sizeName;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => onSelectVariant(v)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isSelected
                          ? "bg-global-primary text-white shadow-xs scale-95"
                          : "bg-white border border-gray-300 text-gray-800 hover:border-gray-400"
                      }`}
                    >
                      {sizeName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {colorOptions.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-gray-200">
              <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                কালার নির্বাচন করুন:
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((v) => {
                  const colorName = v.color?.name || v.colorName;
                  const isSelected =
                    (selectedVariant?.color?.name || selectedVariant?.colorName) === colorName;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => onSelectVariant(v)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isSelected
                          ? "bg-global-primary text-white shadow-xs scale-95"
                          : "bg-white border border-gray-300 text-gray-800 hover:border-gray-400"
                      }`}
                    >
                      {colorName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
              অর্ডার পরিমাণ (Quantity):
            </span>
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="w-10 h-9 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <span className="w-10 text-center font-black text-gray-900 text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onQuantityChange(quantity + 1)}
                className="w-10 h-9 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* STEP 2: CUSTOMER INFORMATION */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-extrabold text-gray-800 flex items-center gap-1.5">
              <FiUser className="text-global-primary text-base" />
              <span>আপনার সম্পূর্ণ নাম <span className="text-global-primary">*</span></span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="যেমন: মোঃ তানভীর হাসান"
              className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-gray-300 focus:border-global-primary focus:ring-2 focus:ring-global-primary/20 text-sm sm:text-base text-gray-900 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-extrabold text-gray-800 flex items-center gap-1.5">
              <FiPhone className="text-global-primary text-base" />
              <span>মোবাইল নম্বর (১১ ডিজিট) <span className="text-global-primary">*</span></span>
            </label>
            <input
              type="tel"
              required
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              placeholder="যেমন: 017XXXXXXXX"
              maxLength={11}
              className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-gray-300 focus:border-global-primary focus:ring-2 focus:ring-global-primary/20 text-sm sm:text-base text-gray-900 font-mono outline-none transition-all"
            />
            <p className="text-[11px] text-gray-400">
              অর্ডার কনফার্মেশনের জন্য এই নম্বরে কল বা এসএমএস দেওয়া হবে
            </p>
          </div>

          {/* Delivery Zone Options */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-extrabold text-gray-800 flex items-center gap-1.5">
              <FiTruck className="text-global-primary text-base" />
              <span>ডেলিভারি এলাকা নির্বাচন করুন <span className="text-global-primary">*</span></span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Inside Dhaka */}
              <div
                onClick={() => setDeliveryZone("inside_dhaka")}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  deliveryZone === "inside_dhaka"
                    ? "border-global-primary bg-global-primary/5 ring-2 ring-global-primary/10"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      deliveryZone === "inside_dhaka"
                        ? "border-global-primary bg-global-primary text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {deliveryZone === "inside_dhaka" && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900">
                      ঢাকার ভিতরে
                    </div>
                    <div className="text-[11px] text-gray-500">২৪-৪৮ ঘণ্টার মধ্যে</div>
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-black text-global-primary">
                  {isFreeDelivery ? "ফ্রি" : formatPrice(deliveryCharges.insideDhaka || 60)}
                </div>
              </div>

              {/* Outside Dhaka */}
              <div
                onClick={() => setDeliveryZone("outside_dhaka")}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  deliveryZone === "outside_dhaka"
                    ? "border-global-primary bg-global-primary/5 ring-2 ring-global-primary/10"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      deliveryZone === "outside_dhaka"
                        ? "border-global-primary bg-global-primary text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {deliveryZone === "outside_dhaka" && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900">
                      ঢাকার বাইরে
                    </div>
                    <div className="text-[11px] text-gray-500">২-৩ কার্যদিবস</div>
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-black text-global-primary">
                  {isFreeDelivery ? "ফ্রি" : formatPrice(deliveryCharges.outsideDhaka || 120)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-extrabold text-gray-800 flex items-center gap-1.5">
              <FiMapPin className="text-global-primary text-base" />
              <span>আপনার সম্পূর্ণ ঠিকানা <span className="text-global-primary">*</span></span>
            </label>
            <textarea
              required
              rows={2}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="বাসা নং, রোড নং, এলাকা/উপজেলা, জেলার নাম..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-global-primary focus:ring-2 focus:ring-global-primary/20 text-sm sm:text-base text-gray-900 outline-none transition-all resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600">
              অর্ডার নোট (অপশনাল)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="যেমন: সাইজ বা ডেলিভারি সম্পর্কিত কোনো বিশেষ কথা..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* STEP 3: PAYMENT METHOD */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="text-xs sm:text-sm font-extrabold text-gray-800">
            পেমেন্ট মেথড নির্বাচন করুন:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setPaymentMethod("Cash")}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                paymentMethod === "Cash"
                  ? "border-global-primary bg-global-primary/5 ring-2 ring-global-primary/10"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FiDollarSign className="text-emerald-600 text-xl" />
                <div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900">
                    ক্যাশ অন ডেলিভারি (COD)
                  </div>
                  <div className="text-[11px] text-gray-500">পণ্য পেয়ে টাকা দিন</div>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "Cash"
                    ? "border-global-primary bg-global-primary text-white"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "Cash" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>

            <div
              onClick={() => setPaymentMethod("SSLCOMMERZ")}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                paymentMethod === "SSLCOMMERZ"
                  ? "border-global-primary bg-global-primary/5 ring-2 ring-global-primary/10"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FiCreditCard className="text-blue-600 text-xl" />
                <div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900">
                    অনলাইন পেমেন্ট
                  </div>
                  <div className="text-[11px] text-gray-500">বিকাশ / নগদ / কার্ড</div>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "SSLCOMMERZ"
                    ? "border-global-primary bg-global-primary text-white"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "SSLCOMMERZ" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STEP 4: BILL BREAKDOWN */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-gray-600 font-medium">
            <span>পণ্য মূল্য ({quantity} টি):</span>
            <span>{formatPrice(subTotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600 font-medium">
            <span>ডেলিভারি চার্জ:</span>
            <span>
              {effectiveShippingCharge === 0 ? (
                <span className="text-emerald-700 font-bold">ফ্রি (০ ৳)</span>
              ) : (
                formatPrice(effectiveShippingCharge)
              )}
            </span>
          </div>
          <div className="pt-2 border-t border-gray-200 flex justify-between text-base sm:text-lg font-black text-gray-950">
            <span>সর্বমোট প্রদেয় বিল:</span>
            <span className="text-global-primary font-black">{formatPrice(grandTotal)}</span>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-global-primary hover:bg-global-hover disabled:opacity-70 text-white font-black text-lg sm:text-xl shadow-xl shadow-global-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>অর্ডার সম্পন্ন হচ্ছে...</span>
            </div>
          ) : (
            <>
              <FiShoppingBag className="text-2xl" />
              <span>অর্ডার কনফার্ম করুন - {formatPrice(grandTotal)}</span>
            </>
          )}
        </button>

        {/* Trust Badges under CTA */}
        <div className="flex items-center justify-center gap-4 text-[11px] sm:text-xs text-gray-500 font-bold pt-1">
          <span className="flex items-center gap-1">
            <FiLock className="text-emerald-600" /> নিরাপদ চেকআউট
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <FiShield className="text-emerald-600" /> ১০০% স্যাটিসফ্যাকশন
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <FiTruck className="text-emerald-600" /> ক্যাশ অন ডেলিভারি
          </span>
        </div>
      </form>
    </div>
  );
}
