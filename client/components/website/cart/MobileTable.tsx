import Image from "next/image";
import React from "react";
import { TiDeleteOutline } from "react-icons/ti";

export default function MobileTable() {
  return (
    <div className="flex flex-col md:hidden">
      {[{}, {}, {}, {}].map((item, idx) => (
        <div
          className={`grid grid-cols-2 gap-4 pb-1 items-center border p-2 ${
            (idx % 2) === 0 ? " bg-white" : "bg-bioxin-accent"
          }`}
          key={idx}
        >
          <Image
            src="/logo.png"
            alt="logo"
            loading="lazy"
            width={100}
            height={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="me-2"
          />
          <div className="place-self-end self-start p-1">
            <TiDeleteOutline size={22} className="cursor-pointer text-gray-500" />
          </div>

          <div className="text-bioxin-p"> Product: </div>
          <div className="place-self-end text-bioxin-p">
            Kiki Baby Wet Wipes{" "}
          </div>

          <div className="text-bioxin-p"> Price: </div>
          <div className="place-self-end text-bioxin-p">30 </div>

          <div className="text-bioxin-p"> Quantity: </div>
          <div className="place-self-end">
            <div className="flex items-center justify-center space-x-2">
              <button className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded">
                -
              </button>
              <span>1</span>
              <button className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded">
                +
              </button>
            </div>
          </div>

          <div className="text-bioxin-p font-bold"> Subtotal: </div>
          <div className="place-self-end  text-bioxin-p font-bold">3612</div>
        </div>
      ))}
    </div>
  );
}
