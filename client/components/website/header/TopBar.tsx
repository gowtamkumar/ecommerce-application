import { selectGlobal } from "@/redux/features/global/globalSlice";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { BiUser } from "react-icons/bi";
import { useSelector } from "react-redux";

export default function TopBar() {
  const global = useSelector(selectGlobal);
  const setting = global?.setting?.headerOption?.leftText || "";
  const session = useSession();

  return (
    <div className="container flex justify-between items-center mx-auto px-4">
      <div className="text-[11px] md:text-xs flex gap-4 items-center opacity-80 hover:opacity-100 transition-opacity">
        <span>{setting}</span>
        <a href={`tel:${global.setting?.phone}`} className="hover:text-gray-300 transition-colors">
          {global.setting?.phone}
        </a>
      </div>

      <div className="flex gap-6 text-[11px] md:text-xs font-medium tracking-wide">
        <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
        <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
        <Link href="/profile?tab=my_account" className="hover:text-gray-300 transition-colors">My Account</Link>
        {session.status === "unauthenticated" && (
          <div className="flex gap-4 border-l border-gray-700 pl-4 ml-2">
            <Link href="/login" className="flex gap-1 items-center hover:text-gray-300 transition-colors">
              Login
            </Link>
            <Link href="/register" className="hover:text-gray-300 transition-colors">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
