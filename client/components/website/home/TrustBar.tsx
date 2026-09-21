"use client";

import {
    FiHeadphones,
    FiRotateCcw,
    FiShield,
    FiTruck,
} from "react-icons/fi";

const TRUST_ITEMS = [
  {
    icon: FiTruck,
    title: "Express Delivery",
    description: "Free fast shipping on all orders over $99 with live tracking",
    badge: "Fast & Free",
  },
  {
    icon: FiShield,
    title: "100% Authentic Guarantee",
    description: "Directly sourced and brand-certified original merchandise",
    badge: "Verified",
  },
  {
    icon: FiRotateCcw,
    title: "30-Day Easy Returns",
    description: "Hassle-free 1-click return requests with instant refunds",
    badge: "No-Risk",
  },
  {
    icon: FiHeadphones,
    title: "24/7 Priority Concierge",
    description: "Dedicated expert support ready to assist you anytime",
    badge: "Always Live",
  },
];

export default function TrustBar() {
  return (
    <section className="relative z-10 -mt-6 sm:-mt-8 mb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100/80 shadow-xl shadow-gray-200/50 p-5 sm:p-7 lg:p-8 backdrop-blur-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-start gap-4 group transition-all duration-300 ${
                  idx > 0 ? "pt-5 sm:pt-0 sm:pl-6 lg:pl-8" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-global-primary flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-global-primary group-hover:text-white group-hover:scale-105 group-hover:shadow-md group-hover:shadow-amber-500/20">
                  <Icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-[-4deg]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-snug group-hover:text-global-primary transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

