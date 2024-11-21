import { Rate } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaRegHeart } from "react-icons/fa";
interface CardItems {
  title: string;
  thumbnail: string;
  price: string | number;
  rating: string;
  id: string | number;
}

export default function Card({ item }: { item: CardItems }) {
  return (
    <>
      <div className="relative group">
        <Link href={`/product/${item.id}`}>
          <Image
            src={item.thumbnail}
            alt={item.title}
            loading="lazy"
            width={800}
            height={800}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer bg-fixed flex justify-end items-start">
            <Image
              src={item.thumbnail}
              alt={item.title}
              loading="lazy"
              width={800}
              height={800}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="relative"
            />
            <button className="mt-4 mr-3 p-2 absolute z-10 bg-white text-black  rounded-full transform translate-x-10 group-hover:translate-x-0 transition duration-500">
              <FaRegHeart size={22} />
            </button>
          </div>
        </Link>
      </div>
      <div className="grid grid-rows-[auto_1fr_auto] h-full">
        <div className="py-4">
          <code>৳{(+item.price || 0).toFixed(2)}</code>
          <p className="font-semibold py-1">
            <Link
              href={`/product/${item.id}`}
              className="text-black hover:underline"
            >
              {item.title}
            </Link>
          </p>
          <Rate allowHalf value={+item.rating} />
        </div>
        <button
          className="self-end w-full"
          onClick={() => console.log("Add To Cart")}
        >
          Add To Cart
        </button>
      </div>
    </>
  );
}
