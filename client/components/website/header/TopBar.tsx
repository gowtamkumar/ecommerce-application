import { Button } from "antd";
import Link from "next/link";
import { BiUser } from "react-icons/bi";

export default function TopBar() {
  return (
    <div className="container flex justify-between items-center mx-auto">
      <p className="text-sm">
        We are available 24/7, Need help?{" "}
        <a href="tel:+965 505 31291">+965 505 31291</a>
      </p>

      <div className="flex gap-5 text-sm">
        <Link href="/about">About</Link>
        <Link href="/about">Contact Us</Link>
        <Link href="/profile?tab=my_account">My Account</Link>
        <Link href="/login" className="flex gap-1 items-center">
          <BiUser /> Login
        </Link>
      </div>
    </div>
  );
}
