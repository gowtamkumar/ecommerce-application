import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TiDeleteOutline } from "react-icons/ti";

export default function ViewCart() {
  return (
    <div className="absolute w-96 z-10 right-0 mt-3 p-4 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-2 transform transition-all duration-300 ease-in-out">
      <div className="flex flex-col w-96 h-[50vh] gap-6 overflow-y-scroll">
        {[{}, {}, {}, {}, {}, {}].map((item, idx) => (
          <div
            className="text-black flex gap-4 justify-between py-3 border-b"
            key={idx}
          >
            <div>
              <Image
                src="/logo.png"
                alt={"logo"}
                loading="lazy"
                width={100}
                height={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-bioxin-p">
                  KiKi Baby Wet Wipes KiKi Baby Wet Wipes
                </p>
                <p className="text-bioxin-p">1 × ৳ 850.00</p>
              </div>
              <div className="px-5">
                <TiDeleteOutline
                  size={22}
                  className="cursor-pointer text-gray-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between py-4">
        <p className="text-bioxin-p">Subtotal:</p>
        <p className="font-bold text-2xl">৳ 850.00</p>
      </div>

      <div className="flex flex-col gap-2">
        <button className="btn-primary-bioxin w-full">
          <Link href="/cart">View Cart</Link>
        </button>

        <button className="btn-primary-bioxin w-full">
          <Link href="/checkout">Checkout</Link>
        </button>
      </div>
    </div>
  );
}
