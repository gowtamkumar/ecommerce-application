"use client";
import appConfig from "@/appConfig";
import { cartCalculationFun, CartResult } from "@/lib/utils/cartCalculationFun";
import { removeCart, selectCart } from "@/redux/features/cart/cartSlice";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";

export default function ViewCart() {
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();

  const handleRemove = (item: any) => {
    dispatch(removeCart(item));
  };

  const [cartResult, setCartResult] = useState<CartResult>({
    total: 0,
    totalQty: 0,
    totalTax: 0,
    totalDiscount: 0,
    subTotal: 0,
  });

  useEffect(() => {
    async function calculateCart() {
      const result = await cartCalculationFun(cart.carts);
      setCartResult(result);
    }

    calculateCart();
  }, [cart.carts]);

  // let total = 0;

  return (
    <div className="absolute w-96 z-10 right-0 mt-3 p-4 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-2 transform transition-all duration-300 ease-in-out">
      <div className="flex flex-col w-96 h-[50vh] gap-6 overflow-y-scroll">
        {(cart.carts || []).map((item: any) => {
          // total +=
          //   (+item.unitPrice * +item.qty) - (+item.discountAmount * +item.qty)
          return (
            <div
              key={item.id}
              className="text-black flex gap-4 items-center justify-between py-3 border-b"
            >
              <div>
                <Image
                  src={
                    item.images
                      ? `${appConfig.apiUrl}/uploads/${item.images[0]}`
                      : "/pos_software.png"
                  }
                  alt={item.name}
                  width={100}
                  height={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="flex justify-between">
                <div>
                  <p>{item.name}</p>
                  <p>
                    {item.qty} × ৳
                    {(
                      +item.unitPrice * +item.qty -
                      +item.discountAmount * +item.qty
                    ).toFixed(2)}
                  </p>
                </div>
                <div className="px-5">
                  <TiDeleteOutline
                    size={22}
                    className="cursor-pointer text-gray-500"
                    onClick={() => handleRemove(item)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between py-4">
        <p>Subtotal:</p>
        <p className="font-bold text-2xl">
          ৳ {(+cartResult.total - +cartResult.totalDiscount).toFixed(2)}
        </p>
      </div>

      <Button className=" w-full">
        <Link href="/checkout">Checkout</Link>
      </Button>
    </div>
  );
}
