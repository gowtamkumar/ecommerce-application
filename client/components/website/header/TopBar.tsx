import { selectGlobal } from "@/redux/features/global/globalSlice";
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
    <div
      className="relative text-xs font-global-secondary-fontfamily tracking-wide"
      style={{ backgroundColor: "var(--topbar-bg)", color: "var(--topbar-text)" }}
    >
      <div className="container relative flex flex-col sm:flex-row justify-between items-center mx-auto px-4 py-2 z-10">
        <div className="text-[11px] font-medium tracking-wide flex gap-4 sm:gap-5 items-center opacity-90">
          <span className="hidden sm:inline">{setting || "Welcome to our store!"}</span>

          {global.setting?.phone && (
            <a
              href={`tel:${global.setting?.phone}`}
              className="hover:opacity-100 opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <HiPhone className="w-3 h-3" />
              <span>{global.setting?.phone}</span>
            </a>
          )}

          {global.setting?.email && (
            <a
              href={`mailto:${global.setting?.email}`}
              className="hover:opacity-100 opacity-90 transition-opacity hidden lg:flex items-center gap-1.5"
            >
              <HiMail className="w-3 h-3" />
              <span>{global.setting?.email}</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase mt-1.5 sm:mt-0">
          {session.status === "authenticated" ? (
            <Link
              href="/profile?tab=my_account"
              className="hover:opacity-100 opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <RiUserLine className="w-3.5 h-3.5" />
              <span>My Account</span>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="flex gap-1.5 items-center hover:opacity-100 opacity-90 transition-opacity"
              >
                <RiLoginBoxLine className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>

              <Link
                href="/register"
                className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 transition-colors font-semibold"
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
