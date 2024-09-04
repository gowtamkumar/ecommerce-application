import Link from "next/link";
import React from "react";

export default function ThirdWeight() {
  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold uppercase">Compnay</h2>
      <ul className="font-medium">
        <li className="mb-4">
          <Link href="#" className="hover:underline">
            Privacy Policy
          </Link>
        </li>
        <li className="mb-4">
          <Link href="#" className="hover:underline">
            Licensing
          </Link>
        </li>
        <li className="mb-4">
          <Link href="#" className="hover:underline">
            Terms &amp; Conditions
          </Link>
        </li>
      </ul>
    </div>
  );
}
