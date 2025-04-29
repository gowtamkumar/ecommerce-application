import { Button } from "antd";
import Link from "next/link";
import { BiUser } from "react-icons/bi";

export default function TopBar() {
  return (
    <div className="container flex justify-between items-center mx-auto">
      <div className="text-sm flex gap-1">
        <p> We are available 24/7, Need help?</p>
        <a href="tel:+01767-163576" className="text-blue-500">
          +01767-163576
        </a>
      </div>

      <div className="flex gap-5 text-sm">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact Us</Link>
        <Link href="/profile?tab=my_account">My Account</Link>
        <Link href="/login" className="flex gap-1 items-center">
          <BiUser /> Login
        </Link>
        <Link href="/register">
          <span className="text-sm">Sign up</span>
        </Link>
      </div>
    </div>
  );
}
