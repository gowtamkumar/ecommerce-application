"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { useEffect, useState } from "react";
import { FiClock, FiShield, FiShoppingBag, FiTruck } from "react-icons/fi";
import { FaFire } from "react-icons/fa";

interface LandingHeroProps {
  product: any;
  selectedVariant: any;
  onOrderNowClick: () => void;
  urgencyText?: string;
  countdownHours?: number;
  ctaButtonText?: string;
}

export default function LandingHero({
  product,
  selectedVariant,
  onOrderNowClick,
  urgencyText,
  countdownHours = 3,
  ctaButtonText,
}: LandingHeroProps) {
  const { formatPrice } = useCurrency();

  // Urgency Countdown Timer (customizable hours from props)
  const initialHours = countdownHours && countdownHours > 0 ? countdownHours : 3;
  const [timeLeft, setTimeLeft] = useState({
    hours: Math.max(0, initialHours - 1),
    minutes: 48,
    seconds: 35,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: Math.max(0, initialHours - 1), minutes: 45, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialHours]);

  const regularPrice = Number(
    selectedVariant?.purchasePrice ||
      selectedVariant?.price ||
      product?.salePrice ||
      product?.unitPrice ||
      0,
  );

  const effectiveFinalPrice = Number(
    selectedVariant?.price ||
      product?.finalPrice ||
      product?.unitPrice ||
      0,
  );

  // If salePrice exists and is higher than effectiveFinalPrice, use it as regularPrice
  const displayOldPrice =
    regularPrice > effectiveFinalPrice
      ? regularPrice
      : Math.round(effectiveFinalPrice * 1.35);

  const savingsAmount = displayOldPrice - effectiveFinalPrice;
  const discountPercent = Math.round((savingsAmount / displayOldPrice) * 100);

  return (
    <div className="w-full space-y-5">
      {/* Top Flash Sale Badge & Urgency Timer */}
      <div className="bg-global-primary/10 border border-global-primary/30 rounded-2xl p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-gray-900 font-extrabold text-sm sm:text-base">
            <FaFire className="text-xl animate-bounce text-global-primary shrink-0" />
            <span>{urgencyText || "সীমিত সময়ের স্পেশাল ধামাকা অফার!"}</span>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
            <FiClock className="text-global-primary text-sm" />
            <span>অফার শেষ হতে বাকি:</span>
            <div className="flex items-center gap-1 font-mono text-white">
              <span className="bg-gray-900 px-2 py-1 rounded-md text-xs">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-gray-900 font-bold">:</span>
              <span className="bg-gray-900 px-2 py-1 rounded-md text-xs">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-gray-900 font-bold">:</span>
              <span className="bg-global-primary px-2 py-1 rounded-md text-xs animate-pulse">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Title & Brand */}
      <div>
        {product?.brand?.name && (
          <span className="text-xs uppercase tracking-widest font-black text-global-primary">
            {product.brand.name}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 leading-tight mt-1">
          {product?.name || "এক্সক্লুসিভ প্রিমিয়াম কালেকশন"}
        </h1>
        {product?.shortDescription && (
          <p className="text-gray-600 text-sm sm:text-base mt-2 leading-relaxed">
            {product.shortDescription}
          </p>
        )}
      </div>

      {/* Pricing Block */}
      <div className="flex items-baseline gap-3 sm:gap-4 flex-wrap bg-gray-50 border border-gray-200/80 rounded-2xl p-4">
        <div className="text-3xl sm:text-4xl font-black text-global-primary">
          {formatPrice(effectiveFinalPrice)}
        </div>
        {displayOldPrice > effectiveFinalPrice && (
          <div className="text-lg sm:text-xl text-gray-400 line-through font-semibold">
            {formatPrice(displayOldPrice)}
          </div>
        )}
        {discountPercent > 0 && (
          <span className="bg-global-primary/15 text-gray-900 border border-global-primary/30 text-xs sm:text-sm font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            {discountPercent}% ছাড় (Save {formatPrice(savingsAmount)})
          </span>
        )}
      </div>

      {/* Dynamic Stock Scarcity Progress Bar */}
      {(() => {
        const rawStock = Number(
          selectedVariant?.stock ||
            selectedVariant?.stockQty ||
            product?.stock ||
            product?.quantity ||
            8,
        );
        const displayStock = rawStock > 0 ? (rawStock > 25 ? 12 : rawStock) : 7;
        const soldPercent = Math.min(94, Math.max(65, 100 - displayStock * 3));

        return (
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-global-primary animate-ping inline-block" />
                স্টক সীমিত! আর মাত্র {displayStock}টি পিস বাকি আছে!
              </span>
              <span className="text-gray-500">{soldPercent}% সোল্ড আউট</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-global-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${soldPercent}%` }}
              />
            </div>
          </div>
        );
      })()}

      {/* Instant Action CTA Button */}
      <div className="pt-2">
        <button
          onClick={onOrderNowClick}
          className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-global-primary hover:bg-global-hover text-white font-black text-lg sm:text-xl shadow-xl shadow-global-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
        >
          <FiShoppingBag className="text-2xl group-hover:scale-110 transition-transform" />
          <span>{ctaButtonText || "অর্ডার করতে এখানে ক্লিক করুন"}</span>
        </button>
        <p className="text-center text-gray-500 text-xs mt-2 flex items-center justify-center gap-2">
          <FiTruck className="text-emerald-600" />
          <span>পণ্য হাতে পেয়ে মূল্য পরিশোধ করার সুবিধা (ক্যাশ অন ডেলিভারি)</span>
        </p>
      </div>
    </div>
  );
}
