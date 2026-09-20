"use client";
import { ActionType } from "@/constants/constants";
import { getCartLists } from "@/lib/apis/cart";
import { getUserShippingAddresses } from "@/lib/apis/shipping-address";
import { getShippingCharges } from "@/lib/apis/shipping-charge";
import { replaceCart } from "@/redux/features/cart/cartSlice";
import {
    selectCheckout,
    setCheckoutFormData,
    setShippingAddress,
    setShippingCharge,
} from "@/redux/features/checkout/checkoutSlice";
import { setAction } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Radio } from "antd";
import dynamic from "next/dynamic";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";

const AddShippingAddress = dynamic(
  () => import("@/components/website/profile/shipping-address/AddShippingAddress"),
  { ssr: false }
);

export default function CheckoutShippingAddress() {
  const dispatch = useDispatch();
  const checkout = useSelector(selectCheckout);
  const { shippingAddress, checkoutFormData } = checkout || {};

  const selectAddressAndRecalculate = async (
    targetAddressId: number,
    addressList: any[]
  ) => {
    dispatch(
      setCheckoutFormData({
        ...checkoutFormData,
        shippingAddressId: targetAddressId,
      })
    );

    const activeShippingAddress = addressList.find(
      (item: { id: number }) => item.id === targetAddressId
    );

    if (activeShippingAddress?.districtId) {
      const getShippingCharge = await getShippingCharges({
        districtId: activeShippingAddress.districtId,
      });

      dispatch(
        setShippingCharge(
          getShippingCharge.data?.length ? getShippingCharge.data[0] : {}
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
  };

  const handleAddressSaved = async (savedData?: any) => {
    try {
      const res = await getUserShippingAddresses();
      if (res.success && res.data) {
        const addresses = res.data;
        dispatch(setShippingAddress(addresses));

        const savedId = savedData?.id || savedData?.data?.id;
        let chosenId = savedId;

        if (!chosenId || !addresses.some((item: any) => item.id === chosenId)) {
          if (
            checkoutFormData?.shippingAddressId &&
            addresses.some((item: any) => item.id === checkoutFormData.shippingAddressId)
          ) {
            chosenId = checkoutFormData.shippingAddressId;
          } else {
            const defaultAddress = addresses.find((item: any) => item.status);
            chosenId = defaultAddress?.id || addresses[0]?.id;
          }
        }

        if (chosenId) {
          await selectAddressAndRecalculate(chosenId, addresses);
        }
      }
    } catch (err: any) {
      console.error("Error refreshing shipping addresses:", err);
    }
  };

  return (
    <div className="space-y-6">
      <Radio.Group
        className="w-full"
        onChange={async ({ target }) => {
          await selectAddressAndRecalculate(target.value, shippingAddress || []);
        }}
        value={checkoutFormData?.shippingAddressId}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shippingAddress?.map(
            (
              item: { id: number; type: string; status: boolean; name: string; phoneNo: string; address: string },
              idx: number
            ) => {
              const isSelected = checkoutFormData?.shippingAddressId === item.id;
              return (
                <label
                  key={idx}
                  className={`
                    relative flex cursor-pointer rounded-3xl border-2 p-6 transition-all h-full
                    ${isSelected
                      ? "border-global-primary bg-linear-to-b from-global-primary/5 via-white to-white shadow-lg shadow-global-primary/10 ring-2 ring-global-primary/20"
                      : "border-gray-200/80 bg-gray-50/50 hover:border-gray-300"
                    }
                  `}
                >
                  <Radio value={item.id} className="sr-only" />
                  <div className="flex w-full flex-col gap-4">
                    <div className="flex justify-between items-center">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isSelected ? "bg-global-primary text-white shadow-2xs" : "bg-gray-100 text-gray-500"}`}>
                          {item.type}
                       </span>
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-global-primary bg-global-primary shadow-xs scale-105" : "border-gray-300 bg-white"}`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                       </div>
                    </div>

                    <div className="space-y-1">
                       <div className="text-sm font-black text-gray-900 leading-tight truncate">{item.name}</div>
                       <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.phoneNo}</div>
                       <div className="text-xs text-gray-500 line-clamp-2 italic pt-1">{item.address}</div>
                    </div>

                    <div className="pt-2 mt-auto border-t border-gray-100 flex justify-between items-center">
                       <button
                         type="button"
                         onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           dispatch(
                             setAction({
                               type: ActionType.UPDATE,
                               payload: item,
                               userShippingAddress: true,
                               shippingAddress: true,
                             })
                           );
                         }}
                         className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-global-primary flex items-center gap-2 transition-colors cursor-pointer"
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
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(
                setAction({
                  type: ActionType.CREATE,
                  userShippingAddress: true,
                  shippingAddress: true,
                })
              );
            }}
            className="relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 p-6 hover:border-global-primary hover:bg-global-primary/5 transition-all min-h-[180px] group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-50 group-hover:bg-global-primary group-hover:text-white flex items-center justify-center mb-4 transition-all shadow-xs text-gray-400 group-hover:shadow-md group-hover:shadow-global-primary/25">
               <PlusOutlined className="text-xl" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-global-primary transition-colors">Add Destination</span>
          </button>
        </div>
      </Radio.Group>

      <div className="flex justify-end pt-2">
        <Link href="/profile?tab=address" className="text-[10px] font-black uppercase tracking-widest text-global-primary hover:text-global-hover hover:underline">
          Manage all addresses
        </Link>
      </div>

      <AddShippingAddress onSuccess={handleAddressSaved} />
    </div>
  );
}

