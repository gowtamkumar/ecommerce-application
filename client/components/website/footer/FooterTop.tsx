"use client";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import React from "react";
import { CiGift } from "react-icons/ci";
import { FaTruckPickup } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { MdOutlinePayment } from "react-icons/md";
import { useSelector } from "react-redux";

export default function FooterTop() {
  const global = useSelector(selectGlobal);
  const setting = global?.setting?.helpSupport || {};

  const features = [
    {
      icon: <FaTruckPickup size={36} />,
      text: setting?.cashDelivery || "Fast Delivery",
      gradient: "from-global-primary/30 to-global-primary/10"
    },
    {
      icon: <IoIosCall size={36} />,
      text: setting?.returnSupport || "24/7 Support",
      gradient: "from-global-primary/20 to-global-primary/5"
    },
    {
      icon: <MdOutlinePayment size={36} />,
      text: setting?.originalProduct || "Secure Payment",
      gradient: "from-global-primary/25 to-global-primary/10"
    },
    {
      icon: <CiGift size={36} />,
      text: setting?.guarantee || "Gift Cards",
      gradient: "from-global-primary/30 to-global-primary/15"
    }
  ];

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl transition-all duration-300 hover:scale-105 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 cursor-pointer"
            style={{
              '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to, rgba(255, 255, 255, 0))`
            } as React.CSSProperties}
          >
            {/* Background gradient on hover */}
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>

            {/* Icon with glow effect */}
            <div className="relative text-global-primary group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_15px_var(--global-primary-alpha-20)]">
              {feature.icon}
            </div>

            {/* Text */}
            <span className="text-sm font-medium text-global-footer-text/70 group-hover:text-global-footer-text transition-colors duration-300 text-center">
              {feature.text}
            </span>

            {/* Decorative border */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-global-footer-text/40 to-transparent group-hover:w-3/4 transition-all duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
