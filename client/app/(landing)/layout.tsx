import appConfig from "@/appConfig";
import { getSettings } from "@/lib/apis/setting";
import { getImageUrl } from "@/lib/utils/imageUrl";
import Image from "next/image";
import Link from "next/link";
import { FiPhoneCall, FiShield, FiShoppingBag, FiTruck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settingRes = await getSettings();
  const setting = settingRes?.data || {};
  const siteName = setting?.siteName || "Exclusive Collection";
  const phone = setting?.phone || "";
  const whatsapp = setting?.whatsapp || phone;
  const logoUrl = setting?.logo ? getImageUrl(setting.logo) : null;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-global-primary selection:text-white">
      {/* Top Scarcity / Trust Announcement Bar */}
      <div className="bg-global-primary text-white py-2 px-4 text-center text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 sm:gap-6 flex-wrap">
          <span className="flex items-center gap-1.5">
            <FiTruck className="text-sm shrink-0" /> সারা দেশে ক্যাশ অন ডেলিভারি
          </span>
          <span className="hidden sm:inline opacity-70">•</span>
          <span className="flex items-center gap-1.5">
            <FiShield className="text-sm shrink-0" /> ১০০% অরিজিনাল ও কালার গ্যারান্টি
          </span>
          <span className="hidden md:inline opacity-70">•</span>
          <span className="hidden md:flex items-center gap-1.5">
            পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করুন
          </span>
        </div>
      </div>

      {/* Minimal Distraction-Free Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo or Brand Name */}
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <div className="relative h-10 sm:h-12 w-32 sm:w-40">
                <Image
                  src={logoUrl}
                  alt={siteName}
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            ) : (
              <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-950 font-serif">
                {siteName}
              </span>
            )}
          </Link>

          {/* Quick Actions (Hotline Call & Order Now button) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full border border-gray-200 text-gray-800 text-xs sm:text-sm font-bold hover:bg-gray-50 transition-colors shadow-2xs"
              >
                <FiPhoneCall className="text-emerald-600 text-base animate-bounce" />
                <span>{phone}</span>
              </a>
            )}

            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=Hello,%20I%20have%20an%20inquiry%20about%20your%20products`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs sm:text-sm font-bold hover:bg-emerald-100 transition-colors"
                title="Chat on WhatsApp"
              >
                <FaWhatsapp className="text-emerald-600 text-base" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}

            <a
              href="#order-form"
              className="flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-global-primary hover:bg-global-hover active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-global-primary/30 transition-all cursor-pointer"
            >
              <FiShoppingBag className="text-sm" />
              <span>অর্ডার করুন</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Landing Page Content */}
      <main className="w-full">{children}</main>

      {/* Minimal Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 border-t border-gray-800 text-center text-xs sm:text-sm">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-white font-bold text-base sm:text-lg">
            {siteName}
          </div>
          <p className="max-w-md mx-auto text-gray-400 text-xs sm:text-sm leading-relaxed">
            আমরা দিচ্ছি সর্বোচ্চ মানের প্রিমিয়াম ফেব্রিক ও এক্সক্লুসিভ কালেকশন। যেকোনো প্রয়োজনে আমাদের হটলাইনে যোগাযোগ করুন।
          </p>
          {phone && (
            <div className="text-gray-300 font-medium">
              হটলাইন: <a href={`tel:${phone}`} className="text-global-primary hover:underline">{phone}</a>
            </div>
          )}
          <div className="pt-4 border-t border-gray-800 text-gray-500 text-xs">
            © {new Date().getFullYear()} {siteName}. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
