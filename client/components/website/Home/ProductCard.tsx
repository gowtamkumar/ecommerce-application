/* eslint-disable @next/next/no-async-client-component */
"use client";
import { addCart } from "@/redux/features/cart/cartSlice";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

const ProductCard = ({ products }: any) => {
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);


  return (
    <div
      className={`grid ${
        global.productView ? "grid-cols-1" : "grid-cols-4"
      } gap-4`}
    >
      {products?.data?.map((item: any, idx: any) => (
        <div className="bg-white rounded-lg shadow-md p-4" key={item.id}>
          <a href={`products/${item.id}`}>
            <Image
              width={150}
              height={150}
              src="/product-01.jpg"
              alt="Category Image"
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
            <p className="text-gray-500 mb-2">${item.name}</p>
          </a>
          <button
            onClick={() => dispatch(addCart(item))}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
