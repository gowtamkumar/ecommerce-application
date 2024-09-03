import Link from "next/link";
import React from "react";

export default function SecondWeight() {
  return (
    <div>
      <h2 className="mb-6 text-sm font-semibold uppercase">Help center</h2>
      <ul className=" dark:text-gray-400 font-medium">
        <li className="mb-4">
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
        </li>
        <li className="mb-4">
          <Link href="#" className="hover:underline">
            Term of SErvice
          </Link>
        </li>
        <li className="mb-4">
          <Link href="#" className="hover:underline">
            Privacy Policy
          </Link>
        </li>
        <li className="mb-4">
          <Link href="#" className="hover:underline">
            Return
          </Link>
        </li>
      </ul>
    </div>
  );
}
