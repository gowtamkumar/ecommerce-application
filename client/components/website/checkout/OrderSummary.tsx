"use client";
import { useCurrency } from "@/context/CurrencyContext";
import {
  deleteCart,
  getCartLists,
  incrementDecrementCart,
} from "@/lib/apis/cart";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { errorNotification } from "@/lib/utils/notification";
import {
  decrementCart,
  incrementCart,
  replaceCart,
  selectCart,
} from "@/redux/features/cart/cartSlice";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { Popconfirm, Tag, Tooltip } from "antd";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineMinus } from "react-icons/hi";
import { AiOutlinePlus } from "react-icons/ai";

export default function OrderSummary() {
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const cart = useSelector(selectCart);
  const { formatPrice } = useCurrency();
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
    }, 500); 
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
      console.log("err", err);
    }
  }

  const handleIncrementDecrement = async (item: any) => {
    if (item.type === "Decrement") {
      dispatch(decrementCart(item));
    } else {
      dispatch(incrementCart(item));
    }
    debouncedSyncRef.current(item);
  };

  function stockCheckingAndPurchaseLimit(value: any) {
    const checkStock = value?.stockQty;
    if (value.limitPurchaseQty && value.limitPurchaseQty <= value.qty) return true;
    if (checkStock <= value.qty) return true;
    return false;
  }

  return (
    <div className="w-full">
      {/* Desktop Header */}
      <div className="hidden sm:grid grid-cols-12 bg-gray-900 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
        <div className="col-span-6">Product Details</div>
        <div className="col-span-2 text-center">Quantity</div>
        <div className="col-span-2 text-right">Net Price</div>
        <div className="col-span-2 text-right">Subtotal</div>
      </div>

      <div className="divide-y divide-gray-50">
        {cart?.carts?.cartList?.map((item: any, idx: number) => (
          <div key={idx} className="p-4 sm:p-8 hover:bg-gray-50/50 transition-all group relative">
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-6 sm:gap-4">
              
              {/* Product Info */}
              <div className="sm:col-span-6 flex items-center gap-4 sm:gap-6">
                <div className="relative w-20 h-24 sm:w-24 sm:h-32 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50 group-hover:scale-105 transition-transform">
                  <Image
                    src={getImageUrl(item.thumbnailImage)}
                    fill
                    alt={item.name}
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                   <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">Premium Item</div>
                   <h3 className="font-black text-gray-900 text-sm sm:text-base leading-tight line-clamp-2">{item?.name}</h3>
                   <div className="flex flex-wrap gap-2 pt-1">
                      {item?.size?.name && (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-gray-100 rounded-md text-gray-500">Size: {item.size.name}</span>
                      )}
                      {item?.color?.name && (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-gray-100 rounded-md text-gray-500">Color: {item.color.name}</span>
                      )}
                   </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="sm:col-span-2 flex justify-start sm:justify-center">
                 <div className="flex items-center p-1 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-900 hover:text-white transition-all disabled:opacity-20"
                      onClick={() => handleIncrementDecrement({ type: "Decrement", id: item.id, qty: item.qty - 1 })}
                      disabled={item?.qty <= 1}
                    >
                      <HiOutlineMinus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs font-black text-gray-900">{item.qty}</span>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-900 hover:text-white transition-all disabled:opacity-20"
                      onClick={() => handleIncrementDecrement({ type: "Increment", id: item.id, qty: item.qty + 1 })}
                      disabled={stockCheckingAndPurchaseLimit(item)}
                    >
                      <AiOutlinePlus size={12} />
                    </button>
                 </div>
              </div>

              {/* Net Price */}
              <div className="sm:col-span-2 text-left sm:text-right">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 sm:hidden uppercase tracking-widest mb-1">Unit Price</span>
                  <span className="text-sm sm:text-base font-black text-gray-900">{formatPrice(item.salePrice)}</span>
                  {item.totalDiscountAmount > 0 && (
                    <Tag color="success" className="w-fit ml-auto mr-0 text-[8px] font-black uppercase tracking-tighter border-none bg-green-50 text-green-600 mt-1">
                       -{formatPrice(item.totalDiscountAmount)} Off
                    </Tag>
                  )}
                </div>
              </div>

              {/* Total Price */}
              <div className="sm:col-span-2 text-left sm:text-right">
                <div className="flex flex-col">
                   <span className="text-xs font-bold text-gray-400 sm:hidden uppercase tracking-widest mb-1">Total</span>
                   <span className="text-base sm:text-lg font-black text-blue-600 tracking-tighter">
                    {formatPrice(item?.subTotal)}
                   </span>
                </div>
              </div>
            </div>

            {/* Remove Action - Absolute Position on Desktop */}
            <div className="absolute top-4 right-4 sm:top-auto sm:bottom-8 sm:right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <Popconfirm
                  title="Remove Item"
                  onConfirm={() => removeItemCart(item.id)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ loading: global.loading.remove, danger: true }}
                >
                  <Tooltip title="Remove Product">
                    <button className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm">
                      <MdDelete size={18} />
                    </button>
                  </Tooltip>
                </Popconfirm>
            </div>
          </div>
        ))}
      </div>

      {(!cart?.carts?.cartList || cart?.carts?.cartList.length === 0) && (
        <div className="p-20 text-center space-y-4 bg-gray-50/50">
           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100">
              <MdInfoOutline className="text-gray-200" size={40} />
           </div>
           <div>
              <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Your cart is empty</h4>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Add some luxury items to get started</p>
           </div>
        </div>
      )}
    </div>
  );
}
