import { selectGlobal } from "@/redux/features/global/globalSlice";
import { Divider } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HiMail, HiPhone } from "react-icons/hi";
import { RiLoginBoxLine, RiUserLine } from "react-icons/ri";
import { useSelector } from "react-redux";

export default function TopBar() {
  const global = useSelector(selectGlobal);
  const setting = global?.setting?.headerOption?.leftText || "";
  const session = useSession();

  return (
    <>
      <div className="relative text-xs py-2 font-global-secondary-fontfamily tracking-wide overflow-hidden" style={{ backgroundColor: 'var(--topbar-bg)', color: 'var(--topbar-text)' }}>
        {/* Decorative gradient overlay */}
        <div className="container relative flex flex-col sm:flex-row justify-between items-center mx-auto px-4 py-1.5 sm:py-0 font-global-secondary-fontfamily z-10">
          {/* Left Section */}
          <div className="text-[11px] font-medium tracking-wide flex gap-4 sm:gap-6 items-center opacity-90">
            {/* Welcome Message */}
            <span className="hover:opacity-100 transition-opacity cursor-default hidden sm:flex items-center gap-2">
              <span className="inline-block w-1 h-1 rounded-full bg-global-hover animate-pulse"></span>
              {setting || "Welcome to our store!"}
            </span>

            {/* Phone Number */}
            {global.setting?.phone && (
              <a
                href={`tel:${global.setting?.phone}`}
                className="hover:text-white transition-all duration-300 flex items-center gap-2 group"
              >
                <div className="p-1.5 rounded-full bg-white/10 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <HiPhone className="w-3 h-3 text-global-hover" />
                </div>
                <span className="opacity-90 group-hover:opacity-100 transition-colors">
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
                <div className="p-1.5 rounded-full bg-white/10 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <HiMail className="w-3 h-3 text-global-hover" />
                </div>
                <span className="opacity-90 group-hover:opacity-100 transition-colors">
                  {global.setting?.email}
                </span>
              </a>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-5 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase opacity-90 mt-2 sm:mt-0">
            {/* Navigation Links */}



            {/* Auth Buttons */}
            {session.status === "authenticated" ? <Link
              href="/profile?tab=my_account"
              className="hover:text-white transition-all duration-300 flex items-center gap-1.5 group"
            >
              <RiUserLine className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>My Account</span>
            </Link>
              : (
                <div className="flex items-center gap-3  border-gray-700 pl-3 ml-1">
                  <Link
                    href="/login"
                    className="flex gap-1.5 items-center hover:text-white transition-all duration-300 group"
                  >
                    <RiLoginBoxLine className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>Login</span>
                  </Link>

                  <Link
                    href="/register"
                    className="px-3 py-1.5  bg-global-hover hover:bg-global-hover text-white transition-all duration-300 font-semibold"
                  >
                    Sign up
                  </Link>
                </div>
              )}
          </div>
        </div>


      </div>
      <Divider className="!m-0 !p-0" />
    </>
  );
}
