import Link from "next/link";

export default function ThirdWeight() {
  return (
    <div className="text-gray-300">
      <h2 className="mb-6 text-lg font-semibold uppercase">Compnay</h2>
      <ul className="font-medium">
        <li className="mb-4">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
        </li>
        <li className="mb-4">
          <Link href="#" className="hover:underline">
            Licensing
          </Link>
        </li>
        <li className="mb-4">
          <Link href="/terms-conditions" className="hover:underline">
            Terms &amp; Conditions
          </Link>
        </li>
      </ul>
    </div>
  );
}
