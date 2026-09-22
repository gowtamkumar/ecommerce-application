"use client";

import { getDiscounts } from "@/lib/apis/discount";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    FiArrowRight,
    FiClock,
    FiShield,
    FiTruck,
    FiZap,
} from "react-icons/fi";

interface FlashDealSectionProps {
  initialDiscounts?: any[];
}

export default function FlashDealSection({ initialDiscounts }: FlashDealSectionProps) {
  const [discounts, setDiscounts] = useState<any[]>(initialDiscounts || []);
  const [loading, setLoading] = useState<boolean>(!initialDiscounts || initialDiscounts.length === 0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  // Fetch active discounts from discount API if not provided via props
  useEffect(() => {
    let isMounted = true;

    async function fetchActiveDiscounts() {
      try {
        const res = await getDiscounts({ status: "Active" });
        if (isMounted && res?.data && Array.isArray(res.data)) {
          // Sort so FlashSale promotions come first, followed by highest priority
          const sorted = [...res.data].sort((a: any, b: any) => {
            if (a.promotionType === "FlashSale" && b.promotionType !== "FlashSale") return -1;
            if (b.promotionType === "FlashSale" && a.promotionType !== "FlashSale") return 1;
            return (b.priority || 0) - (a.priority || 0);
          });
          setDiscounts(sorted);
        }
      } catch (err) {
        console.error("Failed to fetch active discounts:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (!initialDiscounts || initialDiscounts.length === 0) {
      fetchActiveDiscounts();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [initialDiscounts]);

  // Active selected deal
  const activeDeal = useMemo(() => {
    if (!discounts || discounts.length === 0) return null;
    return discounts[selectedIndex] || discounts[0];
  }, [discounts, selectedIndex]);

  // Live countdown timer based on active deal's endDate
  useEffect(() => {
    if (!activeDeal) return;

    const calculateRemaining = () => {
      if (!activeDeal.endDate) {
        // Fallback default: 48h from now
        setTimeLeft({ days: 2, hours: 14, minutes: 36, seconds: 48, isExpired: false });
        return;
      }

      const target = new Date(activeDeal.endDate).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [activeDeal?.endDate, activeDeal?.id]);

  // Format discount savings value
  const formatDiscountBadge = (item: any) => {
    if (!item) return "Special Discount";
    const val = Number(item.value);
    if (item.discountStrategy === "Percentage" && !isNaN(val)) {
      return `${val}% OFF`;
    }
    if (item.discountStrategy === "Fixed" && !isNaN(val)) {
      return `$${val} OFF`;
    }
    if (item.discountStrategy === "FreeShipping") {
      return "FREE SHIPPING";
    }
    if (item.discountStrategy === "Bogo") {
      return "BUY 1 GET 1";
    }
    return !isNaN(val) ? `${val}% OFF` : "LIMITED OFFER";
  };

  // Capitalize campaign name for clear presentation
  const formatCampaignName = (name?: string) => {
    if (!name) return "Seasonal Flash Sale";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Gracefully hide if loading finished and no active discounts are found
  if (!loading && (!discounts || discounts.length === 0)) {
    return null;
  }

  const currentDeal = activeDeal || {
    name: "Seasonal Flash Sale",
    slug: "flash-sale",
    promotionType: "FlashSale",
    value: 20,
    description: null,
  };

  const discountBadge = formatDiscountBadge(currentDeal);
  const campaignName = formatCampaignName(currentDeal.name);
  const dealLink = currentDeal.slug ? `/offers/${currentDeal.slug}` : "/offers";

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/60 border border-slate-800 shadow-2xl p-6 sm:p-10 lg:p-12">
        {/* Ambient Glow Accents */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Campaign Switcher (when multiple promotions exist) */}
        {discounts.length > 1 && (
          <div className="relative z-10 mb-6 sm:mb-8 flex flex-wrap items-center gap-2 pb-4 border-b border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mr-2">
              Active Campaigns:
            </span>
            {discounts.map((item, idx) => (
              <button
                key={item.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  selectedIndex === idx
                    ? "bg-global-primary text-white shadow-md shadow-amber-500/30 scale-105 ring-2 ring-white/20"
                    : "bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white"
                }`}
              >
                <span>{formatCampaignName(item.name)}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/25 font-black text-amber-300">
                  {formatDiscountBadge(item)}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Main Banner Content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Column: Clear Flash Deals Headline & Details */}
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
                <FiZap className="w-3.5 h-3.5 animate-bounce text-amber-400" />
                <span>Limited-Time Flash Deals</span>
              </div>

              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
                Up to {discountBadge}
              </span>

              {currentDeal.name && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold">
                  Campaign: {campaignName}
                </span>
              )}
            </div>

            {/* Clear Primary Title */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Flash Deals of the Week
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {currentDeal.description && currentDeal.description.length > 10 ? (
                  currentDeal.description
                ) : (
                  <>
                    Enjoy exclusive instant savings of <strong className="text-amber-400 font-bold">{discountBadge}</strong> on hand-curated seasonal essentials. Limited quantities available before this campaign concludes.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Right Column: Live Countdown Clock & Big CTA */}
          <div className="flex flex-col items-center lg:items-end space-y-5 shrink-0 w-full lg:w-auto">
            {/* Live Countdown Box */}
            <div className="space-y-2 text-center lg:text-right">
              <div className="flex items-center justify-center lg:justify-end gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                <FiClock className="w-3.5 h-3.5" />
                <span>
                  {timeLeft.isExpired ? "Campaign Ended" : "Deals Expire In:"}
                </span>
              </div>

              {/* Digits Tiles */}
              <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                {[
                  { label: "Days", val: String(timeLeft.days).padStart(2, "0") },
                  { label: "Hours", val: String(timeLeft.hours).padStart(2, "0") },
                  { label: "Mins", val: String(timeLeft.minutes).padStart(2, "0") },
                  { label: "Secs", val: String(timeLeft.seconds).padStart(2, "0") },
                ].map((slot, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-13 sm:w-16 h-13 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-inner">
                      {slot.val}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1.5">
                      {slot.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Primary Shop CTA */}
            <Link
              href={dealLink}
              className="inline-flex items-center justify-center gap-2.5 h-12 sm:h-13 px-8 w-full sm:w-auto rounded-xl bg-global-primary hover:bg-amber-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <span>Shop Flash Sale</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom Trust Assurance Bar */}
        <div className="relative z-10 mt-8 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <FiZap className="text-amber-400 shrink-0" />
            <span>Instant discount applied automatically</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <FiTruck className="text-amber-400 shrink-0" />
            <span>Fast express delivery on all deals</span>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <FiShield className="text-emerald-400 shrink-0" />
            <span className="text-emerald-400 font-semibold">100% Authentic Quality Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
