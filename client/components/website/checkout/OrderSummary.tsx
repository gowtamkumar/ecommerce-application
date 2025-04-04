"use client";
import appConfig from "@/appConfig";
import { getCartLists, incrementDecrementCart } from "@/lib/apis/cart";
import {
  decrementCart,
  incrementCart,
  removeCart,
  replaceCart,
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

  async function cartIncrementDecrementHandle(value: any) {
    const incrementCartRes = await incrementDecrementCart(value);
    if (incrementCartRes.success) {
      const getCartList = await getCartLists();
      dispatch(replaceCart(getCartList.data));
    }
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
        {cart?.carts?.cartList?.map((item: any, idx: number) => {
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
                    ? `${appConfig.baseApiUrl}/uploads/${item.thumbnailImage}`
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
                    onClick={() =>
                      cartIncrementDecrementHandle({
                        type: "Decrement",
                        id: item.id,
                      })
                    }
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
                    onClick={() =>
                      cartIncrementDecrementHandle({
                        type: "Increment",
                        id: item.id,
                      })
                    }
                    disabled={stockCheckingAndPurchaseLimit(item)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mx-2 text-base font-semibold text-green-600">
                Price:
                <p className="text-gray-500 mb-1 text-md">
                  ৳{item.discountedUnitPrice}
                </p>
                {/* {item?.discountAmount && (
                  <div className="text-xs">
                    <span className="line-through text-gray-500">
                      ৳ {(+item.unitPrice).toFixed(2)}
                    </span>
                    <span className="text-red-600">
                      -{item.discountValue}
                      {item?.discountStrategy === "Percentage" ? "%" : "BDT"}
                    </span>
                  </div>
                )} */}
              </div>

              <div className="mx-2 text-base font-semibold text-green-600">
                Tax ৳{item.taxAmount}
              </div>
              <div className="mx-2 text-base font-semibold text-green-600">
                Discount Amount: ৳{item.totalDiscountAmount}
              </div>

              <div>
                <span>Subtotal: {+item.subTotal}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
