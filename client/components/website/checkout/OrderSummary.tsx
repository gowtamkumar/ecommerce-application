"use client";
import appConfig from "@/appConfig";
import {
  decrementCart,
  incrementCart,
  removeCart,
  selectCart,
} from "@/redux/features/cart/cartSlice";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { Popconfirm } from "antd";
import Image from "next/image";
import React from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

export default function OrderSummary() {
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const cart = useSelector(selectCart);

  async function removeItemCart(id: string) {
    try {
      dispatch(setLoading({ remove: true }));
      dispatch(removeCart({ id }));
      setTimeout(async () => {
        dispatch(setLoading({ remove: false }));
      }, 1000);
    } catch (err) {
      console.log("err");
    }
  }

  function incrementCartHandle(value: any) {
    dispatch(incrementCart(value));
  }

  function decrementCartHandle(value: any) {
    dispatch(decrementCart(value));
  }

  function stockCheckingAndPurchaseLimit(value: any) {
    let checkStock = value?.stockQty;

    if (value.limitPurchaseQty && value.limitPurchaseQty <= value.qty) {
      return true;
    }
    if (checkStock <= value.qty) {
      return true;
    }
    return false;
  }

  return (
    <>
      <div className="p-4 border-b">
        <h2 className="text-2xl font-semibold">Order summary</h2>
      </div>
      <div>
        {cart.carts.map((item: any, idx: number) => {
          return (
            <div key={idx} className="p-3 flex border-b">
              <div>
                <Popconfirm
                  title="Delete Order item"
                  description="Are you sure to delete this Order item?"
                  onConfirm={() => removeItemCart(item.id)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ loading: global.loading.remove }}
                  placement="left"
                >
                  <div className="cursor-pointer">
                    <MdDelete size={20} />
                  </div>
                </Popconfirm>
              </div>
              <Image
                src={
                  item.thumbnailImage
                    ? `${appConfig.apiUrl}/uploads/${item.thumbnailImage}`
                    : "/pos_software.png"
                }
                width={100}
                height={100}
                alt={item.name}
                className="w-24 h-24 object-cover"
              />
              <div className="ml-4 flex-grow">
                <h3 className="text-base font-semibold">{item?.name}</h3>
                {item.size?.name && (
                  <span className="mx-2">Size: {item.size?.name}</span>
                )}

                {item?.color?.name && <span>Color: {item?.color?.name}</span>}
              </div>
              <div className="lg:flex items-center">
                <div className="flex">
                  <button
                    className="px-2 py-1 bg-gray-200"
                    onClick={() => decrementCartHandle(item)}
                    disabled={item?.qty <= 1}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="mx-2 w-10 text-center border"
                    value={item.qty}
                    readOnly
                  />
                  <button
                    className="px-2 py-1 bg-gray-200"
                    onClick={() => incrementCartHandle(item)}
                    disabled={stockCheckingAndPurchaseLimit(item)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mx-2 text-base font-semibold text-green-600">
                Price: ৳{(+item.unitPrice).toFixed(2)}
              </div>

              <div className="mx-2 text-base font-semibold text-green-600">
                tax ৳{(+item.taxAmount * +item.qty).toFixed(2)}
              </div>
              <div className="mx-2 text-base font-semibold text-green-600">
                discountAmount: ৳{(+item.discountAmount * +item.qty).toFixed(2)}
              </div>

              <div>
                <span>Subtotal: {+item.unitPrice * +item.qty}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
