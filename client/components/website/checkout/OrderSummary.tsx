/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import appConfig from "@/appConfig";
import { useCurrency } from "@/context/CurrencyContext";
import {
  deleteCart,
  getCartLists,
  incrementDecrementCart,
} from "@/lib/apis/cart";
import { errorNotification } from "@/lib/utils/notification";
import {
  decrementCart,
  incrementCart,
  replaceCart,
  selectCart,
} from "@/redux/features/cart/cartSlice";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { Popconfirm } from "antd";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

export default function OrderSummary() {
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const cart = useSelector(selectCart);
  const { formatPrice } = useCurrency();
  // Inside your component or hook
  const debouncedSyncRef = useRef<any>(null);

  // Debounce utility
  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    debouncedSyncRef.current = debounce(async (item: any) => {
      const res = await incrementDecrementCart(item);
      if (!res.success) {
        errorNotification({ message: res.message });
      }
      const getCartList = await getCartLists();
      dispatch(replaceCart(getCartList.data));
    }, 500); // 500ms debounce
  }, []);

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

  const handleIncrementDecrement = async (item: any) => {
    if (item.type === "Decrement") {
      dispatch(decrementCart(item));
    } else {
      dispatch(incrementCart(item));
    }
    // Debounced backend sync
    debouncedSyncRef.current(item);
  };

  // async function cartIncrementDecrementHandle(value: any) {
  //   const incrementCartRes = await incrementDecrementCart(value);
  //   if (incrementCartRes.success) {
  //     const getCartList = await getCartLists();
  //     dispatch(replaceCart(getCartList.data));
  //   }
  // }

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
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
          <tr>
            <th className="p-4 font-semibold">Product</th>
            <th className="p-4 font-semibold text-center">Quantity</th>
            <th className="p-4 font-semibold text-right">Price</th>
            <th className="p-4 font-semibold text-right">Total</th>
            <th className="p-4 font-semibold text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {cart?.carts?.cartList?.map((item: any, idx: number) => (
            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                    <Image
                      src={
                        item.thumbnailImage
                          ? `${appConfig.baseApiUrl}/uploads/${item.thumbnailImage}`
                          : "/pos_software.png"
                      }
                      fill
                      alt={item.name}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 line-clamp-2">{item?.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                      {item?.size?.name && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded">Size: {item.size.name}</span>
                      )}
                      {item?.color?.name && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded">Color: {item.color.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              </td>

              <td className="p-4">
                <div className="flex items-center justify-center">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50"
                      onClick={() =>
                        handleIncrementDecrement({
                          type: "Decrement",
                          id: item.id,
                          qty: item.qty - 1,
                        })
                      }
                      disabled={item?.qty <= 1}
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-medium text-gray-900">{item.qty}</span>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50"
                      onClick={() =>
                        handleIncrementDecrement({
                          type: "Increment",
                          id: item.id,
                          qty: item.qty + 1,
                        })
                      }
                      disabled={stockCheckingAndPurchaseLimit(item)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </td>

              <td className="p-4 text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium text-gray-900">{formatPrice(item.salePrice)}</span>
                  {item.totalDiscountAmount > 0 && (
                    <span className="text-xs text-green-600">Save {formatPrice(item.totalDiscountAmount)}</span>
                  )}
                </div>
              </td>

              <td className="p-4 text-right font-bold text-gray-900">
                {formatPrice(item.subTotal)}
              </td>

              <td className="p-4 text-center">
                <Popconfirm
                  title="Remove Item"
                  description="Are you sure you want to remove this item?"
                  onConfirm={() => removeItemCart(item.id)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ loading: global.loading.remove, danger: true }}
                  placement="left"
                >
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50">
                    <MdDelete size={20} />
                  </button>
                </Popconfirm>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(!cart?.carts?.cartList || cart?.carts?.cartList.length === 0) && (
        <div className="p-8 text-center text-gray-500">
          Your cart is empty.
        </div>
      )}
    </div>
  );
}
