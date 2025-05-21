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
    <div className="container flex justify-between items-center mx-auto">
      <div className="text-sm flex gap-1 items-center p-2">
        <span> {setting}</span>
        <a href="tel:+01767-163576" className="text-blue-500">
          +{global.setting.phone}
        </a>
      </div>

      <div className="flex gap-5 text-sm">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact Us</Link>
        <Link href="/profile?tab=my_account">My Account</Link>
        {session.status === "unauthenticated" && (
          <>
            <Link href="/login" className="flex gap-1 items-center">
              <BiUser /> Login
            </Link>
            <Link href="/register">
              <span className="text-sm">Sign up</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
