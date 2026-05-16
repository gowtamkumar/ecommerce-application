"use client";
import { ActionType } from "@/constants/constants";
import { getCartLists } from "@/lib/apis/cart";
import { getShippingCharges } from "@/lib/apis/shipping-charge";
import { replaceCart } from "@/redux/features/cart/cartSlice";
import {
  selectCheckout,
  setCheckoutFormData,
  setShippingCharge,
} from "@/redux/features/checkout/checkoutSlice";
import { setAction } from "@/redux/features/global/globalSlice";
import { Radio } from "antd";
import dynamic from "next/dynamic";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { EnvironmentOutlined, PlusOutlined } from "@ant-design/icons";

const AddShippingAddress = dynamic(
  () => import("@/components/dashboard/shipping-address/AddShippingAddress"),
  { ssr: false }
);

export default function CheckoutShippingAddress() {
  const dispatch = useDispatch();
  const checkout = useSelector(selectCheckout);
  const { shippingAddress, checkoutFormData } = checkout || {};

  return (
    <div className="space-y-6">
      <Radio.Group
        className="w-full"
        onChange={async ({ target }) => {
          dispatch(
            setCheckoutFormData({
              ...checkoutFormData,
              shippingAddressId: target.value,
            })
          );

          const activeShippingAddress = shippingAddress?.find(
            (item: { id: number }) => item.id === target.value
          );

          if (activeShippingAddress?.districtId) {
            const getShippingCharge = await getShippingCharges({
              districtId: activeShippingAddress.districtId,
            });

            dispatch(
              setShippingCharge(
                getShippingCharge.data?.length
                  ? getShippingCharge.data[0]
                  : {}
              )
            );

            const newCartList = await getCartLists({
              districtId: activeShippingAddress.districtId,
              couponCode: checkoutFormData?.couponCode,
            });
            if (newCartList.success) {
              dispatch(replaceCart(newCartList.data));
            }
          }
        }}
        value={checkoutFormData?.shippingAddressId}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shippingAddress?.map(
            (
              item: { id: number; type: string; status: boolean; name: string; phoneNo: string; address: string },
              idx: number
            ) => {
              const isSelected = checkoutFormData.shippingAddressId === item.id;
              return (
                <label
                  key={idx}
                  className={`
                    relative flex cursor-pointer rounded-3xl border-2 p-6 transition-all h-full
                    ${isSelected
                      ? "border-gray-900 bg-white shadow-xl shadow-gray-200"
                      : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                    }
                  `}
                >
                  <Radio value={item.id} className="sr-only" />
                  <div className="flex w-full flex-col gap-4">
                    <div className="flex justify-between items-center">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isSelected ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}>
                          {item.type}
                       </span>
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-blue-600 bg-blue-600 shadow-sm shadow-blue-200" : "border-gray-200"}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                       </div>
                    </div>

                    <div className="space-y-1">
                       <div className="text-sm font-black text-gray-900 leading-tight truncate">{item.name}</div>
                       <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.phoneNo}</div>
                       <div className="text-xs text-gray-500 line-clamp-2 italic pt-1">{item.address}</div>
                    </div>

                    <div className="pt-2 mt-auto border-t border-gray-100 flex justify-between items-center">
                       <button
                         onClick={(e) => {
                           e.preventDefault();
                           dispatch(setAction({ type: ActionType.UPDATE, payload: item }))
                         }}
                         className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 flex items-center gap-2 transition-colors"
                       >
                         <CiEdit size={16} /> Edit Address
                       </button>
                    </div>
                  </div>
                </label>
              );
            }
          )}

          <button
            onClick={() => dispatch(setAction({ type: ActionType.CREATE }))}
            className="relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 p-6 hover:border-gray-900 hover:bg-gray-50 transition-all min-h-[180px] group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-50 group-hover:bg-gray-900 group-hover:text-white flex items-center justify-center mb-4 transition-all shadow-sm">
               <PlusOutlined className="text-xl" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900">Add Destination</span>
          </button>
        </div>
      </Radio.Group>

      <div className="flex justify-end pt-2">
        <Link href="/profile?tab=address" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">
          Manage all addresses
        </Link>
      </div>

      <AddShippingAddress />
    </div>
  );
}
