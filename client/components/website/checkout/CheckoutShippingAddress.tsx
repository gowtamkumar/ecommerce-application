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

  const findAddress = shippingAddress?.find(
    (item: { id: number }) => item.id === checkoutFormData.shippingAddressId
  );

  return (
    <div className="mx-auto bg-white  rounded-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Shipping Address</h2>
      </div>
      <div className="p-2">
        <Radio.Group
          name="shippingAddressId"
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
          {shippingAddress?.map(
            (
              item: { id: number; type: string; status: boolean },
              idx: number
            ) => (
              <Space direction="vertical" key={idx}>
                <Radio value={item.id}>{item.type}</Radio>
              </Space>
            )
          )}
        </Radio.Group>

        {findAddress?.name && (
          <div className="text-sm flex justify-between">
            <div className="overflow-hidden">
              <p className="text-gray-600">Name: {findAddress?.name}</p>
              <p className="text-gray-600">Phone: {findAddress?.phoneNo}</p>
              <p className="text-gray-600">Address: {findAddress?.address}</p>
            </div>
            <div>
              <CiEdit
                className="cursor-pointer"
                onClick={() =>
                  dispatch(
                    setAction({
                      type: ActionType.UPDATE,
                      payload: findAddress,
                    })
                  )
                }
              />
            </div>
          </div>
        )}

        <Link href="/profile">
          <Button
            className="mt-2"
            size="small"
            type="default"
            style={{ width: "100%" }}
          >
            All Address
          </Button>
        </Link>

        <Button
          className="mt-2"
          size="small"
          type="default"
          style={{ width: "100%" }}
          onClick={() =>
            dispatch(
              setAction({
                type: ActionType.CREATE,
              })
            )
          }
        >
          New Address
        </Button>
        <AddShippingAddress />
      </div>
    </div>
  );
}
