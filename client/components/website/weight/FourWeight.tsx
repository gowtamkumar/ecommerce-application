import dynamic from "next/dynamic";
import Subscribe from "../footer/Subscribe";

export default function FourWeight() {
  return (
    <div className="relative z-10 max-w-3xl mx-auto text-gray-300">
      <h2 className="text-3xl font-bold mb-4">Stay in the loop!</h2>
      <p className="text-base md:text-lg mb-8 text-gray-200">
        Subscribe to our newsletter and never miss exclusive offers, updates,
        and more.
      </p>
      <Subscribe />
    </div>
  );
}
