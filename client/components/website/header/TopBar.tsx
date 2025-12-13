import { selectGlobal } from "@/redux/features/global/globalSlice";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { HiPhone, HiMail } from "react-icons/hi";
import { RiUserLine, RiLoginBoxLine } from "react-icons/ri";

export default function TopBar() {
  const global = useSelector(selectGlobal);
  const setting = global?.setting?.headerOption?.leftText || "";
  const session = useSession();

  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white text-xs py-2.5 font-global-secondary-fontfamily tracking-wide overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
      
      <div className="container relative flex flex-col sm:flex-row justify-between items-center mx-auto px-4 py-1.5 sm:py-0 font-global-secondary-fontfamily z-10">
        {/* Left Section */}
        <div className="text-[11px] font-medium tracking-wide flex gap-4 sm:gap-6 items-center text-gray-300">
          {/* Welcome Message */}
          <span className="opacity-90 hover:opacity-100 transition-opacity cursor-default hidden sm:flex items-center gap-2">
            <span className="inline-block w-1 h-1 rounded-full bg-global-primary animate-pulse"></span>
            {setting || "Welcome to our store!"}
          </span>
          
          {/* Phone Number */}
          {global.setting?.phone && (
            <a 
              href={`tel:${global.setting?.phone}`} 
              className="hover:text-white transition-all duration-300 flex items-center gap-2 group"
            >
              <div className="p-1.5 rounded-full bg-green-500/20 border border-green-500/30 group-hover:bg-green-500/30 transition-all duration-300">
                <HiPhone className="w-3 h-3 text-green-400" />
              </div>
              <span className="text-gray-300 group-hover:text-white transition-colors">
                {global.setting?.phone}
              </span>
            </a>
          )}
          
          {/* Email (if available) */}
          {global.setting?.email && (
            <a 
              href={`mailto:${global.setting?.email}`}
              className="hover:text-white transition-all duration-300 hidden lg:flex items-center gap-2 group"
            >
              <div className="p-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 group-hover:bg-blue-500/30 transition-all duration-300">
                <HiMail className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-gray-300 group-hover:text-white transition-colors">
                {global.setting?.email}
              </span>
            </a>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-5 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-gray-300 mt-2 sm:mt-0">
          {/* Navigation Links */}
          

          <Link 
            href="/profile?tab=my_account" 
            className="hover:text-white transition-all duration-300 flex items-center gap-1.5 group"
          >
            <RiUserLine className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>My Account</span>
          </Link>

          {/* Auth Buttons */}
          {session.status === "unauthenticated" && (
            <div className="flex items-center gap-3 border-l border-gray-700 pl-3 ml-1">
              <Link 
                href="/login" 
                className="flex gap-1.5 items-center hover:text-white transition-all duration-300 group"
              >
                <RiLoginBoxLine className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Login</span>
              </Link>
              
              <Link 
                href="/register" 
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 font-semibold"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
