"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { FiCheck, FiGift, FiStar, FiTruck } from "react-icons/fi";

interface LandingBundleOffersProps {
  unitPrice: number;
  quantity: number;
  onSelectQuantity: (qty: number) => void;
  freeDeliveryMinQty?: number | null;
}

export default function LandingBundleOffers({
  unitPrice,
  quantity,
  onSelectQuantity,
  freeDeliveryMinQty = 2,
}: LandingBundleOffersProps) {
  const { formatPrice } = useCurrency();

  const isFree = (qty: number) => {
    if (freeDeliveryMinQty === null || freeDeliveryMinQty === undefined || freeDeliveryMinQty <= 0) {
      return false;
    }
    return qty >= freeDeliveryMinQty;
  };

  const bundles = [
    {
      qty: 1,
      badge: "রেগুলার অফার",
      title: "১টি পিস",
      description: "সিঙ্গেল পিস ট্রাই করতে চান",
      totalPrice: unitPrice,
      deliveryPerk: isFree(1) ? "ডেলিভারি সম্পূর্ণ ফ্রি! 🚚" : "ডেলিভারি চার্জ প্রযোজ্য",
      isFreeDelivery: isFree(1),
      popular: false,
    },
    {
      qty: 2,
      badge: isFree(2) ? "সবচেয়ে জনপ্রিয় 🔥" : "২ পিস প্যাক",
      title: "২টি পিস কম্বো",
      description: "বেস্ট ভ্যালু প্যাক",
      totalPrice: unitPrice * 2,
      deliveryPerk: isFree(2) ? "ডেলিভারি সম্পূর্ণ ফ্রি! 🚚" : "ডেলিভারি চার্জ প্রযোজ্য",
      isFreeDelivery: isFree(2),
      popular: true,
    },
    {
      qty: 3,
      badge: "সর্বোচ্চ সাশ্রয়ী 💥",
      title: "৩টি পিস ফ্যামিলি প্যাক",
      description: "অতিরিক্ত ৳১০০ ডিসকাউন্ট",
      totalPrice: Math.max(0, unitPrice * 3 - 100),
      deliveryPerk: isFree(3) ? "ফ্রি হোম ডেলিভারি + স্পেশাল গিফট 🎁" : "স্পেশাল গিফট 🎁",
      isFreeDelivery: isFree(3),
      popular: false,
    },
  ];

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div className="text-center space-y-1">
        <span className="text-xs uppercase tracking-widest font-black text-global-primary">
          স্পেশাল প্যাকেজ ডিল
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900">
          {freeDeliveryMinQty && freeDeliveryMinQty > 0
            ? "কম্বো অফারে অর্ডার করুন ও ডেলিভারি ফ্রি পান!"
            : "কম্বো অফারে অর্ডার করুন ও অতিরিক্ত সাশ্রয় পান!"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {bundles.map((bundle) => {
          const isSelected = quantity === bundle.qty;
          return (
            <div
              key={bundle.qty}
              onClick={() => onSelectQuantity(bundle.qty)}
              className={`relative rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-global-primary bg-global-primary/5 ring-4 ring-global-primary/10 shadow-md scale-[1.02]"
                  : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-xs"
              }`}
            >
              {/* Floating Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span
                  className={`text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-xs ${
                    bundle.popular
                      ? "bg-global-primary text-white animate-pulse"
                      : isSelected
                      ? "bg-global-primary text-white"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {bundle.badge}
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-lg text-gray-950">
                    {bundle.title}
                  </h3>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-global-primary bg-global-primary text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <FiCheck className="text-sm font-black" />}
                  </div>
                </div>

                <p className="text-xs text-gray-500">{bundle.description}</p>

                <div className="pt-2">
                  <div className="text-2xl font-black text-global-primary">
                    {formatPrice(bundle.totalPrice)}
                  </div>
                </div>
              </div>

              {/* Delivery perk pill */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div
                  className={`text-xs font-bold flex items-center gap-1.5 ${
                    bundle.isFreeDelivery ? "text-emerald-700" : "text-gray-500"
                  }`}
                >
                  {bundle.isFreeDelivery ? (
                    <FiTruck className="text-sm shrink-0" />
                  ) : null}
                  <span>{bundle.deliveryPerk}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
