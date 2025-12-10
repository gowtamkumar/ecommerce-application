import dynamic from "next/dynamic";
import FooterTop from "./FooterTop";
const FourWeight = dynamic(() => import("../weight/FourWeight"));
const ThirdWeight = dynamic(() => import("../weight/ThirdWeight"));
const SecondWeight = dynamic(() => import("../weight/SecondWeight"));
const FirstWeight = dynamic(() => import("../weight/FirstWeight"));
const SocialIcon = dynamic(() => import("./SocialIcon"));

export default function WebFooter() {
  return (
    <footer className="bg-[#050505] text-gray-300 font-sans">
      {/* Top Features */}
      <div className="border-b border-gray-900">
        <div className="container mx-auto">
          <FooterTop />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <FirstWeight />
          </div>
          <div>
            <SecondWeight />
          </div>
          <div>
            <ThirdWeight />
          </div>
          <div>
            <FourWeight />
          </div>
        </div>
      </div>

      {/* Social Icons & Newsletter */}
      <div className="bg-white py-8 border-t border-gray-900">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-black font-semibold mb-2">Connect with us</h3>
            <SocialIcon />
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400">Stay updated with our latest offers</p>
          </div>
        </div>
      </div>

      {/* Copyright & Payments */}
      <div className="bg-white py-6 border-t border-gray-900">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
          <div className="flex gap-3">
            {/* Payment Icons Placeholders */}
            <div className="w-10 h-6 bg-gray-900 rounded flex items-center justify-center text-[8px] text-gray-400">VISA</div>
            <div className="w-10 h-6 bg-gray-900 rounded flex items-center justify-center text-[8px] text-gray-400">MC</div>
            <div className="w-10 h-6 bg-gray-900 rounded flex items-center justify-center text-[8px] text-gray-400">PAYPAL</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
