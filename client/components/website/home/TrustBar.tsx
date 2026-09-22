"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { getSettings } from "@/lib/apis/setting";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { useEffect, useState } from "react";
import {
    FiHeadphones,
    FiRotateCcw,
    FiShield,
    FiTruck,
} from "react-icons/fi";
import { useSelector } from "react-redux";

interface TrustBarProps {
  setting?: any;
}

export default function TrustBar({ setting: initialSetting }: TrustBarProps) {
  const global = useSelector(selectGlobal);
  const { formatPrice } = useCurrency();
  const [setting, setSetting] = useState<any>(initialSetting || global?.setting || null);

  useEffect(() => {
    if (!setting && !global?.setting?.id) {
      getSettings()
        .then((res) => {
          if (res?.data) {
            setSetting(res.data);
          }
        })
        .catch(() => {});
    } else if (!setting && global?.setting?.id) {
      setSetting(global.setting);
    }
  }, [global?.setting, setting]);

  const activeSetting = setting || global?.setting || {};
  const helpSupport = activeSetting?.helpSupport || {};
  const returnSetting = activeSetting?.returnSetting || {};
  const freeShipping = activeSetting?.orderFreeShippingAmount;
  const phone = activeSetting?.whatsAppWidget?.phone || activeSetting?.phone;
  const email = activeSetting?.email;

  // 1. Delivery Guarantee
  const deliveryTitle = helpSupport?.cashDelivery
    ? helpSupport.cashDelivery
    : "Express Delivery";
  const deliveryDesc =
    freeShipping && Number(freeShipping) > 0
      ? `Free fast shipping on all orders over ${formatPrice(freeShipping)} with live tracking`
      : "Free fast shipping with live order tracking straight to your door";

  // 2. Authenticity Guarantee
  const guaranteeTitle =
    helpSupport?.guarantee && helpSupport?.originalProduct
      ? `${helpSupport.guarantee} ${helpSupport.originalProduct}`
      : helpSupport?.originalProduct || helpSupport?.guarantee || "100% Authentic Guarantee";
  const guaranteeDesc = "Directly sourced and brand-certified original merchandise";

  // 3. Return Policy
  const returnDays = returnSetting?.returnWindowDays;
  const returnTitle = returnDays
    ? `${returnDays}-Day ${helpSupport?.returnSupport || "Easy Returns"}`
    : helpSupport?.returnSupport || "30-Day Easy Returns";
  const returnDesc = returnDays
    ? `Hassle-free ${returnDays}-day return requests with instant refunds`
    : "Hassle-free 1-click return requests with instant refunds";

  // 4. Priority Concierge / Support
  const supportTitle = phone ? "24/7 Priority Support" : "24/7 Priority Concierge";
  const supportDesc = phone
    ? `Dedicated expert support ready at ${phone} or WhatsApp`
    : email
    ? `Dedicated expert support ready to assist you at ${email}`
    : "Dedicated expert support ready to assist you anytime";

  const trustItems = [
    {
      icon: FiTruck,
      title: deliveryTitle,
      description: deliveryDesc,
      badge: freeShipping && Number(freeShipping) > 0 ? "Free Shipping" : "Fast & Free",
      href: undefined,
    },
    {
      icon: FiShield,
      title: guaranteeTitle,
      description: guaranteeDesc,
      badge: "Verified",
      href: undefined,
    },
    {
      icon: FiRotateCcw,
      title: returnTitle,
      description: returnDesc,
      badge: "No-Risk",
      href: undefined,
    },
    {
      icon: FiHeadphones,
      title: supportTitle,
      description: supportDesc,
      badge: "Always Live",
      href: phone ? `tel:${phone}` : email ? `mailto:${email}` : undefined,
    },
  ];

  return (
    <section className="relative z-10 mt-6 sm:mt-8 mb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100/80 shadow-xl shadow-gray-200/50 p-5 sm:p-7 lg:p-8 backdrop-blur-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            const content = (
              <div
                className={`flex items-start gap-4 group transition-all duration-300 ${
                  idx > 0 ? "pt-5 sm:pt-0 sm:pl-6 lg:pl-8" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-global-primary flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-global-primary group-hover:text-white group-hover:scale-105 group-hover:shadow-md group-hover:shadow-amber-500/20">
                  <Icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-[-4deg]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-snug group-hover:text-global-primary transition-colors">
                      {item.title}
                    </h4>
                    {item.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );

            return item.href ? (
              <a
                key={idx}
                href={item.href}
                className="block hover:no-underline"
              >
                {content}
              </a>
            ) : (
              <div key={idx}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

