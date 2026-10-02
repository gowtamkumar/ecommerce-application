"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { useEffect, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";

interface StickyMobileCTAProps {
  price: number;
  quantity: number;
  onOrderClick: () => void;
}

export default function StickyMobileCTA({
  price,
  quantity,
  onOrderClick,
}: StickyMobileCTAProps) {
  const { formatPrice } = useCurrency();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past initial hero section (250px)
      if (window.scrollY > 250) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div>
          <div className="text-[11px] text-gray-500 font-bold">
            {quantity > 1 ? `${quantity}টি পিস (সর্বমোট):` : "মূল্য:"}
          </div>
          <div className="text-xl font-black text-global-primary leading-tight">
            {formatPrice(price * quantity)}
          </div>
        </div>

        <button
          onClick={onOrderClick}
          className="flex-1 py-3 px-5 rounded-2xl bg-global-primary hover:bg-global-hover active:scale-95 text-white font-black text-sm shadow-lg shadow-global-primary/30 flex items-center justify-center gap-2 cursor-pointer transition-all animate-pulse"
        >
          <FiShoppingBag className="text-lg" />
          <span>অর্ডার করতে ক্লিক করুন</span>
        </button>
      </div>
    </div>
  );
}
