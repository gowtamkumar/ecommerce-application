"use client";
import { selectCart } from "@/redux/features/cart/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

const ProductCard = ({ products }: any) => {
  // get products data

  const layout = useSelector(selectCart);
  console.log("🚀 ~ layout:", layout.carts);
  const dispatch = useDispatch();
  // console.log("🚀 ~ result:", result);
  return (
    <>
      {products.data?.map((item: any, idx: any) => (
        <div className="bg-white rounded-lg shadow-md p-4" key={item.id}>
          <Link href={`products/${idx}`}>
            <Image
              width={150}
              height={150}
              src="/product-01.jpg"
              alt="Category Image"
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
            <p className="text-gray-500 mb-2">${item.name}</p>
          </Link>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add to Cart
          </button>
        </div>
      ))}
    </>
  );
};

export default ProductCard;
