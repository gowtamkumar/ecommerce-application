import Link from "next/link";

export default function SecondWeight() {
  return (
    <div className="text-gray-300">
      <h2 className="mb-6 text-lg font-semibold uppercase">Help center</h2>
      <ul className=" dark:text-gray-400 font-medium">
        <li className="mb-4">
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
        </li>
        <li className="mb-4">
          <Link href="/terms-conditions" className="hover:underline">
            Term of SErvice
          </Link>
        </li>
        <li className="mb-4">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
        </li>

      </ul>
    </div>
  );
}
