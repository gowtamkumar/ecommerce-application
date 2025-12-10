import { selectGlobal } from "@/redux/features/global/globalSlice";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function TopBar() {
  const global = useSelector(selectGlobal);
  const setting = global?.setting?.headerOption?.leftText || "";
  const session = useSession();

  return (
    <div className="container flex flex-col sm:flex-row justify-between items-center mx-auto px-4 py-2 sm:py-0 font-global-secondary-fontfamily">
      <div className="text-[11px] font-medium tracking-wide flex gap-4 sm:gap-6 items-center text-gray-400">
        <span className="opacity-90 hover:opacity-100 transition-opacity cursor-default hidden sm:block">{setting}</span>
        {global.setting?.phone && (
          <a href={`tel:${global.setting?.phone}`} className="hover:text-white transition-colors flex items-center gap-2 group">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:scale-125 transition-transform" />
            <span className="text-gray-300 group-hover:text-white transition-colors">{global.setting?.phone}</span>
          </a>
        )}
      </div>

      <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-gray-400 mt-2 sm:mt-0">
        <Link href="/about" className="hover:text-white transition-colors">About</Link>
        <span className="w-0.5 h-3 bg-gray-800" />
        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        <span className="w-0.5 h-3 bg-gray-800" />
        <Link href="/profile?tab=my_account" className="hover:text-white transition-colors">My Account</Link>

        {session.status === "unauthenticated" && (
          <div className="flex items-center gap-4 border-l border-gray-800 pl-4 ml-2">
            <Link href="/login" className="flex gap-1 items-center hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/register" className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
