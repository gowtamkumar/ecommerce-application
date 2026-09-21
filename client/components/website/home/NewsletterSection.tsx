"use client";

import {
    errorNotification,
    successNotification,
} from "@/lib/utils/notification";
import React, { useState } from "react";
import {
    FiArrowRight,
    FiCheck,
    FiGift,
    FiLock,
    FiMail,
    FiShield,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      errorNotification({ message: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      successNotification({
        message: "Welcome to the VIP Club! Check your inbox for your 15% discount code.",
      });
      setEmail("");
    }, 600);
  };

  return (
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/80 border border-slate-800 shadow-2xl p-8 sm:p-12 lg:p-16">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 -mb-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <HiSparkles className="w-3.5 h-3.5" />
            <span>Exclusive Membership</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
            Join the VIP Club & Receive <span className="text-amber-400">15% Off</span>
          </h2>

          {/* Subtext */}
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Gain immediate priority access to private seasonal drops, exclusive member savings, and curated design edits directly in your inbox.
          </p>

          {/* Perks Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-1 text-xs text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <FiCheck className="w-4 h-4 text-amber-400" />
              <span>Early Drop Access</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FiGift className="w-4 h-4 text-amber-400" />
              <span>Private Member Sales</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FiShield className="w-4 h-4 text-amber-400" />
              <span>Complimentary Gift Wrap</span>
            </span>
          </div>

          {/* Subscription Form */}
          {subscribed ? (
            <div className="pt-3 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold">
              <FiCheck className="w-5 h-5" />
              <span>You're subscribed! Use code VIP15 for 15% off your next order.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="pt-2 max-w-md mx-auto flex flex-col sm:flex-row items-center gap-2.5"
            >
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FiMail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full pl-11 pr-4 h-12 sm:h-13 rounded-xl sm:rounded-2xl bg-white/10 text-white placeholder:text-slate-400 border border-white/20 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto h-12 sm:h-13 px-7 rounded-xl sm:rounded-2xl bg-global-primary hover:bg-amber-600 text-white text-sm font-bold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                <span>{loading ? "Joining..." : "Join Now"}</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <FiLock className="w-3.5 h-3.5" />
            <span>Zero spam. Unsubscribe at any time with a single click.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
