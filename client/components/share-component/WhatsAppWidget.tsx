"use client";

import { selectGlobal } from "@/redux/features/global/globalSlice";
import Image from "next/image";
import { useSelector } from "react-redux";

const WhatsAppWidget = () => {
  const global = useSelector(selectGlobal);
  const setting = global?.setting?.whatsAppWidget || {};


  return (
    <div className="z-50 fixed cursor-pointer bottom-5 right-10 bg-gray-700 rounded-full shadow-lg hover:bg-gray-900 transition-all">
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
