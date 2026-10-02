"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { trackPurchase } from "@/lib/analytics/metaPixel";
import Link from "next/link";
import { useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiFileText,
  FiPhone,
  FiTruck,
} from "react-icons/fi";

interface LandingOrderSuccessProps {
  orderData: {
    orderId: number;
    trackingNo: string;
    grandTotal: number;
    customerName: string;
    phoneNo: string;
    paymentMethod: string;
    paymentUrl?: string | null;
  };
  productName: string;
  storePhone?: string;
  whatsapp?: string;
}

export default function LandingOrderSuccess({
  orderData,
  productName,
  storePhone = "",
  whatsapp = "",
}: LandingOrderSuccessProps) {
  const { formatPrice } = useCurrency();

  // Trigger Meta Pixel Purchase Event on successful order render
  useEffect(() => {
    trackPurchase({
      content_name: productName,
      content_ids: [orderData.orderId],
      value: Number(orderData.grandTotal),
      currency: "BDT",
      order_id: orderData.trackingNo || orderData.orderId,
    });
  }, [orderData, productName]);

  const cleanWhatsapp = (whatsapp || storePhone).replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `হ্যালো! আমি ${productName} পণ্যটির অর্ডার করেছি। আমার ট্র্যাকিং নম্বর: ${orderData.trackingNo}`,
  )}`;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
        <FiCheckCircle className="text-5xl animate-bounce" />
      </div>

      <div className="space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider">
          অর্ডার সম্পন্ন হয়েছে
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-950">
          ধন্যবাদ, {orderData.customerName}!
        </h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
          আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমাদের কাস্টমার কেয়ার টিম শীঘ্রই ফোন করে অর্ডারটি কনফার্ম করবে।
        </p>
      </div>

      {/* Tracking No Box */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-4 sm:p-5 space-y-2">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          অর্ডার ট্র্যাকিং নম্বর (Order Tracking No)
        </div>
        <div className="text-xl sm:text-2xl font-black font-mono text-global-primary tracking-wider">
          {orderData.trackingNo}
        </div>
        <p className="text-xs text-gray-500">
          এই ট্র্যাকিং নম্বরটি সংরক্ষণ করে রাখুন। ডেলিভারির সময় এটি প্রয়োজন হতে পারে।
        </p>
      </div>

      {/* Order Details Grid */}
      <div className="bg-gray-50 rounded-2xl p-4 text-xs sm:text-sm text-left divide-y divide-gray-200">
        <div className="py-2.5 flex justify-between">
          <span className="text-gray-500 font-medium">গ্রাহকের মোবাইল:</span>
          <span className="font-bold text-gray-900">{orderData.phoneNo}</span>
        </div>
        <div className="py-2.5 flex justify-between">
          <span className="text-gray-500 font-medium">পেমেন্ট মেথড:</span>
          <span className="font-bold text-gray-900">
            {orderData.paymentMethod === "SSLCOMMERZ" ? "অনলাইন পেমেন্ট" : "ক্যাশ অন ডেলিভারি (COD)"}
          </span>
        </div>
        <div className="py-2.5 flex justify-between">
          <span className="text-gray-500 font-medium">প্রদেয় সর্বমোট:</span>
          <span className="font-black text-global-primary text-base">
            {formatPrice(orderData.grandTotal)}
          </span>
        </div>
        <div className="py-2.5 flex justify-between">
          <span className="text-gray-500 font-medium">আনুমানিক ডেলিভারি সময়:</span>
          <span className="font-bold text-emerald-700 flex items-center gap-1">
            <FiTruck className="text-sm" /> ২-৩ কার্যদিবস
          </span>
        </div>
      </div>

      {/* Online Payment Link if chosen */}
      {orderData.paymentUrl && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2 text-center">
          <p className="text-xs text-blue-900 font-semibold">
            অনলাইন পেমেন্ট সম্পন্ন করতে নিচের বাটনে ক্লিক করুন:
          </p>
          <a
            href={orderData.paymentUrl}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
          >
            <FiCreditCard className="text-base" />
            <span>এখনই পেমেন্ট করুন</span>
          </a>
        </div>
      )}

      {/* Direct WhatsApp Call-to-action */}
      {cleanWhatsapp && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <FaWhatsapp className="text-xl" />
          <span>হোয়াটসঅ্যাপে যোগাযোগ করুন</span>
        </a>
      )}

      {/* Return to Home / Track */}
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <span>অন্যান্য প্রোডাক্ট দেখুন</span>
          <FiArrowRight className="text-xs" />
        </Link>
      </div>
    </div>
  );
}
