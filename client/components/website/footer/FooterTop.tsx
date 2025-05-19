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
  return (
    <div className="border-b-[1] border-gray-300">
      <div className="grid md:grid-cols-4 text-center items-center justify-center py-6">
        <div className="md:border-r-2 flex items-center justify-center gap-1 text-gray-300">
          <FaTruckPickup size={30} />
          <span>{setting?.cashDelivery}</span>
        </div>
        <div className="md:border-r-2 flex items-center justify-center gap-1 text-gray-300">
          <IoIosCall size={30} />
          <span>{setting?.returnSupport}</span>
        </div>
        <div className="md:border-r-2 flex items-center justify-center gap-1 text-gray-300">
          <MdOutlinePayment size={30} />
          <span>{setting?.originalProduct}</span>
        </div>
        <div className="md:border-r-2 flex items-center justify-center gap-1 text-gray-300">
          <CiGift size={30} />
          <span>{setting?.guarantee}</span>
        </div>
      </div>
    </div>
  );
}
