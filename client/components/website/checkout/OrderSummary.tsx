"use client";
import appConfig from "@/appConfig";
import {
  deleteCart,
  getCartLists,
  incrementDecrementCart,
} from "@/lib/apis/cart";
import { replaceCart, selectCart } from "@/redux/features/cart/cartSlice";
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
      const removeCartRes = await deleteCart(id);

      if (removeCartRes.success) {
        const getCartList = await getCartLists();
        dispatch(replaceCart(getCartList.data));
      }

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

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Image</th>
              <th className="p-3">Product</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Unit Price</th>
              <th className="p-3">Tax</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Subtotal</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart?.carts?.cartList?.map((item: any, idx: number) => (
              <tr key={idx} className="border-t">
                <td className="p-3">{idx + 1}</td>

                <td className="p-3">
                  <Image
                    src={
                      item.thumbnailImage
                        ? `${appConfig.baseApiUrl}/uploads/${item.thumbnailImage}`
                        : "/pos_software.png"
                    }
                    width={50}
                    height={50}
                    alt={item.name}
                    className="w-14 h-14 object-cover"
                  />
                </td>

                <td className="p-3">
                  <div className="font-semibold">{item?.name}</div>
                  {item?.size?.name && (
                    <div className="text-xs">Size: {item.size.name}</div>
                  )}
                  {item?.color?.name && (
                    <div className="text-xs">Color: {item.color.name}</div>
                  )}
                </td>

                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
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
                    <span className="w-8 text-center">{item.qty}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
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
                </td>

                <td className="p-3 text-green-600">
                  ৳ {item.discountedUnitPrice}
                </td>
                <td className="p-3 text-green-600">৳ {item.taxAmount}</td>
                <td className="p-3 text-green-600">
                  ৳ {item.totalDiscountAmount}
                </td>
                <td className="p-3 font-semibold">৳ {+item.subTotal}</td>

                <td className="p-3">
                  <Popconfirm
                    title="Delete Order item"
                    description="Are you sure to delete this Order item?"
                    onConfirm={() => removeItemCart(item.id)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ loading: global.loading.remove }}
                    placement="left"
                  >
                    <button className="text-red-600 hover:text-red-800 cursor-pointer">
                      <MdDelete size={20} />
                    </button>
                  </Popconfirm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="p-4 border-b">
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
      </div> */}
    </>
  );
}
