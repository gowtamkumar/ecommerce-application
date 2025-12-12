import { ActionType } from "@/constants/constants";
import { getShippingCharges } from "@/lib/apis/shipping-charge";
import {
  selectCheckout,
  setCheckoutFormData,
  setShippingCharge,
} from "@/redux/features/checkout/checkoutSlice";
import { setAction } from "@/redux/features/global/globalSlice";
import { Button, Radio, Space } from "antd";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";

const AddShippingAddress = dynamic(
  () => import("@/components/dashboard/shipping-address/AddShippingAddress"),
  { ssr: false }
);

export default function CheckoutShippingAddress() {
  const dispatch = useDispatch();
  const checkout = useSelector(selectCheckout);
  const { shippingAddress, checkoutFormData } = checkout || {};

  // const findAddress = shippingAddress?.find(
  //   (item: { id: number }) => item.id === checkoutFormData.shippingAddressId
  // );

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

          if (activeShippingAddress.divisionId) {
            const getShippingCharge = await getShippingCharges({
              divisionId: activeShippingAddress.divisionId,
            });
            dispatch(
              setShippingCharge(
                getShippingCharge.data?.length
                  ? getShippingCharge.data[0]
                  : {}
              )
            );
          }
        }}
        value={checkoutFormData?.shippingAddressId}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shippingAddress?.map(
            (
              item: { id: number; type: string; status: boolean; name: string; phoneNo: string; address: string },
              idx: number
            ) => (
              <label
                key={idx}
                className={`
                  relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition-all h-full
                  ${
                    checkoutFormData.shippingAddressId === item.id
                      ? "border-blue-600 ring-1 ring-blue-600 bg-blue-50/50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                <Radio value={item.id} className="sr-only" />
                <div className="flex w-full flex-col justify-between gap-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold uppercase tracking-wider px-2 py-0.5 rounded text-[10px] ${
                         checkoutFormData.shippingAddressId === item.id 
                         ? "bg-blue-100 text-blue-700" 
                         : "bg-gray-100 text-gray-600"
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0
                        ${
                          checkoutFormData.shippingAddressId === item.id
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300"
                        }
                      `}
                    >
                      {checkoutFormData.shippingAddressId === item.id && (
                        <div className="h-2.5 w-2.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-gray-600">{item.phoneNo}</p>
                    <p className="text-gray-600 line-clamp-2">{item.address}</p>
                  </div>

                  <div className="pt-2 mt-auto flex gap-2">
                     <button
                        onClick={(e) => {
                          e.preventDefault(); // Prevent radio selection when clicking edit
                          dispatch(
                            setAction({
                              type: ActionType.UPDATE,
                              payload: item,
                            })
                          )
                        }}
                        className="text-xs font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                      >
                        <CiEdit size={14} /> Edit
                      </button>
                  </div>
                </div>
              </label>
            )
          )}
          
          {/* Add New Address Button Card */}
          <button
            onClick={() =>
              dispatch(
                setAction({
                  type: ActionType.CREATE,
                })
              )
            }
            className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all min-h-[160px] group"
          >
            <div className="h-10 w-10 rounded-full bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center mb-2 transition-colors">
               <span className="text-2xl text-gray-400 group-hover:text-blue-600">+</span>
            </div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-blue-700">Add New Address</span>
          </button>
        </div>
      </Radio.Group>

      <div className="flex justify-end">
         <Link href="/profile" className="text-sm text-blue-600 hover:underline">
            Manage all addresses
         </Link>
      </div>

      <AddShippingAddress />
    </div>
  );
}
