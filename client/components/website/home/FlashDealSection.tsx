"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    FiArrowRight,
    FiCheck,
    FiClock,
    FiCopy,
    FiPercent,
    FiZap,
} from "react-icons/fi";

export default function FlashDealSection() {
  const [copied, setCopied] = useState(false);

  // 48 hours countdown from now
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 36,
    seconds: 48,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("FLASH40");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/70 border border-slate-800 shadow-2xl p-7 sm:p-10 lg:p-14">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Deal Metadata & Countdown */}
          <div className="lg:col-span-7 space-y-6">
            {/* Urgency Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <FiZap className="w-3.5 h-3.5 animate-bounce" />
              <span>Limited Time Exclusive</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
                Flash Deal of the Week
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Save up to <strong className="text-amber-400 font-bold">40% OFF</strong> on hand-curated seasonal essentials. Limited inventory available at this special tier.
              </p>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-3 sm:gap-4 pt-1">
              {[
                { label: "Days", val: String(timeLeft.days).padStart(2, "0") },
                { label: "Hours", val: String(timeLeft.hours).padStart(2, "0") },
                { label: "Minutes", val: String(timeLeft.minutes).padStart(2, "0") },
                { label: "Seconds", val: String(timeLeft.seconds).padStart(2, "0") },
              ].map((slot, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-inner">
                    {slot.val}
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1.5">
                    {slot.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions: Coupon Chip + CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products?featured=true"
                className="inline-flex items-center gap-2.5 h-12 px-7 rounded-xl bg-global-primary hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition cursor-pointer"
              >
                <span>Shop Flash Sale</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>

              {/* Coupon Pill */}
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-2.5 h-12 px-5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm font-semibold transition cursor-pointer"
              >
                <FiPercent className="w-4 h-4 text-amber-400" />
                <span>CODE: <strong className="text-amber-400 font-bold">FLASH40</strong></span>
                {copied ? (
                  <FiCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <FiCopy className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Visual Feature Box */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/15 p-6 sm:p-8 backdrop-blur-xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <FiClock className="w-3.5 h-3.5" />
                  <span>Selling Fast</span>
                </span>
                <span className="text-2xl font-black text-amber-400">-40% OFF</span>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg sm:text-xl font-bold text-white">
                  Executive Signature Collection
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Engineered with premium sustainable fabrics and timeless aesthetics. Included complimentary gift packaging on all orders placed today.
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Free Express Shipping</span>
                <span className="text-emerald-400 font-semibold">In Stock & Ready to Ship</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

