"use client";
import { getCartLists } from "@/lib/apis/cart";
import { errorNotification } from "@/lib/utils/notification";
import { replaceCart } from "@/redux/features/cart/cartSlice";
import { Button, Input, Space } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function ApplyCoupon() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleCoupon = async () => {
    setLoading(true);

    const coupon = await getCartLists({ couponCode: data, shippingCost: 0 });

    console.log("coupon", coupon);
    

    if (coupon.success) {
      const getCartList = await getCartLists();
      dispatch(replaceCart(getCartList.data));
    }

    if (!coupon.success) {
      errorNotification({ message: coupon.message });
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-md my-2">
      <div className="p-4 md:flex items-center justify-end gap-4 ">
        <div className="flex md:flex-row flex-col gap-2 w-full">
          <Space.Compact block>
            <Input
              type="text"
              placeholder="Enter Coupon"
              className="border border-gray-300 p-3 rounded"
              onChange={(value) => setData(value.target.value)}
            />
            <Button
              type="primary"
              onClick={handleCoupon}
              loading={loading}
              disabled={loading || !data}
            >
              Apply Coupon
            </Button>
          </Space.Compact>
        </div>
      </div>
    </div>
  );
}
