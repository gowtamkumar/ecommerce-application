"use client";

import { selectGlobal } from "@/redux/features/global/globalSlice";
import Image from "next/image";
import { useSelector } from "react-redux";

const WhatsAppWidget = () => {
  const global = useSelector(selectGlobal);
  const setting = global?.setting?.whatsAppWidget || {};


  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={`https://wa.me/${setting.phone}?text=${encodeURIComponent(
          setting.message
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <Image
          src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
          alt="WhatsApp"
          width={32}
          height={32}
        />
      </a>
    </div>
  );
};

export default WhatsAppWidget;
